import type { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { supabase } from '@/integrations/supabase/client';

export interface PSDProcessingJob {
  id: string;
  userId: string | null;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  step: string;
  layers: PSDLayer[];
  frames: any[];
  createdAt: string;
  updatedAt: string;
}

export interface PSDProcessingOptions {
  extractLayers: boolean;
  generateFrames: boolean;
  preserveLayerNames: boolean;
  optimizeImages: boolean;
  maxFileSize: number; // in bytes
}

export class PSDProcessingService {
  private static instance: PSDProcessingService;
  private processingQueue: Map<string, Promise<PSDProcessingJob>> = new Map();

  static getInstance(): PSDProcessingService {
    if (!PSDProcessingService.instance) {
      PSDProcessingService.instance = new PSDProcessingService();
    }
    return PSDProcessingService.instance;
  }

  /**
   * Upload PSD file to storage and create processing job
   */
  async uploadPSDFile(
    file: File, 
    userId: string | null = null,
    options: Partial<PSDProcessingOptions> = {}
  ): Promise<PSDProcessingJob> {
    const defaultOptions: PSDProcessingOptions = {
      extractLayers: true,
      generateFrames: true,
      preserveLayerNames: true,
      optimizeImages: true,
      maxFileSize: 100 * 1024 * 1024 // 100MB
    };

    const processingOptions = { ...defaultOptions, ...options };

    // Validate file
    if (file.size > processingOptions.maxFileSize) {
      throw new Error(`File size exceeds maximum limit of ${processingOptions.maxFileSize / (1024 * 1024)}MB`);
    }

    if (!file.name.toLowerCase().endsWith('.psd')) {
      throw new Error('Only PSD files are supported');
    }

    // Create unique file name
    const timestamp = Date.now();
    const fileName = `${userId || 'anonymous'}/${timestamp}_${file.name}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('psd-uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('psd-uploads')
      .getPublicUrl(uploadData.path);

    // Create processing job in database
    const jobId = crypto.randomUUID();
    const { data: job, error: jobError } = await supabase
      .from('crdmkr_processing_jobs')
      .insert({
        id: jobId,
        user_id: userId,
        file_name: file.name,
        file_url: publicUrl,
        status: 'pending',
        progress: 0,
        step: 'File uploaded',
        options: processingOptions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      throw new Error(`Failed to create processing job: ${jobError.message}`);
    }

    // Start processing
    return this.processPSDFile(jobId, processingOptions);
  }

  /**
   * Process PSD file and extract layers
   */
  private async processPSDFile(
    jobId: string, 
    options: PSDProcessingOptions
  ): Promise<PSDProcessingJob> {
    // Check if already processing
    if (this.processingQueue.has(jobId)) {
      return this.processingQueue.get(jobId)!;
    }

    // Create processing promise
    const processingPromise = this._processPSDInternal(jobId, options);
    this.processingQueue.set(jobId, processingPromise);

    try {
      const result = await processingPromise;
      return result;
    } finally {
      this.processingQueue.delete(jobId);
    }
  }

  private async _processPSDInternal(
    jobId: string, 
    options: PSDProcessingOptions
  ): Promise<PSDProcessingJob> {
    try {
      // Update status to processing
      await this.updateJobStatus(jobId, 'processing', 10, 'Reading PSD file...');

      // Get job details
      const { data: job, error: jobError } = await supabase
        .from('crdmkr_processing_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError || !job) {
        throw new Error('Job not found');
      }

      // Download PSD file
      const response = await fetch(job.file_url);
      if (!response.ok) {
        throw new Error('Failed to download PSD file');
      }

      const arrayBuffer = await response.arrayBuffer();
      const file = new File([arrayBuffer], job.file_name, { type: 'image/vnd.adobe.photoshop' });

      // Parse PSD file
      await this.updateJobStatus(jobId, 'processing', 30, 'Parsing PSD structure...');
      
      const { parsePSD } = await import('@/components/editor/crd/import/CRDPSDProcessor');
      const parseResult = await parsePSD(file);

      // Extract and process layers
      await this.updateJobStatus(jobId, 'processing', 50, 'Extracting layers...');
      
      const processedLayers = await this.processLayers(parseResult.layers, jobId);

      // Generate frames if requested
      let frames: any[] = [];
      if (options.generateFrames) {
        await this.updateJobStatus(jobId, 'processing', 70, 'Generating frames...');
        frames = await this.generateFrames(processedLayers, jobId);
      }

      // Update job with results
      await this.updateJobStatus(jobId, 'completed', 100, 'Processing complete');
      
      const { data: updatedJob, error: updateError } = await supabase
        .from('crdmkr_processing_jobs')
        .update({
          status: 'completed',
          progress: 100,
          step: 'Processing complete',
          layers: processedLayers,
          frames: frames,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to update job: ${updateError.message}`);
      }

      return updatedJob as PSDProcessingJob;

    } catch (error) {
      console.error('PSD processing error:', error);
      
      await this.updateJobStatus(
        jobId, 
        'failed', 
        0, 
        `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      
      throw error;
    }
  }

  /**
   * Process extracted layers
   */
  private async processLayers(layers: PSDLayer[], jobId: string): Promise<PSDLayer[]> {
    const processedLayers: PSDLayer[] = [];

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      
      // Update progress
      const progress = 50 + (i / layers.length) * 20;
      await this.updateJobStatus(jobId, 'processing', progress, `Processing layer ${i + 1}/${layers.length}`);

      try {
        // Process layer image if available
        if (layer.rawData) {
          const imageUrl = await this.uploadLayerImage(layer, jobId);
          layer.imageUrl = imageUrl;
        }

        // Add metadata
        layer.isProcessed = true;
        layer.processedAt = new Date().toISOString();

        processedLayers.push(layer);
      } catch (error) {
        console.error(`Error processing layer ${layer.name}:`, error);
        // Continue with other layers
      }
    }

    return processedLayers;
  }

  /**
   * Generate frame variations from layers
   */
  private async generateFrames(layers: PSDLayer[], jobId: string): Promise<any[]> {
    const frames: any[] = [];
    const visibleLayers = layers.filter(l => l.visible && l.bounds.width > 0 && l.bounds.height > 0);

    if (visibleLayers.length === 0) {
      return frames;
    }

    // Generate different frame variations
    const frameVariations = [
      { name: 'Classic Frame', style: 'classic', rarity: 'common' },
      { name: 'Modern Frame', style: 'modern', rarity: 'rare' },
      { name: 'Premium Frame', style: 'premium', rarity: 'epic' },
      { name: 'Legendary Frame', style: 'legendary', rarity: 'legendary' }
    ];

    for (let i = 0; i < frameVariations.length; i++) {
      const variation = frameVariations[i];
      
      // Update progress
      const progress = 70 + (i / frameVariations.length) * 20;
      await this.updateJobStatus(jobId, 'processing', progress, `Generating ${variation.name}...`);

      const frame = {
        id: `frame_${jobId}_${i}`,
        name: variation.name,
        style: variation.style,
        rarity: variation.rarity,
        layers: visibleLayers.map(l => l.id),
        preview: null, // Will be generated later
        createdAt: new Date().toISOString()
      };

      frames.push(frame);
    }

    return frames;
  }

  /**
   * Upload layer image to storage
   */
  private async uploadLayerImage(layer: PSDLayer, jobId: string): Promise<string> {
    try {
      // Convert layer data to blob
      const { layerToBlob } = await import('@/components/editor/crd/import/CRDPSDProcessor');
      const blob = await layerToBlob(layer.rawData, layer.bounds.width, layer.bounds.height, 'png');
      
      if (!blob) {
        throw new Error('Failed to convert layer to blob');
      }

      // Upload to storage
      const fileName = `${jobId}/layers/${layer.id}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('psd-layers')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Failed to upload layer image: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('psd-layers')
        .getPublicUrl(uploadData.path);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading layer image for ${layer.name}:`, error);
      throw error;
    }
  }

  /**
   * Update job status
   */
  private async updateJobStatus(
    jobId: string, 
    status: PSDProcessingJob['status'], 
    progress: number, 
    step: string
  ): Promise<void> {
    const { error } = await supabase
      .from('crdmkr_processing_jobs')
      .update({
        status,
        progress,
        step,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (error) {
      console.error('Failed to update job status:', error);
    }
  }

  /**
   * Get processing job by ID
   */
  async getJob(jobId: string): Promise<PSDProcessingJob | null> {
    const { data, error } = await supabase
      .from('crdmkr_processing_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Failed to get job:', error);
      return null;
    }

    return data as PSDProcessingJob;
  }

  /**
   * Get user's processing jobs
   */
  async getUserJobs(userId: string): Promise<PSDProcessingJob[]> {
    const { data, error } = await supabase
      .from('crdmkr_processing_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get user jobs:', error);
      return [];
    }

    return data as PSDProcessingJob[];
  }

  /**
   * Delete processing job
   */
  async deleteJob(jobId: string): Promise<boolean> {
    const { error } = await supabase
      .from('crdmkr_processing_jobs')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error('Failed to delete job:', error);
      return false;
    }

    return true;
  }
}

export const psdProcessingService = PSDProcessingService.getInstance(); 
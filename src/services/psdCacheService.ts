import { supabase } from '@/integrations/supabase/client';
import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { readPsd } from 'ag-psd';

export interface CachedPSDJob {
  id: string;
  fileName: string;
  originalFilePath: string;
  thumbnailUrl: string;
  layersCount: number;
  lastAccessed: Date;
  metadata: {
    width: number;
    height: number;
    colorMode: string;
    bitsPerChannel: number;
  };
}

export interface PSDSessionData {
  visibleLayers: string[];
  layerModifications: Record<string, any>;
  canvasState: any;
  autoSavedAt: Date;
}

class PSDCacheService {
  private layerImageCache = new Map<string, string>();
  private processingQueue = new Map<string, Promise<any>>();

  // Upload and cache original PSD file
  async uploadPSDFile(file: File, userId: string | null = null): Promise<string> {
    const userFolder = userId || 'anonymous';
    const fileName = `${userFolder}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('psd-originals')
      .upload(fileName, file);

    if (error) {
      throw new Error(`Failed to upload PSD file: ${error.message}`);
    }

    return data.path;
  }

  // Process PSD file and cache all layers
  async processPSDWithCaching(
    file: File, 
    userId: string | null = null,
    onProgress?: (progress: number, step: string) => void
  ): Promise<{ layers: PSDLayer[]; jobId: string; thumbnail: string }> {
    const fileKey = `${file.name}_${file.size}_${file.lastModified}`;
    
    // Check if already processing
    if (this.processingQueue.has(fileKey)) {
      return await this.processingQueue.get(fileKey)!;
    }

    // Create processing promise
    const processingPromise = this._processPSDInternal(file, userId, onProgress);
    this.processingQueue.set(fileKey, processingPromise);

    try {
      const result = await processingPromise;
      return result;
    } finally {
      this.processingQueue.delete(fileKey);
    }
  }

  private async _processPSDInternal(
    file: File, 
    userId: string | null,
    onProgress?: (progress: number, step: string) => void
  ): Promise<{ layers: PSDLayer[]; jobId: string; thumbnail: string }> {
    onProgress?.(5, 'Uploading PSD file...');
    
    // Upload original file
    const originalFilePath = await this.uploadPSDFile(file, userId);
    
    onProgress?.(15, 'Reading PSD structure...');
    
    // Read PSD file
    const arrayBuffer = await file.arrayBuffer();
    const psd = readPsd(arrayBuffer, {
      skipLayerImageData: false,
      skipCompositeImageData: false,
      useImageData: true
    });

    if (!psd) {
      throw new Error('Failed to parse PSD file');
    }

    onProgress?.(30, 'Extracting layers...');
    
    // Extract layers with image data
    const layers = await this.extractLayersWithImages(psd.children || [], userId, onProgress);
    
    onProgress?.(70, 'Generating thumbnail...');
    
    // Generate thumbnail from composite or first layer
    const thumbnail = await this.generateThumbnail(psd, layers);
    
    onProgress?.(85, 'Saving to database...');
    
    // Create processing job
    const { data: job, error: jobError } = await supabase
      .from('crdmkr_processing_jobs')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_url: originalFilePath,
        status: 'completed',
        progress: 100,
        result: JSON.stringify({
          layers,
          metadata: {
            width: psd.width || 0,
            height: psd.height || 0,
            colorMode: psd.colorMode?.toString() || 'RGB',
            bitsPerChannel: psd.bitsPerChannel || 8
          }
        })
      })
      .select()
      .single();

    if (jobError) {
      throw new Error(`Failed to save processing job: ${jobError.message}`);
    }

    // Save layers to database
    await this.saveLayers(layers, job.id);
    
    onProgress?.(100, 'Complete!');
    
    return {
      layers,
      jobId: job.id,
      thumbnail
    };
  }

  private async extractLayersWithImages(
    psdLayers: any[], 
    userId: string | null,
    onProgress?: (progress: number, step: string) => void
  ): Promise<PSDLayer[]> {
    const layers: PSDLayer[] = [];
    
    for (let i = 0; i < psdLayers.length; i++) {
      const layer = psdLayers[i];
      const progress = 30 + (i / psdLayers.length) * 30; // 30-60% range
      onProgress?.(progress, `Processing layer ${i + 1}/${psdLayers.length}...`);
      
      const processedLayer = await this.convertLayerWithImageCache(layer, i, userId);
      layers.push(processedLayer);
    }
    
    return layers;
  }

  private async convertLayerWithImageCache(layer: any, index: number, userId: string | null): Promise<PSDLayer> {
    const bounds = {
      x: layer.left || 0,
      y: layer.top || 0,
      width: (layer.right || 0) - (layer.left || 0),
      height: (layer.bottom || 0) - (layer.top || 0)
    };

    let type: PSDLayer['type'] = 'image';
    let content: any = {};
    let cachedImageUrl: string | undefined;

    // Determine layer type and extract content
    if (layer.text) {
      type = 'text';
      content = this.extractTextContent(layer.text);
    } else if (layer.children && layer.children.length > 0) {
      type = 'group';
    } else if (layer.canvas) {
      type = 'image';
      // Cache layer image to storage
      const layerKey = `${userId || 'anonymous'}_layer_${index}`;
      cachedImageUrl = await this.cacheLayerImage(layer.canvas, layerKey, userId);
      content.imageData = cachedImageUrl;
    } else {
      type = 'shape';
    }

    const psdLayer: PSDLayer = {
      id: `layer_${index}_${Date.now()}`,
      name: layer.name || `Layer ${index + 1}`,
      type,
      bounds,
      width: bounds.width,
      height: bounds.height,
      content,
      styleProperties: {
        opacity: layer.opacity !== undefined ? layer.opacity / 255 : 1,
        blendMode: layer.blendMode || 'normal'
      },
      visible: (layer as any).visible !== false
    };

    // Process child layers for groups
    if (layer.children && layer.children.length > 0) {
      psdLayer.children = await Promise.all(
        layer.children.map((child: any, childIndex: number) => 
          this.convertLayerWithImageCache(child, childIndex, userId)
        )
      );
    }

    return psdLayer;
  }

  private async cacheLayerImage(canvas: HTMLCanvasElement, layerKey: string, userId: string | null): Promise<string> {
    // Check if already cached
    if (this.layerImageCache.has(layerKey)) {
      return this.layerImageCache.get(layerKey)!;
    }

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert canvas to blob'));
        }, 'image/png', 0.9);
      });

      // Upload to storage
      const userFolder = userId || 'anonymous';
      const fileName = `${userFolder}/${layerKey}_${Date.now()}.png`;
      const { data, error } = await supabase.storage
        .from('psd-layers')
        .upload(fileName, blob);

      if (error) {
        console.error('Failed to cache layer image:', error);
        // Return data URL as fallback
        return canvas.toDataURL('image/png');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('psd-layers')
        .getPublicUrl(data.path);

      // Cache for reuse
      this.layerImageCache.set(layerKey, publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Error caching layer image:', error);
      // Return data URL as fallback
      return canvas.toDataURL('image/png');
    }
  }

  private async generateThumbnail(psd: any, layers: PSDLayer[]): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Standard card dimensions
    canvas.width = 300;
    canvas.height = 420;
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Try to use PSD composite image if available
    if (psd.canvas) {
      // Scale PSD canvas to fit thumbnail
      const scale = Math.min(
        canvas.width / psd.canvas.width,
        canvas.height / psd.canvas.height
      );
      
      const scaledWidth = psd.canvas.width * scale;
      const scaledHeight = psd.canvas.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(psd.canvas, x, y, scaledWidth, scaledHeight);
    } else {
      // Create a simple preview
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#333333';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${layers.length} Layers`, canvas.width / 2, canvas.height / 2);
    }

    return canvas.toDataURL('image/jpeg', 0.8);
  }

  private extractTextContent(textData: any): any {
    return {
      text: textData.text || '',
      fontSize: textData.style?.fontSize || 12,
      fontFamily: (textData.style as any)?.fontName || 'Arial',
      color: this.rgbToHex((textData.style as any)?.fillColor) || '#000000'
    };
  }

  private rgbToHex(color?: any): string {
    if (!color) return '#000000';
    
    const r = Math.round((color.r || color[0] || 0) * 255);
    const g = Math.round((color.g || color[1] || 0) * 255);
    const b = Math.round((color.b || color[2] || 0) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private async saveLayers(layers: PSDLayer[], jobId: string): Promise<void> {
    const layersToInsert = this.flattenLayersForDB(layers, jobId);
    
    if (layersToInsert.length > 0) {
      const { error } = await supabase
        .from('psd_layers')
        .insert(layersToInsert);

      if (error) {
        console.error('Failed to save layers:', error);
        throw error;
      }
    }
  }

  private flattenLayersForDB(layers: PSDLayer[], jobId: string, parentId?: string): any[] {
    const dbLayers: any[] = [];
    
    layers.forEach((layer, order) => {
      const layerHash = this.generateLayerHash(layer);
      
      const dbLayer = {
        job_id: jobId,
        layer_name: layer.name,
        layer_type: layer.type,
        bounds: layer.bounds,
        content: layer.content,
        style_properties: layer.styleProperties,
        visible: layer.visible,
        display_order: order,
        parent_layer_id: parentId,
        cached_image_url: layer.content?.imageData,
        layer_hash: layerHash
      };
      
      dbLayers.push(dbLayer);
      
      // Add child layers
      if (layer.children) {
        const childLayers = this.flattenLayersForDB(layer.children, jobId, layer.id);
        dbLayers.push(...childLayers);
      }
    });
    
    return dbLayers;
  }

  private generateLayerHash(layer: PSDLayer): string {
    const hashData = {
      name: layer.name,
      type: layer.type,
      bounds: layer.bounds,
      content: layer.content ? JSON.stringify(layer.content) : null
    };
    return btoa(JSON.stringify(hashData)).slice(0, 32);
  }

  // Session management methods
  async saveSession(userId: string, jobId: string, sessionData: PSDSessionData): Promise<void> {
    const { error } = await supabase
      .from('user_psd_sessions')
      .upsert({
        user_id: userId,
        job_id: jobId,
        session_data: sessionData as any,
        visible_layers: sessionData.visibleLayers,
        layer_modifications: sessionData.layerModifications,
        canvas_state: sessionData.canvasState,
        auto_saved_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  }

  async loadSession(userId: string, jobId: string): Promise<PSDSessionData | null> {
    const { data, error } = await supabase
      .from('user_psd_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      visibleLayers: data.visible_layers || [],
      layerModifications: (data.layer_modifications as Record<string, any>) || {},
      canvasState: (data.canvas_state as any) || {},
      autoSavedAt: new Date(data.auto_saved_at)
    };
  }

  async getCachedPSDJobs(userId: string | null): Promise<CachedPSDJob[]> {
    let query = supabase
      .from('crdmkr_processing_jobs')
      .select('*')
      .eq('status', 'completed');
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.is('user_id', null);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get cached PSD jobs:', error);
      return [];
    }

    return data.map(job => ({
      id: job.id,
      fileName: job.file_name,
      originalFilePath: job.file_url || '',
      thumbnailUrl: '',
      layersCount: 0,
      lastAccessed: new Date(job.created_at),
      metadata: (() => {
        try {
          const result = typeof job.result === 'string' ? JSON.parse(job.result) : job.result;
          return result?.metadata || {
            width: 0,
            height: 0,
            colorMode: 'RGB',
            bitsPerChannel: 8
          };
        } catch {
          return {
            width: 0,
            height: 0,
            colorMode: 'RGB',
            bitsPerChannel: 8
          };
        }
      })()
    }));
  }

  async loadCachedLayers(jobId: string): Promise<PSDLayer[]> {
    const { data, error } = await supabase
      .from('psd_layers')
      .select('*')
      .eq('job_id', jobId)
      .order('display_order');

    if (error) {
      console.error('Failed to load cached layers:', error);
      return [];
    }

    return this.reconstructLayerHierarchy(data);
  }

  private reconstructLayerHierarchy(dbLayers: any[]): PSDLayer[] {
    const layerMap = new Map<string, PSDLayer>();
    const rootLayers: PSDLayer[] = [];

    // First pass: create all layers
    dbLayers.forEach(dbLayer => {
      const layer: PSDLayer = {
        id: dbLayer.id,
        name: dbLayer.layer_name,
        type: dbLayer.layer_type,
        bounds: dbLayer.bounds,
        width: dbLayer.bounds.width,
        height: dbLayer.bounds.height,
        content: dbLayer.content,
        styleProperties: dbLayer.style_properties,
        visible: dbLayer.visible,
        children: []
      };
      layerMap.set(dbLayer.id, layer);
    });

    // Second pass: build hierarchy
    dbLayers.forEach(dbLayer => {
      const layer = layerMap.get(dbLayer.id)!;
      
      if (dbLayer.parent_layer_id) {
        const parent = layerMap.get(dbLayer.parent_layer_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(layer);
        }
      } else {
        rootLayers.push(layer);
      }
    });

    return rootLayers;
  }

  // Auto-save functionality
  startAutoSave(userId: string, jobId: string, getSessionData: () => PSDSessionData): () => void {
    const autoSaveInterval = setInterval(async () => {
      try {
        const sessionData = getSessionData();
        await this.saveSession(userId, jobId, sessionData);
        console.log('PSD session auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }
}

export const psdCacheService = new PSDCacheService();
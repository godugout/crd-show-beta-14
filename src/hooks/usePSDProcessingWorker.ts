import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import { psdProcessingService } from '@/services/psd/psdProcessingService';
import { useCallback, useEffect, useRef, useState } from 'react';

interface PSDProcessingState {
  isProcessing: boolean;
  progress: number;
  step: string;
  error: string | null;
  result: any | null;
}

interface PSDProcessingOptions {
  useWorker?: boolean;
  maxFileSize?: number;
  optimizeImages?: boolean;
  generateFrames?: boolean;
}

export const usePSDProcessingWorker = (options: PSDProcessingOptions = {}) => {
  const { user } = useSecureAuth();
  const [state, setState] = useState<PSDProcessingState>({
    isProcessing: false,
    progress: 0,
    step: '',
    error: null,
    result: null
  });

  const workerRef = useRef<Worker | null>(null);
  const currentJobIdRef = useRef<string | null>(null);

  const defaultOptions: Required<PSDProcessingOptions> = {
    useWorker: true,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    optimizeImages: true,
    generateFrames: true,
    ...options
  };

  // Initialize worker
  const initializeWorker = useCallback(() => {
    if (!defaultOptions.useWorker || workerRef.current) return;

    try {
      workerRef.current = new Worker(
        new URL('../workers/psdProcessingWorker.ts', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (event) => {
        const { type, jobId, result, progress, step, error } = event.data;

        switch (type) {
          case 'progress':
            if (jobId === currentJobIdRef.current) {
              setState(prev => ({
                ...prev,
                progress,
                step
              }));
            }
            break;

          case 'result':
            if (jobId === currentJobIdRef.current) {
              if (result.success) {
                setState(prev => ({
                  ...prev,
                  isProcessing: false,
                  progress: 100,
                  step: 'Processing complete',
                  result: result.data,
                  error: null
                }));
              } else {
                setState(prev => ({
                  ...prev,
                  isProcessing: false,
                  error: result.error || 'Processing failed',
                  progress: 0,
                  step: ''
                }));
              }
            }
            break;

          case 'error':
            setState(prev => ({
              ...prev,
              isProcessing: false,
              error: error || 'Worker error occurred',
              progress: 0,
              step: ''
            }));
            break;
        }
      };

      workerRef.current.onerror = (event) => {
        console.error('PSD Processing Worker Error:', event.error);
        setState(prev => ({
          ...prev,
          isProcessing: false,
          error: event.error?.message || 'Worker error occurred',
          progress: 0,
          step: ''
        }));
      };

    } catch (error) {
      console.error('Failed to initialize PSD processing worker:', error);
      // Fallback to main thread processing
      defaultOptions.useWorker = false;
    }
  }, [defaultOptions.useWorker]);

  // Cleanup worker
  const cleanupWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    currentJobIdRef.current = null;
  }, []);

  // Process PSD file
  const processPSDFile = useCallback(async (file: File): Promise<any> => {
    // Validate file
    if (file.size > defaultOptions.maxFileSize) {
      throw new Error(`File size exceeds maximum limit of ${defaultOptions.maxFileSize / (1024 * 1024)}MB`);
    }

    if (!file.name.toLowerCase().endsWith('.psd')) {
      throw new Error('Only PSD files are supported');
    }

    // Reset state
    setState({
      isProcessing: true,
      progress: 0,
      step: 'Initializing...',
      error: null,
      result: null
    });

    const jobId = crypto.randomUUID();
    currentJobIdRef.current = jobId;

    try {
      if (defaultOptions.useWorker && workerRef.current) {
        // Use Web Worker for processing
        const arrayBuffer = await file.arrayBuffer();
        
        workerRef.current.postMessage({
          type: 'process_psd',
          jobId,
          data: { arrayBuffer }
        });

        // Wait for result
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Processing timeout'));
          }, 300000); // 5 minutes timeout

          const handleMessage = (event: MessageEvent) => {
            const { type, jobId: responseJobId, result } = event.data;
            
            if (responseJobId === jobId) {
              clearTimeout(timeout);
              workerRef.current?.removeEventListener('message', handleMessage);
              
              if (type === 'result') {
                if (result.success) {
                  resolve(result.data);
                } else {
                  reject(new Error(result.error));
                }
              }
            }
          };

          workerRef.current?.addEventListener('message', handleMessage);
        });

      } else {
        // Fallback to main thread processing
        const result = await psdProcessingService.uploadPSDFile(file, user?.id || null, {
          extractLayers: true,
          generateFrames: defaultOptions.generateFrames,
          preserveLayerNames: true,
          optimizeImages: defaultOptions.optimizeImages,
          maxFileSize: defaultOptions.maxFileSize
        });

        setState(prev => ({
          ...prev,
          isProcessing: false,
          progress: 100,
          step: 'Processing complete',
          result: {
            layers: result.layers,
            frames: result.frames,
            metadata: {
              width: 1920, // Default, should be extracted from PSD
              height: 1080,
              layerCount: result.layers?.length || 0
            }
          }
        }));

        return result;
      }

    } catch (error) {
      console.error('PSD processing error:', error);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Processing failed',
        progress: 0,
        step: ''
      }));

      throw error;
    }
  }, [user?.id, defaultOptions]);

  // Cancel processing
  const cancelProcessing = useCallback(() => {
    if (workerRef.current && currentJobIdRef.current) {
      workerRef.current.postMessage({
        type: 'cancel',
        jobId: currentJobIdRef.current
      });
    }

    setState(prev => ({
      ...prev,
      isProcessing: false,
      progress: 0,
      step: '',
      error: 'Processing cancelled'
    }));

    currentJobIdRef.current = null;
  }, []);

  // Get user's processing history
  const getUserJobs = useCallback(async (): Promise<any[]> => {
    if (!user?.id) return [];
    
    try {
      return await psdProcessingService.getUserJobs(user.id);
    } catch (error) {
      console.error('Failed to get user jobs:', error);
      return [];
    }
  }, [user?.id]);

  // Delete processing job
  const deleteJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      return await psdProcessingService.deleteJob(jobId);
    } catch (error) {
      console.error('Failed to delete job:', error);
      return false;
    }
  }, []);

  // Initialize worker on mount
  useEffect(() => {
    initializeWorker();
    
    return () => {
      cleanupWorker();
    };
  }, [initializeWorker, cleanupWorker]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupWorker();
    };
  }, [cleanupWorker]);

  return {
    // State
    isProcessing: state.isProcessing,
    progress: state.progress,
    step: state.step,
    error: state.error,
    result: state.result,
    
    // Actions
    processPSDFile,
    cancelProcessing,
    getUserJobs,
    deleteJob,
    
    // Utilities
    resetState: () => setState({
      isProcessing: false,
      progress: 0,
      step: '',
      error: null,
      result: null
    })
  };
}; 
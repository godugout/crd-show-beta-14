// PSD Processing Web Worker
// Handles heavy PSD parsing and layer processing in background

interface PSDProcessingMessage {
  type: 'process_psd' | 'extract_layers' | 'generate_frames' | 'cancel';
  data?: any;
  jobId?: string;
}

interface PSDProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
  progress?: number;
  step?: string;
}

// Import PSD processing libraries dynamically
let psdParser: any = null;
let imageProcessor: any = null;

// Initialize PSD processing libraries
async function initializePSDLibraries() {
  if (!psdParser) {
    const { readPsd } = await import('ag-psd');
    psdParser = { readPsd };
  }
  
  if (!imageProcessor) {
    // Custom image processing utilities
    imageProcessor = {
      createImageData: (width: number, height: number, data: Uint8ClampedArray) => {
        return new ImageData(data, width, height);
      },
      
      convertToBlob: async (imageData: ImageData, format: string = 'png'): Promise<Blob> => {
        const canvas = new OffscreenCanvas(imageData.width, imageData.height);
        const ctx = canvas.getContext('2d')!;
        ctx.putImageData(imageData, 0, 0);
        return canvas.convertToBlob({ type: `image/${format}` });
      },
      
      resizeImage: (imageData: ImageData, maxWidth: number, maxHeight: number): ImageData => {
        const canvas = new OffscreenCanvas(imageData.width, imageData.height);
        const ctx = canvas.getContext('2d')!;
        ctx.putImageData(imageData, 0, 0);
        
        const scale = Math.min(maxWidth / imageData.width, maxHeight / imageData.height);
        const newWidth = Math.round(imageData.width * scale);
        const newHeight = Math.round(imageData.height * scale);
        
        const resizedCanvas = new OffscreenCanvas(newWidth, newHeight);
        const resizedCtx = resizedCanvas.getContext('2d')!;
        resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
        
        return resizedCtx.getImageData(0, 0, newWidth, newHeight);
      }
    };
  }
}

// Process PSD file
async function processPSDFile(arrayBuffer: ArrayBuffer, jobId: string): Promise<PSDProcessingResult> {
  try {
    await initializePSDLibraries();
    
    // Report progress
    self.postMessage({
      type: 'progress',
      jobId,
      progress: 10,
      step: 'Reading PSD file...'
    });

    // Parse PSD
    const psdData = psdParser.readPsd(arrayBuffer, {
      skipLayerImageData: false,
      skipCompositeImageData: true,
      skipThumbnail: true,
    });

    if (!psdData) {
      throw new Error('Failed to parse PSD file');
    }

    self.postMessage({
      type: 'progress',
      jobId,
      progress: 30,
      step: 'Extracting layers...'
    });

    // Extract layers
    const layers = extractLayers(psdData.children || [], psdData.width, psdData.height);
    
    self.postMessage({
      type: 'progress',
      jobId,
      progress: 60,
      step: 'Processing layer images...'
    });

    // Process layer images
    const processedLayers = await processLayerImages(layers, jobId);
    
    self.postMessage({
      type: 'progress',
      jobId,
      progress: 80,
      step: 'Generating frames...'
    });

    // Generate frames
    const frames = generateFrames(processedLayers);
    
    self.postMessage({
      type: 'progress',
      jobId,
      progress: 100,
      step: 'Processing complete'
    });

    return {
      success: true,
      data: {
        layers: processedLayers,
        frames,
        metadata: {
          width: psdData.width,
          height: psdData.height,
          layerCount: layers.length,
          colorMode: psdData.colorMode?.toString() || 'RGB',
          bitsPerChannel: psdData.bitsPerChannel || 8
        }
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Extract layers from PSD data
function extractLayers(children: any[], width: number, height: number): any[] {
  const layers: any[] = [];
  
  function processLayer(layer: any, parentId?: string) {
    if (!layer) return;
    
    const layerData = {
      id: crypto.randomUUID(),
      name: layer.name || 'Unnamed Layer',
      type: layer.type || 'layer',
      visible: layer.visible !== false,
      opacity: layer.opacity || 1,
      bounds: {
        x: layer.left || 0,
        y: layer.top || 0,
        width: (layer.right || 0) - (layer.left || 0),
        height: (layer.bottom || 0) - (layer.top || 0)
      },
      rawData: layer.imageData,
      children: [],
      parentId
    };
    
    layers.push(layerData);
    
    // Process child layers
    if (layer.children && layer.children.length > 0) {
      layer.children.forEach((child: any) => {
        processLayer(child, layerData.id);
      });
    }
  }
  
  children.forEach(layer => processLayer(layer));
  return layers;
}

// Process layer images
async function processLayerImages(layers: any[], jobId: string): Promise<any[]> {
  const processedLayers: any[] = [];
  
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    
    // Report progress
    self.postMessage({
      type: 'progress',
      jobId,
      progress: 60 + (i / layers.length) * 20,
      step: `Processing layer ${i + 1}/${layers.length}: ${layer.name}`
    });
    
    try {
      if (layer.rawData) {
        // Convert raw data to image
        const imageData = imageProcessor.createImageData(
          layer.bounds.width,
          layer.bounds.height,
          layer.rawData
        );
        
        // Optimize image size if too large
        const maxSize = 1024;
        let optimizedImageData = imageData;
        if (imageData.width > maxSize || imageData.height > maxSize) {
          optimizedImageData = imageProcessor.resizeImage(imageData, maxSize, maxSize);
        }
        
        // Convert to blob
        const blob = await imageProcessor.convertToBlob(optimizedImageData, 'png');
        
        // Create object URL for the blob
        const imageUrl = URL.createObjectURL(blob);
        
        layer.imageUrl = imageUrl;
        layer.isProcessed = true;
        layer.processedAt = new Date().toISOString();
      }
      
      processedLayers.push(layer);
    } catch (error) {
      console.error(`Error processing layer ${layer.name}:`, error);
      // Continue with other layers
    }
  }
  
  return processedLayers;
}

// Generate frame variations
function generateFrames(layers: any[]): any[] {
  const frames: any[] = [];
  const visibleLayers = layers.filter(l => l.visible && l.bounds.width > 0 && l.bounds.height > 0);
  
  if (visibleLayers.length === 0) {
    return frames;
  }
  
  const frameVariations = [
    { name: 'Classic Frame', style: 'classic', rarity: 'common' },
    { name: 'Modern Frame', style: 'modern', rarity: 'rare' },
    { name: 'Premium Frame', style: 'premium', rarity: 'epic' },
    { name: 'Legendary Frame', style: 'legendary', rarity: 'legendary' }
  ];
  
  frameVariations.forEach((variation, index) => {
    const frame = {
      id: `frame_${Date.now()}_${index}`,
      name: variation.name,
      style: variation.style,
      rarity: variation.rarity,
      layers: visibleLayers.map(l => l.id),
      preview: null, // Will be generated later
      createdAt: new Date().toISOString()
    };
    
    frames.push(frame);
  });
  
  return frames;
}

// Handle messages from main thread
self.addEventListener('message', async (event: MessageEvent<PSDProcessingMessage>) => {
  const { type, data, jobId } = event.data;
  
  switch (type) {
    case 'process_psd':
      if (data && data.arrayBuffer) {
        const result = await processPSDFile(data.arrayBuffer, jobId!);
        self.postMessage({
          type: 'result',
          jobId,
          result
        });
      }
      break;
      
    case 'cancel':
      // Handle cancellation if needed
      break;
      
    default:
      console.warn('Unknown message type:', type);
  }
});

// Handle errors
self.addEventListener('error', (event) => {
  console.error('PSD Processing Worker Error:', event.error);
  self.postMessage({
    type: 'error',
    error: event.error?.message || 'Unknown error in PSD processing worker'
  });
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('PSD Processing Worker Unhandled Rejection:', event.reason);
  self.postMessage({
    type: 'error',
    error: event.reason?.message || 'Unhandled promise rejection in PSD processing worker'
  });
}); 
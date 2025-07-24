import { supabase } from '@/integrations/supabase/client';
import type { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { layerToBlob } from '@/components/editor/crd/import/CRDPSDProcessor';

/**
 * Upload original PSD file to storage
 */
export async function uploadPSDToStorage(file: File, fileName: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from('psd-originals')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('psd-originals')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading PSD:', error);
    throw new Error('Failed to upload PSD file');
  }
}

/**
 * Upload processed layer as PNG to storage
 */
export async function uploadLayerToStorage(
  layer: PSDLayer, 
  blob: Blob, 
  psdFileName: string
): Promise<string> {
  try {
    const sanitizedLayerName = layer.name.replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${psdFileName}_${layer.id}_${sanitizedLayerName}.png`;
    
    const { data, error } = await supabase.storage
      .from('psd-layers')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/png'
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('psd-layers')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading layer:', error);
    throw new Error(`Failed to upload layer: ${layer.name}`);
  }
}

/**
 * Process and upload all visible layers from a PSD
 */
export async function processAndUploadLayers(
  layers: PSDLayer[], 
  psdFileName: string,
  onProgress?: (current: number, total: number, layerName: string) => void
): Promise<PSDLayer[]> {
  const processedLayers: PSDLayer[] = [];
  const visibleLayers = flattenLayers(layers).filter(layer => 
    layer.visible && !['folder', 'background', 'adjustment'].includes(layer.type) && layer.bounds.width > 0 && layer.bounds.height > 0
  );

  for (let i = 0; i < visibleLayers.length; i++) {
    const layer = visibleLayers[i];
    
    try {
      onProgress?.(i + 1, visibleLayers.length, layer.name);

      // Convert layer to blob
      const blob = await layerToBlob(layer.rawData, layer.bounds.width, layer.bounds.height, 'png');
      
      if (blob) {
        // Upload to storage
        const imageUrl = await uploadLayerToStorage(layer, blob, psdFileName);
        
        // Update layer with image URL
        const processedLayer: PSDLayer = {
          ...layer,
          imageUrl,
          isProcessed: true,
        };
        
        processedLayers.push(processedLayer);
      }
    } catch (error) {
      console.error(`Error processing layer ${layer.name}:`, error);
      // Continue with other layers even if one fails
    }
  }

  return processedLayers;
}

/**
 * Flatten nested layers (from folders) into a flat array
 */
function flattenLayers(layers: PSDLayer[]): PSDLayer[] {
  const flattened: PSDLayer[] = [];
  
  layers.forEach(layer => {
    flattened.push(layer);
    if (layer.children) {
      flattened.push(...flattenLayers(layer.children));
    }
  });
  
  return flattened;
}

/**
 * Create thumbnail from layer blob
 */
export async function createLayerThumbnail(blob: Blob, maxSize = 200): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate thumbnail dimensions
      const { width, height } = img;
      const aspectRatio = width / height;
      
      let thumbWidth, thumbHeight;
      if (width > height) {
        thumbWidth = Math.min(maxSize, width);
        thumbHeight = thumbWidth / aspectRatio;
      } else {
        thumbHeight = Math.min(maxSize, height);
        thumbWidth = thumbHeight * aspectRatio;
      }

      canvas.width = thumbWidth;
      canvas.height = thumbHeight;
      
      // Draw thumbnail
      ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
      
      canvas.toBlob((thumbnailBlob) => {
        if (thumbnailBlob) {
          resolve(thumbnailBlob);
        } else {
          reject(new Error('Failed to create thumbnail blob'));
        }
      }, 'image/png', 0.8);
    };

    img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
    img.src = URL.createObjectURL(blob);
  });
}
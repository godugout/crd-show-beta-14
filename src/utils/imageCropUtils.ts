// Image cropping utilities for CRD cards
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SmartCropResult {
  cropArea: CropArea;
  cropType: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'face-detected';
  aspectRatioMatch: boolean;
}

/**
 * Calculate optimal crop area for a given image to fit card dimensions
 */
export function calculateSmartCrop(
  imageWidth: number,
  imageHeight: number,
  targetAspectRatio: number
): SmartCropResult {
  const imageAspectRatio = imageWidth / imageHeight;
  const aspectRatioMatch = Math.abs(imageAspectRatio - targetAspectRatio) < 0.05;

  // If aspect ratios are close enough, use the full image
  if (aspectRatioMatch) {
    return {
      cropArea: { x: 0, y: 0, width: imageWidth, height: imageHeight },
      cropType: 'center',
      aspectRatioMatch: true
    };
  }

  let cropArea: CropArea;
  let cropType: SmartCropResult['cropType'] = 'center';

  if (imageAspectRatio > targetAspectRatio) {
    // Image is wider than target - crop horizontally
    const targetWidth = imageHeight * targetAspectRatio;
    const offsetX = (imageWidth - targetWidth) / 2;
    
    cropArea = {
      x: Math.max(0, offsetX),
      y: 0,
      width: Math.min(targetWidth, imageWidth),
      height: imageHeight
    };
    cropType = 'center';
  } else {
    // Image is taller than target - crop vertically
    const targetHeight = imageWidth / targetAspectRatio;
    
    // For portraits, prefer top-center cropping to keep faces
    const offsetY = imageAspectRatio < 0.8 ? 
      Math.max(0, (imageHeight - targetHeight) * 0.25) : // Top-weighted for portraits
      Math.max(0, (imageHeight - targetHeight) / 2);     // Center for other ratios
    
    cropArea = {
      x: 0,
      y: offsetY,
      width: imageWidth,
      height: Math.min(targetHeight, imageHeight)
    };
    cropType = imageAspectRatio < 0.8 ? 'top' : 'center';
  }

  return {
    cropArea,
    cropType,
    aspectRatioMatch: false
  };
}

/**
 * Apply crop to image data URL
 */
export function applyCropToImage(
  imageDataUrl: string,
  cropArea: CropArea,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Set canvas to target dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw the cropped portion of the image
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height, // Source
        0, 0, targetWidth, targetHeight // Destination
      );

      // Convert to data URL with high quality
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      resolve(croppedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageDataUrl;
  });
}

/**
 * Get image dimensions from data URL
 */
export function getImageDimensions(imageDataUrl: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageDataUrl;
  });
}

/**
 * Check if image resolution is sufficient for print quality
 */
export function checkPrintQuality(
  imageWidth: number,
  imageHeight: number,
  cardWidthInches: number = 2.5,
  cardHeightInches: number = 3.5,
  targetDPI: number = 300
): { sufficient: boolean; actualDPI: number; recommendedDPI: number } {
  const requiredWidth = cardWidthInches * targetDPI;
  const requiredHeight = cardHeightInches * targetDPI;
  
  const actualDPIWidth = imageWidth / cardWidthInches;
  const actualDPIHeight = imageHeight / cardHeightInches;
  const actualDPI = Math.min(actualDPIWidth, actualDPIHeight);
  
  return {
    sufficient: imageWidth >= requiredWidth && imageHeight >= requiredHeight,
    actualDPI: Math.round(actualDPI),
    recommendedDPI: targetDPI
  };
}

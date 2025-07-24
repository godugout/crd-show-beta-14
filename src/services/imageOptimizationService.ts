import { supabase } from '@/lib/supabase-client';

export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large';

interface ImageDimensions {
  width: number;
  height: number;
}

export const IMAGE_SIZES: Record<ImageSize, ImageDimensions> = {
  thumbnail: { width: 150, height: 210 },
  small: { width: 300, height: 420 },
  medium: { width: 600, height: 840 },
  large: { width: 1200, height: 1680 }
};

interface ProcessedImage {
  url: string;
  size: ImageSize;
  dimensions: ImageDimensions;
  cached: boolean;
}

export class ImageOptimizationService {
  private static readonly CACHE_BUCKET = 'optimized-images';
  
  /**
   * Get the appropriate image size based on context
   */
  static getRecommendedSize(context: 'grid' | 'single' | 'studio' | 'list'): ImageSize {
    switch (context) {
      case 'grid':
      case 'list':
        return 'thumbnail';
      case 'single':
        return 'medium';
      case 'studio':
        return 'large';
      default:
        return 'medium';
    }
  }

  /**
   * Generate cache key for optimized image
   */
  private static getCacheKey(originalUrl: string, size: ImageSize): string {
    const hash = this.simpleHash(originalUrl);
    return `${size}/${hash}`;
  }

  /**
   * Simple hash function for URLs
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Check if optimized image exists in cache
   */
  static async checkCache(originalUrl: string, size: ImageSize): Promise<string | null> {
    try {
      const cacheKey = this.getCacheKey(originalUrl, size);
      
      const { data } = supabase.storage
        .from(this.CACHE_BUCKET)
        .getPublicUrl(cacheKey);
      
      // Verify the file actually exists
      const response = await fetch(data.publicUrl, { method: 'HEAD' });
      if (response.ok) {
        console.log(`📸 Found cached optimized image: ${size}`);
        return data.publicUrl;
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to check image cache:', error);
      return null;
    }
  }

  /**
   * Generate and cache optimized image
   */
  static async generateOptimizedImage(originalUrl: string, size: ImageSize): Promise<string> {
    try {
      console.log(`🔄 Generating optimized image: ${size}`);
      
      // Create canvas to resize image
      const dimensions = IMAGE_SIZES[size];
      const optimizedBlob = await this.resizeImage(originalUrl, dimensions);
      
      // Upload to cache
      const cacheKey = this.getCacheKey(originalUrl, size);
      const { data, error } = await supabase.storage
        .from(this.CACHE_BUCKET)
        .upload(cacheKey, optimizedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000', // 1 year cache
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.CACHE_BUCKET)
        .getPublicUrl(cacheKey);

      console.log(`✅ Generated and cached optimized image: ${size}`);
      return urlData.publicUrl;
    } catch (error) {
      console.warn(`Failed to generate optimized image for ${size}:`, error);
      return originalUrl; // Fallback to original
    }
  }

  /**
   * Resize image using canvas
   */
  private static async resizeImage(imageUrl: string, dimensions: ImageDimensions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate aspect ratio preserving dimensions
        const aspectRatio = img.width / img.height;
        const targetAspectRatio = dimensions.width / dimensions.height;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (aspectRatio > targetAspectRatio) {
          // Image is wider - fit by height
          drawHeight = dimensions.height;
          drawWidth = drawHeight * aspectRatio;
          offsetX = (dimensions.width - drawWidth) / 2;
        } else {
          // Image is taller - fit by width
          drawWidth = dimensions.width;
          drawHeight = drawWidth / aspectRatio;
          offsetY = (dimensions.height - drawHeight) / 2;
        }

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        // Fill background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        
        // Draw image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/webp',
          0.85
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  }

  /**
   * Get optimized image URL with caching
   */
  static async getOptimizedImageUrl(originalUrl: string, size: ImageSize): Promise<string> {
    if (!originalUrl || originalUrl.startsWith('blob:') || originalUrl.startsWith('data:')) {
      return originalUrl;
    }

    // Check cache first
    const cachedUrl = await this.checkCache(originalUrl, size);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Generate new optimized image
    return this.generateOptimizedImage(originalUrl, size);
  }

  /**
   * Generate thumbnail with blur effect for progressive loading
   */
  static async generateBlurredThumbnail(originalUrl: string): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('No canvas context');

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          // Create tiny blurred version
          canvas.width = 20;
          canvas.height = 28;
          
          ctx.filter = 'blur(2px)';
          ctx.drawImage(img, 0, 0, 20, 28);
          
          resolve(canvas.toDataURL('image/jpeg', 0.1));
        };
        
        img.onerror = () => resolve(originalUrl);
        img.src = originalUrl;
      });
    } catch (error) {
      return originalUrl;
    }
  }

  /**
   * Clean up old cached images
   */
  static async cleanupCache(olderThanDays: number = 30): Promise<void> {
    try {
      const { data: files, error } = await supabase.storage
        .from(this.CACHE_BUCKET)
        .list();

      if (error) throw error;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const filesToDelete = files?.filter(file => {
        const fileDate = new Date(file.created_at);
        return fileDate < cutoffDate;
      });

      if (filesToDelete && filesToDelete.length > 0) {
        const filePaths = filesToDelete.map(file => file.name);
        await supabase.storage
          .from(this.CACHE_BUCKET)
          .remove(filePaths);
        
        console.log(`🗑️ Cleaned up ${filesToDelete.length} old cached images`);
      }
    } catch (error) {
      console.warn('Failed to cleanup image cache:', error);
    }
  }
}
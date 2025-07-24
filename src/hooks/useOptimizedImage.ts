import { useState, useEffect } from 'react';
import { ImageOptimizationService, ImageSize } from '@/services/imageOptimizationService';
import { ImageCacheService } from '@/services/imageCacheService';

interface UseOptimizedImageProps {
  src: string;
  size?: ImageSize;
  context?: 'grid' | 'single' | 'studio' | 'list';
  enableCaching?: boolean;
}

interface UseOptimizedImageReturn {
  optimizedSrc: string;
  isLoading: boolean;
  error: boolean;
  preloadSizes: (sizes: ImageSize[]) => Promise<void>;
}

export const useOptimizedImage = ({
  src,
  size,
  context = 'single',
  enableCaching = true
}: UseOptimizedImageProps): UseOptimizedImageReturn => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determine optimal size
  const optimalSize = size || ImageOptimizationService.getRecommendedSize(context);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setError(true);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(false);

    const loadOptimizedImage = async () => {
      try {
        let imageUrl: string;

        if (enableCaching) {
          // Use cached service which now integrates with optimization
          imageUrl = await ImageCacheService.getCachedImageUrl(src, optimalSize);
        } else {
          // Direct optimization service
          imageUrl = await ImageOptimizationService.getOptimizedImageUrl(src, optimalSize);
        }

        if (isMounted) {
          setOptimizedSrc(imageUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Failed to load optimized image:', err);
        if (isMounted) {
          setError(true);
          setIsLoading(false);
          setOptimizedSrc(src); // Fallback to original
        }
      }
    };

    loadOptimizedImage();

    return () => {
      isMounted = false;
    };
  }, [src, optimalSize, enableCaching]);

  // Function to preload multiple sizes
  const preloadSizes = async (sizes: ImageSize[]) => {
    const preloadPromises = sizes.map(preloadSize => 
      enableCaching 
        ? ImageCacheService.preloadImage(src, preloadSize)
        : ImageOptimizationService.getOptimizedImageUrl(src, preloadSize)
    );

    try {
      await Promise.all(preloadPromises);
      console.log(`📦 Preloaded ${sizes.length} image sizes for ${src}`);
    } catch (error) {
      console.warn('Failed to preload some image sizes:', error);
    }
  };

  return {
    optimizedSrc,
    isLoading,
    error,
    preloadSizes
  };
};
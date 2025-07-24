import { useState, useEffect } from 'react';
import { ImageOptimizationService, ImageSize } from '@/services/imageOptimizationService';

interface UseProgressiveImageProps {
  src: string;
  size: ImageSize;
  enableBlur?: boolean;
}

interface ProgressiveImageState {
  blurredSrc: string;
  optimizedSrc: string;
  isLoading: boolean;
  isOptimizedLoaded: boolean;
  error: boolean;
}

export const useProgressiveImage = ({ 
  src, 
  size, 
  enableBlur = true 
}: UseProgressiveImageProps): ProgressiveImageState => {
  const [state, setState] = useState<ProgressiveImageState>({
    blurredSrc: '',
    optimizedSrc: '',
    isLoading: true,
    isOptimizedLoaded: false,
    error: false
  });

  useEffect(() => {
    if (!src) {
      setState(prev => ({ ...prev, isLoading: false, error: true }));
      return;
    }

    let isMounted = true;

    const loadImages = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: false }));

        // Load blurred thumbnail first if enabled
        if (enableBlur) {
          const blurredUrl = await ImageOptimizationService.generateBlurredThumbnail(src);
          if (isMounted) {
            setState(prev => ({ ...prev, blurredSrc: blurredUrl }));
          }
        }

        // Load optimized image
        const optimizedUrl = await ImageOptimizationService.getOptimizedImageUrl(src, size);
        if (isMounted) {
          setState(prev => ({ ...prev, optimizedSrc: optimizedUrl }));
          
          // Pre-load the optimized image to know when it's ready
          const img = new Image();
          img.onload = () => {
            if (isMounted) {
              setState(prev => ({ 
                ...prev, 
                isOptimizedLoaded: true, 
                isLoading: false 
              }));
            }
          };
          img.onerror = () => {
            if (isMounted) {
              setState(prev => ({ 
                ...prev, 
                error: true, 
                isLoading: false,
                optimizedSrc: src // Fallback to original
              }));
            }
          };
          img.src = optimizedUrl;
        }
      } catch (error) {
        console.warn('Failed to load progressive image:', error);
        if (isMounted) {
          setState(prev => ({ 
            ...prev, 
            error: true, 
            isLoading: false,
            optimizedSrc: src // Fallback to original
          }));
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [src, size, enableBlur]);

  return state;
};
import React, { useState, useRef } from 'react';
import { ImageOptimizationService, ImageSize } from '@/services/imageOptimizationService';
import { useProgressiveImage } from '@/hooks/useProgressiveImage';
import { useIntersectionObserver } from '@/components/editor/wizard/hooks/useIntersectionObserver';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: ImageSize;
  context?: 'grid' | 'single' | 'studio' | 'list';
  showSkeleton?: boolean;
  fallbackSrc?: string;
  enableLazyLoading?: boolean;
  enableProgressiveLoading?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  size,
  context = 'single',
  showSkeleton = true,
  fallbackSrc,
  enableLazyLoading = true,
  enableProgressiveLoading = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  
  // Determine optimal size based on context if not explicitly provided
  const optimalSize = size || ImageOptimizationService.getRecommendedSize(context);
  
  // Intersection observer for lazy loading
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Progressive image loading
  const shouldLoad = enableLazyLoading ? hasIntersected : true;
  const { 
    blurredSrc, 
    optimizedSrc, 
    isLoading, 
    isOptimizedLoaded, 
    error 
  } = useProgressiveImage({
    src: shouldLoad ? src : '',
    size: optimalSize,
    enableBlur: enableProgressiveLoading
  });

  // Handle image load error
  const handleImageError = () => {
    if (fallbackSrc && !hasError) {
      setHasError(true);
    }
  };

  // Combine refs for intersection observer
  const combinedRef = (node: HTMLDivElement) => {
    targetRef.current = node;
    if (containerRef.current !== node) {
      containerRef.current = node;
    }
  };

  // Show skeleton while loading
  if ((isLoading || !shouldLoad) && showSkeleton) {
    return (
      <div ref={combinedRef} className={className}>
        <Skeleton className="w-full h-full bg-crd-mediumGray/20" />
      </div>
    );
  }

  // Show error state
  if ((error || hasError) && !optimizedSrc && !fallbackSrc) {
    return (
      <div ref={combinedRef} className={`bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded flex items-center justify-center ${className}`}>
        <div className="text-center text-crd-lightGray text-sm">
          <div className="w-8 h-8 mx-auto mb-2 opacity-50">
            📷
          </div>
          Image unavailable
        </div>
      </div>
    );
  }

  const imageSource = hasError && fallbackSrc ? fallbackSrc : (optimizedSrc || src);
  const showBlur = enableProgressiveLoading && blurredSrc && !isOptimizedLoaded;

  return (
    <div ref={combinedRef} className={`relative overflow-hidden ${className}`}>
      {/* Blurred thumbnail for progressive loading */}
      {showBlur && (
        <img
          src={blurredSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
          style={{ filter: 'blur(8px) saturate(1.2)' }}
          aria-hidden="true"
        />
      )}
      
      {/* Main optimized image */}
      <img
        src={imageSource}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          showBlur ? 'opacity-0' : 'opacity-100'
        } ${isOptimizedLoaded ? 'opacity-100' : ''}`}
        onError={handleImageError}
        onLoad={() => {
          // Force opacity transition when image loads
          if (containerRef.current) {
            const img = containerRef.current.querySelector('img:last-child') as HTMLImageElement;
            if (img) {
              img.style.opacity = '1';
            }
          }
        }}
        loading={enableLazyLoading ? "lazy" : "eager"}
      />
    </div>
  );
};
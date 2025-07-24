import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/shared/OptimizedImage';

interface CardPreviewProps {
  imageUrl: string;
  title?: string;
  className?: string;
  isLowRes?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  imageUrl,
  title,
  className,
  isLowRes = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-lg bg-crd-mediumGray/10',
        'aspect-[2.5/3.5] transition-all duration-300',
        !isLoaded && 'bg-gradient-to-br from-crd-mediumGray/20 to-crd-mediumGray/10',
        className
      )}
    >
      {/* Low-res preview with blur */}
      <OptimizedImage
        src={imageUrl}
        alt={title || 'Card preview'}
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-all duration-500',
          isLowRes && 'blur-sm scale-105',
          !isLoaded && 'opacity-0'
        )}
        enableLazyLoading={false}
        enableProgressiveLoading={!isLowRes}
        context="grid"
      />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-crd-green/30 border-t-crd-green rounded-full animate-spin" />
        </div>
      )}

      {/* Card frame hint */}
      <div className="absolute inset-2 border border-white/10 rounded pointer-events-none" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </div>
  );
};
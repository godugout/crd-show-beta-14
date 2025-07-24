import React, { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useProgressiveLoading } from '@/hooks/useProgressiveLoading';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { CardSkeleton } from './CardSkeleton';
import { CardPreview } from './CardPreview';
import { OptimizedImage } from '@/components/shared/OptimizedImage';

interface ProgressiveCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  priority?: 'high' | 'normal' | 'low';
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  onLoad?: () => void;
}

export const ProgressiveCard: React.FC<ProgressiveCardProps> = ({
  imageUrl,
  title,
  description,
  className,
  onClick,
  priority = 'normal',
  rarity = 'common',
  onLoad
}) => {
  const { metrics, getQualitySettings } = usePerformanceMonitor();
  const qualitySettings = getQualitySettings();
  const { rarity: hapticRarity, loadingComplete, loadingError } = useHapticFeedback();
  
  // Adjust loading timing based on performance and priority
  const loadingConfig = useMemo(() => {
    const baseConfig = {
      skeleton: { showAfter: 0, timeout: 100 },
      preview: { showAfter: 100, timeout: 300 },
      full: { showAfter: 300, timeout: 1000 },
    };

    // Adjust timing based on performance
    if (metrics.quality === 'low') {
      return {
        skeleton: { showAfter: 0, timeout: 150 },
        preview: { showAfter: 150, timeout: 500 },
        full: { showAfter: 500, timeout: 1500 },
      };
    }

    // Prioritize high-priority cards
    if (priority === 'high') {
      return {
        skeleton: { showAfter: 0, timeout: 50 },
        preview: { showAfter: 50, timeout: 200 },
        full: { showAfter: 200, timeout: 600 },
      };
    }

    return baseConfig;
  }, [metrics.quality, priority]);

  const {
    currentStage,
    isLoading,
    hasError,
    progress,
    startLoading,
    setStage,
    setError
  } = useProgressiveLoading({
    stageConfig: loadingConfig,
    onComplete: () => {
      onLoad?.();
      loadingComplete();
      // Rarity-based haptic feedback on load complete
      hapticRarity(rarity);
    },
    autoProgress: true,
  });

  // Start loading when component mounts
  useEffect(() => {
    startLoading();
  }, [startLoading]);

  // Rarity-based styling
  const rarityStyles = useMemo(() => {
    const baseStyle = 'transition-all duration-300';
    
    switch (rarity) {
      case 'legendary':
        return `${baseStyle} ring-2 ring-yellow-500/30 shadow-lg shadow-yellow-500/20`;
      case 'rare':
        return `${baseStyle} ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/20`;
      case 'uncommon':
        return `${baseStyle} ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20`;
      default:
        return `${baseStyle} ring-1 ring-crd-mediumGray/20`;
    }
  }, [rarity]);

  const handleImageLoad = () => {
    if (currentStage === 'preview') {
      setStage('full');
    }
  };

  const handleImageError = () => {
    setError(new Error('Failed to load image'));
    loadingError();
  };

  const cardContent = () => {
    if (hasError) {
      return (
        <div className="aspect-[2.5/3.5] bg-crd-mediumGray/20 rounded-lg flex items-center justify-center">
          <div className="text-center text-crd-lightGray">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-sm">Failed to load</div>
          </div>
        </div>
      );
    }

    switch (currentStage) {
      case 'skeleton':
        return (
          <CardSkeleton 
            animate={qualitySettings.effectsEnabled}
            showGradient={qualitySettings.effectsEnabled}
          />
        );
      
      case 'preview':
        return (
          <CardPreview
            imageUrl={imageUrl}
            title={title}
            isLowRes={!qualitySettings.effectsEnabled}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        );
      
      case 'full':
        return (
          <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-lg">
            <OptimizedImage
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              enableLazyLoading={priority !== 'high'}
              enableProgressiveLoading={qualitySettings.effectsEnabled}
              context="grid"
            />
            
            {/* Card details overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg mb-1 truncate">{title}</h3>
                {description && (
                  <p className="text-sm text-white/80 line-clamp-2">{description}</p>
                )}
              </div>
            </div>

            {/* Rarity effects */}
            {qualitySettings.effectsEnabled && rarity !== 'common' && (
              <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                  'absolute inset-0 opacity-30',
                  rarity === 'legendary' && 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
                  rarity === 'rare' && 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
                  rarity === 'uncommon' && 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
                )} />
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'group cursor-pointer hover:scale-105 transition-transform duration-200',
        rarityStyles,
        className
      )}
      onClick={onClick}
    >
      {cardContent()}
      
      {/* Progress indicator (only during loading) */}
      {isLoading && qualitySettings.effectsEnabled && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-crd-mediumGray/20 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-crd-green to-crd-green/80 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Performance indicator (dev mode only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          {currentStage} | {metrics.fps}fps | {metrics.quality}
        </div>
      )}
    </div>
  );
};
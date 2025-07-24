import React from 'react';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  className?: string;
  animate?: boolean;
  showGradient?: boolean;
  aspectRatio?: 'card' | 'square';
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className,
  animate = true,
  showGradient = true,
  aspectRatio = 'card'
}) => {
  const aspectClass = aspectRatio === 'card' ? 'aspect-[2.5/3.5]' : 'aspect-square';

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-lg bg-crd-mediumGray/20 border border-crd-mediumGray/10',
        aspectClass,
        animate && 'animate-pulse',
        className
      )}
    >
      {/* Card silhouette with gradient */}
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-crd-mediumGray/30 via-crd-mediumGray/20 to-crd-mediumGray/10" />
      )}
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      
      {/* Content placeholders */}
      <div className="absolute inset-0 p-4 flex flex-col">
        {/* Title placeholder */}
        <div className="w-3/4 h-4 bg-crd-mediumGray/30 rounded mb-2" />
        
        {/* Image area */}
        <div className="flex-1 bg-crd-mediumGray/20 rounded mb-2 relative">
          {/* Card frame hint */}
          <div className="absolute inset-2 border border-crd-mediumGray/20 rounded" />
        </div>
        
        {/* Footer placeholders */}
        <div className="space-y-2">
          <div className="w-1/2 h-3 bg-crd-mediumGray/30 rounded" />
          <div className="w-2/3 h-3 bg-crd-mediumGray/30 rounded" />
        </div>
      </div>

      {/* Rarity glow hint */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-crd-green/10 to-transparent opacity-0 animate-[glow_3s_ease-in-out_infinite]" />
    </div>
  );
};
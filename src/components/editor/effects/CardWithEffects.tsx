import React from 'react';
import { cn } from '@/lib/utils';
import type { CardVisualEffects } from '@/types/card';

interface CardWithEffectsProps {
  effects?: CardVisualEffects;
  effectIntensity?: number;
  children: React.ReactNode;
  className?: string;
}

// Helper function to get intensity class
const getIntensityClass = (intensity: number) => {
  if (intensity <= 0.25) return 'effect-intensity-low';
  if (intensity <= 0.5) return 'effect-intensity-medium';
  if (intensity <= 0.75) return 'effect-intensity-high';
  return 'effect-intensity-max';
};

export const CardWithEffects: React.FC<CardWithEffectsProps> = ({
  effects = { chrome: false, holographic: false, foil: false },
  effectIntensity = 0.6,
  children,
  className = ''
}) => {
  const hasAnyEffect = Object.values(effects).some(Boolean);
  const hasMultipleEffects = Object.values(effects).filter(Boolean).length > 1;
  
  if (!hasAnyEffect) {
    return <div className={className}>{children}</div>;
  }

  const intensityClass = getIntensityClass(effectIntensity);

  return (
    <div 
      className={cn(
        'card-effect-container',
        hasMultipleEffects && 'multi-effect',
        className
      )}
    >
      {children}
      
      {/* Chrome Effect Layer */}
      {effects.chrome && (
        <div 
          className={cn('effect-chrome', intensityClass)}
          style={{ 
            opacity: effectIntensity,
            mixBlendMode: hasMultipleEffects ? 'multiply' : 'normal'
          }}
        />
      )}
      
      {/* Holographic Effect Layer */}
      {effects.holographic && (
        <div 
          className={cn('effect-holographic', intensityClass)}
          style={{ 
            opacity: effectIntensity,
            mixBlendMode: hasMultipleEffects ? 'screen' : 'normal'
          }}
        />
      )}
      
      {/* Foil Effect Layer */}
      {effects.foil && (
        <div 
          className={cn('effect-foil', intensityClass)}
          style={{ 
            opacity: effectIntensity,
            mixBlendMode: hasMultipleEffects ? 'overlay' : 'normal'
          }}
        />
      )}
    </div>
  );
};

import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface GoldEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const GoldEffect: React.FC<GoldEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const goldIntensity = getEffectParam('gold', 'intensity', 0);
  const goldTone = getEffectParam('gold', 'goldTone', 'rich');
  const shimmerSpeed = getEffectParam('gold', 'shimmerSpeed', 80);
  const colorEnhancement = getEffectParam('gold', 'colorEnhancement', true);

  if (goldIntensity <= 0) return null;

  // Traditional gold colors based on tone
  let mainColors, blendMode;
  
  switch (goldTone) {
    case 'rose':
      mainColors = {
        primary: `rgba(255, 185, 150, ${(goldIntensity / 100) * 0.25})`,
        secondary: `rgba(255, 155, 120, ${(goldIntensity / 100) * 0.15})`,
        tertiary: `rgba(184, 134, 100, ${(goldIntensity / 100) * 0.1})`,
        accent: `rgba(255, 205, 170, ${(goldIntensity / 100) * 0.2})`
      };
      break;
    case 'white':
      mainColors = {
        primary: `rgba(245, 245, 245, ${(goldIntensity / 100) * 0.25})`,
        secondary: `rgba(225, 225, 225, ${(goldIntensity / 100) * 0.15})`,
        tertiary: `rgba(200, 200, 200, ${(goldIntensity / 100) * 0.1})`,
        accent: `rgba(255, 255, 255, ${(goldIntensity / 100) * 0.2})`
      };
      break;
    case 'antique':
      mainColors = {
        primary: `rgba(205, 175, 120, ${(goldIntensity / 100) * 0.25})`,
        secondary: `rgba(185, 155, 100, ${(goldIntensity / 100) * 0.15})`,
        tertiary: `rgba(164, 134, 80, ${(goldIntensity / 100) * 0.1})`,
        accent: `rgba(225, 195, 140, ${(goldIntensity / 100) * 0.2})`
      };
      break;
    default: // rich gold
      mainColors = {
        primary: `rgba(255, 215, 0, ${(goldIntensity / 100) * 0.25})`,
        secondary: `rgba(255, 165, 0, ${(goldIntensity / 100) * 0.15})`,
        tertiary: `rgba(184, 134, 11, ${(goldIntensity / 100) * 0.1})`,
        accent: `rgba(255, 235, 122, ${(goldIntensity / 100) * 0.2})`
      };
  }

  blendMode = 'screen';
  const animationDuration = 10000 / (shimmerSpeed / 100);

  return (
    <>
      {/* Base gold layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `radial-gradient(
            ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
            ${mainColors.primary} 0%,
            ${mainColors.secondary} 40%,
            ${mainColors.tertiary} 70%,
            transparent 100%
          )`,
          mixBlendMode: blendMode,
          opacity: 0.6
        }}
      />
      
      {/* Shimmer layer */}
      <div
        className="absolute inset-0 z-21 transition-opacity"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              transparent 0%,
              ${mainColors.accent} 20%,
              rgba(255, 215, 0, 0.2) 50%,
              ${mainColors.accent} 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.5,
          animation: colorEnhancement ? `gold-pulse ${animationDuration}ms infinite alternate` : 'none'
        }}
      />

    </>
  );
};

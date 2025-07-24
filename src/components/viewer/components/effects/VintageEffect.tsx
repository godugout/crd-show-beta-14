
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface VintageEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const VintageEffect: React.FC<VintageEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const vintageIntensity = getEffectParam('vintage', 'intensity', 0);

  if (vintageIntensity <= 0) return null;

  // Reduce overall effect intensity to prevent overwhelming the image
  const effectScale = Math.min(vintageIntensity / 100 * 0.6, 0.6); // Max 60% instead of 100%

  return (
    <>
      {/* Subtle cardstock base texture with reduced opacity */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              0deg,
              rgba(245, 240, 230, ${effectScale * 0.2}) 0%,
              rgba(250, 245, 235, ${effectScale * 0.15}) 50%,
              rgba(248, 243, 233, ${effectScale * 0.18}) 100%
            )
          `,
          mixBlendMode: 'soft-light', // Changed from 'multiply' to 'soft-light'
          opacity: 0.7
        }}
      />
      
      {/* Very subtle paper fiber grain texture */}
      <div
        className="absolute inset-0 z-21"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              ${getEffectParam('vintage', 'aging', 40) > 50 ? 88 : 92}deg,
              transparent 0px,
              rgba(220, 210, 190, ${effectScale * 0.08}) 0.5px,
              transparent 1px,
              transparent 2px,
              rgba(235, 225, 205, ${effectScale * 0.05}) 2.5px,
              transparent 3px
            ),
            repeating-linear-gradient(
              ${getEffectParam('vintage', 'aging', 40) > 50 ? 2 : -2}deg,
              transparent 0px,
              rgba(210, 200, 180, ${effectScale * 0.04}) 1px,
              transparent 3px
            )
          `,
          mixBlendMode: 'overlay', // Changed from 'multiply' to 'overlay'
          opacity: 0.4
        }}
      />
      
      {/* Reduced aging spots and discoloration */}
      <div
        className="absolute inset-0 z-22"
        style={{
          backgroundImage: `
            radial-gradient(
              ellipse at 20% 30%, 
              rgba(200, 180, 140, ${effectScale * 0.1}) 0%, 
              transparent 3%
            ),
            radial-gradient(
              ellipse at 70% 80%, 
              rgba(190, 170, 130, ${effectScale * 0.08}) 0%, 
              transparent 4%
            ),
            radial-gradient(
              ellipse at 85% 15%, 
              rgba(210, 190, 150, ${effectScale * 0.09}) 0%, 
              transparent 2%
            ),
            radial-gradient(
              ellipse at 15% 85%, 
              rgba(180, 160, 120, ${effectScale * 0.06}) 0%, 
              transparent 3%
            )
          `,
          mixBlendMode: 'soft-light', // Changed from 'multiply' to 'soft-light'
          opacity: Math.min(getEffectParam('vintage', 'aging', 40) / 150, 0.4) // Reduced max opacity
        }}
      />
      
      {/* Subtle edge wear and patina */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 70%,
              rgba(160, 140, 100, ${effectScale * 0.12}) 90%,
              rgba(140, 120, 80, ${effectScale * 0.08}) 100%
            )
          `,
          mixBlendMode: 'overlay', // Changed from 'multiply' to 'overlay'
          opacity: Math.min(getEffectParam('vintage', 'aging', 40) / 200, 0.3) // Reduced max opacity
        }}
      />
      
      {/* Very subtle paper texture noise */}
      <div
        className="absolute inset-0 z-24"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(230, 220, 200, ${effectScale * 0.04}) 1px, transparent 1px),
            radial-gradient(circle at 70% 70%, rgba(240, 230, 210, ${effectScale * 0.03}) 1px, transparent 1px),
            radial-gradient(circle at 20% 80%, rgba(225, 215, 195, ${effectScale * 0.035}) 1px, transparent 1px)
          `,
          backgroundSize: '15px 15px, 20px 20px, 18px 18px',
          backgroundPosition: '0 0, 10px 10px, 5px 15px',
          mixBlendMode: 'overlay',
          opacity: 0.3
        }}
      />
    </>
  );
};

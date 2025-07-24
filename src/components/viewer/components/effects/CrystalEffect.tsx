
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface CrystalEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const CrystalEffect: React.FC<CrystalEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const crystalIntensity = getEffectParam('crystal', 'intensity', 0);
  const facets = getEffectParam('crystal', 'facets', 6);
  const dispersion = getEffectParam('crystal', 'dispersion', 40);
  const clarity = getEffectParam('crystal', 'clarity', 60);
  const sparkle = getEffectParam('crystal', 'sparkle', true);

  if (crystalIntensity <= 0) return null;

  console.log('💎 Crystal Effect Rendering:', {
    crystalIntensity,
    facets,
    dispersion,
    clarity,
    sparkle
  });

  // More pronounced opacity for glitter effect
  const baseOpacity = (crystalIntensity / 100) * 0.25;
  const glitterOpacity = baseOpacity * 1.5;
  const transparentOpacity = baseOpacity * 0.6;

  // Diamond-like sharp reflections
  const mouseInfluence = {
    x: (mousePosition.x - 0.5) * 40,
    y: (mousePosition.y - 0.5) * 40
  };

  return (
    <>
      {/* Transparent crystal base layer */}
      <div
        className="absolute inset-0 z-14"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mouseInfluence.x}% ${50 + mouseInfluence.y}%,
            rgba(255, 255, 255, ${transparentOpacity * 0.4}) 0%,
            rgba(240, 250, 255, ${transparentOpacity * 0.3}) 40%,
            transparent 80%
          )`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Diamond facet reflections scattered like glitter */}
      {sparkle && Array.from({ length: Math.min(Math.max(facets * 2, 8), 16) }, (_, i) => {
        const angle = (360 / Math.max(facets * 2, 8)) * i + mousePosition.x * 60;
        const radiusVariation = 0.1 + (i % 4) * 0.15;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * radiusVariation * 120;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * radiusVariation * 120;
        const size = 2 + (crystalIntensity * 0.08) + (i % 3);
        
        return (
          <div
            key={i}
            className="absolute z-19"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `linear-gradient(
                ${angle + 45}deg,
                rgba(255, 255, 255, ${glitterOpacity * 2}) 0%,
                rgba(230, 240, 255, ${glitterOpacity * 1.5}) 30%,
                rgba(200, 230, 255, ${glitterOpacity}) 60%,
                transparent 100%
              )`,
              borderRadius: i % 2 === 0 ? '50%' : '0%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              filter: `blur(${0.2 + (i * 0.1)}px)`,
              boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${glitterOpacity})`,
              animation: `crystal-diamond-${i} ${1.8 + (i * 0.2)}s ease-in-out infinite alternate`
            }}
          />
        );
      })}

      {/* Additional scattered micro-crystals for glitter paper effect */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = 20 + (i * 7) % 60;
        const y = 15 + (i * 11) % 70;
        const size = 1 + (crystalIntensity * 0.03);
        
        return (
          <div
            key={`micro-${i}`}
            className="absolute z-18"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `rgba(255, 255, 255, ${glitterOpacity * 0.8})`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              filter: `blur(0.1px)`,
              animation: `crystal-micro-${i} ${3 + (i * 0.1)}s ease-in-out infinite alternate`
            }}
          />
        );
      })}

      {/* Sharp prismatic dispersion with transparency */}
      {dispersion > 0 && (
        <div
          className="absolute inset-0 z-16"
          style={{
            background: `conic-gradient(
              from ${mousePosition.x * 180}deg at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(255, 220, 230, ${baseOpacity * (dispersion / 100) * 0.6}) 0deg,
              rgba(220, 255, 240, ${baseOpacity * (dispersion / 100) * 0.7}) 60deg,
              rgba(220, 240, 255, ${baseOpacity * (dispersion / 100) * 0.6}) 120deg,
              rgba(240, 220, 255, ${baseOpacity * (dispersion / 100) * 0.5}) 180deg,
              rgba(255, 240, 220, ${baseOpacity * (dispersion / 100) * 0.6}) 240deg,
              rgba(255, 220, 230, ${baseOpacity * (dispersion / 100) * 0.6}) 360deg
            )`,
            mixBlendMode: 'color-dodge',
            opacity: clarity / 100
          }}
        />
      )}

      {/* CSS Animations for diamond sparkles */}
      <style>
        {Array.from({ length: Math.min(Math.max(facets * 2, 8), 16) }, (_, i) => `
          @keyframes crystal-diamond-${i} {
            0% { 
              opacity: ${glitterOpacity * 0.6}; 
              transform: translate(-50%, -50%) rotate(45deg) scale(0.8); 
            }
            100% { 
              opacity: ${glitterOpacity * 1.8}; 
              transform: translate(-50%, -50%) rotate(45deg) scale(1.2); 
            }
          }
        `).join('\n')}
        {Array.from({ length: 12 }, (_, i) => `
          @keyframes crystal-micro-${i} {
            0% { 
              opacity: ${glitterOpacity * 0.4}; 
              transform: translate(-50%, -50%) scale(0.6); 
            }
            100% { 
              opacity: ${glitterOpacity * 1.2}; 
              transform: translate(-50%, -50%) scale(1); 
            }
          }
        `).join('\n')}
      </style>
    </>
  );
};

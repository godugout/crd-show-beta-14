
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface LunarEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const LunarEffect: React.FC<LunarEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const lunarIntensity = getEffectParam('lunar', 'intensity', 0);

  if (lunarIntensity <= 0) return null;

  const baseOpacity = (lunarIntensity / 100) * 0.4;
  const dustOpacity = baseOpacity * 0.6;

  return (
    <>
      {/* Lunar surface base - dull NASA gray */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
            rgba(75, 85, 99, ${baseOpacity}) 0%,
            rgba(107, 114, 128, ${baseOpacity * 0.8}) 50%,
            rgba(156, 163, 175, ${baseOpacity * 0.6}) 80%,
            transparent 100%
          )`,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Moon dust particles scattered across surface */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = 5 + (i * 7) % 90;
        const y = 8 + (i * 11) % 84;
        const size = 1 + (i % 4) * 0.5;
        
        return (
          <div
            key={`dust-${i}`}
            className="absolute z-17"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `rgba(156, 163, 175, ${dustOpacity * (0.5 + (i % 3) * 0.2)})`,
              borderRadius: '50%',
              filter: 'blur(0.2px)',
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      })}

      {/* Larger moon dust clusters */}
      {Array.from({ length: 8 }, (_, i) => {
        const x = 15 + (i * 12) % 70;
        const y = 20 + (i * 9) % 60;
        const size = 2 + (i % 3);
        
        return (
          <div
            key={`cluster-${i}`}
            className="absolute z-18"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(
                circle,
                rgba(107, 114, 128, ${dustOpacity * 1.2}) 0%,
                rgba(156, 163, 175, ${dustOpacity * 0.8}) 60%,
                transparent 100%
              )`,
              borderRadius: '50%',
              filter: 'blur(0.4px)',
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      })}

      {/* Retro space texture overlay */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `linear-gradient(
            ${mousePosition.x * 90 + 45}deg,
            transparent 0%,
            rgba(75, 85, 99, ${baseOpacity * 0.3}) 25%,
            rgba(107, 114, 128, ${baseOpacity * 0.4}) 50%,
            rgba(75, 85, 99, ${baseOpacity * 0.3}) 75%,
            transparent 100%
          )`,
          mixBlendMode: 'overlay',
          filter: 'blur(2px)'
        }}
      />

      {/* Subtle retro space grid pattern */}
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(156, 163, 175, ${dustOpacity * 0.1}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, ${dustOpacity * 0.1}) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.3,
          mixBlendMode: 'soft-light'
        }}
      />
    </>
  );
};

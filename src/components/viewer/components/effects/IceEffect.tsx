
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface IceEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const IceEffect: React.FC<IceEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const iceIntensity = getEffectParam('ice', 'intensity', 0);

  if (iceIntensity <= 0) return null;

  const baseOpacity = (iceIntensity / 100) * 0.3;
  const scratchOpacity = baseOpacity * 0.8;

  return (
    <>
      {/* Ice base layer with frosted effect */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
            rgba(240, 249, 255, ${baseOpacity}) 0%,
            rgba(224, 242, 254, ${baseOpacity * 0.8}) 40%,
            rgba(186, 230, 253, ${baseOpacity * 0.6}) 70%,
            transparent 100%
          )`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Ice scratches and surface markings */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30) + mousePosition.x * 25;
        const length = 10 + (i * 6) % 25;
        const x = 15 + (i * 12) % 70;
        const y = 10 + (i * 8) % 80;
        
        return (
          <div
            key={`scratch-${i}`}
            className="absolute z-17"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${length}px`,
              height: '1px',
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(173, 216, 230, ${scratchOpacity * 0.9}) 15%,
                rgba(135, 206, 250, ${scratchOpacity * 1.3}) 40%,
                rgba(70, 130, 180, ${scratchOpacity * 1.1}) 60%,
                rgba(173, 216, 230, ${scratchOpacity * 0.8}) 85%,
                transparent 100%
              )`,
              transform: `rotate(${angle}deg)`,
              filter: 'blur(0.2px)',
              opacity: 0.6 + (i % 4) * 0.15
            }}
          />
        );
      })}

      {/* Deeper ice cracks and blue streaks */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60) + mousePosition.y * 35;
        const x = 20 + (i * 15) % 60;
        const y = 15 + (i * 12) % 70;
        const isLongCrack = i % 2 === 0;
        
        return (
          <div
            key={`crack-${i}`}
            className="absolute z-18"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: isLongCrack ? '45px' : '25px',
              height: isLongCrack ? '2.5px' : '1.5px',
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(65, 105, 225, ${scratchOpacity * 0.7}) 25%,
                rgba(30, 144, 255, ${scratchOpacity * 0.9}) 50%,
                rgba(100, 149, 237, ${scratchOpacity * 0.75}) 75%,
                transparent 100%
              )`,
              transform: `rotate(${angle}deg)`,
              filter: 'blur(0.4px)',
              boxShadow: `0 0 4px rgba(30, 144, 255, ${scratchOpacity * 0.6})`
            }}
          />
        );
      })}

      {/* Ice skating marks */}
      {Array.from({ length: 8 }, (_, i) => {
        const curve = Math.sin(i * 0.8) * 20;
        const x = 10 + (i * 10) % 80;
        const y = 25 + curve + (i * 8) % 50;
        
        return (
          <div
            key={`skate-mark-${i}`}
            className="absolute z-16"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '35px',
              height: '0.8px',
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(70, 130, 180, ${baseOpacity * 0.8}) 20%,
                rgba(95, 158, 160, ${baseOpacity * 1.0}) 50%,
                rgba(70, 130, 180, ${baseOpacity * 0.8}) 80%,
                transparent 100%
              )`,
              transform: `rotate(${-15 + curve * 0.5}deg)`,
              filter: 'blur(0.3px)',
              opacity: 0.5 + (i % 3) * 0.2
            }}
          />
        );
      })}

      {/* Frost patterns */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `conic-gradient(
            from ${mousePosition.x * 180}deg at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            transparent 0deg,
            rgba(240, 249, 255, ${baseOpacity * 0.4}) 30deg,
            transparent 60deg,
            rgba(224, 242, 254, ${baseOpacity * 0.5}) 120deg,
            transparent 150deg,
            rgba(186, 230, 253, ${baseOpacity * 0.3}) 210deg,
            transparent 240deg,
            rgba(240, 249, 255, ${baseOpacity * 0.4}) 330deg,
            transparent 360deg
          )`,
          mixBlendMode: 'soft-light',
          filter: 'blur(1px)'
        }}
      />
    </>
  );
};

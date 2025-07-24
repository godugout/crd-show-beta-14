
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface WavesEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const WavesEffect: React.FC<WavesEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const intensity = getEffectParam('waves', 'intensity', 0);
  const frequency = getEffectParam('waves', 'frequency', 10);
  const amplitude = getEffectParam('waves', 'amplitude', 30);
  const direction = getEffectParam('waves', 'direction', 45);
  const complexity = getEffectParam('waves', 'complexity', 3);
  const wobble = getEffectParam('waves', 'wobble', 50);

  if (intensity <= 0) return null;

  const baseOpacity = (intensity / 100) * 0.6;
  const animationSpeed = Math.max(2000, 8000 - (frequency * 120));
  const waveHeight = (amplitude / 100) * 40;
  const wobbleAmount = (wobble / 100) * 15;

  // Generate multiple wave layers based on complexity
  const waveLayers = Array.from({ length: Math.min(complexity, 5) }, (_, i) => {
    const layerOffset = i * 72; // 72 degrees offset between layers
    const layerSpeed = animationSpeed + (i * 500);
    const layerOpacity = baseOpacity * (1 - i * 0.15);
    
    return (
      <div
        key={`wave-layer-${i}`}
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${direction + layerOffset + mousePosition.x * 30}deg,
              transparent 0%,
              rgba(100, 150, 255, ${layerOpacity * 0.3}) ${15 + i * 5}%,
              rgba(150, 100, 255, ${layerOpacity * 0.4}) ${35 + i * 5}%,
              rgba(100, 200, 150, ${layerOpacity * 0.3}) ${55 + i * 5}%,
              rgba(200, 100, 200, ${layerOpacity * 0.2}) ${75 + i * 5}%,
              transparent 100%
            )
          `,
          backgroundSize: `${200 + i * 50}% ${100 + waveHeight}%`,
          animation: `wave-flow-${i} ${layerSpeed}ms ease-in-out infinite`,
          mixBlendMode: 'overlay',
          transform: `translateY(${Math.sin(Date.now() / 1000 + i) * wobbleAmount}px)`,
          filter: `blur(${0.5 + i * 0.3}px)`,
          zIndex: 20 + i
        }}
      />
    );
  });

  // Circular wave pattern for more complex interference
  const circularWaves = complexity > 2 ? (
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(
            ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
            transparent 0%,
            rgba(80, 200, 255, ${baseOpacity * 0.2}) 20%,
            transparent 40%,
            rgba(255, 150, 100, ${baseOpacity * 0.15}) 60%,
            transparent 80%,
            rgba(150, 255, 150, ${baseOpacity * 0.1}) 90%,
            transparent 100%
          )
        `,
        backgroundSize: `${150 + amplitude}% ${150 + amplitude}%`,
        animation: `circular-waves ${animationSpeed * 1.5}ms linear infinite`,
        mixBlendMode: 'soft-light',
        zIndex: 25
      }}
    />
  ) : null;

  // Wobble distortion overlay
  const wobbleOverlay = wobble > 20 ? (
    <div
      className="absolute inset-0"
      style={{
        background: `
          linear-gradient(
            ${direction + 90 + mousePosition.y * 45}deg,
            transparent 0%,
            rgba(255, 255, 255, ${(wobble / 100) * 0.05}) 25%,
            transparent 50%,
            rgba(255, 255, 255, ${(wobble / 100) * 0.08}) 75%,
            transparent 100%
          )
        `,
        backgroundSize: `${100 + wobbleAmount * 2}% ${100 + wobbleAmount * 3}%`,
        animation: `wobble-distort ${animationSpeed * 0.7}ms ease-in-out infinite alternate`,
        mixBlendMode: 'overlay',
        transform: `skew(${Math.sin(Date.now() / 800) * wobbleAmount * 0.1}deg)`,
        zIndex: 26
      }}
    />
  ) : null;

  return (
    <>
      {/* Wave layers */}
      {waveLayers}
      
      {/* Circular wave pattern */}
      {circularWaves}
      
      {/* Wobble distortion */}
      {wobbleOverlay}

      {/* CSS animations */}
      <style>
        {`
          @keyframes wave-flow-0 {
            0% { background-position: 0% 0% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 0% }
          }
          @keyframes wave-flow-1 {
            0% { background-position: 100% 0% }
            50% { background-position: 0% 100% }
            100% { background-position: 100% 0% }
          }
          @keyframes wave-flow-2 {
            0% { background-position: 50% 0% }
            50% { background-position: 150% 100% }
            100% { background-position: 50% 0% }
          }
          @keyframes wave-flow-3 {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 150% }
            100% { background-position: 0% 50% }
          }
          @keyframes wave-flow-4 {
            0% { background-position: 25% 25% }
            50% { background-position: 75% 75% }
            100% { background-position: 25% 25% }
          }
          @keyframes circular-waves {
            0% { transform: rotate(0deg) scale(1) }
            50% { transform: rotate(180deg) scale(1.1) }
            100% { transform: rotate(360deg) scale(1) }
          }
          @keyframes wobble-distort {
            0% { 
              transform: translateX(0px) translateY(0px) scale(1) 
            }
            25% { 
              transform: translateX(${wobbleAmount * 0.3}px) translateY(${wobbleAmount * 0.2}px) scale(1.01) 
            }
            50% { 
              transform: translateX(0px) translateY(${wobbleAmount * 0.4}px) scale(0.99) 
            }
            75% { 
              transform: translateX(-${wobbleAmount * 0.2}px) translateY(0px) scale(1.01) 
            }
            100% { 
              transform: translateX(0px) translateY(0px) scale(1) 
            }
          }
        `}
      </style>
    </>
  );
};


import React, { useEffect, useState } from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface AuroraEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const AuroraEffect: React.FC<AuroraEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const auroraIntensity = getEffectParam('aurora', 'intensity', 0);
  const waveSpeed = getEffectParam('aurora', 'waveSpeed', 80);
  const colorShift = getEffectParam('aurora', 'colorShift', 120);

  // For aurora flare animation
  const [flarePosition, setFlarePosition] = useState({ x: Math.random(), y: Math.random() });
  const [flareActive, setFlareActive] = useState(false);
  const [flareOpacity, setFlareOpacity] = useState(0);
  
  // Trigger aurora flare randomly
  useEffect(() => {
    if (auroraIntensity <= 0) return;
    
    const flareTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlarePosition({ 
          x: Math.random() * 0.8 + 0.1,
          y: Math.random() * 0.8 + 0.1
        });
        setFlareActive(true);
        setFlareOpacity(0.6 + Math.random() * 0.3);
        
        setTimeout(() => {
          setFlareActive(false);
        }, 1500 + Math.random() * 2000);
      }
    }, 3000 + Math.random() * 4000);
    
    return () => {
      clearInterval(flareTimer);
    };
  }, [auroraIntensity]);

  if (auroraIntensity <= 0) return null;

  const animationDuration = 10000 / (waveSpeed / 100);

  return (
    <>
      {/* Base Aurora Layer - Blue-green waves */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(30, 150, 255, ${(auroraIntensity / 100) * 0.3}) 0%,
              rgba(20, 180, 120, ${(auroraIntensity / 100) * 0.35}) 40%,
              rgba(80, 100, 200, ${(auroraIntensity / 100) * 0.25}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />
      
      {/* Aurora Waves - Flowing colors */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${180 + mousePosition.y * 40}deg,
              transparent 0%,
              rgba(20, 150, 240, ${(auroraIntensity / 100) * 0.2}) 15%,
              rgba(60, 200, 140, ${(auroraIntensity / 100) * 0.25}) 35%, 
              rgba(80, 120, 200, ${(auroraIntensity / 100) * 0.2}) 55%,
              rgba(120, 80, 180, ${(auroraIntensity / 100) * 0.18}) 75%,
              transparent 100%
            )
          `,
          backgroundSize: '400% 400%',
          animation: `aurora-flow ${animationDuration * 2}ms ease infinite`,
          mixBlendMode: 'screen',
          opacity: 0.9
        }}
      />

      {/* Aurora Flare - Red/orange flashes */}
      <div
        className="absolute inset-0 z-22 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(
              circle at ${flarePosition.x * 100}% ${flarePosition.y * 100}%,
              rgba(255, 80, 40, ${flareActive ? flareOpacity : 0}) 0%,
              rgba(255, 140, 60, ${flareActive ? flareOpacity * 0.8 : 0}) 30%,
              transparent 70%
            )
          `,
          mixBlendMode: 'screen',
          opacity: flareActive ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out'
        }}
      />

      {/* Shimmer layer for color shift */}
      <div
        className="absolute inset-0 z-23 transition-opacity"
        style={{
          background: `
            linear-gradient(
              ${colorShift + mousePosition.x * 90}deg,
              transparent 0%,
              rgba(100, 220, 180, 0.2) 20%,
              rgba(60, 200, 150, 0.25) 50%,
              rgba(100, 220, 180, 0.2) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6,
          animation: `aurora-shimmer ${animationDuration}ms infinite alternate`
        }}
      />

      {/* Style tag for animations */}
      <style>
        {`
          @keyframes aurora-flow {
            0% { background-position: 0% 0% }
            50% { background-position: 100% 100% }
            100% { background-position: 0% 0% }
          }
          @keyframes aurora-shimmer {
            0% { opacity: 0.4 }
            100% { opacity: 0.8 }
          }
        `}
      </style>
    </>
  );
};

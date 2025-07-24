
import React from 'react';

interface ColorEffectsLayersProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  blur: number;
}

export const ColorEffectsLayers: React.FC<ColorEffectsLayersProps> = ({
  intensity,
  mousePosition,
  blur
}) => {
  return (
    <>
      {/* Enhanced Angular Color Effects - More Blue/Gray focused */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 180}deg at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(100, 150, 255, ${(intensity / 100) * 0.28}) 0deg,
              rgba(0, 200, 255, ${(intensity / 100) * 0.32}) 60deg,
              rgba(150, 180, 255, ${(intensity / 100) * 0.25}) 120deg,
              rgba(80, 120, 200, ${(intensity / 100) * 0.3}) 180deg,
              rgba(120, 160, 255, ${(intensity / 100) * 0.26}) 240deg,
              rgba(60, 140, 220, ${(intensity / 100) * 0.3}) 300deg,
              rgba(100, 150, 255, ${(intensity / 100) * 0.28}) 360deg
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.8) 25%,
              rgba(255, 255, 255, 0.5) 55%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.8) 25%,
              rgba(255, 255, 255, 0.5) 55%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.4,
          filter: `blur(${blur * 0.6}px)`
        }}
      />

      {/* 3D Depth Layer - Blue/Gray Offset Colors */}
      <div
        className="absolute inset-0 z-25"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.y * 90}deg,
              rgba(120, 160, 220, ${(intensity / 100) * 0.22}) 0%,
              rgba(100, 180, 240, ${(intensity / 100) * 0.25}) 25%,
              rgba(140, 140, 200, ${(intensity / 100) * 0.2}) 50%,
              rgba(160, 180, 255, ${(intensity / 100) * 0.24}) 75%,
              rgba(80, 140, 220, ${(intensity / 100) * 0.22}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 20}% ${55 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.7) 30%,
              rgba(255, 255, 255, 0.4) 65%,
              rgba(255, 255, 255, 0.1) 85%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 20}% ${55 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.7) 30%,
              rgba(255, 255, 255, 0.4) 65%,
              rgba(255, 255, 255, 0.1) 85%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.5,
          filter: `blur(${blur * 0.4}px)`,
          transform: 'translateX(1px) translateY(1px)' // Subtle offset for depth
        }}
      />
    </>
  );
};

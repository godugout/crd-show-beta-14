
import React from 'react';

interface InterferencePatternLayersProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  blur: number;
}

export const InterferencePatternLayers: React.FC<InterferencePatternLayersProps> = ({
  intensity,
  mousePosition,
  blur
}) => {
  return (
    <>
      {/* Concentric Circle Interference Pattern */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              circle at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              transparent 0%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.2}) 8%,
              transparent 12%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.15}) 20%,
              transparent 24%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.12}) 32%,
              transparent 36%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.14}) 44%,
              transparent 48%
            )
          `,
          backgroundSize: '120px 120px',
          mixBlendMode: 'overlay',
          opacity: 0.6,
          filter: `blur(${blur * 0.8}px)`
        }}
      />

      {/* Secondary Circle Pattern */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            radial-gradient(
              circle at ${60 + mousePosition.x * 25}% ${60 + mousePosition.y * 25}%,
              transparent 0%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.15}) 5%,
              transparent 10%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.12}) 15%,
              transparent 20%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.14}) 25%,
              transparent 30%
            )
          `,
          backgroundSize: '80px 80px',
          mixBlendMode: 'overlay',
          opacity: 0.4,
          filter: `blur(${blur}px)`
        }}
      />
    </>
  );
};

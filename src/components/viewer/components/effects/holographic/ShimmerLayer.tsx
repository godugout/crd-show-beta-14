
import React from 'react';

interface ShimmerLayerProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  blur: number;
}

export const ShimmerLayer: React.FC<ShimmerLayerProps> = ({
  intensity,
  mousePosition,
  blur
}) => {
  return (
    <div
      className="absolute inset-0 z-26"
      style={{
        background: `
          radial-gradient(
            ellipse at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%,
            rgba(255, 255, 255, ${(intensity / 100) * 0.4}) 0%,
            rgba(245, 250, 255, ${(intensity / 100) * 0.25}) 15%,
            rgba(235, 245, 255, ${(intensity / 100) * 0.12}) 35%,
            transparent 50%
          )
        `,
        mixBlendMode: 'screen',
        opacity: 0.7,
        filter: `blur(${blur * 0.3}px)`
      }}
    />
  );
};

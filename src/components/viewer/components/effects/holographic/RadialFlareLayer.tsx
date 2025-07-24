
import React from 'react';

interface RadialFlareLayerProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  blur: number;
}

export const RadialFlareLayer: React.FC<RadialFlareLayerProps> = ({
  intensity,
  mousePosition,
  blur
}) => {
  return (
    <div
      className="absolute inset-0 z-21"
      style={{
        background: `
          conic-gradient(
            from ${mousePosition.x * 90}deg at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
            transparent 0deg,
            rgba(255, 255, 255, ${(intensity / 100) * 0.25}) 15deg,
            transparent 30deg,
            rgba(255, 255, 255, ${(intensity / 100) * 0.2}) 75deg,
            transparent 90deg,
            rgba(255, 255, 255, ${(intensity / 100) * 0.3}) 135deg,
            transparent 150deg,
            rgba(255, 255, 255, ${(intensity / 100) * 0.2}) 195deg,
            transparent 210deg,
            rgba(255, 255, 255, ${(intensity / 100) * 0.25}) 255deg,
            transparent 270deg,
            rgba(255, 255, 255, ${(intensity / 100) * 0.2}) 315deg,
            transparent 330deg,
            rgba(255, 255, 255, ${(intensity / 100) * 0.25}) 360deg
          )
        `,
        maskImage: `
          radial-gradient(
            ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            rgba(255, 255, 255, 0.9) 20%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0.2) 85%,
            transparent 100%
          )
        `,
        WebkitMaskImage: `
          radial-gradient(
            ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            rgba(255, 255, 255, 0.9) 20%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0.2) 85%,
            transparent 100%
          )
        `,
        mixBlendMode: 'soft-light',
        opacity: 0.6,
        filter: `blur(${blur * 0.8}px)`
      }}
    />
  );
};

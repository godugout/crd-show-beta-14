
import React from 'react';

interface MetallicChromeLayerProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  blur: number;
}

export const MetallicChromeLayer: React.FC<MetallicChromeLayerProps> = ({
  intensity,
  mousePosition,
  blur
}) => {
  return (
    <div
      className="absolute inset-0 z-20"
      style={{
        background: `
          radial-gradient(
            ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
            rgba(240, 248, 255, ${(intensity / 100) * 0.4}) 0%,
            rgba(235, 242, 250, ${(intensity / 100) * 0.35}) 15%,
            rgba(225, 235, 245, ${(intensity / 100) * 0.28}) 30%,
            rgba(215, 228, 240, ${(intensity / 100) * 0.22}) 45%,
            rgba(205, 220, 235, ${(intensity / 100) * 0.16}) 60%,
            rgba(195, 212, 230, ${(intensity / 100) * 0.12}) 75%,
            rgba(185, 205, 225, ${(intensity / 100) * 0.08}) 85%,
            rgba(175, 198, 220, ${(intensity / 100) * 0.04}) 95%,
            transparent 100%
          )
        `,
        mixBlendMode: 'screen',
        opacity: 0.8,
        filter: `blur(${blur * 0.3}px)`
      }}
    />
  );
};

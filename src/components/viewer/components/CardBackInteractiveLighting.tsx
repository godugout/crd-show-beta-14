
import React from 'react';
import type { CardBackMaterial } from '../hooks/useDynamicCardBackMaterials';

interface CardBackInteractiveLightingProps {
  selectedMaterial: CardBackMaterial;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  interactiveLighting?: boolean;
}

export const CardBackInteractiveLighting: React.FC<CardBackInteractiveLightingProps> = ({
  selectedMaterial,
  mousePosition,
  isHovering,
  interactiveLighting = false
}) => {
  if (!interactiveLighting || !isHovering) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-40" style={{ backfaceVisibility: 'hidden' }}>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${selectedMaterial.borderColor.replace(')', ', 0.08)')} 0%,
              rgba(255, 255, 255, 0.03) 30%,
              transparent 70%
            )
          `,
          mixBlendMode: 'overlay',
          transition: 'opacity 0.2s ease',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
};

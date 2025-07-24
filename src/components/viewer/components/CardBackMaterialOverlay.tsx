
import React from 'react';
import type { CardBackMaterial } from '../hooks/useDynamicCardBackMaterials';

interface CardBackMaterialOverlayProps {
  selectedMaterial: CardBackMaterial;
}

export const CardBackMaterialOverlay: React.FC<CardBackMaterialOverlayProps> = ({
  selectedMaterial
}) => {
  return (
    <>
      {/* Enhanced dynamic texture overlay */}
      {selectedMaterial.texture === 'noise' && (
        <div 
          className="absolute inset-0 z-25 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            animation: 'noise-shift 8s ease-in-out infinite alternate',
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          }}
        />
      )}

      {/* Material-specific accent overlay */}
      <div 
        className="absolute inset-0 z-26"
        style={{
          background: `radial-gradient(
            circle at 30% 30%, 
            ${selectedMaterial.borderColor} 0%, 
            transparent 40%
          ), radial-gradient(
            circle at 70% 70%, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 30%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.6,
          pointerEvents: 'none',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* CSS animations */}
      <style>
        {`
          @keyframes noise-shift {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-20px, -20px); }
          }
        `}
      </style>
    </>
  );
};

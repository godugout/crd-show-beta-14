
import React from 'react';
import type { CardBackMaterial } from '../hooks/useDynamicCardBackMaterials';

interface CardBackLogoProps {
  selectedMaterial: CardBackMaterial;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  interactiveLighting?: boolean;
}

export const CardBackLogo: React.FC<CardBackLogoProps> = ({
  selectedMaterial,
  isHovering,
  mousePosition,
  interactiveLighting = false
}) => {
  // Enhanced logo effects with horizontal flip for correct orientation
  const getLogoEffects = () => {
    const baseTreatment = selectedMaterial.logoTreatment;

    // Add horizontal flip to correct logo orientation on back face
    const baseTransform = `scaleX(-1) ${baseTreatment.transform}`;

    if (!interactiveLighting || !isHovering) {
      return {
        filter: baseTreatment.filter,
        transform: baseTransform,
        opacity: baseTreatment.opacity,
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as const,
        pointerEvents: 'none' as const
      };
    }

    const intensity = Math.sqrt(
      Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)
    );
    
    return {
      filter: `
        ${baseTreatment.filter}
        drop-shadow(0 0 ${20 + intensity * 30}px rgba(255, 215, 0, ${0.3 + intensity * 0.4}))
        drop-shadow(0 0 ${40 + intensity * 60}px rgba(59, 130, 246, ${0.2 + intensity * 0.3}))
        brightness(${1 + intensity * 0.3})
        contrast(${1.1 + intensity * 0.2})
      `,
      transform: `${baseTransform} scale(${1 + intensity * 0.05})`,
      opacity: baseTreatment.opacity + intensity * 0.1,
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const,
      pointerEvents: 'none' as const
    };
  };

  return (
    <div 
      className="relative h-full flex items-center justify-center z-30"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'none',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-48 h-auto relative z-10 transition-all duration-700 ease-out"
          style={{
            ...getLogoEffects(),
            imageRendering: 'crisp-edges',
            objectFit: 'contain',
            animation: interactiveLighting && isHovering ? 'logo-glow-pulse 4s ease-in-out infinite' : 'none',
            backfaceVisibility: 'hidden',
            maxWidth: '192px',
            maxHeight: '192px'
          }}
          onLoad={() => console.log('✅ Enhanced CRD logo loaded successfully (back face)')}
          onError={(e) => {
            console.log('❌ Error loading enhanced CRD logo (back face)');
            // Show fallback text
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
          draggable={false}
        />
        
        {/* Fallback CRD text if image fails */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/80"
          style={{
            ...getLogoEffects(),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            letterSpacing: '0.1em',
            display: 'none' // Will be shown if image fails
          }}
        >
          CRD
        </div>
      </div>
    </div>
  );
};

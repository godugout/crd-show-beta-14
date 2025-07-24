
import React, { useMemo } from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import { useDynamicCardBackMaterials } from '../../hooks/useDynamicCardBackMaterials';

interface CardBackMaterialPanelProps {
  effectValues: EffectValues;
  parallaxOffset: { x: number; y: number };
}

export const CardBackMaterialPanel: React.FC<CardBackMaterialPanelProps> = React.memo(({
  effectValues,
  parallaxOffset
}) => {
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);
  
  const materialOpacity = useMemo(() => Math.round(selectedMaterial.opacity * 100), [selectedMaterial.opacity]);

  return (
    <div 
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      style={{
        transform: `perspective(600px) rotateX(25deg) translateZ(-80px) translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y}px)`,
        filter: 'blur(0.4px)'
      }}
    >
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30">
        <h4 className="text-purple-400 font-medium mb-2 text-sm text-center">Card Back Material</h4>
        <div className="space-y-1 text-xs text-center">
          <div className="text-purple-300 font-medium">{selectedMaterial.name}</div>
          <div className="flex justify-center space-x-4">
            <div className="text-white/60">
              Opacity: {materialOpacity}%
            </div>
            {selectedMaterial.blur && (
              <div className="text-white/60">
                Blur: {selectedMaterial.blur}px
              </div>
            )}
          </div>
          {selectedMaterial.texture && (
            <div className="text-white/60 capitalize">
              Texture: {selectedMaterial.texture}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CardBackMaterialPanel.displayName = 'CardBackMaterialPanel';

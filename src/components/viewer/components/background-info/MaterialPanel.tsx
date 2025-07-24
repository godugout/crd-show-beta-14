
import React, { useMemo } from 'react';
import type { MaterialSettings } from '../../types';

interface MaterialPanelProps {
  materialSettings: MaterialSettings;
  parallaxOffset: { x: number; y: number };
}

export const MaterialPanel: React.FC<MaterialPanelProps> = React.memo(({
  materialSettings,
  parallaxOffset
}) => {
  const materialDisplayValues = useMemo(() => ({
    roughness: Math.round(materialSettings.roughness * 100),
    metalness: Math.round(materialSettings.metalness * 100),
    clearcoat: Math.round(materialSettings.clearcoat * 100),
    reflectivity: Math.round(materialSettings.reflectivity * 100)
  }), [materialSettings]);

  return (
    <div 
      className="absolute right-8 top-1/2 transform translate-y-8 z-10" // Reduced z-index to avoid overlapping
      style={{
        transform: `perspective(800px) rotateY(-15deg) translateZ(-30px) translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y + 32}px)`,
        filter: 'blur(0.3px)'
      }}
    >
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-orange-400/30">
        <h4 className="text-orange-400 font-medium mb-2 text-sm">Material</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-white/70">Roughness:</span>
            <span className="text-white/60">{materialDisplayValues.roughness}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Metalness:</span>
            <span className="text-white/60">{materialDisplayValues.metalness}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Clearcoat:</span>
            <span className="text-white/60">{materialDisplayValues.clearcoat}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Reflectivity:</span>
            <span className="text-white/60">{materialDisplayValues.reflectivity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
});

MaterialPanel.displayName = 'MaterialPanel';

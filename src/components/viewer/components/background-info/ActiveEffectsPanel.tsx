
import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface ActiveEffectsPanelProps {
  effectValues: EffectValues;
  parallaxOffset: { x: number; y: number };
}

export const ActiveEffectsPanel: React.FC<ActiveEffectsPanelProps> = React.memo(({
  effectValues,
  parallaxOffset
}) => {
  const activeEffects = useMemo(() => {
    return Object.entries(effectValues || {})
      .filter(([_, params]) => params && typeof params.intensity === 'number' && params.intensity > 0)
      .map(([effectId, params]) => ({
        id: effectId,
        name: effectId.charAt(0).toUpperCase() + effectId.slice(1),
        intensity: params.intensity as number
      }))
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 4);
  }, [effectValues]);

  return (
    <div 
      className="absolute left-8 top-1/2 transform -translate-y-1/2"
      style={{
        transform: `perspective(800px) rotateY(15deg) translateZ(-50px) translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y - 50}px)`,
        filter: 'blur(0.5px)'
      }}
    >
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
        <h4 className="text-blue-400 font-medium mb-3 text-sm flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          Active Effects
        </h4>
        {activeEffects.length > 0 ? (
          <div className="space-y-2">
            {activeEffects.map(effect => (
              <div key={effect.id} className="flex items-center justify-between text-xs">
                <span className="text-white/80">{effect.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 transition-all duration-300"
                      style={{ width: `${effect.intensity}%` }}
                    />
                  </div>
                  <span className="text-blue-300 w-6 text-right">{effect.intensity}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs">No effects active</p>
        )}
      </div>
    </div>
  );
});

ActiveEffectsPanel.displayName = 'ActiveEffectsPanel';

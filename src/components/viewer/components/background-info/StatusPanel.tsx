
import React, { useMemo } from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface StatusPanelProps {
  effectValues: EffectValues;
  parallaxOffset: { x: number; y: number };
}

export const StatusPanel: React.FC<StatusPanelProps> = React.memo(({
  effectValues,
  parallaxOffset
}) => {
  const activeEffectsCount = useMemo(() => {
    return Object.entries(effectValues || {})
      .filter(([_, params]) => params && typeof params.intensity === 'number' && params.intensity > 0)
      .length;
  }, [effectValues]);

  return (
    <div 
      className="absolute top-8 left-1/2 transform -translate-x-1/2"
      style={{
        transform: `perspective(600px) rotateX(-20deg) translateZ(-60px) translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y}px)`,
        filter: 'blur(0.2px)'
      }}
    >
      <div className="bg-black/15 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            <span className="text-white/70">Studio Active</span>
          </div>
          <div className="text-white/50">|</div>
          <div className="text-white/70">
            {activeEffectsCount} Effect{activeEffectsCount !== 1 ? 's' : ''} Applied
          </div>
        </div>
      </div>
    </div>
  );
});

StatusPanel.displayName = 'StatusPanel';


import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { EnvironmentScene, LightingPreset } from '../../types';

interface EnvironmentPanelProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  parallaxOffset: { x: number; y: number };
}

export const EnvironmentPanel: React.FC<EnvironmentPanelProps> = React.memo(({
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  parallaxOffset
}) => {
  return (
    <div 
      className="absolute right-8 top-1/3 transform -translate-y-1/2"
      style={{
        transform: `perspective(800px) rotateY(-15deg) translateZ(-30px) translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y - 33}px)`,
        filter: 'blur(0.3px)'
      }}
    >
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30">
        <h4 className="text-green-400 font-medium mb-2 text-sm">Environment</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-white/70">Scene:</span>
            <span className="text-green-300">{selectedScene.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Lighting:</span>
            <span className="text-green-300">{selectedLighting.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Brightness:</span>
            <span className="text-white/60">{overallBrightness[0]}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Interactive:</span>
            <div className="flex items-center">
              {interactiveLighting ? (
                <Eye className="w-3 h-3 text-green-400" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EnvironmentPanel.displayName = 'EnvironmentPanel';

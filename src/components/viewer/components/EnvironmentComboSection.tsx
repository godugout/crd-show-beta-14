
import React from 'react';
import { Button } from '@/components/ui/button';
import type { EnvironmentScene } from '../types';
import { ENVIRONMENT_SCENES } from '../constants';

interface EnvironmentComboSectionProps {
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
}

export const EnvironmentComboSection: React.FC<EnvironmentComboSectionProps> = ({
  selectedScene,
  onSceneChange
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {ENVIRONMENT_SCENES.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSceneChange(scene)}
            className={`relative p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
              selectedScene.id === scene.id
                ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="text-2xl">{scene.icon}</div>
              <div className="text-center">
                <div className={`font-medium text-sm ${
                  selectedScene.id === scene.id ? 'text-green-400' : 'text-white'
                }`}>
                  {scene.name}
                </div>
                <div className="text-xs text-gray-400 mt-1 leading-tight">
                  {scene.description}
                </div>
              </div>
            </div>
            {selectedScene.id === scene.id && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

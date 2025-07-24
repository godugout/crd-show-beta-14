
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import type { EnvironmentScene } from '../../../types';
import { ENVIRONMENT_SCENES } from '../../../constants';
import { cn } from '@/lib/utils';

interface SpacesSectionProps {
  selectedScene: EnvironmentScene;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
}

const EnvironmentButton = ({ scene, isSelected, onSelect }: { scene: EnvironmentScene, isSelected: boolean, onSelect: () => void }) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative aspect-[16/10] w-full rounded-lg overflow-hidden group border-2 transition-all duration-200",
        isSelected ? "border-crd-blue shadow-lg" : "border-white/10 hover:border-crd-blue/50"
      )}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${scene.previewUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
        <p className="text-white text-xs font-medium truncate">{scene.name}</p>
      </div>
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-inset ring-crd-blue bg-crd-blue/20" />
      )}
    </button>
  );
};

export const SpacesSection: React.FC<SpacesSectionProps> = ({
  selectedScene,
  isOpen,
  onToggle,
  onSceneChange,
}) => {
  const scenes2D = ENVIRONMENT_SCENES.filter(s => s.type === '2d');
  const scenes3D = ENVIRONMENT_SCENES.filter(s => s.type === '3d');
  
  const statusText = `${selectedScene.name} ${selectedScene.type === '3d' ? '(3D Space)' : ''}`;

  return (
    <CollapsibleSection
      title="Spaces"
      emoji="🌌"
      statusText={statusText}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-6 pt-2">
        {scenes2D.length > 0 && (
          <div className="space-y-3">
            <Label className="text-white text-sm font-medium px-3">
              2D Environments
            </Label>
            <div className="grid grid-cols-2 gap-3 px-3">
              {scenes2D.map((scene) => (
                <EnvironmentButton 
                  key={scene.id}
                  scene={scene}
                  isSelected={selectedScene.id === scene.id}
                  onSelect={() => onSceneChange(scene)}
                />
              ))}
            </div>
          </div>
        )}

        {scenes3D.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3">
              <Label className="text-white text-sm font-medium">
                3D Environments
              </Label>
              {selectedScene.type === '3d' && (
                <span className="text-xs bg-crd-blue text-white font-semibold px-2 py-0.5 rounded-md">Active</span>
              )}
            </div>
            <p className="text-crd-lightGray text-xs px-3">
              Select a 3D environment for immersive backgrounds.
            </p>
            <div className="grid grid-cols-2 gap-3 px-3">
              {scenes3D.map((scene) => (
                <EnvironmentButton 
                  key={scene.id}
                  scene={scene}
                  isSelected={selectedScene.id === scene.id}
                  onSelect={() => onSceneChange(scene)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};

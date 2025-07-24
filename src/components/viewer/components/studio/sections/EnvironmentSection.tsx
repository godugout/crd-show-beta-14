
import React from 'react';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedColoredSlider } from '../../EnhancedColoredSlider';
import type { EnvironmentScene, EnvironmentControls } from '../../../types';
import { ENVIRONMENT_SCENES } from '../../../constants';

interface EnvironmentSectionProps {
  selectedScene: EnvironmentScene;
  environmentControls: EnvironmentControls;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onControlsChange: (controls: EnvironmentControls) => void;
}

export const EnvironmentSection: React.FC<EnvironmentSectionProps> = ({
  selectedScene,
  environmentControls,
  isOpen,
  onToggle,
  onSceneChange,
  onControlsChange
}) => {
  const categories = ['natural', 'fantasy', 'futuristic', 'architectural'] as const;
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'natural': return '🌿';
      case 'fantasy': return '✨';
      case 'futuristic': return '🚀';
      case 'architectural': return '🏛️';
      default: return '🌍';
    }
  };

  const updateControl = (key: keyof EnvironmentControls, value: number) => {
    onControlsChange({
      ...environmentControls,
      [key]: value
    });
  };

  const statusText = selectedScene.name;

  return (
    <CollapsibleSection
      title="Environment"
      icon={Globe}
      statusText={statusText}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-6">
        {/* Environment Categories */}
        {categories.map((category) => {
          const categoryScenes = ENVIRONMENT_SCENES.filter(s => s.category === category);
          if (categoryScenes.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h4 className="text-white font-medium text-sm flex items-center capitalize">
                <span className="mr-2">{getCategoryIcon(category)}</span>
                {category}
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {categoryScenes.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => onSceneChange(scene)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                      selectedScene.id === scene.id 
                        ? 'ring-2 ring-crd-green scale-105' 
                        : 'hover:scale-102 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={scene.previewUrl}
                      alt={scene.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                      <div className="text-white text-xs font-medium">
                        {scene.name}
                      </div>
                    </div>
                    {selectedScene.id === scene.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-crd-green rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Environment Controls */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <h4 className="text-white font-medium flex items-center">
            Environment Controls
          </h4>

          {/* Depth of Field */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Depth of Field: {environmentControls.depthOfField.toFixed(1)}
            </Label>
            <EnhancedColoredSlider
              value={[environmentControls.depthOfField]}
              onValueChange={([value]) => updateControl('depthOfField', value)}
              min={0}
              max={5}
              step={0.1}
              isActive={environmentControls.depthOfField > 0}
              styleColor="#45B26B"
              effectName="Depth of Field"
            />
          </div>

          {/* Parallax Intensity */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Parallax Intensity: {environmentControls.parallaxIntensity.toFixed(1)}
            </Label>
            <EnhancedColoredSlider
              value={[environmentControls.parallaxIntensity]}
              onValueChange={([value]) => updateControl('parallaxIntensity', value)}
              min={0}
              max={3}
              step={0.1}
              isActive={environmentControls.parallaxIntensity > 0}
              styleColor="#3B82F6"
              effectName="Parallax"
            />
          </div>

          {/* Field of View */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Field of View: {environmentControls.fieldOfView}°
            </Label>
            <EnhancedColoredSlider
              value={[environmentControls.fieldOfView]}
              onValueChange={([value]) => updateControl('fieldOfView', value)}
              min={60}
              max={120}
              step={5}
              isActive={environmentControls.fieldOfView !== 75}
              styleColor="#8B5CF6"
              effectName="Field of View"
            />
          </div>

          {/* Atmospheric Density */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Atmospheric Density: {(environmentControls.atmosphericDensity * 100).toFixed(0)}%
            </Label>
            <EnhancedColoredSlider
              value={[environmentControls.atmosphericDensity]}
              onValueChange={([value]) => updateControl('atmosphericDensity', value)}
              min={0}
              max={2}
              step={0.1}
              isActive={environmentControls.atmosphericDensity !== 1}
              styleColor="#F59E0B"
              effectName="Atmospheric Density"
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};

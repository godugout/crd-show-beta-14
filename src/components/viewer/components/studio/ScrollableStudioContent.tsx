
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudioContent } from './StudioContent';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';

interface ScrollableStudioContentProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const ScrollableStudioContent: React.FC<ScrollableStudioContentProps> = (props) => {
  return (
    <div 
      className="flex-1 overflow-hidden"
      onWheel={(e) => {
        // Allow scroll events to propagate within the panel
        e.stopPropagation();
      }}
    >
      <ScrollArea className="h-full">
        <StudioContent {...props} />
      </ScrollArea>
    </div>
  );
};


import React from 'react';
import { StudioHeader } from './studio/StudioHeader';
import { StudioContent } from './studio/StudioContent';
import { StudioFooter } from './studio/StudioFooter';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { TemplateEngine } from '@/templates/engine';

interface ProgressiveCustomizePanelProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  isFullscreen: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  onClose: () => void;
  card: any;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
  
  // Template engine integration
  templateEngine?: TemplateEngine;
  onReplayTemplate?: () => void;
  onStudioEntry?: () => void;
  animationProgress?: number;
  isCosmicPlaying?: boolean;
}

export const ProgressiveCustomizePanel: React.FC<ProgressiveCustomizePanelProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  isFullscreen,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onToggleFullscreen,
  onDownload,
  onShare,
  onClose,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false,
  templateEngine,
  onReplayTemplate,
  onStudioEntry,
  animationProgress,
  isCosmicPlaying
}) => {
  return (
    <div className="h-full bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 flex flex-col w-80 min-w-80 max-w-96">
      <StudioHeader onClose={onClose} />
      
      <StudioContent
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings}
        onSceneChange={onSceneChange}
        onLightingChange={onLightingChange}
        onEffectChange={onEffectChange}
        onBrightnessChange={onBrightnessChange}
        onInteractiveLightingToggle={onInteractiveLightingToggle}
        onMaterialSettingsChange={onMaterialSettingsChange}
        selectedPresetId={selectedPresetId}
        onPresetSelect={onPresetSelect}
        onApplyCombo={onApplyCombo}
        isApplyingPreset={isApplyingPreset}
      />
      
        <StudioFooter
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          onDownload={onDownload}
          onShare={onShare}
          templateEngine={templateEngine}
          animationProgress={animationProgress}
          onReplay={onReplayTemplate}
          onContinueToCustomize={onStudioEntry}
          mode={isCosmicPlaying ? 'cinematic' : 'studio'}
        />
    </div>
  );
};

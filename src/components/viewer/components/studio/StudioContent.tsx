import React, { useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSectionManager } from './hooks/useSectionManager';
import { 
  StylesSection, 
  EffectsSection, 
  SpacesSection,
  SurfaceSection,
  LightingSection,
  AnimationSection
} from './sections';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';

interface StudioContentProps {
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
  
  // Animation props
  animationMode?: string;
  animationIntensity?: number;
  onAnimationModeChange?: (mode: string) => void;
  onAnimationIntensityChange?: (intensity: number) => void;
  
  // Alignment animation props
  animationProgress?: number;
  isAlignmentPlaying?: boolean;
  playbackSpeed?: number;
  cardAngle?: number;
  cameraDistance?: number;
  isOptimalZoom?: boolean;
  isOptimalPosition?: boolean;
  hasTriggered?: boolean;
  onProgressChange?: (progress: number) => void;
  onPlayToggle?: () => void;
  onSpeedChange?: (speed: number) => void;
  onReset?: () => void;
  onAngleReset?: () => void;
}

export const StudioContent: React.FC<StudioContentProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false,
  
  // Animation props
  animationMode = 'none',
  animationIntensity = 0.5,
  onAnimationModeChange,
  onAnimationIntensityChange,
  
  // Alignment animation props
  animationProgress = 0,
  isAlignmentPlaying = false,
  playbackSpeed = 1,
  cardAngle = 0,
  cameraDistance = 15,
  isOptimalZoom = false,
  isOptimalPosition = false,
  hasTriggered = false,
  onProgressChange,
  onPlayToggle,
  onSpeedChange,
  onReset,
  onAngleReset
}) => {
  const { sectionStates, setSectionState } = useSectionManager();

  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
    },
    [onBrightnessChange],
  );

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        <div className="p-3 space-y-3">
          {/* Styles Section */}
          <StylesSection
            effectValues={effectValues}
            isOpen={sectionStates.styles !== false}
            onToggle={(isOpen) => setSectionState('styles', isOpen)}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            onApplyCombo={onApplyCombo}
            isApplyingPreset={isApplyingPreset}
          />

          {/* Effects Section */}
          <EffectsSection
            effectValues={effectValues}
            isOpen={sectionStates.effects}
            onToggle={(isOpen) => setSectionState('effects', isOpen)}
            onEffectChange={onEffectChange}
            selectedPresetId={selectedPresetId}
          />

          {/* Spaces Section */}
          <SpacesSection
            selectedScene={selectedScene}
            isOpen={sectionStates.spaces}
            onToggle={(isOpen) => setSectionState('spaces', isOpen)}
            onSceneChange={onSceneChange}
          />
          
          {/* Lighting Section */}
          <LightingSection
            selectedLighting={selectedLighting}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            isOpen={sectionStates.lighting}
            onToggle={(isOpen) => setSectionState('lighting', isOpen)}
            onLightingChange={onLightingChange}
            onBrightnessChange={handleBrightnessChange}
            onInteractiveLightingToggle={onInteractiveLightingToggle}
          />

          {/* Animation Section */}
          <AnimationSection
            animationMode={animationMode}
            animationIntensity={animationIntensity}
            onAnimationModeChange={onAnimationModeChange || (() => {})}
            onAnimationIntensityChange={onAnimationIntensityChange || (() => {})}
            animationProgress={animationProgress}
            isAlignmentPlaying={isAlignmentPlaying}
            playbackSpeed={playbackSpeed}
            cardAngle={cardAngle}
            cameraDistance={cameraDistance}
            isOptimalZoom={isOptimalZoom}
            isOptimalPosition={isOptimalPosition}
            hasTriggered={hasTriggered}
            onProgressChange={onProgressChange || (() => {})}
            onPlayToggle={onPlayToggle || (() => {})}
            onSpeedChange={onSpeedChange || (() => {})}
            onReset={onReset || (() => {})}
            onAngleReset={onAngleReset || (() => {})}
            isOpen={sectionStates.animation}
            onToggle={(isOpen) => setSectionState('animation', isOpen)}
          />

          {/* Surface Section */}
          <SurfaceSection
            materialSettings={materialSettings}
            isOpen={sectionStates.materials}
            onToggle={(isOpen) => setSectionState('materials', isOpen)}
            onMaterialSettingsChange={onMaterialSettingsChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

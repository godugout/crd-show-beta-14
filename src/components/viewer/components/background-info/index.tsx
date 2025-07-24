
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';
import { useBackgroundParallax } from '../../hooks/useBackgroundParallax';
import { ActiveEffectsPanel } from './ActiveEffectsPanel';
import { EnvironmentPanel } from './EnvironmentPanel';
import { MaterialPanel } from './MaterialPanel';
import { CardBackMaterialPanel } from './CardBackMaterialPanel';
import { StatusPanel } from './StatusPanel';
import { AmbientGlow } from './AmbientGlow';

interface BackgroundInfoProps {
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const BackgroundInfo: React.FC<BackgroundInfoProps> = React.memo(({
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  mousePosition,
  isHovering
}) => {
  const { parallaxOffset } = useBackgroundParallax({ mousePosition });

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `perspective(1000px) translateZ(-200px)`,
        opacity: isHovering ? 0.9 : 0.7,
        transition: 'opacity 0.3s ease, transform 0.1s ease'
      }}
    >
      <ActiveEffectsPanel 
        effectValues={effectValues}
        parallaxOffset={parallaxOffset}
      />

      <EnvironmentPanel
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        parallaxOffset={parallaxOffset}
      />

      <MaterialPanel
        materialSettings={materialSettings}
        parallaxOffset={parallaxOffset}
      />

      <CardBackMaterialPanel
        effectValues={effectValues}
        parallaxOffset={parallaxOffset}
      />

      <StatusPanel
        effectValues={effectValues}
        parallaxOffset={parallaxOffset}
      />

      <AmbientGlow
        mousePosition={mousePosition}
        isHovering={isHovering}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.selectedScene.id === nextProps.selectedScene.id &&
    prevProps.selectedLighting.id === nextProps.selectedLighting.id &&
    prevProps.overallBrightness[0] === nextProps.overallBrightness[0] &&
    prevProps.interactiveLighting === nextProps.interactiveLighting &&
    prevProps.isHovering === nextProps.isHovering &&
    Math.abs(prevProps.mousePosition.x - nextProps.mousePosition.x) < 0.01 &&
    Math.abs(prevProps.mousePosition.y - nextProps.mousePosition.y) < 0.01 &&
    JSON.stringify(prevProps.effectValues) === JSON.stringify(nextProps.effectValues) &&
    JSON.stringify(prevProps.materialSettings) === JSON.stringify(nextProps.materialSettings)
  );
});

BackgroundInfo.displayName = 'BackgroundInfo';

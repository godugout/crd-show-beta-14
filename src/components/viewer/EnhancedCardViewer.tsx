
import React, { useState, useCallback } from 'react';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useEnhancedCardInteraction } from './hooks/useEnhancedCardInteraction';
import { EnhancedCardCanvas } from './components/EnhancedCardCanvas';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';

interface EnhancedCardViewerProps {
  card: CardData;
  onDownload?: (card: CardData) => void;
  onShare?: (card: CardData) => void;
  onClose?: () => void;
}

export const EnhancedCardViewer: React.FC<EnhancedCardViewerProps> = ({
  card,
  onDownload,
  onShare,
  onClose
}) => {
  // Debug logging to see if this viewer is being used
  console.log('EnhancedCardViewer rendering with card:', card?.title);

  // Enhanced effects system
  const {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset
  } = useEnhancedCardEffects();

  // Interactive card behavior
  const {
    mousePosition,
    isHovering,
    rotation,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  } = useEnhancedCardInteraction();

  // Environment and lighting state
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState<number[]>([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Material properties - now including clearcoat
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    metalness: 0.5,
    roughness: 0.5,
    reflectivity: 0.5,
    clearcoat: 0.3
  });

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const handleInteractiveLightingToggle = useCallback(() => {
    setInteractiveLighting(!interactiveLighting);
  }, [interactiveLighting]);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-screen'} bg-black overflow-hidden`}>
      {/* Main Canvas Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <EnhancedCardCanvas
          card={card}
          effectValues={effectValues}
          mousePosition={mousePosition}
          isHovering={isHovering}
          rotation={rotation}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness[0]}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          width={isFullscreen ? 500 : 400}
          height={isFullscreen ? 700 : 560}
        />
      </div>

      {/* Close button - simple implementation */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};

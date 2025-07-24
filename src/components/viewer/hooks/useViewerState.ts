import { useState, useCallback } from 'react';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { useDoubleClick } from '@/hooks/useDoubleClick';

export const useViewerState = () => {
  // Basic viewer state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // --- REMOVED: Redundant effectValues state.
  // This state is now managed exclusively by the `useEnhancedCardEffects` hook to prevent conflicts
  // and resolve the card back rendering issue.

  // Environment and effects state - Simplified to only handle 2D scenes
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(false);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.0,
    reflectivity: 0.5
  });

  // --- NEW: Preset state initialized to "custom-init"
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>("custom-init");

  // Action handlers
  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const handleResetCamera = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const onCardClick = useDoubleClick({
    onDoubleClick: useCallback(() => {
      console.log('🎉 Double click registered! Flipping card.');
      setIsFlipped(prev => !prev);
    }, []),
  });

  return {
    // Basic state
    isFullscreen,
    setIsFullscreen,
    rotation,
    setRotation,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    zoom,
    setZoom,
    isFlipped,
    setIsFlipped,
    autoRotate,
    setAutoRotate,
    showEffects,
    setShowEffects,
    mousePosition,
    setMousePosition,
    showCustomizePanel,
    setShowCustomizePanel,
    isHovering,
    setIsHovering,
    isHoveringControls,
    setIsHoveringControls,
    showExportDialog,
    setShowExportDialog,

    // --- REMOVED: effectValues and setEffectValues are no longer exposed by this hook.

    // Environment state
    selectedScene,
    setSelectedScene,
    selectedLighting,
    setSelectedLighting,
    overallBrightness,
    setOverallBrightness,
    interactiveLighting,
    setInteractiveLighting,
    materialSettings,
    setMaterialSettings,
    selectedPresetId,
    setSelectedPresetId,

    // Actions
    handleReset,
    handleZoom,
    handleResetCamera,
    onCardClick
  };
};


import { useState, useCallback } from 'react';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';
import type { ViewerState } from '../types/ImmersiveViewerTypes';
import type { MaterialSettings } from '../types';

export const useImmersiveViewerState = () => {
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedScene, setSelectedScene] = useState(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(false);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.0,
    reflectivity: 0.5
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>("custom-init");
  const [solidCardTransition, setSolidCardTransition] = useState(false);
  const [environmentControls, setEnvironmentControls] = useState({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  const viewerState: ViewerState = {
    showCustomizePanel,
    showExportDialog,
    selectedScene,
    selectedLighting,
    overallBrightness,
    interactiveLighting,
    materialSettings,
    selectedPresetId,
    solidCardTransition,
    environmentControls
  };

  const actions = {
    setShowCustomizePanel,
    setShowExportDialog,
    setSelectedScene,
    setSelectedLighting,
    setOverallBrightness,
    setInteractiveLighting,
    setMaterialSettings,
    setSelectedPresetId,
    setSolidCardTransition,
    setEnvironmentControls
  };

  return {
    viewerState,
    actions
  };
};

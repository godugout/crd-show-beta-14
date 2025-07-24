
import React, { useCallback } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface ViewerActionsManagerProps {
  card: CardData;
  onShare?: (card: CardData) => void;
  effectValues: EffectValues;
  handleEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  resetAllEffects: () => void;
  applyPreset: (preset: EffectValues, presetId?: string) => void;
  validateEffectState: () => void;
  isApplyingPreset: boolean;
  setSelectedPresetId: (id: string | undefined) => void;
  setSelectedScene: (scene: any) => void;
  setSelectedLighting: (lighting: any) => void;
  setShowExportDialog: (show: boolean) => void;
  children: React.ReactNode;
}

export const ViewerActionsManager: React.FC<ViewerActionsManagerProps> = ({
  card,
  onShare,
  effectValues,
  handleEffectChange,
  resetAllEffects,
  applyPreset,
  validateEffectState,
  isApplyingPreset,
  setSelectedPresetId,
  setSelectedScene,
  setSelectedLighting,
  setShowExportDialog,
  children
}) => {
  const handleDownloadClick = useCallback(() => {
    setShowExportDialog(true);
  }, [setShowExportDialog]);

  const handleShareClick = useCallback(() => {
    if (onShare) {
      onShare(card);
    }
  }, [onShare, card]);

  // Enhanced combo application with validation
  const handleComboApplication = useCallback((combo: any) => {
    console.log('🚀 Applying combo with enhanced synchronization:', combo.id);
    
    validateEffectState();
    applyPreset(combo.effects, combo.id);
    setSelectedPresetId(combo.id);
    
    if (combo.scene) {
      setSelectedScene(combo.scene);
    }
    if (combo.lighting) {
      setSelectedLighting(combo.lighting);
    }
  }, [applyPreset, validateEffectState, setSelectedPresetId, setSelectedScene, setSelectedLighting]);

  // Enhanced manual effect change with state tracking
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    if (!isApplyingPreset) {
      setSelectedPresetId(undefined);
    }
    handleEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset, setSelectedPresetId]);

  // Pass handlers through context or props to children
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onDownloadClick: handleDownloadClick,
            onShareClick: handleShareClick,
            onComboApplication: handleComboApplication,
            onManualEffectChange: handleManualEffectChange,
            onResetAllEffects: resetAllEffects
          } as any);
        }
        return child;
      })}
    </>
  );
};

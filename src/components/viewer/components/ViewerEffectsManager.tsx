
import React, { useCallback, useEffect } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { useEnhancedCardEffects } from '../hooks/useEnhancedCardEffects';
import { useCardEffects } from '../hooks/useCardEffects';
import type { ViewerState } from '../types/ImmersiveViewerTypes';

interface ViewerEffectsManagerProps {
  card: CardData;
  viewerState: ViewerState;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onApplyPreset: (preset: EffectValues, presetId?: string) => void;
  onValidateEffectState: () => void;
  children: (props: {
    effectValues: EffectValues;
    handleEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
    resetAllEffects: () => void;
    applyPreset: (preset: EffectValues, presetId?: string) => void;
    validateEffectState: () => void;
    isApplyingPreset: boolean;
    frameStyles: React.CSSProperties;
    enhancedEffectStyles: React.CSSProperties;
    surfaceTextureStyles: React.CSSProperties;
  }) => React.ReactNode;
}

export const ViewerEffectsManager: React.FC<ViewerEffectsManagerProps> = ({
  card,
  viewerState,
  onEffectChange,
  onResetAllEffects,
  onApplyPreset,
  onValidateEffectState,
  children
}) => {
  // Enhanced effects hook
  const enhancedEffectsHook = useEnhancedCardEffects();
  const {
    effectValues,
    handleEffectChange,
    resetAllEffects,
    applyPreset,
    isApplyingPreset,
    validateEffectState
  } = enhancedEffectsHook;

  // Style generation hook
  const { getFrameStyles, getEnhancedEffectStyles, surfaceTextureStyles } = useCardEffects(card);

  // Enhanced state validation on card change
  useEffect(() => {
    if (card) {
      validateEffectState();
      onValidateEffectState();
    }
  }, [card, validateEffectState, onValidateEffectState]);

  // Enhanced manual effect change to clear preset selection
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    if (!isApplyingPreset) {
      // Clear preset selection when manual changes are made
    }
    handleEffectChange(effectId, parameterId, value);
    onEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset, onEffectChange]);

  // Enhanced reset that includes all state
  const handleResetWithEffects = useCallback(() => {
    resetAllEffects();
    validateEffectState();
    onResetAllEffects();
  }, [resetAllEffects, validateEffectState, onResetAllEffects]);

  // Enhanced combo application
  const handleApplyCombo = useCallback((combo: any) => {
    console.log('🚀 ViewerEffectsManager: Applying style combo:', combo.id, 'Effects:', combo.effects);
    validateEffectState();
    applyPreset(combo.effects, combo.id);
    onApplyPreset(combo.effects, combo.id);
  }, [applyPreset, validateEffectState, onApplyPreset]);

  // Enhanced preset application (for direct EffectValues)
  const handleApplyPreset = useCallback((preset: EffectValues, presetId?: string) => {
    console.log('🎨 ViewerEffectsManager: Applying preset:', { preset, presetId });
    validateEffectState();
    applyPreset(preset, presetId);
    onApplyPreset(preset, presetId);
  }, [applyPreset, validateEffectState, onApplyPreset]);

  return (
    <>
      {children({
        effectValues,
        handleEffectChange: handleManualEffectChange,
        resetAllEffects: handleResetWithEffects,
        applyPreset: handleApplyPreset,
        validateEffectState,
        isApplyingPreset,
        frameStyles: getFrameStyles(),
        enhancedEffectStyles: getEnhancedEffectStyles(),
        surfaceTextureStyles
      })}
    </>
  );
};

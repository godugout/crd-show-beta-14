
import { useCallback } from 'react';
import { ENHANCED_VISUAL_EFFECTS } from './effects/effectConfigs';
import { usePresetApplication } from './effects/usePresetApplication';
import { useEffectStateManager } from './effects/useEffectStateManager';
import { useEffectValidation } from './effects/useEffectValidation';
import type { EffectValues, VisualEffectConfig, EffectParameter } from './effects/types';

// Re-export types for backward compatibility
export type { EffectValues, VisualEffectConfig, EffectParameter };
export { ENHANCED_VISUAL_EFFECTS };

export const useEnhancedCardEffects = () => {
  // Use specialized hooks for different concerns
  const {
    effectValues,
    setEffectValues,
    handleEffectChange: handleEffectChangeBase,
    resetEffect,
    resetAllEffects: resetAllEffectsBase
  } = useEffectStateManager();

  const { validateEffectState } = useEffectValidation(effectValues);

  const { 
    presetState, 
    applyPreset: applyPresetBase, 
    setPresetState, 
    isApplyingPreset,
    clearTimeouts 
  } = usePresetApplication();

  // Enhanced handleEffectChange that also manages preset state
  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    // Clear preset state when manual changes are made (unless locked)
    if (!presetState.isApplying && !presetState.isLocked) {
      setPresetState(prev => ({ 
        ...prev, 
        currentPresetId: undefined,
        sequenceId: `manual-${Date.now()}`
      }));
    }
    
    // Call the base implementation
    handleEffectChangeBase(effectId, parameterId, value);
    
  }, [presetState.isApplying, presetState.isLocked, setPresetState, handleEffectChangeBase]);

  // Enhanced resetAllEffects that also clears timeouts and preset state
  const resetAllEffects = useCallback(() => {
    console.log('🔄 Resetting all effects with cleanup');
    
    // Clear all timeouts
    clearTimeouts();
    
    // Reset preset state
    setPresetState({ 
      isApplying: false, 
      appliedAt: Date.now(), 
      isLocked: false,
      sequenceId: `reset-${Date.now()}`
    });
    
    // Call the base implementation
    resetAllEffectsBase();
    
  }, [clearTimeouts, setPresetState, resetAllEffectsBase]);

  // Wrapper for the applyPreset function with effectValues
  const applyPreset = useCallback((preset: EffectValues, presetId?: string) => {
    applyPresetBase(preset, setEffectValues, presetId);
  }, [applyPresetBase, setEffectValues]);

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,
    presetState,
    isApplyingPreset,
    validateEffectState
  };
};

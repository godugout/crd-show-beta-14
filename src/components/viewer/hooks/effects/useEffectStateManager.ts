
import { useState, useCallback } from 'react';
import { createDefaultEffectValues, clampEffectValue } from './effectUtils';
import type { EffectValues } from './types';

export const useEffectStateManager = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>(() => {
    const defaults = createDefaultEffectValues();
    // --- FIX: Initialize with a minimal effect to ensure the card back is visible on load.
    // By setting one effect's intensity > 5, we trigger useMaterialSelector to pick a
    // non-default material, making the back visible without user interaction.
    // 'brushedmetal' is chosen as it provides a neutral, metallic default back.
    if (defaults.brushedmetal) {
      defaults.brushedmetal.intensity = 6;
    }
    return defaults;
  });

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string, isPreset?: boolean) => {
    console.log('🎛️ Effect Change:', { effectId, parameterId, value, isPreset });
    
    // Apply clamping for smooth transitions
    const clampedValue = clampEffectValue(effectId, parameterId, value);
    
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: clampedValue
      }
    }));
  }, []);

  const resetEffect = useCallback((effectId: string) => {
    console.log('🔄 Resetting effect:', effectId);
    const defaultValues = createDefaultEffectValues();
    
    if (defaultValues[effectId]) {
      setEffectValues(prev => ({
        ...prev,
        [effectId]: { ...defaultValues[effectId] }
      }));
    }
  }, []);

  const resetAllEffects = useCallback(() => {
    console.log('🔄 Resetting all effects and ensuring back is visible');
    // --- FIX: When resetting, re-apply the logic to ensure the back remains visible.
    const defaults = createDefaultEffectValues();
    if (defaults.brushedmetal) {
      defaults.brushedmetal.intensity = 6;
    }
    setEffectValues(defaults);
  }, []);

  return {
    effectValues,
    setEffectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects
  };
};

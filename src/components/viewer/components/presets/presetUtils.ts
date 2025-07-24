
import { User } from 'lucide-react';
import type { ComboPreset } from './types';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import { COMBO_PRESETS } from './comboPresets';

/**
 * Enhanced effect matching with progressive tolerance
 */
export const effectsMatchPreset = (presetEffects: EffectValues, currentEffects: EffectValues): boolean => {
  console.log('🔍 Checking preset match:', { presetEffects, currentEffects });
  
  const presetKeys = Object.keys(presetEffects);
  const currentActiveKeys = Object.keys(currentEffects).filter(key => {
    const effect = currentEffects[key];
    return effect && typeof effect.intensity === 'number' && effect.intensity > 5; // Increased threshold
  });

  // Allow for flexible matching - don't require exact effect count
  const hasMainPresetEffects = presetKeys.every(key => {
    const preset = presetEffects[key];
    const current = currentEffects[key];
    if (!current || !preset) return false;
    
    const presetIntensity = typeof preset.intensity === 'number' ? preset.intensity : 0;
    const currentIntensity = typeof current.intensity === 'number' ? current.intensity : 0;
    
    // More tolerant intensity matching with progressive tolerance
    const tolerance = Math.max(10, presetIntensity * 0.2); // 20% tolerance or minimum 10
    const intensityMatch = Math.abs(currentIntensity - presetIntensity) <= tolerance;
    
    if (!intensityMatch) {
      console.log(`❌ Intensity mismatch for ${key}:`, { preset: presetIntensity, current: currentIntensity, tolerance });
      return false;
    }
    
    // Check other parameters with increased tolerance
    const paramsMatch = Object.keys(preset).every(paramKey => {
      if (paramKey === 'intensity') return true;
      const presetVal = preset[paramKey];
      const currentVal = current[paramKey];
      
      if (typeof presetVal === 'number' && typeof currentVal === 'number') {
        const paramTolerance = Math.max(8, presetVal * 0.25); // 25% tolerance
        return Math.abs(currentVal - presetVal) <= paramTolerance;
      }
      return presetVal === currentVal;
    });
    
    console.log(`${paramsMatch ? '✅' : '❌'} Parameters match for ${key}:`, paramsMatch);
    return paramsMatch;
  });

  console.log('📊 Final match result:', hasMainPresetEffects);
  return hasMainPresetEffects;
};

/**
 * Detect custom effects with improved logic
 */
export const hasCustomEffects = (currentEffects: EffectValues): boolean => {
  const hasActiveEffects = Object.values(currentEffects).some(effect => 
    effect && typeof effect.intensity === 'number' && effect.intensity > 5
  );
  
  if (!hasActiveEffects) return false;
  
  // Check if current effects match any existing preset
  const matchesExistingPreset = COMBO_PRESETS.some(preset => effectsMatchPreset(preset.effects, currentEffects));
  
  console.log('🎨 Custom effects check:', { hasActiveEffects, matchesExistingPreset });
  return !matchesExistingPreset;
};

/**
 * Enhanced custom preset creation
 */
export const createCustomPreset = (currentEffects: EffectValues): ComboPreset => {
  const activeEffects = Object.keys(currentEffects).filter(key => {
    const effect = currentEffects[key];
    return effect && typeof effect.intensity === 'number' && effect.intensity > 5;
  });
  
  const description = `Custom blend: ${activeEffects.join(', ')}`;
  
  return {
    id: 'user-custom',
    name: "Your Style",
    icon: User,
    description,
    materialHint: 'Custom user-defined material combination',
    effects: currentEffects,
    isCustom: true
  };
};

/**
 * Determine selection with improved logic
 */
export const getPresetSelection = (
  preset: ComboPreset, 
  selectedPresetId?: string, 
  isApplyingPreset?: boolean, 
  currentEffects?: EffectValues
) => {
  // Priority 1: Explicit selection during application
  if (isApplyingPreset && selectedPresetId === preset.id) {
    return { isSelected: true, reason: 'applying' as const };
  }
  
  // Priority 2: Stable selection from state
  if (selectedPresetId === preset.id) {
    return { isSelected: true, reason: 'selected' as const };
  }
  
  // Priority 3: Auto-detection (only if no explicit selection)
  if (!selectedPresetId && currentEffects && effectsMatchPreset(preset.effects, currentEffects)) {
    return { isSelected: true, reason: 'auto-detected' as const };
  }
  
  return { isSelected: false, reason: 'none' as const };
};

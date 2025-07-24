
import { useMemo } from 'react';
import type { EffectValues } from '../useEnhancedCardEffects';
import { CARD_BACK_MATERIALS, type CardBackMaterial } from './materialConstants';
import { 
  EFFECT_TO_MATERIAL_MAPPING, 
  calculateEffectIntensities, 
  findDominantEffect,
  handleSpecialEffectCases 
} from './materialMapping';

export const useMaterialSelector = (effectValues: EffectValues = {}): CardBackMaterial => {
  return useMemo(() => {
    console.log('🎨 Material Selection: Effect values received:', effectValues);
    
    if (!effectValues || Object.keys(effectValues).length === 0) {
      console.log('🎨 Material Selection: No effect values, using default');
      return CARD_BACK_MATERIALS.default;
    }
    
    // Calculate effect intensities with enhanced debugging
    const effectIntensities = calculateEffectIntensities(effectValues);
    
    console.log('🎨 Material Selection: Active effects (>5 intensity):', effectIntensities);
    
    // If no effects are active, return default
    if (effectIntensities.length === 0) {
      console.log('🎨 Material Selection: No active effects, using default');
      return CARD_BACK_MATERIALS.default;
    }
    
    // Find the effect with highest intensity
    const dominantEffect = findDominantEffect(effectIntensities);
    if (!dominantEffect) {
      return CARD_BACK_MATERIALS.default;
    }
    
    console.log('🎨 Material Selection: Dominant effect:', dominantEffect);
    
    // Handle special cases
    const specialCase = handleSpecialEffectCases(dominantEffect, effectValues);
    if (specialCase) {
      const selectedMat = CARD_BACK_MATERIALS[specialCase];
      console.log('🎨 Material Selection: Selected special case material:', selectedMat.name);
      return selectedMat;
    }
    
    // Use standard mapping
    const materialId = EFFECT_TO_MATERIAL_MAPPING[dominantEffect.effectId] || 'default';
    const selectedMat = CARD_BACK_MATERIALS[materialId];
    
    console.log('🎨 Material Selection: Selected material:', materialId, selectedMat.name);
    
    return selectedMat;
  }, [effectValues]);
};

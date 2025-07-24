
import { useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import { CARD_BACK_MATERIALS, type CardBackMaterial } from './materials/materialConstants';
import { getMaterialForEffect } from './materials/materialMapping';
import { useMaterialSelector } from './materials/useMaterialSelector';

// Re-export types and constants for backward compatibility
export type { CardBackMaterial };
export { CARD_BACK_MATERIALS };

export const useDynamicCardBackMaterials = (effectValues: EffectValues = {}) => {
  // Use the material selector hook with proper default
  const selectedMaterial = useMaterialSelector(effectValues);
  
  // Keep the getMaterialForEffect function for external use
  const getMaterialForEffectCallback = useCallback((effectId: string): CardBackMaterial => {
    return getMaterialForEffect(effectId);
  }, []);
  
  return {
    selectedMaterial,
    availableMaterials: CARD_BACK_MATERIALS,
    getMaterialForEffect: getMaterialForEffectCallback
  };
};

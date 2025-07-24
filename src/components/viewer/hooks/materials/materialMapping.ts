
import type { EffectValues } from '../useEnhancedCardEffects';
import { CARD_BACK_MATERIALS, type CardBackMaterial } from './materialConstants';

export const EFFECT_TO_MATERIAL_MAPPING: Record<string, string> = {
  holographic: 'holographic',
  crystal: 'crystal',
  chrome: 'chrome',
  brushedmetal: 'chrome',
  gold: 'gold',
  vintage: 'vintage',
  prizm: 'prizm',
  interference: 'lunar',
  foilspray: 'starlight'
};

export const getMaterialForEffect = (effectId: string): CardBackMaterial => {
  const materialId = EFFECT_TO_MATERIAL_MAPPING[effectId] || 'default';
  return CARD_BACK_MATERIALS[materialId];
};

export const calculateEffectIntensities = (effectValues: EffectValues = {}) => {
  if (!effectValues || Object.keys(effectValues).length === 0) {
    return [];
  }
  
  return Object.entries(effectValues).map(([effectId, params]) => {
    const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
    return { effectId, intensity };
  }).filter(({ intensity }) => intensity > 5);
};

export const findDominantEffect = (effectIntensities: Array<{ effectId: string; intensity: number }>) => {
  if (effectIntensities.length === 0) {
    return null;
  }
  
  return effectIntensities.reduce((max, current) => 
    current.intensity > max.intensity ? current : max
  );
};

export const handleSpecialEffectCases = (dominantEffect: { effectId: string; intensity: number }, effectValues: EffectValues = {}): string | null => {
  // Check for solar tone in gold effect
  if (dominantEffect.effectId === 'gold') {
    const goldTone = effectValues.gold?.goldTone;
    if (goldTone === 'solar') {
      return 'solar';
    }
  }
  
  return null;
};

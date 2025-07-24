
import type { EffectValues } from '@/components/viewer/hooks/useEnhancedCardEffects';

export const getHolographicEffectParam = (
  effectValues: EffectValues,
  effectId: string,
  paramId: string,
  defaultValue: number | boolean | string = 0
) => {
  return effectValues?.[effectId]?.[paramId] ?? defaultValue;
};

export const calculateHolographicBlur = (intensity: number): number => {
  return Math.max(0, (intensity / 100) * 1.2);
};

export const calculateHolographicOpacity = (intensity: number, multiplier: number = 1): number => {
  return (intensity / 100) * multiplier;
};

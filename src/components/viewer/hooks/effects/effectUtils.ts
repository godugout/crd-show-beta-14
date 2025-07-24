
import { ENHANCED_VISUAL_EFFECTS } from './effectConfigs';
import type { EffectValues } from './types';

// Create default effect values
export const createDefaultEffectValues = (): EffectValues => {
  const initialValues: EffectValues = {};
  ENHANCED_VISUAL_EFFECTS.forEach(effect => {
    initialValues[effect.id] = {};
    effect.parameters.forEach(param => {
      initialValues[effect.id][param.id] = param.defaultValue;
    });
  });
  return initialValues;
};

// Enhanced effect intensity clamping for smooth transitions
export const clampEffectValue = (effectId: string, parameterId: string, value: number | boolean | string): number | boolean | string => {
  if (typeof value !== 'number') return value;
  
  // Apply smooth clamping for problematic effects
  const clampingRules: Record<string, Record<string, { soft: number; hard: number }>> = {
    prizm: {
      intensity: { soft: 75, hard: 85 }, // Soft limit at 75%, hard at 85%
      complexity: { soft: 8, hard: 10 },
      colorSeparation: { soft: 80, hard: 90 }
    },
    crystal: {
      intensity: { soft: 80, hard: 90 },
      dispersion: { soft: 85, hard: 95 }
    },
    holographic: {
      intensity: { soft: 85, hard: 95 },
      shiftSpeed: { soft: 180, hard: 200 }
    }
  };
  
  const rule = clampingRules[effectId]?.[parameterId];
  if (rule && value > rule.soft) {
    // Apply smooth damping above soft limit
    const overage = value - rule.soft;
    const damping = 1 - (overage / (rule.hard - rule.soft)) * 0.5;
    const clampedValue = rule.soft + (overage * Math.max(0.1, damping));
    
    console.log(`🎛️ Clamping ${effectId}.${parameterId}:`, { original: value, clamped: clampedValue });
    return Math.min(clampedValue, rule.hard);
  }
  
  return value;
};

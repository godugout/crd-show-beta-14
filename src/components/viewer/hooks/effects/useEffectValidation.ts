
import { useCallback } from 'react';
import type { EffectValues } from './types';
import { ENHANCED_VISUAL_EFFECTS } from './effectConfigs';

export const useEffectValidation = (effectValues: EffectValues) => {
  // Enhanced state validation
  const validateEffectState = useCallback(() => {
    console.log('🔍 Validating effect state consistency');
    
    // Check that all effects have their required parameters
    const validationIssues = ENHANCED_VISUAL_EFFECTS.flatMap(effect => {
      const currentEffect = effectValues[effect.id];
      if (!currentEffect) return [];
      
      return effect.parameters.flatMap(param => {
        if (currentEffect[param.id] === undefined) {
          return [`Missing parameter ${param.id} in effect ${effect.id}`];
        }
        return [];
      });
    });
    
    if (validationIssues.length > 0) {
      console.warn('⚠️ Effect validation issues:', validationIssues);
    }
    
    return validationIssues.length === 0;
  }, [effectValues]);

  return {
    validateEffectState
  };
};

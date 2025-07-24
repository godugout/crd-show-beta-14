
import React, { useEffect, useRef } from 'react';
import type { EffectValues } from '../hooks/effects/types';

interface EffectTransitionManagerProps {
  effectValues: EffectValues;
  isApplyingPreset: boolean;
  onTransitionComplete?: () => void;
  children: React.ReactNode;
}

export const EffectTransitionManager: React.FC<EffectTransitionManagerProps> = ({
  effectValues,
  isApplyingPreset,
  onTransitionComplete,
  children
}) => {
  const previousEffectsRef = useRef<EffectValues>(effectValues);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  // Detect significant effect changes and manage transitions
  useEffect(() => {
    const hasSignificantChange = Object.keys(effectValues).some(effectId => {
      const current = effectValues[effectId];
      const previous = previousEffectsRef.current[effectId];
      
      if (!current || !previous) return true;
      
      const currentIntensity = typeof current.intensity === 'number' ? current.intensity : 0;
      const previousIntensity = typeof previous.intensity === 'number' ? previous.intensity : 0;
      
      return Math.abs(currentIntensity - previousIntensity) > 10;
    });

    if (hasSignificantChange && !isApplyingPreset) {
      console.log('🔄 Significant effect change detected, managing transition');
      
      // Clear any existing transition
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      // Complete transition after a brief delay
      transitionTimeoutRef.current = setTimeout(() => {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 300);
    }

    previousEffectsRef.current = effectValues;
  }, [effectValues, isApplyingPreset, onTransitionComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`transition-all duration-300 ${isApplyingPreset ? 'opacity-90' : 'opacity-100'}`}>
      {children}
    </div>
  );
};

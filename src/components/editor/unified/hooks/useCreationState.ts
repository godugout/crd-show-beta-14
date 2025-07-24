
import { useState, useCallback } from 'react';
import type { CreationMode, CreationStep, CreationState } from '../types';

export const useCreationState = (initialMode: CreationMode = 'quick') => {
  const [state, setState] = useState<CreationState>({
    mode: initialMode,
    currentStep: 'intent',
    intent: { mode: initialMode },
    canAdvance: false,
    canGoBack: false,
    progress: 0,
    errors: {}
  });

  const updateState = useCallback((updates: Partial<CreationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return { state, updateState };
};

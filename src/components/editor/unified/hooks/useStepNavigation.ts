
import { useCallback } from 'react';
import type { CreationMode, CreationStep, CreationState } from '../types';
import { useModeConfig } from './useModeConfig';

interface UseStepNavigationProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export const useStepNavigation = ({ state, updateState }: UseStepNavigationProps) => {
  const { getConfigById } = useModeConfig();

  const setMode = useCallback((mode: CreationMode) => {
    const config = getConfigById(mode);
    if (config) {
      updateState({
        mode,
        currentStep: config.steps[0],
        intent: { ...state.intent, mode },
        progress: 0,
        canGoBack: false,
        canAdvance: true
      });
    }
  }, [getConfigById, state.intent, updateState]);

  const nextStep = useCallback(() => {
    const currentConfig = getConfigById(state.mode);
    if (!currentConfig) return;
    
    const currentIndex = currentConfig.steps.indexOf(state.currentStep);
    const nextIndex = Math.min(currentIndex + 1, currentConfig.steps.length - 1);
    const nextStep = currentConfig.steps[nextIndex];
    
    updateState({
      currentStep: nextStep,
      progress: (nextIndex / (currentConfig.steps.length - 1)) * 100,
      canGoBack: nextIndex > 0,
      canAdvance: nextIndex < currentConfig.steps.length - 1
    });
  }, [state.mode, state.currentStep, getConfigById, updateState]);

  const previousStep = useCallback(() => {
    const currentConfig = getConfigById(state.mode);
    if (!currentConfig) return;
    
    const currentIndex = currentConfig.steps.indexOf(state.currentStep);
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prevStep = currentConfig.steps[prevIndex];
    
    updateState({
      currentStep: prevStep,
      progress: (prevIndex / (currentConfig.steps.length - 1)) * 100,
      canGoBack: prevIndex > 0,
      canAdvance: true
    });
  }, [state.mode, state.currentStep, getConfigById, updateState]);

  return { setMode, nextStep, previousStep };
};

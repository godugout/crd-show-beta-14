
import { useCallback, useMemo } from 'react';
import { useWizardContext } from '../WizardContext';

export const useWizardNavigation = () => {
  const { state, dispatch } = useWizardContext();

  const currentStep = useMemo(() => {
    return state.steps.find(step => step.id === state.currentStepId);
  }, [state.steps, state.currentStepId]);

  const currentStepIndex = useMemo(() => {
    return state.steps.findIndex(step => step.id === state.currentStepId);
  }, [state.steps, state.currentStepId]);

  const validateCurrentStep = useCallback(() => {
    if (!currentStep) return false;

    let isValid = false;

    switch (currentStep.id) {
      case 'template':
        isValid = !!state.cardData.template_id;
        break;
      case 'upload':
        isValid = !!state.cardData.image_url;
        break;
      case 'details':
        isValid = !!(state.cardData.title && state.cardData.title.trim());
        break;
      case 'effects':
        isValid = true; // Effects are optional
        break;
      case 'publish':
        isValid = !!(state.cardData.title && state.cardData.image_url && state.cardData.template_id);
        break;
      default:
        isValid = false;
    }

    // Update step validity if it has changed
    if (currentStep.valid !== isValid) {
      dispatch({ 
        type: 'SET_STEP_VALIDITY', 
        payload: { stepId: currentStep.id, valid: isValid } 
      });
    }

    return isValid;
  }, [currentStep, state.cardData, dispatch]);

  const canNavigateToStep = useCallback((stepId: string) => {
    const targetStep = state.steps.find(step => step.id === stepId);
    const targetIndex = state.steps.findIndex(step => step.id === stepId);
    
    if (!targetStep) return false;
    
    // Can always navigate backward to completed steps
    if (targetIndex < currentStepIndex && targetStep.completed) {
      return true;
    }
    
    // Can navigate forward only to the next step if current step is valid
    if (targetIndex === currentStepIndex + 1) {
      return validateCurrentStep();
    }
    
    // Can navigate to current step
    return targetIndex === currentStepIndex;
  }, [state.steps, currentStepIndex, validateCurrentStep]);

  const navigateToStep = useCallback((stepId: string) => {
    console.log('Navigating to step:', stepId);
    if (canNavigateToStep(stepId)) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: stepId });
      return true;
    }
    return false;
  }, [canNavigateToStep, dispatch]);

  const nextStep = useCallback(() => {
    const nextStepIndex = currentStepIndex + 1;
    
    if (nextStepIndex < state.steps.length) {
      const nextStep = state.steps[nextStepIndex];
      return navigateToStep(nextStep.id);
    }
    return false;
  }, [currentStepIndex, state.steps, navigateToStep]);

  const previousStep = useCallback(() => {
    const prevStepIndex = currentStepIndex - 1;
    
    if (prevStepIndex >= 0) {
      const prevStep = state.steps[prevStepIndex];
      return navigateToStep(prevStep.id);
    }
    return false;
  }, [currentStepIndex, state.steps, navigateToStep]);

  const completeCurrentStep = useCallback(() => {
    if (currentStep && validateCurrentStep()) {
      dispatch({ type: 'MARK_STEP_COMPLETED', payload: currentStep.id });
      return true;
    }
    return false;
  }, [currentStep, validateCurrentStep, dispatch]);

  const canGoNext = useMemo(() => {
    return currentStepIndex < state.steps.length - 1 && validateCurrentStep();
  }, [currentStepIndex, state.steps.length, validateCurrentStep]);

  const canGoBack = useMemo(() => {
    return currentStepIndex > 0;
  }, [currentStepIndex]);

  const isLastStep = useMemo(() => {
    return currentStepIndex === state.steps.length - 1;
  }, [currentStepIndex, state.steps.length]);

  return {
    currentStep,
    currentStepIndex,
    steps: state.steps,
    navigateToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    completeCurrentStep,
    canGoNext,
    canGoBack,
    isLastStep,
    canNavigateToStep
  };
};

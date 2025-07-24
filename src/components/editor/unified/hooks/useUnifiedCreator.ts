
import { useNavigate } from 'react-router-dom';
import type { CardData } from '@/hooks/useCardEditor';
import type { CreationMode } from '../types';
import { useCreationState } from './useCreationState';
import { useModeConfig } from './useModeConfig';
import { useStepNavigation } from './useStepNavigation';
import { useCreationActions } from './useCreationActions';

interface UseUnifiedCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const useUnifiedCreator = ({
  initialMode = 'quick',
  onComplete,
  onCancel
}: UseUnifiedCreatorProps = {}) => {
  const navigate = useNavigate();
  const { state, updateState } = useCreationState(initialMode);
  const { modeConfigs, getConfigById } = useModeConfig();
  const { setMode, nextStep, previousStep } = useStepNavigation({ state, updateState });
  const {
    cardEditor,
    isCreating,
    creationError,
    validateStep,
    completeCreation,
    cancelCreation,
    startOver
  } = useCreationActions({ state, updateState, onComplete, onCancel });

  const currentConfig = getConfigById(state.mode);

  const goToGallery = () => {
    navigate('/gallery');
  };

  const switchMode = (newMode: CreationMode) => {
    setMode(newMode);
  };

  return {
    state: {
      ...state,
      isCreating,
      creationError
    },
    cardEditor,
    modeConfigs,
    currentConfig,
    actions: {
      setMode,
      nextStep,
      previousStep: previousStep,
      switchMode,
      validateStep,
      completeCreation,
      cancelCreation,
      updateState,
      goToGallery,
      startOver
    }
  };
};

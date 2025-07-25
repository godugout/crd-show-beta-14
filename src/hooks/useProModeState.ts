import { useState, useCallback } from 'react';
import type { CardData } from '@/hooks/useCardEditor';

export interface ProModeState {
  isProMode: boolean;
  proModeCardData: CardData | null;
  isProModeActive: boolean;
}

export const useProModeState = (initialCardData?: CardData) => {
  const [proModeState, setProModeState] = useState<ProModeState>({
    isProMode: false,
    proModeCardData: initialCardData || null,
    isProModeActive: false
  });

  const toggleProMode = useCallback((enabled: boolean) => {
    setProModeState(prev => ({
      ...prev,
      isProMode: enabled,
      isProModeActive: enabled
    }));
  }, []);

  const setProModeCardData = useCallback((cardData: CardData) => {
    setProModeState(prev => ({
      ...prev,
      proModeCardData: cardData
    }));
  }, []);

  const exitProMode = useCallback(() => {
    setProModeState(prev => ({
      ...prev,
      isProMode: false,
      isProModeActive: false
    }));
  }, []);

  const enterProMode = useCallback((cardData: CardData) => {
    setProModeState({
      isProMode: true,
      proModeCardData: cardData,
      isProModeActive: true
    });
  }, []);

  const resetProMode = useCallback(() => {
    setProModeState({
      isProMode: false,
      proModeCardData: null,
      isProModeActive: false
    });
  }, []);

  return {
    proModeState,
    toggleProMode,
    setProModeCardData,
    exitProMode,
    enterProMode,
    resetProMode
  };
};
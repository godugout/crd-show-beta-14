
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TextEffectStyle, TextAnimation } from '@/components/hero/TextEffects3D';
import type { EffectValues } from '@/components/viewer/hooks/useEnhancedCardEffects';

interface GlobalSecretEffectsState {
  // Menu state - always accessible now
  isEnabled: boolean;
  
  // Text effects
  textStyle: TextEffectStyle;
  animation: TextAnimation;
  intensity: number;
  speed: number;
  glowEnabled: boolean;
  
  // Visual effects
  visualEffects: EffectValues;
  
  // Interactive mode
  interactiveMode: boolean;
  hoveredElement: string | null;
}

interface GlobalSecretEffectsContextType extends GlobalSecretEffectsState {
  // Controls
  toggleEnabled: (enabled: boolean) => void;
  
  // Text effect controls
  setTextStyle: (style: TextEffectStyle) => void;
  setAnimation: (animation: TextAnimation) => void;
  setIntensity: (intensity: number) => void;
  setSpeed: (speed: number) => void;
  setGlowEnabled: (enabled: boolean) => void;
  resetTextEffects: () => void;
  
  // Visual effect controls
  updateVisualEffect: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  resetVisualEffects: () => void;
  
  // Interactive mode
  setInteractiveMode: (enabled: boolean) => void;
  setHoveredElement: (element: string | null) => void;
}

const GlobalSecretEffectsContext = createContext<GlobalSecretEffectsContextType | undefined>(undefined);

export const useGlobalSecretEffects = () => {
  const context = useContext(GlobalSecretEffectsContext);
  if (!context) {
    throw new Error('useGlobalSecretEffects must be used within GlobalSecretEffectsProvider');
  }
  return context;
};

const DEFAULT_TEXT_EFFECTS = {
  textStyle: 'gradient' as TextEffectStyle,
  animation: 'glow' as TextAnimation,
  intensity: 0.8,
  speed: 1.5,
  glowEnabled: true
};

const DEFAULT_VISUAL_EFFECTS: EffectValues = {
  chrome: { enabled: false, intensity: 0.5, speed: 1.0 },
  holographic: { enabled: false, intensity: 0.6, speed: 1.2 },
  foil: { enabled: false, intensity: 0.4, speed: 0.8 },
  rainbow: { enabled: false, intensity: 0.7, speed: 1.0 },
  shimmer: { enabled: false, intensity: 0.5, speed: 1.5 }
};

export const GlobalSecretEffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalSecretEffectsState>({
    isEnabled: false,
    ...DEFAULT_TEXT_EFFECTS,
    visualEffects: DEFAULT_VISUAL_EFFECTS,
    interactiveMode: false,
    hoveredElement: null
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('crd-global-secret-effects');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setState(prev => ({ ...prev, ...settings }));
      } catch (e) {
        console.log('Failed to load secret effects settings');
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newState: Partial<GlobalSecretEffectsState>) => {
    const settingsToSave = {
      isEnabled: newState.isEnabled ?? state.isEnabled,
      textStyle: newState.textStyle ?? state.textStyle,
      animation: newState.animation ?? state.animation,
      intensity: newState.intensity ?? state.intensity,
      speed: newState.speed ?? state.speed,
      glowEnabled: newState.glowEnabled ?? state.glowEnabled,
      visualEffects: newState.visualEffects ?? state.visualEffects,
      interactiveMode: newState.interactiveMode ?? state.interactiveMode
    };
    localStorage.setItem('crd-global-secret-effects', JSON.stringify(settingsToSave));
  };

  const updateState = (updates: Partial<GlobalSecretEffectsState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      saveSettings(updates);
      return newState;
    });
  };

  const contextValue: GlobalSecretEffectsContextType = {
    ...state,
    
    // Controls
    toggleEnabled: (enabled: boolean) => updateState({ isEnabled: enabled }),
    
    // Text effect controls
    setTextStyle: (textStyle: TextEffectStyle) => updateState({ textStyle }),
    setAnimation: (animation: TextAnimation) => updateState({ animation }),
    setIntensity: (intensity: number) => updateState({ intensity }),
    setSpeed: (speed: number) => updateState({ speed }),
    setGlowEnabled: (glowEnabled: boolean) => updateState({ glowEnabled }),
    resetTextEffects: () => updateState(DEFAULT_TEXT_EFFECTS),
    
    // Visual effect controls
    updateVisualEffect: (effectId: string, parameterId: string, value: number | boolean | string) => {
      const newVisualEffects = {
        ...state.visualEffects,
        [effectId]: {
          ...state.visualEffects[effectId as keyof EffectValues],
          [parameterId]: value
        }
      };
      updateState({ visualEffects: newVisualEffects });
    },
    resetVisualEffects: () => updateState({ visualEffects: DEFAULT_VISUAL_EFFECTS }),
    
    // Interactive mode
    setInteractiveMode: (interactiveMode: boolean) => updateState({ interactiveMode }),
    setHoveredElement: (hoveredElement: string | null) => updateState({ hoveredElement })
  };

  return (
    <GlobalSecretEffectsContext.Provider value={contextValue}>
      {children}
    </GlobalSecretEffectsContext.Provider>
  );
};

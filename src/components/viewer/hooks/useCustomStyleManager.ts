
import { useState, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export interface CustomStyleControls {
  shimmer: number;        // Overall metallic/holographic intensity
  depth: number;          // Surface depth and dimension
  color: number;          // Color vibrancy and shift
  texture: number;        // Surface texture complexity
  glow: number;           // Edge glow and highlights
  movement: number;       // Animation and flow speed
}

export interface SavedCustomStyle {
  id: string;
  name: string;
  controls: CustomStyleControls;
  createdAt: number;
}

const DEFAULT_CONTROLS: CustomStyleControls = {
  shimmer: 50,
  depth: 50,
  color: 50,
  texture: 50,
  glow: 50,
  movement: 50
};

// Smart mapping from simplified controls to complex effect parameters
const mapControlsToEffects = (controls: CustomStyleControls): EffectValues => {
  const { shimmer, depth, color, texture, glow, movement } = controls;
  
  return {
    holographic: {
      intensity: Math.round(shimmer * 0.8),
      shiftSpeed: 50 + (movement * 1.5),
      rainbowSpread: 120 + (color * 2),
      animated: movement > 20
    },
    foilspray: {
      intensity: Math.round(texture * 0.6),
      density: 30 + (texture * 0.4),
      direction: 45
    },
    prizm: {
      intensity: Math.round(color * 0.5),
      complexity: Math.max(1, Math.round(depth * 0.08)),
      colorSeparation: 40 + (color * 0.4)
    },
    chrome: {
      intensity: Math.round(shimmer * 0.4),
      sharpness: 60 + (depth * 0.3),
      highlightSize: 30 + (glow * 0.4)
    },
    interference: {
      intensity: Math.round(depth * 0.3),
      frequency: Math.max(1, Math.round(6 + texture * 0.1)),
      thickness: 2 + (depth * 0.05)
    },
    brushedmetal: {
      intensity: Math.round(texture * 0.4),
      direction: 45,
      grainDensity: Math.max(1, Math.round(4 + texture * 0.08))
    },
    crystal: {
      intensity: Math.round((shimmer + depth) * 0.25),
      facets: Math.max(3, Math.round(6 + depth * 0.1)),
      dispersion: 40 + (color * 0.4),
      clarity: 40 + (depth * 0.4),
      sparkle: glow > 30
    },
    vintage: { intensity: 0 },
    gold: { intensity: 0, shimmerSpeed: 80, platingThickness: 5, goldTone: 'rich', reflectivity: 85, colorEnhancement: true },
    aurora: { intensity: 0, waveSpeed: 80, colorShift: 120 },
    waves: { intensity: 0, frequency: 10, amplitude: 30, direction: 45, complexity: 3, wobble: 50 },
    ice: { intensity: 0 },
    lunar: { intensity: 0 }
  };
};

export const useCustomStyleManager = () => {
  const [customControls, setCustomControls] = useState<CustomStyleControls>(DEFAULT_CONTROLS);
  const [savedStyles, setSavedStyles] = useState<SavedCustomStyle[]>(() => {
    try {
      const saved = localStorage.getItem('cardshow-custom-styles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const updateControl = useCallback((key: keyof CustomStyleControls, value: number) => {
    setCustomControls(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetControls = useCallback(() => {
    setCustomControls(DEFAULT_CONTROLS);
  }, []);

  const saveCustomStyle = useCallback((name: string) => {
    const newStyle: SavedCustomStyle = {
      id: `custom-${Date.now()}`,
      name,
      controls: { ...customControls },
      createdAt: Date.now()
    };
    
    const updated = [...savedStyles, newStyle];
    setSavedStyles(updated);
    localStorage.setItem('cardshow-custom-styles', JSON.stringify(updated));
    
    return newStyle.id;
  }, [customControls, savedStyles]);

  const loadCustomStyle = useCallback((styleId: string) => {
    const style = savedStyles.find(s => s.id === styleId);
    if (style) {
      setCustomControls(style.controls);
    }
  }, [savedStyles]);

  const deleteCustomStyle = useCallback((styleId: string) => {
    const updated = savedStyles.filter(s => s.id !== styleId);
    setSavedStyles(updated);
    localStorage.setItem('cardshow-custom-styles', JSON.stringify(updated));
  }, [savedStyles]);

  const getEffectValues = useCallback(() => {
    return mapControlsToEffects(customControls);
  }, [customControls]);

  return {
    customControls,
    savedStyles,
    updateControl,
    resetControls,
    saveCustomStyle,
    loadCustomStyle,
    deleteCustomStyle,
    getEffectValues
  };
};

import { useState, useCallback } from 'react';
import { useEnhancedCardEffects, type EffectValues } from '@/components/viewer/hooks/useEnhancedCardEffects';
import { toast } from 'sonner';

export interface StyleVariation {
  id: 'epic' | 'classic' | 'futuristic';
  name: string;
  effects: EffectValues;
}

export interface CardEffectPreset {
  lighting: {
    intensity: number;
    color: string;
    shadowStrength: number;
  };
  materials: {
    metalness: number;
    roughness: number;
    emissive: number;
  };
  particles: {
    enabled: boolean;
    count: number;
    speed: number;
  };
  postProcessing: {
    bloom: number;
    contrast: number;
    saturation: number;
  };
}

// Define style variation presets
const STYLE_PRESETS: Record<string, EffectValues> = {
  epic: {
    holographic: {
      intensity: 75,
      color: '#ff6b35',
      rotation: 15,
      enabled: true
    },
    energyfield: {
      intensity: 60,
      color: '#ff4444',
      speed: 1.5,
      enabled: true
    },
    metallicshine: {
      intensity: 40,
      reflection: 0.8,
      enabled: true
    }
  },
  classic: {
    brushedmetal: {
      intensity: 50,
      direction: 45,
      enabled: true
    },
    vintage: {
      intensity: 30,
      sepia: 0.4,
      vignette: 0.3,
      enabled: true
    },
    embossed: {
      intensity: 25,
      depth: 0.6,
      enabled: true
    }
  },
  futuristic: {
    neoncore: {
      intensity: 80,
      color: '#9d4edd',
      glow: 0.9,
      enabled: true
    },
    cyberpunk: {
      intensity: 70,
      scanlines: 0.5,
      glitch: 0.3,
      enabled: true
    },
    holographic: {
      intensity: 60,
      color: '#c77dff',
      rotation: -20,
      enabled: true
    }
  }
};

export const useStyleVariations = () => {
  const [activeStyle, setActiveStyle] = useState<'epic' | 'classic' | 'futuristic' | null>(null);
  const [isApplyingStyle, setIsApplyingStyle] = useState(false);
  
  const { applyPreset, resetAllEffects } = useEnhancedCardEffects();

  const applyStyleVariation = useCallback(async (variationId: 'epic' | 'classic' | 'futuristic') => {
    setIsApplyingStyle(true);
    
    try {
      // Get the preset for this variation
      const preset = STYLE_PRESETS[variationId];
      
      if (!preset) {
        throw new Error(`Style preset not found: ${variationId}`);
      }

      // Apply the preset using the enhanced effects hook
      await applyPreset(preset, variationId);
      
      // Update active style
      setActiveStyle(variationId);
      
      // Show success feedback
      const styleNames = {
        epic: 'More Epic',
        classic: 'Classic',
        futuristic: 'Futuristic'
      };
      
      toast.success(`✨ ${styleNames[variationId]} style applied!`);
      
      // Track analytics (if implemented)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'style_variation_selected', {
          style: variationId,
          timestamp: Date.now()
        });
      }
      
    } catch (error) {
      console.error('Failed to apply style variation:', error);
      toast.error('Failed to apply style. Please try again.');
    } finally {
      setIsApplyingStyle(false);
    }
  }, [applyPreset]);

  const clearStyleVariation = useCallback(() => {
    setIsApplyingStyle(true);
    
    try {
      resetAllEffects();
      setActiveStyle(null);
      toast.success('🔄 Effects cleared');
    } catch (error) {
      console.error('Failed to clear style:', error);
      toast.error('Failed to clear effects');
    } finally {
      setIsApplyingStyle(false);
    }
  }, [resetAllEffects]);

  return {
    activeStyle,
    isApplyingStyle,
    applyStyleVariation,
    clearStyleVariation,
    stylePresets: STYLE_PRESETS
  };
};
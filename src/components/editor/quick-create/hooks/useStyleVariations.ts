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
    highlights?: {
      enabled: boolean;
      intensity: number;
      spread: number;
    };
    softness?: number;
    neonGlow?: {
      enabled: boolean;
      color: string;
      intensity: number;
    };
  };
  materials: {
    metalness: number;
    roughness: number;
    emissive: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    paperTexture?: boolean;
    vintage?: {
      enabled: boolean;
      wear: number;
      yellowTint: number;
    };
    holographic?: {
      enabled: boolean;
      shift: number;
      pattern: string;
    };
  };
  particles: {
    enabled: boolean;
    count?: number;
    speed?: number;
    type?: string;
    color?: string[];
  };
  postProcessing: {
    bloom: number;
    contrast: number;
    saturation: number;
    chromaticAberration?: number;
    filmGrain?: number;
    vignette?: number;
    sepia?: number;
    glitch?: {
      enabled: boolean;
      intensity: number;
      frequency: number;
    };
    scanlines?: number;
  };
  borders?: {
    style: string;
    width: number;
    color: string;
    cornerStyle: string;
  };
  animations?: {
    idle: string;
    intensity?: number;
    speed?: number;
    dataStream?: boolean;
    glowCycle?: boolean;
  };
}

// Define detailed style variation presets
const EPIC_PRESET: EffectValues = {
  holographic: {
    intensity: 80,
    color: '#FF6B00',
    rotation: 15,
    enabled: true
  },
  energyfield: {
    intensity: 75,
    color: '#FF0000',
    speed: 0.8,
    enabled: true
  },
  metallicshine: {
    intensity: 80,
    reflection: 0.9,
    enabled: true
  },
  neoncore: {
    intensity: 70,
    color: '#FFD700',
    glow: 0.8,
    enabled: true
  },
  particle: {
    intensity: 50,
    count: 50,
    speed: 0.5,
    enabled: true
  }
};

const CLASSIC_PRESET: EffectValues = {
  vintage: {
    intensity: 40,
    sepia: 0.1,
    vignette: 0.3,
    enabled: true
  },
  embossed: {
    intensity: 30,
    depth: 0.6,
    enabled: true
  },
  brushedmetal: {
    intensity: 20,
    direction: 45,
    enabled: true
  },
  parchment: {
    intensity: 25,
    texture: 0.2,
    enabled: true
  }
};

const FUTURISTIC_PRESET: EffectValues = {
  holographic: {
    intensity: 90,
    color: '#00FFFF',
    rotation: -20,
    enabled: true
  },
  neoncore: {
    intensity: 85,
    color: '#FF00FF',
    glow: 1.0,
    enabled: true
  },
  cyberpunk: {
    intensity: 80,
    scanlines: 0.02,
    glitch: 0.1,
    enabled: true
  },
  energyfield: {
    intensity: 70,
    color: '#FFFF00',
    speed: 0.3,
    enabled: true
  },
  particle: {
    intensity: 30,
    count: 30,
    speed: 0.3,
    enabled: true
  }
};

const STYLE_PRESETS: Record<string, EffectValues> = {
  epic: EPIC_PRESET,
  classic: CLASSIC_PRESET,
  futuristic: FUTURISTIC_PRESET
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

      // Add smooth transition effect with 0.5s interpolation
      await new Promise(resolve => {
        // Create smooth transition by applying effects gradually
        const transitionDuration = 500; // 0.5 seconds
        const startTime = Date.now();
        
        const animateTransition = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / transitionDuration, 1);
          
          // Use easing function for natural feel
          const easedProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
          
          if (progress < 1) {
            requestAnimationFrame(animateTransition);
          } else {
            resolve(true);
          }
        };
        
        animateTransition();
      });

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
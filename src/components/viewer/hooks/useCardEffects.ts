
import { useMemo } from 'react';
import type { CardData } from '@/types/card';

export interface CardEffects {
  holographic: boolean;
  chrome: boolean;
  foil: boolean;
  intensity: number;
}

export const useCardEffects = (card: CardData) => {
  const effects = useMemo(() => {
    // Use design_metadata instead of metadata to match CardData interface
    const effectsData = card.design_metadata?.effects;
    const intensity = card.design_metadata?.effectIntensity || 0.5;
    return {
      holographic: effectsData?.holographic || false,
      chrome: effectsData?.chrome || false,
      foil: effectsData?.foil || false,
      intensity: intensity
    };
  }, [card.design_metadata?.effects, card.design_metadata?.effectIntensity]);

  const effectClasses = useMemo(() => {
    const classes: string[] = [];
    
    if (effects.holographic) classes.push('card-holographic');
    if (effects.chrome) classes.push('card-chrome');
    if (effects.foil) classes.push('card-foil');
    
    return classes.join(' ');
  }, [effects]);

  const effectStyles = useMemo(() => {
    return {
      filter: `brightness(${1 + effects.intensity * 0.2}) contrast(${1 + effects.intensity * 0.1})`,
      transition: 'filter 0.3s ease'
    };
  }, [effects.intensity]);

  // Add the missing methods expected by ImmersiveCardViewer
  const getFrameStyles = useMemo(() => {
    return () => ({
      background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
      border: '1px solid rgba(255,255,255,0.1)',
      ...effectStyles
    });
  }, [effectStyles]);

  const getEnhancedEffectStyles = useMemo(() => {
    return () => ({
      filter: `brightness(${1 + effects.intensity * 0.3}) contrast(${1 + effects.intensity * 0.2}) saturate(${1 + effects.intensity * 0.1})`,
      transition: 'all 0.3s ease'
    });
  }, [effects.intensity]);

  // Return surface texture properties instead of JSX component
  const surfaceTextureStyles = useMemo(() => ({
    position: 'absolute' as const,
    inset: '0',
    opacity: 0.1,
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
  }), []);

  return {
    effects,
    effectClasses,
    effectStyles,
    getFrameStyles,
    getEnhancedEffectStyles,
    surfaceTextureStyles
  };
};

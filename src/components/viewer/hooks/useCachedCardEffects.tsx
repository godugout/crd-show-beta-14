
import { useMemo, useRef } from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from './useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface UseCachedCardEffectsParams {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  overallBrightness: number[];
  interactiveLighting: boolean;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  zoom: number;
  rotation: { x: number; y: number };
  isHovering: boolean;
}

// Create a stable hash for effect values to detect actual changes
const createEffectHash = (effectValues: EffectValues): string => {
  return JSON.stringify(
    Object.entries(effectValues || {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, value?.intensity || 0])
  );
};

export const useCachedCardEffects = (params: UseCachedCardEffectsParams) => {
  const {
    selectedScene,
    selectedLighting,
    overallBrightness,
    mousePosition,
    showEffects,
    effectValues,
    isHovering,
    interactiveLighting
  } = params;

  // Cache for style objects to prevent unnecessary recalculations
  const styleCache = useRef(new Map<string, React.CSSProperties>());
  
  // Create stable keys for caching
  const effectHash = useMemo(() => createEffectHash(effectValues), [effectValues]);
  const environmentKey = useMemo(() => 
    `${selectedScene.id}-${selectedLighting.id}-${overallBrightness[0]}`, 
    [selectedScene.id, selectedLighting.id, overallBrightness]
  );

  // Cached frame styles
  const frameStyles = useMemo(() => ({
    filter: `brightness(${overallBrightness[0]}%)`,
    transition: 'all 0.3s ease'
  }), [overallBrightness]);

  // Cached enhanced effect styles
  const enhancedEffectStyles = useMemo(() => {
    const styles: React.CSSProperties = {};
    
    if (showEffects) {
      const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
        effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
      );
      
      if (activeEffects.length > 0) {
        const avgIntensity = activeEffects.reduce((sum, [_, effect]) => 
          sum + (effect.intensity as number), 0) / activeEffects.length;
        
        const enhancementFactor = Math.min(avgIntensity / 100 * 0.3, 0.3);
        styles.filter = `contrast(${1 + enhancementFactor * 0.1}) saturate(${1 + enhancementFactor * 0.2})`;
        styles.transition = 'all 0.3s ease';
        
        if (interactiveLighting && isHovering) {
          const lightBoost = (mousePosition.x * 0.1 + mousePosition.y * 0.1) * enhancementFactor;
          styles.filter += ` brightness(${1 + lightBoost})`;
        }
      }
    }
    
    return styles;
  }, [effectHash, showEffects, interactiveLighting, isHovering, mousePosition]);

  // Cached environment style
  const environmentStyle = useMemo(() => ({
    background: selectedScene.backgroundImage || selectedScene.gradient,
    filter: `brightness(${selectedLighting.brightness}%)`,
    transition: 'all 0.5s ease'
  }), [environmentKey, selectedScene, selectedLighting]);

  // Cached surface texture - return as React element
  const SurfaceTexture = useMemo(() => {
    const textureOpacity = showEffects ? 0.05 : 0.1;
    return (
      <div 
        className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/5 to-transparent"
        style={{
          opacity: textureOpacity,
          mixBlendMode: 'overlay',
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)
          `
        }}
      />
    );
  }, [showEffects]);

  // Effect blend mode helper
  const getEffectBlendMode = useMemo(() => {
    const blendModes: Record<string, string> = {
      crystal: 'multiply',
      vintage: 'multiply',
      chrome: 'overlay',
      brushedmetal: 'multiply',
      holographic: 'overlay',
      interference: 'screen',
      prizm: 'overlay',
      foilspray: 'screen'
    };
    
    return (effectId: string) => blendModes[effectId] || 'overlay';
  }, []);

  // Clear cache when necessary (on unmount or major changes)
  const clearCache = () => {
    styleCache.current.clear();
  };

  return {
    frameStyles,
    enhancedEffectStyles,
    environmentStyle,
    getEffectBlendMode,
    SurfaceTexture,
    clearCache
  };
};

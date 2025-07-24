
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import { getHolographicEffectParam, calculateHolographicBlur } from './holographic/holographicUtils';
import { MetallicChromeLayer } from './holographic/MetallicChromeLayer';
import { RadialFlareLayer } from './holographic/RadialFlareLayer';
import { InterferencePatternLayers } from './holographic/InterferencePatternLayers';
import { ColorEffectsLayers } from './holographic/ColorEffectsLayers';
import { ShimmerLayer } from './holographic/ShimmerLayer';

interface HolographicEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  const holographicIntensity = Number(getHolographicEffectParam(effectValues, 'holographic', 'intensity', 0));

  if (holographicIntensity <= 0) return null;

  const holographicBlur = calculateHolographicBlur(holographicIntensity);

  return (
    <>
      <MetallicChromeLayer
        intensity={holographicIntensity}
        mousePosition={mousePosition}
        blur={holographicBlur}
      />

      <RadialFlareLayer
        intensity={holographicIntensity}
        mousePosition={mousePosition}
        blur={holographicBlur}
      />

      <InterferencePatternLayers
        intensity={holographicIntensity}
        mousePosition={mousePosition}
        blur={holographicBlur}
      />

      <ColorEffectsLayers
        intensity={holographicIntensity}
        mousePosition={mousePosition}
        blur={holographicBlur}
      />

      <ShimmerLayer
        intensity={holographicIntensity}
        mousePosition={mousePosition}
        blur={holographicBlur}
      />
    </>
  );
};


import React from 'react';
import type { MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { useEnhancedInteractiveLighting } from '../hooks/useEnhancedInteractiveLighting';
import { EnhancedInteractiveLightingLayer } from './EnhancedInteractiveLightingLayer';
import { GoldEffect } from './effects/GoldEffect';
import { AuroraEffect } from './effects/AuroraEffect';
import { CrystalEffect } from './effects/CrystalEffect';
import { VintageEffect } from './effects/VintageEffect';
import { MetallicEffects } from './effects/MetallicEffects';
import { PrismaticEffects } from './effects/PrismaticEffects';
import { FoilSprayEffect } from './effects/FoilSprayEffect';
import { IceEffect } from './effects/IceEffect';
import { LunarEffect } from './effects/LunarEffect';
import { WavesEffect } from './effects/WavesEffect';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  materialSettings?: MaterialSettings;
  interactiveLighting?: boolean;
  effectValues?: EffectValues;
  applyToFrame?: boolean; // New prop to control where effects apply
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  mousePosition,
  physicalEffectStyles,
  materialSettings,
  interactiveLighting = false,
  effectValues,
  applyToFrame = false
}) => {
  // Enhanced interactive lighting hook
  const enhancedLightingData = useEnhancedInteractiveLighting(
    mousePosition, 
    isHovering, 
    interactiveLighting
  );

  if (!showEffects || !effectValues) {
    console.log('🎭 CardEffectsLayer: Not rendering effects:', { showEffects, hasEffectValues: !!effectValues });
    return null;
  }

  // Debug log effect values
  console.log('🎭 CardEffectsLayer: Rendering with effectValues:', effectValues);
  console.log('🎭 CardEffectsLayer: showEffects state:', showEffects);
  console.log('🎭 CardEffectsLayer: interactiveLighting:', interactiveLighting);

  // Helper function to safely get effect parameter values with logging
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    const value = effectValues?.[effectId]?.[paramId] ?? defaultValue;
    if (value !== defaultValue) {
      console.log(`🎭 CardEffectsLayer: ${effectId}.${paramId} = ${value}`);
    }
    return value;
  };
  
  // Get individual effect intensities from effectValues with logging
  const holographicIntensity = getEffectParam('holographic', 'intensity', 0);
  const chromeIntensity = getEffectParam('chrome', 'intensity', 0);
  const brushedmetalIntensity = getEffectParam('brushedmetal', 'intensity', 0);
  const crystalIntensity = getEffectParam('crystal', 'intensity', 0);
  const vintageIntensity = getEffectParam('vintage', 'intensity', 0);
  const interferenceIntensity = getEffectParam('interference', 'intensity', 0);
  const prizemIntensity = getEffectParam('prizm', 'intensity', 0);
  const foilsprayIntensity = getEffectParam('foilspray', 'intensity', 0);
  const goldIntensity = getEffectParam('gold', 'intensity', 0);
  const auroraIntensity = getEffectParam('aurora', 'intensity', 0);
  const wavesIntensity = getEffectParam('waves', 'intensity', 0);

  // Log total active intensity for debugging
  const totalIntensity = holographicIntensity + chromeIntensity + brushedmetalIntensity + 
                        crystalIntensity + vintageIntensity + interferenceIntensity + 
                        prizemIntensity + foilsprayIntensity + goldIntensity + auroraIntensity + wavesIntensity;
  
  if (totalIntensity > 0) {
    console.log(`🎭 CardEffectsLayer: Total effect intensity: ${totalIntensity}`, {
      holographic: holographicIntensity,
      chrome: chromeIntensity,
      brushedmetal: brushedmetalIntensity,
      crystal: crystalIntensity,
      vintage: vintageIntensity,
      interference: interferenceIntensity,
      prizm: prizemIntensity,
      foilspray: foilsprayIntensity,
      gold: goldIntensity,
      aurora: auroraIntensity,
      waves: wavesIntensity
    });
  }

  // Apply effects only to frame borders if applyToFrame is true
  const effectMaskStyle: React.CSSProperties | undefined = applyToFrame ? {
    // This creates a mask that only applies effects to the border area
    // by using a radial gradient mask that creates a "frame only" effect
    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 60%, black 80%)',
    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 60%, black 80%)'
  } : undefined;
  
  return (
    <>
      {/* Apply mask container if effects should only be on frame */}
      <div style={effectMaskStyle} className="absolute inset-0">
        {/* Enhanced Interactive Lighting Layer */}
        {interactiveLighting && (
          <EnhancedInteractiveLightingLayer
            lightingData={enhancedLightingData}
            effectValues={effectValues}
            mousePosition={mousePosition}
          />
        )}

        {/* Waves Effect - Base layer for movement and wobble */}
        <WavesEffect
          effectValues={effectValues}
          mousePosition={mousePosition}
        />

        {/* Gold Effect */}
        <GoldEffect
          effectValues={effectValues}
          mousePosition={mousePosition}
        />

        {/* Aurora Effect - Enhanced with wave movement */}
        <AuroraEffect
          effectValues={effectValues}
          mousePosition={mousePosition}
        />

        {/* Crystal Effect - Enhanced with Diamond Glitter */}
        <CrystalEffect
          effectValues={effectValues}
          mousePosition={mousePosition}
        />

        {/* Vintage Effect - Realistic Cardstock Paper */}
        <VintageEffect
          effectValues={effectValues}
          mousePosition={mousePosition}
        />

        {/* Chrome & Brushed Metal Effects */}
        <MetallicEffects
          effectValues={effectValues}
          mousePosition={mousePosition}
        />

        {/* Prismatic Effects (Holographic, Interference, Prizm) */}
        <PrismaticEffects
          effectValues={effectValues}
          mousePosition={mousePosition}
          enhancedLightingData={enhancedLightingData}
        />

        {/* Foil Spray Effect */}
        <FoilSprayEffect
          effectValues={effectValues}
          mousePosition={mousePosition}
        />

        {/* Ice Effect - Natural ice with scratches */}
        <IceEffect
          effectValues={effectValues}
          mousePosition={mousePosition}
        />

        {/* Lunar Effect - Moon dust and retro space aesthetic */}
        <LunarEffect
          effectValues={effectValues}
          mousePosition={mousePosition}
        />
      </div>

      {/* Calculate overall intensity for edge enhancement */}
      {(() => {
        const totalIntensity = holographicIntensity + chromeIntensity + brushedmetalIntensity + 
                              crystalIntensity + vintageIntensity + interferenceIntensity + 
                              prizemIntensity + foilsprayIntensity + goldIntensity + auroraIntensity + wavesIntensity;
        const normalizedIntensity = Math.min(totalIntensity / 100, 1);
        
        // Subtle edge glow - applied either to frame only or full card based on applyToFrame
        return totalIntensity > 0 ? (
          <div
            className="absolute inset-0 z-26 rounded-xl"
            style={{
              boxShadow: `
                inset 0 0 15px rgba(255, 255, 255, ${normalizedIntensity * (enhancedLightingData ? 0.05 + enhancedLightingData.lightIntensity * 0.1 : 0.05)}),
                inset 0 0 5px rgba(255, 255, 255, ${normalizedIntensity * (enhancedLightingData ? 0.1 + enhancedLightingData.lightIntensity * 0.15 : 0.1)})
              `,
              opacity: enhancedLightingData ? 0.3 + enhancedLightingData.lightIntensity * 0.2 : 0.3,
              ...(applyToFrame ? effectMaskStyle : {})
            }}
          />
        ) : null;
      })()}
    </>
  );
};

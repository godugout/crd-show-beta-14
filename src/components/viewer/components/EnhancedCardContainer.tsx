
import React from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { Card3DTransform } from './Card3DTransform';
import { useCachedCardEffects } from '../hooks/useCachedCardEffects';

interface EnhancedCardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  showBackgroundInfo?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (event: React.MouseEvent) => void;
  environmentControls?: EnvironmentControls;
  solidCardTransition?: boolean;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = [100],
  showBackgroundInfo = true,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  },
  solidCardTransition
}) => {
  // Use cached effects for better performance only when all required props are available
  const cachedEffects = selectedScene && selectedLighting && materialSettings ? useCachedCardEffects({
    card,
    effectValues,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering
  }) : null;

  // Use cached styles if available, otherwise fall back to provided styles
  const effectiveFrameStyles = cachedEffects?.frameStyles || frameStyles;
  const effectiveEnhancedEffectStyles = cachedEffects?.enhancedEffectStyles || enhancedEffectStyles;
  const effectiveSurfaceTextureFront = cachedEffects?.SurfaceTexture || SurfaceTexture;
  const effectiveSurfaceTextureBack = undefined;

  // Calculate the final rotation including the flip
  const finalRotation = {
    x: rotation.x,
    y: rotation.y + (isFlipped ? 180 : 0),
  };

  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: `brightness(${interactiveLighting && isHovering ? 1.3 : 1.2}) contrast(1.1)`
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* This acts as the 3D stage */}
      <div
        className="relative"
        style={{
          width: '400px',
          height: '560px',
          transform: `perspective(1000px) rotateX(${finalRotation.x}deg) rotateY(${finalRotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
          filter: `drop-shadow(0 25px 50px rgba(0,0,0,${interactiveLighting && isHovering ? 0.9 : 0.8}))`
        }}
      >
        {/* Card front: sits on front */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          <CardFrontContainer
            card={card}
            rotation={finalRotation}
            isHovering={isHovering}
            showEffects={showEffects}
            effectValues={effectValues}
            mousePosition={mousePosition}
            frameStyles={effectiveFrameStyles}
            enhancedEffectStyles={effectiveEnhancedEffectStyles}
            SurfaceTexture={effectiveSurfaceTextureFront}
            interactiveLighting={interactiveLighting}
          />
        </div>
        {/* Card back: sits on back, flipped */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <CardBackContainer
            rotation={finalRotation}
            isHovering={isHovering}
            showEffects={showEffects}
            effectValues={effectValues}
            mousePosition={mousePosition}
            frameStyles={effectiveFrameStyles}
            enhancedEffectStyles={effectiveEnhancedEffectStyles}
            SurfaceTexture={effectiveSurfaceTextureBack}
            interactiveLighting={interactiveLighting}
          />
        </div>
      </div>
    </div>
  );
};

EnhancedCardContainer.displayName = 'EnhancedCardContainer';

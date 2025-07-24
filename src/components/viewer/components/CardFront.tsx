
import React from 'react';
import type { CardData } from '@/types/card';
import { CardEffectsLayer } from './CardEffectsLayer';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardFrontProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  effectValues?: EffectValues;
  materialSettings?: any;
  interactiveLighting?: boolean;
}

export const CardFront: React.FC<CardFrontProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  frameStyles,
  physicalEffectStyles,
  SurfaceTexture,
  effectValues,
  materialSettings,
  interactiveLighting = false
}) => {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        ...frameStyles,
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Base Card Frame Layer - z-index 10 */}
      <div className="absolute inset-0 z-10" style={frameStyles} />
      
      {/* Effects Layer (Below Image) - z-index 20 */}
      <div className="absolute inset-0 z-20">
        {showEffects && (
          <CardEffectsLayer
            showEffects={showEffects}
            isHovering={isHovering}
            effectIntensity={effectIntensity}
            mousePosition={mousePosition}
            physicalEffectStyles={physicalEffectStyles}
            effectValues={effectValues}
            materialSettings={materialSettings}
            interactiveLighting={interactiveLighting}
            applyToFrame={true}
          />
        )}
        
        {/* Surface Texture (Applied to frame only) */}
        {SurfaceTexture}
      </div>
      
      {/* Full Image Display - Highest Priority - z-index 40 */}
      <div className="relative h-full z-40">
        {card.image_url ? (
          <div className="w-full h-full relative overflow-hidden">
            <img 
              src={card.image_url} 
              alt={card.title}
              className="w-full h-full object-cover object-center"
              style={{
                filter: showEffects 
                  ? 'brightness(1.05) contrast(1.02)' 
                  : 'none',
                transition: 'filter 0.3s ease'
              }}
              draggable="false"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Content Overlay (transparent text/info) - z-index 30 */}
      <div className="absolute inset-0 z-30 p-6 pointer-events-none">
        <div className="h-full flex flex-col">
          {/* Title & Info at the bottom */}
          <div className="mt-auto">
            <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-lg p-3">
              {card.title && (
                <h3 className="text-white text-xl font-bold mb-1">{card.title}</h3>
              )}
              {card.description && (
                <p className="text-white text-sm opacity-90">{card.description}</p>
              )}
              {card.rarity && (
                <p className="text-white text-xs uppercase tracking-wide opacity-75 mt-1">{card.rarity}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Very Subtle Interactive Lighting - Topmost, z-index 50 */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse 180% 140% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.03) 0%,
                rgba(255, 255, 255, 0.01) 50%,
                transparent 85%
              )
            `,
            mixBlendMode: 'soft-light',
            transition: 'opacity 0.2s ease',
            opacity: showEffects ? 0.6 : 0.3
          }}
        />
      )}
    </div>
  );
};

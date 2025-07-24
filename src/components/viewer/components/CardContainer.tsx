
import React from 'react';
import type { CardData } from '@/types/card';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  effectValues?: EffectValues;
  interactiveLighting?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  physicalEffectStyles,
  SurfaceTexture,
  effectValues,
  interactiveLighting = false,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: 'brightness(1.2) contrast(1.1)'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Single 3D Plane Card with Front/Back sides */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          width: '400px',
          height: '560px',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.1s ease',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))'
        }}
        onClick={onClick}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden'
          }}
        >
          <CardFront
            card={card}
            isFlipped={isFlipped}
            isHovering={isHovering}
            showEffects={showEffects}
            effectIntensity={effectIntensity}
            mousePosition={mousePosition}
            frameStyles={frameStyles}
            physicalEffectStyles={physicalEffectStyles}
            SurfaceTexture={SurfaceTexture}
            effectValues={effectValues}
            interactiveLighting={interactiveLighting}
          />
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          <CardBack
            card={card}
            isFlipped={isFlipped}
            isHovering={isHovering}
            showEffects={showEffects}
            effectIntensity={effectIntensity}
            mousePosition={mousePosition}
            physicalEffectStyles={physicalEffectStyles}
            SurfaceTexture={SurfaceTexture}
            effectValues={effectValues}
            interactiveLighting={interactiveLighting}
          />
        </div>
      </div>
    </div>
  );
};

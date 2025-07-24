
import React, { useRef, useState } from 'react';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { useThrottledMousePosition } from '../hooks/useThrottledMousePosition';

interface EnhancedCardCanvasProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  rotation: { x: number; y: number };
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number;
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  width?: number;
  height?: number;
}

export const EnhancedCardCanvas: React.FC<EnhancedCardCanvasProps> = ({
  card,
  effectValues,
  mousePosition,
  isHovering,
  rotation,
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  width = 400,
  height = 560
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Use throttled mouse position for smoother performance
  const { mousePosition: throttledMousePosition, updateMousePosition } = useThrottledMousePosition(16);

  // Handle mouse move with throttling
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove(event);
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      updateMousePosition(x, y);
    }
  };

  // Use the provided mouse position for immediate updates, throttled for internal calculations
  const effectiveMousePosition = interactiveLighting ? throttledMousePosition : mousePosition;

  // Cached frame styles
  const frameStyles: React.CSSProperties = React.useMemo(() => ({
    background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
    border: '1px solid rgba(255,255,255,0.1)'
  }), []);

  // Cached enhanced effect styles
  const enhancedEffectStyles: React.CSSProperties = React.useMemo(() => ({
    filter: `brightness(${overallBrightness / 100}) contrast(1.1)`
  }), [overallBrightness]);

  // Cached surface texture component
  const SurfaceTexture = React.useMemo(() => (
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    />
  ), []);

  return (
    <div
      ref={canvasRef}
      className="relative flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        perspective: '1000px'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* CRD Logo Branding - Upper Right */}
      <div className="absolute top-4 right-4 z-50">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-16 h-auto opacity-60 hover:opacity-80 transition-opacity duration-200"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          }}
          onLoad={() => console.log('Canvas CRD branding logo loaded successfully')}
          onError={() => console.log('Error loading Canvas CRD branding logo')}
        />
      </div>

      {/* Enhanced Card Container with continuous rotation */}
      <EnhancedCardContainer
        card={card}
        isFlipped={false}
        isHovering={isHovering}
        showEffects={true}
        effectValues={effectValues}
        mousePosition={effectiveMousePosition}
        rotation={rotation}
        zoom={1}
        isDragging={isDragging}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
        overallBrightness={[overallBrightness]}
        showBackgroundInfo={true}
        onMouseDown={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => {
          setIsDragging(false);
          onMouseLeave();
        }}
        onClick={() => {}} // Remove flip functionality
      />

      {/* Updated instruction */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        Drag to rotate card in 3D
      </div>
    </div>
  );
};

EnhancedCardCanvas.displayName = 'EnhancedCardCanvas';

import React, { useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSatellite } from './MaterialSatellite';
import { ParticleFlowRing } from './ParticleFlowRing';
import { CRDVisualStyles, type CRDVisualStyle } from '../styles/StyleRegistry';
import { useOrbitalState } from '../hooks/useOrbitalState';
import { useDragControl } from '../hooks/useDragControl';
import { calculateSatellitePositions, findClosestSatellite } from '../utils/rotationUtils';

interface OrbitalRingProps {
  radius?: number;
  cardRotation: THREE.Euler;
  onStyleChange: (style: CRDVisualStyle) => void;
  selectedStyleId: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  showRing?: boolean;
  showLockIndicators?: boolean;
  isPaused?: boolean;
  cardPaused?: boolean;
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({
  radius = 4,
  cardRotation,
  onStyleChange,
  selectedStyleId,
  autoRotate = true,
  rotationSpeed = 1,
  showRing = true,
  showLockIndicators = true,
  isPaused = false,
  cardPaused = false
}) => {
  const ringRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  // Unified orbital state management
  const {
    currentRotation,
    setCurrentRotation,
    rotationVelocity,
    setRotationVelocity,
    updateRotation,
    applyRotation,
    hoveredSatellite,
    isMouseOverRing,
    isMouseOverCard,
    handleSatelliteHover,
    handleRingHover,
    handleCardHover,
    isDragging,
    setIsDragging
  } = useOrbitalState({ autoRotate, rotationSpeed, isPaused, cardPaused });

  const {
    handleDragStart,
    handleDragMove,
    handleDragEnd
  } = useDragControl(setCurrentRotation);

  // Calculate satellite positions
  const satellitePositions = React.useMemo(() => 
    calculateSatellitePositions(CRDVisualStyles, radius),
    [radius]
  );

  // Animation frame updates
  useFrame((_, delta) => {
    if (!ringRef.current) return;

    const newRotation = updateRotation(delta);
    setCurrentRotation(newRotation);
    applyRotation(ringRef.current, newRotation);

    // Clear momentum when it gets very small
    if (Math.abs(rotationVelocity) <= 0.001) {
      setRotationVelocity(0);
    }
  });

  // Event handlers
  const handlePointerDown = useCallback((event: any) => {
    handleDragStart(event, currentRotation);
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  }, [currentRotation, gl.domElement, handleDragStart, setIsDragging]);

  const handlePointerMove = useCallback((event: any) => {
    const newRotation = handleDragMove(event);
    if (newRotation !== null) {
      setCurrentRotation(newRotation);
    }
  }, [handleDragMove]);

  const handlePointerUp = useCallback(() => {
    const momentum = handleDragEnd();
    setRotationVelocity(momentum);
    setIsDragging(false);
    gl.domElement.style.cursor = 'auto';
  }, [gl.domElement, handleDragEnd, setIsDragging]);

  const handlePointerEnter = useCallback(() => {
    handleRingHover(true);
  }, [handleRingHover]);

  const handlePointerLeave = useCallback(() => {
    handleRingHover(false);
  }, [handleRingHover]);

  // Satellite interaction handlers
  const handleSatelliteClick = useCallback((style: CRDVisualStyle) => {
    onStyleChange(style);
  }, [onStyleChange]);

  const handleSatelliteHoverWrapper = useCallback((styleId: string, hovered: boolean) => {
    handleSatelliteHover(hovered ? styleId : null);
  }, [handleSatelliteHover]);

  return (
    <group 
      ref={ringRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {showRing && (
        <ParticleFlowRing
          radius={radius}
          selectedStyleId={selectedStyleId}
          hoveredSatellite={hoveredSatellite}
          satellitePositions={satellitePositions}
          isPaused={isPaused}
        />
      )}

      {satellitePositions.map(({ style, position }) => (
        <MaterialSatellite
          key={style.id}
          position={position}
          style={{
            ...style,
            locked: showLockIndicators ? style.locked : false
          }}
          isActive={style.id === selectedStyleId}
          isHovered={hoveredSatellite === style.id}
          onClick={() => handleSatelliteClick(style)}
          onHover={(hovered) => handleSatelliteHoverWrapper(style.id, hovered)}
        />
      ))}
    </group>
  );
};
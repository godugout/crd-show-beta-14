import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';

interface UseRingRotationProps {
  autoRotate: boolean;
  rotationSpeed: number;
  isPaused: boolean;
}

export function useRingRotation({ 
  autoRotate, 
  rotationSpeed,
  isPaused 
}: UseRingRotationProps) {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [rotationVelocity, setRotationVelocity] = useState(0);
  const [isMouseOverRing, setIsMouseOverRing] = useState(false);
  
  const updateRotation = useCallback((delta: number, isDragging: boolean) => {
    if (isPaused || isDragging) return currentRotation;

    if (Math.abs(rotationVelocity) > 0.001) {
      // Apply momentum with damping
      const newVelocity = rotationVelocity * 0.98;
      setRotationVelocity(newVelocity);
      return currentRotation + newVelocity * delta;
    } 
    
    if (autoRotate) {
      // Auto-rotation with hover speed adjustment
      const hoverSpeedMultiplier = isMouseOverRing ? 0.15 : 1.0;
      const baseSpeed = rotationSpeed * 0.25 * delta * hoverSpeedMultiplier;
      return currentRotation + baseSpeed;
    }

    return currentRotation;
  }, [autoRotate, currentRotation, isPaused, isMouseOverRing, rotationSpeed, rotationVelocity]);

  const applyRotation = useCallback((group: THREE.Group, targetRotation: number) => {
    const rotationDiff = targetRotation - group.rotation.y;
    group.rotation.y += rotationDiff * 0.1; // Smooth interpolation
  }, []);

  return {
    currentRotation,
    setCurrentRotation,
    rotationVelocity,
    setRotationVelocity,
    isMouseOverRing,
    setIsMouseOverRing,
    updateRotation,
    applyRotation
  };
}
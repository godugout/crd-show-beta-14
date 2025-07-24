import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';

interface UseOrbitalStateProps {
  autoRotate: boolean;
  rotationSpeed: number;
  isPaused: boolean;
  cardPaused?: boolean;
}

export function useOrbitalState({ 
  autoRotate, 
  rotationSpeed,
  isPaused,
  cardPaused = false
}: UseOrbitalStateProps) {
  // Rotation state
  const [currentRotation, setCurrentRotation] = useState(0);
  const [rotationVelocity, setRotationVelocity] = useState(0);
  
  // Hover state - centralized
  const [hoveredSatellite, setHoveredSatellite] = useState<string | null>(null);
  const [isMouseOverRing, setIsMouseOverRing] = useState(false);
  const [isMouseOverCard, setIsMouseOverCard] = useState(false);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  
  // Performance optimization - use refs for frequently updated values
  const lastHoverTime = useRef(0);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateRotation = useCallback((delta: number) => {
    if (isPaused || isDragging) return currentRotation;

    if (Math.abs(rotationVelocity) > 0.001) {
      // Apply momentum with damping
      const newVelocity = rotationVelocity * 0.98;
      setRotationVelocity(newVelocity);
      return currentRotation + newVelocity * delta;
    } 
    
    if (autoRotate) {
      // Ring stops completely when mouse is over ring OR when any satellite is hovered
      const shouldStop = isMouseOverRing || hoveredSatellite !== null;
      if (shouldStop) {
        return currentRotation; // Completely stop rotation
      }
      
      const baseSpeed = rotationSpeed * 0.25 * delta;
      return currentRotation + baseSpeed;
    }

    return currentRotation;
  }, [autoRotate, currentRotation, isPaused, isMouseOverRing, hoveredSatellite, rotationSpeed, rotationVelocity, isDragging]);

  const applyRotation = useCallback((group: THREE.Group, targetRotation: number) => {
    const rotationDiff = targetRotation - group.rotation.y;
    group.rotation.y += rotationDiff * 0.1; // Smooth interpolation
  }, []);

  // Centralized hover management with debouncing
  const handleSatelliteHover = useCallback((styleId: string | null, immediate = false) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    if (immediate || !styleId) {
      setHoveredSatellite(styleId);
      lastHoverTime.current = Date.now();
    } else {
      // Debounce hover changes to prevent jitter
      hoverTimeout.current = setTimeout(() => {
        setHoveredSatellite(styleId);
        lastHoverTime.current = Date.now();
      }, 50);
    }
  }, []);

  const handleRingHover = useCallback((isOver: boolean) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    if (isOver) {
      setIsMouseOverRing(true);
      lastHoverTime.current = Date.now();
    } else {
      // Delay clearing mouse over ring to prevent flicker
      hoverTimeout.current = setTimeout(() => {
        if (!isDragging) {
          setIsMouseOverRing(false);
        }
      }, 150); // Longer delay to ensure stable hover detection
    }
  }, [isDragging]);

  const handleCardHover = useCallback((isOver: boolean) => {
    setIsMouseOverCard(isOver);
  }, []);

  return {
    // Rotation state
    currentRotation,
    setCurrentRotation,
    rotationVelocity,
    setRotationVelocity,
    updateRotation,
    applyRotation,
    
    // Hover state
    hoveredSatellite,
    isMouseOverRing,
    isMouseOverCard,
    handleSatelliteHover,
    handleRingHover,
    handleCardHover,
    
    // Drag state
    isDragging,
    setIsDragging
  };
}
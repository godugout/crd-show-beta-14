import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';

interface DragState {
  startX: number;
  startRotation: number;
  lastX: number;
  lastTime: number;
  velocityHistory: number[];
}

export function useDragControl(onRotationChange: (rotation: number) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'clockwise' | 'counterclockwise' | null>(null);
  const dragState = useRef<DragState>({
    startX: 0,
    startRotation: 0,
    lastX: 0,
    lastTime: 0,
    velocityHistory: []
  });

  const handleDragStart = useCallback((event: { clientX: number }, currentRotation: number) => {
    setIsDragging(true);
    dragState.current = {
      startX: event.clientX,
      startRotation: currentRotation,
      lastX: event.clientX,
      lastTime: Date.now(),
      velocityHistory: []
    };
  }, []);

  const handleDragMove = useCallback((event: { clientX: number }, sensitivity: number = 0.005) => {
    if (!isDragging) return null;

    const currentTime = Date.now();
    const deltaX = event.clientX - dragState.current.lastX;
    const deltaTime = currentTime - dragState.current.lastTime;
    const rotationDelta = deltaX * sensitivity;
    
    // Calculate instantaneous velocity
    if (deltaTime > 0) {
      const instantVelocity = rotationDelta / (deltaTime / 1000);
      dragState.current.velocityHistory.push(instantVelocity);
      if (dragState.current.velocityHistory.length > 5) {
        dragState.current.velocityHistory.shift();
      }
    }

    // Update direction
    if (Math.abs(deltaX) > 1) {
      setDragDirection(deltaX > 0 ? 'clockwise' : 'counterclockwise');
    }

    // Calculate new rotation
    const newRotation = dragState.current.startRotation + 
      (event.clientX - dragState.current.startX) * sensitivity;

    // Update state
    dragState.current.lastX = event.clientX;
    dragState.current.lastTime = currentTime;

    return newRotation;
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return 0;

    setIsDragging(false);
    
    // Calculate final momentum
    const validVelocities = dragState.current.velocityHistory.filter(v => !isNaN(v) && isFinite(v));
    if (validVelocities.length > 0) {
      const avgVelocity = validVelocities.reduce((sum, v) => sum + v, 0) / validVelocities.length;
      return Math.max(-2, Math.min(2, avgVelocity * 0.3)); // Clamp momentum
    }

    return 0;
  }, [isDragging]);

  return {
    isDragging,
    dragDirection,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
}
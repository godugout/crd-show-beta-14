import React, { useRef, useCallback, useState } from 'react';
import { useThree } from '@react-three/fiber';

interface DragUpGestureProps {
  onDragUpTrigger: () => void;
  minDragDistance?: number;
  children: React.ReactNode;
  onCardAngleUpdate?: (angle: number) => void;
}

interface DragState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  hasTriggered: boolean;
}

export const DragUpGesture: React.FC<DragUpGestureProps> = ({
  onDragUpTrigger,
  minDragDistance = 120, // pixels - increased for less sensitivity
  onCardAngleUpdate,
  children
}) => {
  const { gl } = useThree();
  const dragState = useRef<DragState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    hasTriggered: false
  });

  const [isGestureActive, setIsGestureActive] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);

  const handlePointerDown = useCallback((event: any) => {
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
    
    dragState.current = {
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      isDragging: true,
      hasTriggered: false
    };
    setIsGestureActive(true);
    
    // Prevent default to handle touch events properly
    event.preventDefault();
  }, []);

  const handlePointerMove = useCallback((event: any) => {
    if (!dragState.current.isDragging) return;

    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
    
    dragState.current.currentX = clientX;
    dragState.current.currentY = clientY;

    // Calculate drag vector
    const deltaX = clientX - dragState.current.startX;
    const deltaY = clientY - dragState.current.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Check if drag is primarily upward
    const isUpwardDrag = deltaY < -30; // More lenient threshold
    const isPrimarilyVertical = Math.abs(deltaY) > Math.abs(deltaX) * 0.5; // 50% vertical bias
    
    if (isUpwardDrag && isPrimarilyVertical) {
      // Calculate angle based on drag distance, max 45 degrees
      const dragProgress = Math.min(Math.abs(deltaY) / minDragDistance, 1);
      const targetAngle = Math.min(dragProgress * 45, 45); // Cap at 45 degrees
      
      setCurrentAngle(targetAngle);
      if (onCardAngleUpdate) {
        onCardAngleUpdate(targetAngle);
      }
      
      // Trigger animation when we reach 45 degrees
      if (targetAngle >= 45 && !dragState.current.hasTriggered) {
        console.log('🚀 Card reached 45° - triggering alignment animation!');
        dragState.current.hasTriggered = true;
        onDragUpTrigger();
        gl.domElement.style.cursor = 'grab';
      }
    }
    
    event.preventDefault();
  }, [minDragDistance, onDragUpTrigger, onCardAngleUpdate, gl.domElement]);

  const handlePointerUp = useCallback((event: any) => {
    dragState.current.isDragging = false;
    setIsGestureActive(false);
    gl.domElement.style.cursor = 'grab';
    
    event.preventDefault();
  }, [gl.domElement]);

  // Add global event listeners for mouse/touch tracking
  React.useEffect(() => {
    const element = gl.domElement;
    
    // Touch events
    element.addEventListener('touchstart', handlePointerDown, { passive: false });
    element.addEventListener('touchmove', handlePointerMove, { passive: false });
    element.addEventListener('touchend', handlePointerUp, { passive: false });
    
    // Mouse events
    element.addEventListener('mousedown', handlePointerDown);
    element.addEventListener('mousemove', handlePointerMove);
    element.addEventListener('mouseup', handlePointerUp);
    
    return () => {
      element.removeEventListener('touchstart', handlePointerDown);
      element.removeEventListener('touchmove', handlePointerMove);
      element.removeEventListener('touchend', handlePointerUp);
      element.removeEventListener('mousedown', handlePointerDown);
      element.removeEventListener('mousemove', handlePointerMove);
      element.removeEventListener('mouseup', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, gl.domElement]);

  return <>{children}</>;
};
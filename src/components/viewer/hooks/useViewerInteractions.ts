import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeZones } from './useSafeZones';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface UseViewerInteractionsProps {
  allowRotation: boolean;
  autoRotate: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (start: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  setRotation: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setMousePosition: (position: { x: number; y: number }) => void;
  setIsHoveringControls: (hovering: boolean) => void;
  rotation: { x: number; y: number };
  dragStart: { x: number; y: number };
  handleZoom: (delta: number) => void;
  showCustomizePanel: boolean;
  showStats: boolean;
  hasMultipleCards: boolean;
}

export const useViewerInteractions = ({
  allowRotation,
  autoRotate,
  isDragging,
  setIsDragging,
  setDragStart,
  setAutoRotate,
  setRotation,
  setMousePosition,
  setIsHoveringControls,
  rotation,
  dragStart,
  handleZoom,
  showCustomizePanel,
  showStats,
  hasMultipleCards
}: UseViewerInteractionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialDragPosition = useRef<{ x: number; y: number } | null>(null);
  const lastDragPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const DRAG_THRESHOLD = 5; // pixels
  const [isMomentumActive, setIsMomentumActive] = useState(false);
  const restingRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationMilestoneRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Haptic feedback integration
  const { dragStart: hapticDragStart, dragEnd: hapticDragEnd, rotationMilestone, medium } = useHapticFeedback({
    respectPerformance: true
  });

  // Safe zone detection
  const { isInSafeZone } = useSafeZones({
    panelWidth: 320,
    showPanel: showCustomizePanel,
    showStats,
    hasNavigation: hasMultipleCards
  });

  // Enhanced mouse handling with hover effect only on card
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Do not run hover effect if mouse is down for a potential drag OR if momentum is active
    if (!containerRef.current || initialDragPosition.current || isMomentumActive) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    const targetElement = e.target as HTMLElement;
    const cardElement = targetElement.closest('[class*="cursor-grab"]');
    
    if (!isDragging && !inSafeZone) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      const isInControlsArea = e.clientX - rect.left < 300 && e.clientY - rect.top > rect.height - 100;
      setIsHoveringControls(isInControlsArea);
      
      if (allowRotation && !autoRotate) {
        if (cardElement) {
          const cardRect = cardElement.getBoundingClientRect();
          const cardX = (e.clientX - cardRect.left) / cardRect.width;
          const cardY = (e.clientY - cardRect.top) / cardRect.height;
          
          setRotation({
            x: restingRotationRef.current.x + (cardY - 0.5) * 15, // Subtle hover effect
            y: restingRotationRef.current.y + (cardX - 0.5) * -30,
          });
        } else {
          // When not hovering card, return to resting rotation
          setRotation(restingRotationRef.current);
        }
      }
    }
  }, [isDragging, allowRotation, autoRotate, isInSafeZone, setMousePosition, setIsHoveringControls, setRotation, isMomentumActive]);

  // Enhanced wheel handling for safe zones
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (!inSafeZone) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(zoomDelta);
      medium(); // Subtle haptic feedback on zoom
    }
  }, [isInSafeZone, handleZoom]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (allowRotation && !inSafeZone) {
      initialDragPosition.current = { x: e.clientX, y: e.clientY };
      // Adjusted drag start calculation for increased sensitivity
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      lastDragPositionRef.current = { x: e.clientX, y: e.clientY };
      setAutoRotate(false);
      hapticDragStart(); // Haptic feedback on drag start
    }
  }, [rotation, allowRotation, isInSafeZone, setDragStart, setAutoRotate, hapticDragStart]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (allowRotation && initialDragPosition.current) {
      if (isDragging) {
        // Already dragging, just update rotation
        const newRotationY = e.clientX - dragStart.x;
        const newRotationX = e.clientY - dragStart.y;
        
        const newRotation = {
          x: newRotationX, // Allow full 360° X rotation
          y: newRotationY // Allow full 360° Y rotation
        };
        setRotation(newRotation);
        restingRotationRef.current = newRotation; // Update resting rotation during drag

        // Haptic feedback on rotation milestones (every 45 degrees)
        const rotationDelta = Math.abs(newRotation.x - rotationMilestoneRef.current.x) + Math.abs(newRotation.y - rotationMilestoneRef.current.y);
        if (rotationDelta > 45) {
          rotationMilestone();
          rotationMilestoneRef.current = newRotation;
        }

        // Calculate velocity for momentum
        velocityRef.current = {
          x: e.clientX - lastDragPositionRef.current.x,
          y: e.clientY - lastDragPositionRef.current.y
        };
        lastDragPositionRef.current = { x: e.clientX, y: e.clientY };

      } else {
        // Not dragging yet, check threshold
        const dx = e.clientX - initialDragPosition.current.x;
        const dy = e.clientY - initialDragPosition.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          setIsDragging(true);
          // Set initial last drag position when drag starts
          lastDragPositionRef.current = { x: e.clientX, y: e.clientY };
        }
      }
    }
  }, [isDragging, dragStart, allowRotation, setRotation, setIsDragging]);

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      hapticDragEnd(); // Haptic feedback on drag end
      
      const hasMomentum = Math.abs(velocityRef.current.x) > 0.1 || Math.abs(velocityRef.current.y) > 0.1;

      if (!autoRotate && hasMomentum) {
        setIsMomentumActive(true);
        const animateMomentum = () => {
          if (Math.abs(velocityRef.current.x) < 0.1 && Math.abs(velocityRef.current.y) < 0.1) {
            setIsMomentumActive(false);
            return;
          }

          setRotation(prev => {
            const newRotation = {
              x: prev.x + velocityRef.current.y,
              y: prev.y + velocityRef.current.x,
            };
            restingRotationRef.current = newRotation; // Update resting rotation during momentum
            return newRotation;
          });

          velocityRef.current.x *= 0.95; // Damping factor
          velocityRef.current.y *= 0.95;

          animationFrameRef.current = requestAnimationFrame(animateMomentum);
        };
        animateMomentum();
      }
    }
    initialDragPosition.current = null;
  }, [isDragging, setIsDragging, autoRotate, setRotation, hapticDragEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    // Stop momentum if auto-rotate is toggled on
    if (autoRotate && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      setIsMomentumActive(false);
    }
  }, [autoRotate]);

  useEffect(() => {
    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    isMomentumActive,
  };
};

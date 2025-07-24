
import { useCallback, useRef, useEffect } from 'react';
import { useViewerInteractions } from './useViewerInteractions';
import type { CardData } from '@/hooks/useCardEditor';

interface UseViewerInteractionManagerProps {
  allowRotation: boolean;
  cards: any[];
  currentCardIndex: number;
  showCustomizePanel: boolean;
  showStats: boolean;
  autoRotate: boolean;
  isDragging: boolean;
  rotation: { x: number; y: number };
  dragStart: { x: number; y: number };
  setIsDragging: (value: boolean) => void;
  setDragStart: (value: { x: number; y: number }) => void;
  setAutoRotate: (value: boolean) => void;
  setRotation: (value: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setMousePosition: (value: { x: number; y: number }) => void;
  setIsHoveringControls: (value: boolean) => void;
  handleZoom: (delta: number) => void;
}

export const useViewerInteractionManager = (props: UseViewerInteractionManagerProps) => {
  const {
    allowRotation,
    cards,
    currentCardIndex,
    showCustomizePanel,
    showStats,
    autoRotate,
    isDragging,
    rotation,
    dragStart,
    setIsDragging,
    setDragStart,
    setAutoRotate,
    setRotation,
    setMousePosition,
    setIsHoveringControls,
    handleZoom
  } = props;

  const animationRef = useRef<number>();

  const hasMultipleCards = cards.length > 1;

  // Viewer interactions hook
  const { containerRef, handleMouseMove, handleDragStart, handleDrag, handleDragEnd, isMomentumActive } = useViewerInteractions({
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
  });

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging && !isMomentumActive) {
      const animate = () => {
        setRotation(prev => ({
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: prev.y + 0.5
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging, isMomentumActive, setRotation]);

  return {
    containerRef,
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    hasMultipleCards
  };
};

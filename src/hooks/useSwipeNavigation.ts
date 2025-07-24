import { useCallback, useRef, useState, useEffect } from 'react';
import { useHapticFeedback } from './useHapticFeedback';

interface UseSwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enableHapticFeedback?: boolean;
  disabled?: boolean;
}

interface SwipeState {
  isSwipingHorizontal: boolean;
  isSwipingVertical: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
}

export const useSwipeNavigation = (
  elementRef: React.RefObject<HTMLElement>,
  options: UseSwipeNavigationOptions = {}
) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    enableHapticFeedback = true,
    disabled = false
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwipingHorizontal: false,
    isSwipingVertical: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0
  });

  const { light, medium } = useHapticFeedback({ 
    enabled: enableHapticFeedback,
    respectPerformance: true 
  });

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);
  const hasTriggeredHapticRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    touchStartRef.current = { x, y };
    swipeDirectionRef.current = null;
    hasTriggeredHapticRef.current = false;
    
    setSwipeState({
      isSwipingHorizontal: false,
      isSwipingVertical: false,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      deltaX: 0,
      deltaY: 0
    });
  }, [disabled, elementRef]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !touchStartRef.current || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    const deltaX = currentX - touchStartRef.current.x;
    const deltaY = currentY - touchStartRef.current.y;

    // Determine swipe direction on first significant movement
    if (!swipeDirectionRef.current && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      swipeDirectionRef.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
    }

    // Trigger haptic feedback when crossing half threshold
    if (!hasTriggeredHapticRef.current && enableHapticFeedback) {
      const halfThreshold = threshold / 2;
      if (Math.abs(deltaX) > halfThreshold || Math.abs(deltaY) > halfThreshold) {
        light();
        hasTriggeredHapticRef.current = true;
      }
    }

    setSwipeState({
      isSwipingHorizontal: swipeDirectionRef.current === 'horizontal' && Math.abs(deltaX) > 10,
      isSwipingVertical: swipeDirectionRef.current === 'vertical' && Math.abs(deltaY) > 10,
      startX: touchStartRef.current.x,
      startY: touchStartRef.current.y,
      currentX,
      currentY,
      deltaX,
      deltaY
    });

    // Prevent default behavior during swipe
    if (swipeDirectionRef.current) {
      e.preventDefault();
    }
  }, [disabled, elementRef, threshold, enableHapticFeedback, light]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (disabled || !touchStartRef.current) return;

    const { deltaX, deltaY } = swipeState;
    let swipeDetected = false;

    // Check for horizontal swipes
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
        swipeDetected = true;
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
        swipeDetected = true;
      }
    }
    // Check for vertical swipes
    else if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
        swipeDetected = true;
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
        swipeDetected = true;
      }
    }

    // Haptic feedback for successful swipe
    if (swipeDetected && enableHapticFeedback) {
      medium();
    }

    // Reset state
    touchStartRef.current = null;
    swipeDirectionRef.current = null;
    hasTriggeredHapticRef.current = false;
    
    setSwipeState({
      isSwipingHorizontal: false,
      isSwipingVertical: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0
    });
  }, [disabled, swipeState, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, enableHapticFeedback, medium]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add event listeners with passive: false to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    swipeState,
    isSwipingHorizontal: swipeState.isSwipingHorizontal,
    isSwipingVertical: swipeState.isSwipingVertical,
    swipeProgress: {
      horizontal: Math.min(Math.abs(swipeState.deltaX) / threshold, 1),
      vertical: Math.min(Math.abs(swipeState.deltaY) / threshold, 1)
    }
  };
};
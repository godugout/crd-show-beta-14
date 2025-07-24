import { useRef, useCallback, useEffect } from 'react';

interface TouchGestureHandlers {
  onPinch?: (scale: number, centerX: number, centerY: number) => void;
  onRotate?: (angle: number, centerX: number, centerY: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onTap?: (x: number, y: number) => void;
  onDoubleTap?: (x: number, y: number) => void;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
}

export const useTouchGestures = (
  elementRef: React.RefObject<HTMLElement>,
  handlers: TouchGestureHandlers
) => {
  const touchesRef = useRef<TouchPoint[]>([]);
  const lastPinchDistanceRef = useRef<number>(0);
  const lastRotationAngleRef = useRef<number>(0);
  const lastTapTimeRef = useRef<number>(0);
  const lastTapPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const getTouchDistance = (touch1: TouchPoint, touch2: TouchPoint): number => {
    const dx = touch1.x - touch2.x;
    const dy = touch1.y - touch2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchAngle = (touch1: TouchPoint, touch2: TouchPoint): number => {
    return Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x);
  };

  const getTouchCenter = (touch1: TouchPoint, touch2: TouchPoint): { x: number; y: number } => {
    return {
      x: (touch1.x + touch2.x) / 2,
      y: (touch1.y + touch2.y) / 2
    };
  };

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    touchesRef.current = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }));

    if (touchesRef.current.length === 2) {
      const [touch1, touch2] = touchesRef.current;
      lastPinchDistanceRef.current = getTouchDistance(touch1, touch2);
      lastRotationAngleRef.current = getTouchAngle(touch1, touch2);
    }
  }, [elementRef]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentTouches = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }));

    if (currentTouches.length === 1 && touchesRef.current.length === 1) {
      // Single finger pan
      const current = currentTouches[0];
      const previous = touchesRef.current[0];
      const deltaX = current.x - previous.x;
      const deltaY = current.y - previous.y;
      
      if (handlers.onPan) {
        handlers.onPan(deltaX, deltaY);
      }
    } else if (currentTouches.length === 2 && touchesRef.current.length === 2) {
      // Two finger pinch and rotate
      const [current1, current2] = currentTouches;
      const currentDistance = getTouchDistance(current1, current2);
      const currentAngle = getTouchAngle(current1, current2);
      const center = getTouchCenter(current1, current2);

      // Pinch gesture
      if (lastPinchDistanceRef.current > 0) {
        const scale = currentDistance / lastPinchDistanceRef.current;
        if (handlers.onPinch && Math.abs(scale - 1) > 0.01) {
          handlers.onPinch(scale, center.x, center.y);
        }
      }

      // Rotation gesture
      if (lastRotationAngleRef.current !== 0) {
        const angleDiff = currentAngle - lastRotationAngleRef.current;
        if (handlers.onRotate && Math.abs(angleDiff) > 0.01) {
          handlers.onRotate(angleDiff, center.x, center.y);
        }
      }

      lastPinchDistanceRef.current = currentDistance;
      lastRotationAngleRef.current = currentAngle;
    }

    touchesRef.current = currentTouches;
  }, [elementRef, handlers]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Handle tap gestures
    if (touchesRef.current.length === 1 && event.touches.length === 0) {
      const touch = touchesRef.current[0];
      const now = Date.now();
      const tapThreshold = 300; // ms
      const positionThreshold = 10; // pixels

      const isDoubleTap = 
        now - lastTapTimeRef.current < tapThreshold &&
        Math.abs(touch.x - lastTapPositionRef.current.x) < positionThreshold &&
        Math.abs(touch.y - lastTapPositionRef.current.y) < positionThreshold;

      if (isDoubleTap && handlers.onDoubleTap) {
        handlers.onDoubleTap(touch.x, touch.y);
      } else if (handlers.onTap) {
        handlers.onTap(touch.x, touch.y);
      }

      lastTapTimeRef.current = now;
      lastTapPositionRef.current = { x: touch.x, y: touch.y };
    }

    touchesRef.current = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }));

    if (touchesRef.current.length < 2) {
      lastPinchDistanceRef.current = 0;
      lastRotationAngleRef.current = 0;
    }
  }, [elementRef, handlers]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add event listeners
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
    isTouch: touchesRef.current.length > 0
  };
};
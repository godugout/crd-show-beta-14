
import { useState, useRef, useCallback } from 'react';

interface ThrottledMousePosition {
  x: number;
  y: number;
}

export const useThrottledMousePosition = (throttleMs: number = 16) => {
  const [mousePosition, setMousePosition] = useState<ThrottledMousePosition>({ x: 0.5, y: 0.5 });
  const lastUpdateRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const updateMousePosition = useCallback((x: number, y: number) => {
    const now = Date.now();
    
    if (now - lastUpdateRef.current >= throttleMs) {
      setMousePosition({ x, y });
      lastUpdateRef.current = now;
    } else {
      // Schedule update for next frame if not throttling
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x, y });
        lastUpdateRef.current = Date.now();
        rafRef.current = null;
      });
    }
  }, [throttleMs]);

  return {
    mousePosition,
    updateMousePosition
  };
};


import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  isNearBottom: boolean;
}

export const useMousePosition = (bottomThreshold: number = 100) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    isNearBottom: false
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const isNearBottom = event.clientY >= windowHeight - bottomThreshold;
      
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
        isNearBottom
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [bottomThreshold]);

  return mousePosition;
};

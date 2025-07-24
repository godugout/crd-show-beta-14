
import { useMemo } from 'react';

interface UseBackgroundParallaxProps {
  mousePosition: { x: number; y: number };
}

export const useBackgroundParallax = ({ mousePosition }: UseBackgroundParallaxProps) => {
  const parallaxOffset = useMemo(() => ({
    x: (mousePosition.x - 0.5) * 20,
    y: (mousePosition.y - 0.5) * 10
  }), [mousePosition.x, mousePosition.y]);

  return { parallaxOffset };
};

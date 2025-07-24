
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitoring = (enabled: boolean = false) => {
  const metricsRef = useRef<PerformanceMetrics>({ fps: 60, frameTime: 16.67 });
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      frameCountRef.current++;
      
      // Calculate FPS every second
      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        const frameTime = delta / frameCountRef.current;
        
        // Get memory usage if available
        const memoryUsage = (performance as any).memory?.usedJSHeapSize || undefined;
        
        metricsRef.current = {
          fps,
          frameTime,
          memoryUsage
        };
        
        // Log performance warnings
        if (fps < 30) {
          console.warn(`Performance Warning: Low FPS detected (${fps})`);
        }
        
        if (frameTime > 33) {
          console.warn(`Performance Warning: High frame time (${frameTime.toFixed(2)}ms)`);
        }
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  return metricsRef.current;
};

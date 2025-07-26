import { useState, useEffect, useRef } from 'react';

export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  frameTime: number;
  lastUpdate: number;
  quality: QualityLevel;
  isThrottling: boolean;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    frameTime: 16.67, // 60fps = 16.67ms per frame
    lastUpdate: Date.now(),
    quality: 'high',
    isThrottling: false
  });

  const frameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    let startTime = performance.now();

    const updateMetrics = () => {
      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;
      
      if (delta >= 1000) { // Update every second
        const currentFps = (frameCountRef.current * 1000) / delta;
        
        // Keep FPS history for smoothing
        fpsHistoryRef.current.push(currentFps);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }
        
        const avgFps = fpsHistoryRef.current.reduce((sum, fps) => sum + fps, 0) / fpsHistoryRef.current.length;
        
        const memoryUsed = (performance as any).memory?.usedJSHeapSize || 0;
        const frameTime = delta / frameCountRef.current;
        const quality: QualityLevel = avgFps >= 55 ? 'ultra' : avgFps >= 45 ? 'high' : avgFps >= 30 ? 'medium' : 'low';
        
        setMetrics(prev => ({
          ...prev,
          fps: Math.round(avgFps),
          memory: memoryUsed,
          memoryUsage: memoryUsed / (1024 * 1024), // MB
          loadTime: now - startTime,
          renderTime: delta,
          frameTime: frameTime,
          lastUpdate: now,
          quality,
          isThrottling: avgFps < 30
        }));

        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      frameCountRef.current++;
      frameRef.current = requestAnimationFrame(updateMetrics);
    };

    frameRef.current = requestAnimationFrame(updateMetrics);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const getQualitySettings = (quality?: QualityLevel) => {
    const targetQuality = quality || metrics.quality;
    switch (targetQuality) {
      case 'low': return { shadows: false, effects: false, effectsEnabled: false, quality: 0.5 };
      case 'medium': return { shadows: true, effects: false, effectsEnabled: false, quality: 0.75 };
      case 'high': return { shadows: true, effects: true, effectsEnabled: true, quality: 1.0 };
      case 'ultra': return { shadows: true, effects: true, effectsEnabled: true, quality: 1.5 };
    }
  };

  return { metrics, getQualitySettings };
};

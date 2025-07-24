import { useState, useEffect, useCallback, useRef } from 'react';
import type { PerformanceMetrics } from '../types';

export const usePerformanceMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.7,
    memoryUsage: 128,
    triangleCount: 50000,
    drawCalls: 25,
    renderTime: 12.5
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const animationFrameId = useRef<number>();

  // Performance monitoring loop
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastTime.current;
    
    frameCount.current++;
    
    // Calculate FPS every 10 frames for smoother readings
    if (frameCount.current % 10 === 0) {
      const fps = 1000 / (deltaTime / 10);
      
      // Keep FPS history for averaging
      fpsHistory.current.push(fps);
      if (fpsHistory.current.length > 30) {
        fpsHistory.current.shift();
      }
      
      const averageFps = fpsHistory.current.reduce((sum, f) => sum + f, 0) / fpsHistory.current.length;
      
      // Get memory usage (if available)
      let memoryUsage = 128; // Default fallback
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory) {
          memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
        }
      }
      
      // Estimate render metrics based on FPS
      const frameTime = 1000 / averageFps;
      const renderTime = frameTime * 0.75; // Estimate 75% of frame time for rendering
      
      // Estimate triangle count and draw calls based on performance
      const performanceRatio = Math.min(averageFps / 60, 1);
      const triangleCount = Math.round(50000 * performanceRatio);
      const drawCalls = Math.round(25 * performanceRatio);
      
      setPerformanceMetrics({
        fps: Math.round(averageFps),
        frameTime: Math.round(frameTime * 10) / 10,
        memoryUsage: Math.round(memoryUsage),
        triangleCount,
        drawCalls,
        renderTime: Math.round(renderTime * 10) / 10
      });
      
      frameCount.current = 0;
    }
    
    lastTime.current = now;
    
    if (isMonitoring) {
      animationFrameId.current = requestAnimationFrame(monitorPerformance);
    }
  }, [isMonitoring]);

  // Start/stop monitoring
  useEffect(() => {
    if (isMonitoring) {
      lastTime.current = performance.now();
      frameCount.current = 0;
      animationFrameId.current = requestAnimationFrame(monitorPerformance);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isMonitoring, monitorPerformance]);

  // Toggle monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev);
  }, []);

  // Manual performance update (for external integrations)
  const updateMetrics = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
    setPerformanceMetrics(prev => ({ ...prev, ...newMetrics }));
  }, []);

  // Get performance status
  const getPerformanceStatus = useCallback(() => {
    const { fps, memoryUsage } = performanceMetrics;
    
    if (fps >= 55 && memoryUsage < 200) return 'excellent';
    if (fps >= 30 && memoryUsage < 400) return 'good';
    if (fps >= 20 && memoryUsage < 600) return 'fair';
    return 'poor';
  }, [performanceMetrics]);

  // Get optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = [];
    const { fps, memoryUsage } = performanceMetrics;
    
    if (fps < 30) {
      suggestions.push('Consider reducing rendering quality');
      suggestions.push('Disable advanced effects temporarily');
    }
    
    if (memoryUsage > 400) {
      suggestions.push('Close unused panels');
      suggestions.push('Reduce texture quality');
    }
    
    if (fps < 20) {
      suggestions.push('Switch to Beginner mode for better performance');
    }
    
    return suggestions;
  }, [performanceMetrics]);

  return {
    isMonitoring,
    performanceMetrics,
    toggleMonitoring,
    updateMetrics,
    getPerformanceStatus,
    getOptimizationSuggestions
  };
};

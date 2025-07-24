import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnimationTask } from './useAnimationController';

export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  quality: QualityLevel;
  isThrottling: boolean;
}

export interface PerformanceTargets {
  mobile: {
    fps: number;
    frameTime: number;
    maxMemoryMB: number;
  };
  desktop: {
    fps: number;
    frameTime: number;
    maxMemoryMB: number;
  };
}

const PERFORMANCE_TARGETS: PerformanceTargets = {
  mobile: {
    fps: 60,
    frameTime: 16.67, // ms
    maxMemoryMB: 256,
  },
  desktop: {
    fps: 144,
    frameTime: 6.94, // ms
    maxMemoryMB: 1024,
  }
};

const QUALITY_SETTINGS = {
  low: {
    textureQuality: 0.5,
    shadowQuality: 0.3,
    effectsEnabled: false,
    particlesEnabled: false,
    antiAliasing: false,
  },
  medium: {
    textureQuality: 0.75,
    shadowQuality: 0.6,
    effectsEnabled: true,
    particlesEnabled: false,
    antiAliasing: false,
  },
  high: {
    textureQuality: 1.0,
    shadowQuality: 0.8,
    effectsEnabled: true,
    particlesEnabled: true,
    antiAliasing: true,
  },
  ultra: {
    textureQuality: 1.0,
    shadowQuality: 1.0,
    effectsEnabled: true,
    particlesEnabled: true,
    antiAliasing: true,
  }
};

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    quality: 'high',
    isThrottling: false,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);

  // Detect device capabilities
  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
  }, []);

  const getTargets = useCallback(() => {
    return isMobile() ? PERFORMANCE_TARGETS.mobile : PERFORMANCE_TARGETS.desktop;
  }, [isMobile]);

  // Get memory usage (if available)
  const getMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    return 0;
  }, []);

  // Calculate adaptive quality based on performance
  const calculateQuality = useCallback((avgFrameTime: number, memoryUsage: number): QualityLevel => {
    const targets = getTargets();
    
    // Check if we're exceeding memory limits
    if (memoryUsage > targets.maxMemoryMB) {
      return 'low';
    }

    // Adjust quality based on frame time
    if (avgFrameTime > targets.frameTime * 2) {
      return 'low';
    } else if (avgFrameTime > targets.frameTime * 1.5) {
      return 'medium';
    } else if (avgFrameTime > targets.frameTime * 1.2) {
      return 'high';
    } else {
      return 'ultra';
    }
  }, [getTargets]);

  // Centralized performance monitoring
  useAnimationTask(
    'performance-monitor',
    useCallback((timestamp: number) => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      
      frameCountRef.current++;
      frameTimesRef.current.push(deltaTime);

      // Keep only last 60 frames for rolling average
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Calculate metrics every 30 frames (~0.5 seconds at 60fps)
      if (frameCountRef.current % 30 === 0) {
        const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const currentFps = 1000 / avgFrameTime;
        const memoryUsage = getMemoryUsage();
        const newQuality = calculateQuality(avgFrameTime, memoryUsage);
        const targets = getTargets();

        setMetrics(prev => ({
          fps: Math.round(currentFps),
          frameTime: Math.round(avgFrameTime * 100) / 100,
          memoryUsage: Math.round(memoryUsage),
          quality: newQuality,
          isThrottling: avgFrameTime > targets.frameTime * 1.5,
        }));
      }

      lastTimeRef.current = now;
    }, [calculateQuality, getMemoryUsage, getTargets]),
    0 // Lower priority for monitoring
  );

  // Get quality settings for current level
  const getQualitySettings = useCallback((quality: QualityLevel = metrics.quality) => {
    return QUALITY_SETTINGS[quality];
  }, [metrics.quality]);

  // Force quality level (for testing or user preference)
  const setQuality = useCallback((quality: QualityLevel) => {
    setMetrics(prev => ({ ...prev, quality }));
  }, []);

  return {
    metrics,
    getQualitySettings,
    setQuality,
    isMobile: isMobile(),
    targets: getTargets(),
  };
};

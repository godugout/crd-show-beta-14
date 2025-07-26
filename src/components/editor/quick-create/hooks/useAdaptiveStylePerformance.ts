import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GPUInfo {
  tier: number;
  isMobile: boolean;
  fps: number;
  memory: number;
}

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  gpuUtilization: number;
}

export type PerformanceLevel = 'low' | 'medium' | 'high';

interface CardEffectPreset {
  lighting: {
    intensity: number;
    color: string;
    shadowStrength: number;
    highlights?: {
      enabled: boolean;
      intensity: number;
      spread: number;
    };
    neonGlow?: {
      enabled: boolean;
      color: string;
      intensity: number;
    };
    softness?: number;
  };
  materials: {
    metalness: number;
    roughness: number;
    emissive: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    paperTexture?: boolean;
    vintage?: {
      enabled: boolean;
      wear: number;
      yellowTint: number;
    };
    holographic?: {
      enabled: boolean;
      shift: number;
      pattern: string;
    };
    subsurfaceScattering?: boolean;
  };
  particles: {
    enabled: boolean;
    count?: number;
    speed?: number;
    type?: string;
    color?: string[];
  };
  postProcessing: {
    bloom: number;
    contrast: number;
    saturation: number;
    chromaticAberration?: number;
    filmGrain?: number;
    vignette?: number;
    sepia?: number;
    glitch?: {
      enabled: boolean;
      intensity: number;
      frequency: number;
    };
    scanlines?: number;
  };
  animations?: {
    idle?: string;
    intensity?: number;
    speed?: number;
    dataStream?: boolean;
    glowCycle?: boolean;
  };
  borders?: {
    style: string;
    width: number;
    color: string;
    cornerStyle: string;
  };
}

export const useAdaptiveStylePerformance = () => {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>('high');
  const [gpuInfo, setGpuInfo] = useState<GPUInfo | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  // Detect GPU capabilities
  const detectGPUTier = useCallback(async (): Promise<GPUInfo> => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { tier: 0, isMobile: /Mobi|Android/i.test(navigator.userAgent), fps: 30, memory: 0 };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : '';
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    // Detect mobile devices
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    
    // Memory estimation (rough)
    const memory = (navigator as any).deviceMemory || 4;
    
    // GPU tier detection based on renderer
    let tier = 1;
    if (renderer.includes('RTX') || renderer.includes('RX 6') || renderer.includes('RX 7')) {
      tier = 3;
    } else if (renderer.includes('GTX') || renderer.includes('RX 5') || renderer.includes('Intel Iris')) {
      tier = 2;
    } else if (isMobile && memory >= 6) {
      tier = 2;
    }

    return { tier, isMobile, fps: 60, memory };
  }, []);

  // Calculate average FPS from performance entries
  const calculateAverageFPS = useCallback((entries: PerformanceEntry[]): number => {
    if (entries.length === 0) return 60;
    
    const frameTimes = entries.map(entry => entry.duration);
    const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
    
    return Math.round(1000 / avgFrameTime);
  }, []);

  // Monitor performance metrics
  const startPerformanceMonitoring = useCallback(() => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    
    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const avgFPS = calculateAverageFPS(entries);
      
      setMetrics(prev => ({
        fps: avgFPS,
        frameTime: 1000 / avgFPS,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        gpuUtilization: 0 // Approximation based on FPS
      }));
      
      // Auto-adjust performance level based on FPS
      if (avgFPS < 30 && performanceLevel !== 'low') {
        setPerformanceLevel('low');
        toast({
          title: "Performance mode enabled",
          description: "Switching to optimized settings for smoother experience"
        });
      } else if (avgFPS > 50 && performanceLevel === 'low') {
        setPerformanceLevel('medium');
      } else if (avgFPS > 55 && performanceLevel === 'medium' && gpuInfo?.tier && gpuInfo.tier >= 2) {
        setPerformanceLevel('high');
      }
    });
    
    // Monitor frame performance if available
    if ('requestIdleCallback' in window) {
      performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }
    
    return () => {
      performanceObserver.disconnect();
      setIsMonitoring(false);
    };
  }, [isMonitoring, performanceLevel, gpuInfo, toast, calculateAverageFPS]);

  // Initialize GPU detection
  useEffect(() => {
    detectGPUTier().then(info => {
      setGpuInfo(info);
      
      // Set initial performance level based on GPU tier
      if (info.tier >= 3) {
        setPerformanceLevel('high');
      } else if (info.tier >= 2) {
        setPerformanceLevel('medium');
      } else {
        setPerformanceLevel('low');
      }
    });
  }, [detectGPUTier]);

  // Start monitoring when component mounts
  useEffect(() => {
    const cleanup = startPerformanceMonitoring();
    return cleanup;
  }, [startPerformanceMonitoring]);

  // Get optimized preset based on performance level
  const getOptimizedPreset = useCallback((basePreset: CardEffectPreset): CardEffectPreset => {
    switch (performanceLevel) {
      case 'low':
        return {
          ...basePreset,
          particles: { 
            ...basePreset.particles, 
            enabled: false 
          },
          postProcessing: {
            ...basePreset.postProcessing,
            bloom: Math.min(basePreset.postProcessing.bloom * 0.3, 0.2),
            chromaticAberration: 0,
            filmGrain: 0,
            glitch: basePreset.postProcessing.glitch ? {
              ...basePreset.postProcessing.glitch,
              enabled: false
            } : undefined,
            scanlines: 0
          },
          materials: {
            ...basePreset.materials,
            clearcoat: 0,
            clearcoatRoughness: 0,
            subsurfaceScattering: false,
            holographic: basePreset.materials.holographic ? {
              ...basePreset.materials.holographic,
              enabled: false
            } : undefined
          },
          lighting: {
            ...basePreset.lighting,
            highlights: basePreset.lighting.highlights ? {
              ...basePreset.lighting.highlights,
              enabled: false
            } : undefined,
            neonGlow: basePreset.lighting.neonGlow ? {
              ...basePreset.lighting.neonGlow,
              enabled: false
            } : undefined
          },
          animations: basePreset.animations ? {
            ...basePreset.animations,
            dataStream: false,
            glowCycle: false,
            intensity: (basePreset.animations.intensity || 1) * 0.5
          } : undefined
        };
      
      case 'medium':
        return {
          ...basePreset,
          particles: basePreset.particles.enabled ? { 
            ...basePreset.particles, 
            count: Math.floor((basePreset.particles.count || 50) * 0.5),
            speed: (basePreset.particles.speed || 1) * 0.7
          } : basePreset.particles,
          postProcessing: {
            ...basePreset.postProcessing,
            bloom: basePreset.postProcessing.bloom * 0.7,
            chromaticAberration: (basePreset.postProcessing.chromaticAberration || 0) * 0.5,
            filmGrain: (basePreset.postProcessing.filmGrain || 0) * 0.5,
            glitch: basePreset.postProcessing.glitch ? {
              ...basePreset.postProcessing.glitch,
              intensity: basePreset.postProcessing.glitch.intensity * 0.7
            } : undefined
          },
          materials: {
            ...basePreset.materials,
            clearcoat: (basePreset.materials.clearcoat || 0) * 0.7
          },
          animations: basePreset.animations ? {
            ...basePreset.animations,
            intensity: (basePreset.animations.intensity || 1) * 0.8
          } : undefined
        };
      
      default: // high performance
        return basePreset;
    }
  }, [performanceLevel]);

  // Check if WebGL is supported
  const hasWebGLSupport = useCallback((): boolean => {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  }, []);

  // Check device capabilities
  const getDeviceCapabilities = useCallback(() => {
    return {
      webgl: hasWebGLSupport(),
      mobile: gpuInfo?.isMobile || false,
      memory: gpuInfo?.memory || 0,
      tier: gpuInfo?.tier || 0,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  }, [gpuInfo, hasWebGLSupport]);

  return {
    performanceLevel,
    gpuInfo,
    metrics,
    getOptimizedPreset,
    getDeviceCapabilities,
    hasWebGLSupport: hasWebGLSupport(),
    setPerformanceLevel,
    isMonitoring
  };
};
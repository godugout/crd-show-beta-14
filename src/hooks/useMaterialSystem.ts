import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePerformanceMonitor } from './usePerformanceMonitor';
import { useTextureLoader } from './useTextureLoader';

// Material property types
export interface MaterialProperties {
  albedo: THREE.Color;
  metallic: number;
  roughness: number;
  normal: number;
  emission: THREE.Color;
  emissionIntensity: number;
  envMapIntensity: number;
}

export type MaterialPreset =
  | 'matte'
  | 'glossy'
  | 'metallic'
  | 'holographic'
  | 'chrome'
  | 'plastic';

export interface MaterialSystemState {
  currentMaterial: MaterialProperties;
  textureCache: Record<string, THREE.Texture>;
  isLoading: boolean;
  performanceMetrics: any;
}

// Material preset configurations
const MATERIAL_PRESETS: Record<MaterialPreset, Partial<MaterialProperties>> = {
  matte: {
    metallic: 0,
    roughness: 1,
    envMapIntensity: 0.2,
    emissionIntensity: 0,
  },
  glossy: {
    metallic: 0,
    roughness: 0.1,
    envMapIntensity: 0.8,
    emissionIntensity: 0,
  },
  metallic: {
    metallic: 1,
    roughness: 0.1,
    envMapIntensity: 1,
    emissionIntensity: 0,
  },
  holographic: {
    metallic: 0.8,
    roughness: 0.05,
    envMapIntensity: 1.5,
    emissionIntensity: 0.2,
  },
  chrome: {
    metallic: 1,
    roughness: 0,
    envMapIntensity: 1.2,
    emissionIntensity: 0,
  },
  plastic: {
    metallic: 0,
    roughness: 0.4,
    envMapIntensity: 0.5,
    emissionIntensity: 0,
  },
};

// Property validation functions
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const validateMaterialProperty = (
  property: keyof MaterialProperties,
  value: any
): any => {
  switch (property) {
    case 'metallic':
    case 'roughness':
      return clamp(value, 0, 1);
    case 'normal':
      return clamp(value, 0, 2);
    case 'emissionIntensity':
      return Math.max(0, value);
    case 'envMapIntensity':
      return Math.max(0, value);
    case 'albedo':
    case 'emission':
      return value instanceof THREE.Color ? value : new THREE.Color(value);
    default:
      return value;
  }
};

export function useMaterialSystem() {
  // Initialize default material properties
  const [currentMaterial, setCurrentMaterial] = useState<MaterialProperties>({
    albedo: new THREE.Color(0xffffff),
    metallic: 0,
    roughness: 0.5,
    normal: 1,
    emission: new THREE.Color(0x000000),
    emissionIntensity: 0,
    envMapIntensity: 1,
  });

  const [textureCache, setTextureCache] = useState<
    Record<string, THREE.Texture>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  // Hook dependencies
  const textureLoader = useTextureLoader();
  const performanceMonitor = usePerformanceMonitor();

  // Performance tracking
  const performanceTimers = useRef<Record<string, string>>({});

  // Update material property with validation
  const updateMaterialProperty = useCallback(
    (property: keyof MaterialProperties, value: any) => {
      const timerId = performanceMonitor.startTimer('material-property-update');

      try {
        const validatedValue = validateMaterialProperty(property, value);

        setCurrentMaterial(prev => ({
          ...prev,
          [property]: validatedValue,
        }));

        // Record performance metric
        performanceMonitor.recordMetric(
          'materialUpdateTime',
          performanceMonitor.endTimer(timerId)
        );
      } catch (error) {
        console.warn(`Failed to update material property ${property}:`, error);
        performanceMonitor.endTimer(timerId);
      }
    },
    [performanceMonitor]
  );

  // Apply material preset
  const applyPreset = useCallback(
    (preset: MaterialPreset) => {
      const timerId = performanceMonitor.startTimer('preset-application');

      try {
        const presetConfig = MATERIAL_PRESETS[preset];
        if (!presetConfig) {
          console.warn(`Unknown material preset: ${preset}`);
          return;
        }

        setCurrentMaterial(prev => {
          const updated = { ...prev };

          Object.entries(presetConfig).forEach(([key, value]) => {
            const propertyKey = key as keyof MaterialProperties;
            updated[propertyKey] = validateMaterialProperty(
              propertyKey,
              value
            ) as any;
          });

          return updated;
        });

        performanceMonitor.recordMetric(
          'presetApplicationTime',
          performanceMonitor.endTimer(timerId)
        );
      } catch (error) {
        console.error(`Failed to apply preset ${preset}:`, error);
        performanceMonitor.endTimer(timerId);
      }
    },
    [performanceMonitor]
  );

  // Load texture with caching
  const loadTexture = useCallback(
    async (url: string): Promise<THREE.Texture> => {
      if (textureCache[url]) {
        performanceMonitor.recordMetric('textureCacheHit', 1);
        return textureCache[url];
      }

      setIsLoading(true);
      const timerId = performanceMonitor.startTimer('texture-loading');

      try {
        const texture = await textureLoader.loadTexture(url);

        setTextureCache(prev => ({
          ...prev,
          [url]: texture,
        }));

        performanceMonitor.recordMetric(
          'textureLoadTime',
          performanceMonitor.endTimer(timerId)
        );
        performanceMonitor.recordMetric('textureCacheMiss', 1);

        return texture;
      } catch (error) {
        performanceMonitor.endTimer(timerId);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [textureCache, textureLoader, performanceMonitor]
  );

  // Clear texture cache for memory management
  const clearTextureCache = useCallback(() => {
    setTextureCache({});
    performanceMonitor.recordMetric('textureCacheCleared', 1);
  }, [performanceMonitor]);

  // Get current performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return performanceMonitor.getMetrics();
  }, [performanceMonitor]);

  // Monitor memory usage and auto-clear cache if needed
  useEffect(() => {
    const checkMemoryUsage = () => {
      const memoryInfo = performanceMonitor.getMemoryInfo();
      const memoryUsageMB = memoryInfo.usedJSHeapSize / (1024 * 1024);

      performanceMonitor.recordMetric('memoryUsage', memoryUsageMB);

      // Auto-clear cache if memory usage is high (>200MB)
      if (memoryUsageMB > 200) {
        console.warn('High memory usage detected, clearing texture cache');
        clearTextureCache();
      }
    };

    const interval = setInterval(checkMemoryUsage, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [performanceMonitor, clearTextureCache]);

  // Create Three.js material from current properties
  const createThreeMaterial = useCallback(
    (materialType: 'standard' | 'physical' = 'standard') => {
      const commonProps = {
        color: currentMaterial.albedo,
        metalness: currentMaterial.metallic,
        roughness: currentMaterial.roughness,
        emissive: currentMaterial.emission,
        emissiveIntensity: currentMaterial.emissionIntensity,
        envMapIntensity: currentMaterial.envMapIntensity,
      };

      if (materialType === 'physical') {
        return new THREE.MeshPhysicalMaterial(commonProps);
      } else {
        return new THREE.MeshStandardMaterial(commonProps);
      }
    },
    [currentMaterial]
  );

  // Validate current material configuration
  const validateMaterial = useCallback(() => {
    const issues: string[] = [];

    if (currentMaterial.metallic < 0 || currentMaterial.metallic > 1) {
      issues.push('Metallic value must be between 0 and 1');
    }

    if (currentMaterial.roughness < 0 || currentMaterial.roughness > 1) {
      issues.push('Roughness value must be between 0 and 1');
    }

    if (currentMaterial.normal < 0 || currentMaterial.normal > 2) {
      issues.push('Normal intensity must be between 0 and 2');
    }

    if (currentMaterial.emissionIntensity < 0) {
      issues.push('Emission intensity must be non-negative');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }, [currentMaterial]);

  return {
    // State
    currentMaterial,
    textureCache,
    isLoading,
    performanceMetrics: getPerformanceMetrics(),

    // Actions
    updateMaterialProperty,
    applyPreset,
    loadTexture,
    clearTextureCache,

    // Utilities
    createThreeMaterial,
    validateMaterial,
    getPerformanceMetrics,
  };
}

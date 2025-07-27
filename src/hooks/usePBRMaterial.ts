import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useMaterialSystem } from './useMaterialSystem';
import { usePerformanceMonitor } from './usePerformanceMonitor';

export type MaterialType = 'standard' | 'physical';
export type TextureMapType =
  | 'albedo'
  | 'metallic'
  | 'roughness'
  | 'normal'
  | 'emission'
  | 'environment';
export type PhysicalProperty =
  | 'clearcoat'
  | 'clearcoatRoughness'
  | 'transmission'
  | 'thickness'
  | 'ior';

export interface PBRMaterialOptions {
  materialType?: MaterialType;
  debounceMs?: number;
  autoUpdate?: boolean;
}

export interface PBRMaterialState {
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
  materialType: MaterialType;
  isUpdating: boolean;
  textureCount: number;
}

// Property validation and clamping
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const validateProperty = (property: string, value: number): number => {
  switch (property) {
    case 'metallic':
    case 'roughness':
    case 'clearcoat':
    case 'clearcoatRoughness':
    case 'transmission':
    case 'thickness':
      return clamp(value, 0, 1);
    case 'normal':
      return Math.max(0, value);
    case 'emissionIntensity':
    case 'envMapIntensity':
      return Math.max(0, value);
    case 'ior':
      return Math.max(1, value); // IOR must be >= 1
    default:
      return value;
  }
};

export function usePBRMaterial(options: PBRMaterialOptions = {}) {
  const {
    materialType = 'standard',
    debounceMs = 16, // ~60fps
    autoUpdate = true,
  } = options;

  // Dependencies
  const materialSystem = useMaterialSystem();
  const performanceMonitor = usePerformanceMonitor();

  // State
  const [isUpdating, setIsUpdating] = useState(false);
  const [textureCount, setTextureCount] = useState(0);

  // Refs
  const materialRef = useRef<
    THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | null
  >(null);
  const texturesRef = useRef<Set<THREE.Texture>>(new Set());
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const batchingRef = useRef(false);
  const performanceMetricsRef = useRef({
    updateCount: 0,
    lastUpdateTime: 0,
    averageUpdateTime: 0,
  });

  // Initialize material
  const initializeMaterial = useCallback(() => {
    const timerId = performanceMonitor.startTimer('material-initialization');

    try {
      // Dispose existing material
      if (materialRef.current) {
        materialRef.current.dispose();
      }

      // Create new material based on type
      const material =
        materialType === 'physical'
          ? new THREE.MeshPhysicalMaterial()
          : new THREE.MeshStandardMaterial();

      // Apply current material system properties
      const { currentMaterial } = materialSystem;

      material.color.copy(currentMaterial.albedo);
      material.metalness = validateProperty(
        'metallic',
        currentMaterial.metallic
      );
      material.roughness = validateProperty(
        'roughness',
        currentMaterial.roughness
      );
      material.emissive.copy(currentMaterial.emission);
      material.emissiveIntensity = validateProperty(
        'emissionIntensity',
        currentMaterial.emissionIntensity
      );
      material.envMapIntensity = validateProperty(
        'envMapIntensity',
        currentMaterial.envMapIntensity
      );

      // Set normal scale
      material.normalScale = new THREE.Vector2(
        validateProperty('normal', currentMaterial.normal),
        validateProperty('normal', currentMaterial.normal)
      );

      materialRef.current = material;

      performanceMonitor.recordMetric(
        'materialInitTime',
        performanceMonitor.endTimer(timerId)
      );
    } catch (error) {
      console.error('Failed to initialize PBR material:', error);
      performanceMonitor.endTimer(timerId);
    }
  }, [materialType, materialSystem, performanceMonitor]);

  // Initialize material on mount and when type changes
  useEffect(() => {
    initializeMaterial();
  }, [initializeMaterial]);

  // Update material property with debouncing
  const updateProperty = useCallback(
    (property: keyof typeof materialSystem.currentMaterial, value: number) => {
      if (!materialRef.current) return;

      const timerId = performanceMonitor.startTimer('property-update');

      try {
        const validatedValue = validateProperty(property, value);
        const material = materialRef.current;

        // Apply property to Three.js material
        switch (property) {
          case 'metallic':
            material.metalness = validatedValue;
            break;
          case 'roughness':
            material.roughness = validatedValue;
            break;
          case 'normal':
            material.normalScale.set(validatedValue, validatedValue);
            break;
          case 'emissionIntensity':
            material.emissiveIntensity = validatedValue;
            break;
          case 'envMapIntensity':
            material.envMapIntensity = validatedValue;
            break;
          case 'albedo':
            if (value instanceof THREE.Color) {
              material.color.copy(value as any);
            }
            break;
          case 'emission':
            if (value instanceof THREE.Color) {
              material.emissive.copy(value as any);
            }
            break;
        }

        // Mark material for update
        if (!batchingRef.current) {
          if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
          }

          updateTimeoutRef.current = setTimeout(() => {
            if (materialRef.current) {
              materialRef.current.needsUpdate = true;
              setIsUpdating(false);
            }
          }, debounceMs);

          setIsUpdating(true);
        }

        // Update performance metrics
        const updateTime = performanceMonitor.endTimer(timerId);
        performanceMetricsRef.current.updateCount++;
        performanceMetricsRef.current.lastUpdateTime = updateTime;
        performanceMetricsRef.current.averageUpdateTime =
          (performanceMetricsRef.current.averageUpdateTime + updateTime) / 2;

        performanceMonitor.recordMetric('materialPropertyUpdate', updateTime);

        // Update material system if auto-update is enabled
        if (autoUpdate) {
          materialSystem.updateMaterialProperty(property, validatedValue);
        }
      } catch (error) {
        console.error(`Failed to update property ${property}:`, error);
        performanceMonitor.endTimer(timerId);
      }
    },
    [materialSystem, performanceMonitor, debounceMs, autoUpdate]
  );

  // Update physical material properties
  const updatePhysicalProperty = useCallback(
    (property: PhysicalProperty, value: number) => {
      if (!materialRef.current) return;
      if (materialType !== 'physical') {
        throw new Error(
          'Physical properties only available for MeshPhysicalMaterial'
        );
      }

      const timerId = performanceMonitor.startTimer('physical-property-update');

      try {
        const validatedValue = validateProperty(property, value);
        const material = materialRef.current as THREE.MeshPhysicalMaterial;

        switch (property) {
          case 'clearcoat':
            material.clearcoat = validatedValue;
            break;
          case 'clearcoatRoughness':
            material.clearcoatRoughness = validatedValue;
            break;
          case 'transmission':
            material.transmission = validatedValue;
            break;
          case 'thickness':
            material.thickness = validatedValue;
            break;
          case 'ior':
            material.ior = validatedValue;
            break;
        }

        if (!batchingRef.current) {
          material.needsUpdate = true;
        }

        performanceMonitor.recordMetric(
          'physicalPropertyUpdate',
          performanceMonitor.endTimer(timerId)
        );
      } catch (error) {
        console.error(`Failed to update physical property ${property}:`, error);
        performanceMonitor.endTimer(timerId);
      }
    },
    [materialType, performanceMonitor]
  );

  // Set texture map
  const setTextureMap = useCallback(
    async (mapType: TextureMapType, texture: THREE.Texture) => {
      if (!materialRef.current) return;

      const timerId = performanceMonitor.startTimer('texture-map-set');

      try {
        const material = materialRef.current;

        // Apply texture to appropriate map
        switch (mapType) {
          case 'albedo':
            material.map = texture;
            break;
          case 'metallic':
            material.metalnessMap = texture;
            break;
          case 'roughness':
            material.roughnessMap = texture;
            break;
          case 'normal':
            material.normalMap = texture;
            break;
          case 'emission':
            material.emissiveMap = texture;
            break;
          case 'environment':
            material.envMap = texture;
            break;
          default:
            throw new Error(`Unsupported texture map type: ${mapType}`);
        }

        // Track texture for disposal
        texturesRef.current.add(texture);
        setTextureCount(texturesRef.current.size);

        material.needsUpdate = true;

        performanceMonitor.recordMetric(
          'textureMapSet',
          performanceMonitor.endTimer(timerId)
        );
      } catch (error) {
        performanceMonitor.endTimer(timerId);
        throw error;
      }
    },
    [performanceMonitor]
  );

  // Batch multiple updates for performance
  const batchUpdate = useCallback((updateFn: () => void) => {
    if (!materialRef.current) return;

    batchingRef.current = true;

    try {
      updateFn();
      materialRef.current.needsUpdate = true;
    } finally {
      batchingRef.current = false;
    }
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return {
      ...performanceMetricsRef.current,
      textureCount,
      isUpdating,
      materialType,
    };
  }, [textureCount, isUpdating, materialType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Dispose material
      if (materialRef.current) {
        materialRef.current.dispose();
      }

      // Dispose textures
      texturesRef.current.forEach(texture => {
        texture.dispose();
      });
      texturesRef.current.clear();
    };
  }, []);

  // Sync with material system changes
  useEffect(() => {
    if (!materialRef.current || !autoUpdate) return;

    const { currentMaterial } = materialSystem;
    const material = materialRef.current;

    // Sync properties
    material.color.copy(currentMaterial.albedo);
    material.metalness = validateProperty('metallic', currentMaterial.metallic);
    material.roughness = validateProperty(
      'roughness',
      currentMaterial.roughness
    );
    material.emissive.copy(currentMaterial.emission);
    material.emissiveIntensity = validateProperty(
      'emissionIntensity',
      currentMaterial.emissionIntensity
    );
    material.envMapIntensity = validateProperty(
      'envMapIntensity',
      currentMaterial.envMapIntensity
    );
    material.normalScale.set(
      validateProperty('normal', currentMaterial.normal),
      validateProperty('normal', currentMaterial.normal)
    );

    material.needsUpdate = true;
  }, [materialSystem.currentMaterial, autoUpdate]);

  return {
    // State
    material: materialRef.current!,
    materialType,
    isUpdating,
    textureCount,

    // Actions
    updateProperty,
    updatePhysicalProperty,
    setTextureMap,
    batchUpdate,

    // Utilities
    getPerformanceMetrics,
  };
}

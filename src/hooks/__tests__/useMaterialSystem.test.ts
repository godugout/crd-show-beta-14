import { act, renderHook } from '@testing-library/react';
import * as THREE from 'three';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useMaterialSystem } from '../useMaterialSystem';

// Mock Three.js
vi.mock('three', () => ({
  Color: vi.fn().mockImplementation(color => ({
    r: 1,
    g: 1,
    b: 1,
    setHex: vi.fn(),
    clone: vi.fn(() => ({ r: 1, g: 1, b: 1 })),
  })),
  TextureLoader: vi.fn().mockImplementation(() => ({
    load: vi.fn((url, onLoad) => {
      const mockTexture = {
        flipY: false,
        wrapS: 1000,
        wrapT: 1000,
        minFilter: 1006,
        magFilter: 1006,
      };
      onLoad?.(mockTexture);
      return mockTexture;
    }),
  })),
}));

// Mock performance monitoring
vi.mock('../usePerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    startTimer: vi.fn(),
    endTimer: vi.fn(),
    recordMetric: vi.fn(),
    getMetrics: vi.fn(() => ({
      frameRate: 60,
      memoryUsage: 128,
      textureLoadTime: 50,
    })),
  }),
}));

describe('useMaterialSystem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default material properties', () => {
      const { result } = renderHook(() => useMaterialSystem());

      expect(result.current.currentMaterial).toEqual({
        albedo: expect.any(Object), // THREE.Color mock
        metallic: 0,
        roughness: 0.5,
        normal: 1,
        emission: expect.any(Object), // THREE.Color mock
        emissionIntensity: 0,
        envMapIntensity: 1,
      });
    });

    it('should initialize with empty texture cache', () => {
      const { result } = renderHook(() => useMaterialSystem());

      expect(result.current.textureCache).toEqual({});
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize performance metrics', () => {
      const { result } = renderHook(() => useMaterialSystem());

      expect(result.current.performanceMetrics).toEqual({
        frameRate: 60,
        memoryUsage: 128,
        textureLoadTime: 50,
      });
    });
  });

  describe('Material Property Validation', () => {
    it('should validate metallic values between 0 and 1', () => {
      const { result } = renderHook(() => useMaterialSystem());

      act(() => {
        result.current.updateMaterialProperty('metallic', 0.5);
      });
      expect(result.current.currentMaterial.metallic).toBe(0.5);

      act(() => {
        result.current.updateMaterialProperty('metallic', -0.1);
      });
      expect(result.current.currentMaterial.metallic).toBe(0); // Clamped to min

      act(() => {
        result.current.updateMaterialProperty('metallic', 1.5);
      });
      expect(result.current.currentMaterial.metallic).toBe(1); // Clamped to max
    });

    it('should validate roughness values between 0 and 1', () => {
      const { result } = renderHook(() => useMaterialSystem());

      act(() => {
        result.current.updateMaterialProperty('roughness', 0.3);
      });
      expect(result.current.currentMaterial.roughness).toBe(0.3);

      act(() => {
        result.current.updateMaterialProperty('roughness', -0.5);
      });
      expect(result.current.currentMaterial.roughness).toBe(0);

      act(() => {
        result.current.updateMaterialProperty('roughness', 2.0);
      });
      expect(result.current.currentMaterial.roughness).toBe(1);
    });

    it('should validate normal intensity between 0 and 2', () => {
      const { result } = renderHook(() => useMaterialSystem());

      act(() => {
        result.current.updateMaterialProperty('normal', 1.5);
      });
      expect(result.current.currentMaterial.normal).toBe(1.5);

      act(() => {
        result.current.updateMaterialProperty('normal', -0.1);
      });
      expect(result.current.currentMaterial.normal).toBe(0);

      act(() => {
        result.current.updateMaterialProperty('normal', 3.0);
      });
      expect(result.current.currentMaterial.normal).toBe(2);
    });

    it('should validate emission intensity as non-negative', () => {
      const { result } = renderHook(() => useMaterialSystem());

      act(() => {
        result.current.updateMaterialProperty('emissionIntensity', 2.5);
      });
      expect(result.current.currentMaterial.emissionIntensity).toBe(2.5);

      act(() => {
        result.current.updateMaterialProperty('emissionIntensity', -1.0);
      });
      expect(result.current.currentMaterial.emissionIntensity).toBe(0);
    });
  });

  describe('Material Presets', () => {
    it('should apply matte preset correctly', () => {
      const { result } = renderHook(() => useMaterialSystem());

      act(() => {
        result.current.applyPreset('matte');
      });

      expect(result.current.currentMaterial.metallic).toBe(0);
      expect(result.current.currentMaterial.roughness).toBe(1);
      expect(result.current.currentMaterial.envMapIntensity).toBe(0.2);
    });

    it('should apply metallic preset correctly', () => {
      const { result } = renderHook(() => useMaterialSystem());

      act(() => {
        result.current.applyPreset('metallic');
      });

      expect(result.current.currentMaterial.metallic).toBe(1);
      expect(result.current.currentMaterial.roughness).toBe(0.1);
      expect(result.current.currentMaterial.envMapIntensity).toBe(1);
    });

    it('should apply glossy preset correctly', () => {
      const { result } = renderHook(() => useMaterialSystem());

      act(() => {
        result.current.applyPreset('glossy');
      });

      expect(result.current.currentMaterial.metallic).toBe(0);
      expect(result.current.currentMaterial.roughness).toBe(0.1);
      expect(result.current.currentMaterial.envMapIntensity).toBe(0.8);
    });

    it('should handle invalid preset gracefully', () => {
      const { result } = renderHook(() => useMaterialSystem());
      const initialMaterial = { ...result.current.currentMaterial };

      act(() => {
        result.current.applyPreset('invalid-preset' as any);
      });

      // Material should remain unchanged
      expect(result.current.currentMaterial).toEqual(initialMaterial);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid property names gracefully', () => {
      const { result } = renderHook(() => useMaterialSystem());

      expect(() => {
        act(() => {
          result.current.updateMaterialProperty('invalidProperty' as any, 0.5);
        });
      }).not.toThrow();
    });

    it('should handle texture loading failures', async () => {
      const { result } = renderHook(() => useMaterialSystem());

      // Mock texture loader to fail
      (THREE.TextureLoader as Mock).mockImplementationOnce(() => ({
        load: vi.fn((url, onLoad, onProgress, onError) => {
          onError?.(new Error('Failed to load texture'));
        }),
      }));

      await act(async () => {
        await expect(
          result.current.loadTexture('invalid-url.jpg')
        ).rejects.toThrow('Failed to load texture');
      });
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should track material property updates', () => {
      const { result } = renderHook(() => useMaterialSystem());

      act(() => {
        result.current.updateMaterialProperty('metallic', 0.8);
      });

      // Performance monitoring should be called
      expect(result.current.performanceMetrics).toBeDefined();
    });

    it('should track texture loading performance', async () => {
      const { result } = renderHook(() => useMaterialSystem());

      await act(async () => {
        await result.current.loadTexture('test-texture.jpg');
      });

      expect(result.current.performanceMetrics.textureLoadTime).toBeDefined();
      expect(typeof result.current.performanceMetrics.textureLoadTime).toBe(
        'number'
      );
    });
  });

  describe('Memory Management', () => {
    it('should track memory usage', () => {
      const { result } = renderHook(() => useMaterialSystem());

      expect(result.current.performanceMetrics.memoryUsage).toBeDefined();
      expect(result.current.performanceMetrics.memoryUsage).toBeLessThan(256); // Under 256MB limit
    });

    it('should clear texture cache when memory limit approached', async () => {
      const { result } = renderHook(() => useMaterialSystem());

      // Mock high memory usage
      vi.mocked(result.current.performanceMetrics.memoryUsage as any) = 250;

      await act(async () => {
        result.current.clearTextureCache();
      });

      expect(result.current.textureCache).toEqual({});
    });
  });
});

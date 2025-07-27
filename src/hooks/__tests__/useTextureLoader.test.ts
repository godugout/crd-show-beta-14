import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTextureLoader } from '../useTextureLoader';

// Mock Three.js TextureLoader
const mockTextureLoader = {
  load: vi.fn(),
  setPath: vi.fn(),
  setCrossOrigin: vi.fn(),
};

vi.mock('three', () => ({
  TextureLoader: vi.fn(() => mockTextureLoader),
  RepeatWrapping: 1000,
  ClampToEdgeWrapping: 1001,
  LinearFilter: 1006,
  LinearMipmapLinearFilter: 1008,
}));

// Mock performance monitoring
vi.mock('../usePerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    startTimer: vi.fn(() => 'timer-id'),
    endTimer: vi.fn(),
    recordMetric: vi.fn(),
    getMetrics: vi.fn(() => ({
      textureLoadTime: 150,
      memoryUsage: 64,
      cacheHitRate: 0.8,
    })),
  }),
}));

describe('useTextureLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTextureLoader.load.mockImplementation((url, onLoad) => {
      const mockTexture = {
        image: { width: 1024, height: 1024 },
        flipY: false,
        wrapS: 1000,
        wrapT: 1000,
        minFilter: 1006,
        magFilter: 1006,
        generateMipmaps: true,
        needsUpdate: true,
      };
      setTimeout(() => onLoad(mockTexture), 10);
      return mockTexture;
    });
  });

  describe('Texture Loading', () => {
    it('should load texture successfully', async () => {
      const { result } = renderHook(() => useTextureLoader());

      let loadedTexture: any;
      await act(async () => {
        loadedTexture = await result.current.loadTexture('test-texture.jpg');
      });

      expect(loadedTexture).toBeDefined();
      expect(loadedTexture.flipY).toBe(false);
      expect(mockTextureLoader.load).toHaveBeenCalledWith(
        'test-texture.jpg',
        expect.any(Function),
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('should handle texture loading errors', async () => {
      const { result } = renderHook(() => useTextureLoader());

      mockTextureLoader.load.mockImplementationOnce(
        (url, onLoad, onProgress, onError) => {
          setTimeout(() => onError(new Error('Network error')), 10);
        }
      );

      await act(async () => {
        await expect(
          result.current.loadTexture('invalid-texture.jpg')
        ).rejects.toThrow('Network error');
      });
    });

    it('should validate supported texture formats', async () => {
      const { result } = renderHook(() => useTextureLoader());

      // Valid formats
      expect(() => result.current.validateFormat('image.jpg')).not.toThrow();
      expect(() => result.current.validateFormat('image.png')).not.toThrow();
      expect(() => result.current.validateFormat('image.exr')).not.toThrow();

      // Invalid formats
      expect(() => result.current.validateFormat('image.gif')).toThrow(
        'Unsupported texture format: gif'
      );
      expect(() => result.current.validateFormat('image.bmp')).toThrow(
        'Unsupported texture format: bmp'
      );
    });
  });

  describe('Texture Caching', () => {
    it('should cache loaded textures', async () => {
      const { result } = renderHook(() => useTextureLoader());

      await act(async () => {
        await result.current.loadTexture('cached-texture.jpg');
      });

      expect(result.current.cache['cached-texture.jpg']).toBeDefined();
      expect(result.current.getCacheSize()).toBe(1);
    });

    it('should return cached texture on subsequent loads', async () => {
      const { result } = renderHook(() => useTextureLoader());

      // First load
      let firstTexture: any;
      await act(async () => {
        firstTexture = await result.current.loadTexture('repeated-texture.jpg');
      });

      // Second load should return cached version
      let secondTexture: any;
      await act(async () => {
        secondTexture = await result.current.loadTexture(
          'repeated-texture.jpg'
        );
      });

      expect(firstTexture).toBe(secondTexture);
      expect(mockTextureLoader.load).toHaveBeenCalledTimes(1); // Only called once
    });

    it('should track cache memory usage', async () => {
      const { result } = renderHook(() => useTextureLoader());

      await act(async () => {
        await result.current.loadTexture('memory-test.jpg');
      });

      const memoryUsage = result.current.getCacheMemoryUsage();
      expect(memoryUsage).toBeGreaterThan(0);
      expect(memoryUsage).toBeLessThan(256 * 1024 * 1024); // Under 256MB limit
    });

    it('should clear cache when memory limit is approached', async () => {
      const { result } = renderHook(() => useTextureLoader());

      // Mock high memory usage
      vi.spyOn(result.current, 'getCacheMemoryUsage').mockReturnValue(
        250 * 1024 * 1024
      );

      await act(async () => {
        result.current.clearCache();
      });

      expect(result.current.getCacheSize()).toBe(0);
      expect(result.current.cache).toEqual({});
    });

    it('should implement LRU eviction strategy', async () => {
      const { result } = renderHook(() =>
        useTextureLoader({ maxCacheSize: 2 })
      );

      await act(async () => {
        await result.current.loadTexture('texture1.jpg');
        await result.current.loadTexture('texture2.jpg');
        await result.current.loadTexture('texture3.jpg'); // Should evict texture1
      });

      expect(result.current.cache['texture1.jpg']).toBeUndefined();
      expect(result.current.cache['texture2.jpg']).toBeDefined();
      expect(result.current.cache['texture3.jpg']).toBeDefined();
    });
  });

  describe('LOD Generation', () => {
    it('should generate LOD levels for textures', async () => {
      const { result } = renderHook(() => useTextureLoader());

      let texture: any;
      await act(async () => {
        texture = await result.current.loadTexture('lod-texture.jpg', {
          generateLOD: true,
        });
      });

      expect(texture.generateMipmaps).toBe(true);
      expect(texture.minFilter).toBe(1008); // LinearMipmapLinearFilter
    });

    it('should create multiple resolution versions', async () => {
      const { result } = renderHook(() => useTextureLoader());

      await act(async () => {
        const lodTextures = await result.current.generateLODTextures(
          'base-texture.jpg',
          [512, 256, 128]
        );
        expect(lodTextures).toHaveLength(3);
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should track texture loading times', async () => {
      const { result } = renderHook(() => useTextureLoader());

      await act(async () => {
        await result.current.loadTexture('perf-texture.jpg');
      });

      expect(
        result.current.getPerformanceMetrics().textureLoadTime
      ).toBeDefined();
    });

    it('should track cache hit rates', async () => {
      const { result } = renderHook(() => useTextureLoader());

      await act(async () => {
        await result.current.loadTexture('hit-rate-texture.jpg');
        await result.current.loadTexture('hit-rate-texture.jpg'); // Cache hit
      });

      const metrics = result.current.getPerformanceMetrics();
      expect(metrics.cacheHitRate).toBeGreaterThan(0);
    });

    it('should monitor memory usage trends', async () => {
      const { result } = renderHook(() => useTextureLoader());

      const initialMemory = result.current.getCacheMemoryUsage();

      await act(async () => {
        await result.current.loadTexture('memory-trend.jpg');
      });

      const finalMemory = result.current.getCacheMemoryUsage();
      expect(finalMemory).toBeGreaterThanOrEqual(initialMemory);
    });
  });

  describe('Texture Configuration', () => {
    it('should apply correct texture settings', async () => {
      const { result } = renderHook(() => useTextureLoader());

      let texture: any;
      await act(async () => {
        texture = await result.current.loadTexture('config-texture.jpg', {
          wrapS: 1000, // RepeatWrapping
          wrapT: 1001, // ClampToEdgeWrapping
          flipY: true,
        });
      });

      expect(texture.wrapS).toBe(1000);
      expect(texture.wrapT).toBe(1001);
      expect(texture.flipY).toBe(true);
    });

    it('should handle texture format optimization', async () => {
      const { result } = renderHook(() => useTextureLoader());

      await act(async () => {
        const optimizedTexture = await result.current.loadTexture(
          'optimize-texture.jpg',
          {
            optimize: true,
          }
        );
        expect(optimizedTexture.generateMipmaps).toBe(true);
      });
    });
  });

  describe('Error Recovery', () => {
    it('should retry failed texture loads', async () => {
      const { result } = renderHook(() =>
        useTextureLoader({ retryAttempts: 2 })
      );

      let callCount = 0;
      mockTextureLoader.load.mockImplementation(
        (url, onLoad, onProgress, onError) => {
          callCount++;
          if (callCount < 2) {
            setTimeout(() => onError(new Error('Temporary failure')), 10);
          } else {
            setTimeout(() => onLoad({ flipY: false }), 10);
          }
        }
      );

      let texture: any;
      await act(async () => {
        texture = await result.current.loadTexture('retry-texture.jpg');
      });

      expect(texture).toBeDefined();
      expect(callCount).toBe(2);
    });

    it('should use fallback textures on permanent failure', async () => {
      const { result } = renderHook(() =>
        useTextureLoader({
          fallbackTexture: 'fallback.jpg',
        })
      );

      mockTextureLoader.load.mockImplementation(
        (url, onLoad, onProgress, onError) => {
          if (url === 'failed-texture.jpg') {
            setTimeout(() => onError(new Error('Permanent failure')), 10);
          } else {
            setTimeout(() => onLoad({ flipY: false, isFallback: true }), 10);
          }
        }
      );

      let texture: any;
      await act(async () => {
        texture = await result.current.loadTexture('failed-texture.jpg');
      });

      expect(texture.isFallback).toBe(true);
    });
  });
});

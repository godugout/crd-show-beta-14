import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePerformanceMonitor } from './usePerformanceMonitor';

export interface TextureLoaderOptions {
  maxCacheSize?: number;
  retryAttempts?: number;
  fallbackTexture?: string;
}

export interface TextureLoadOptions {
  wrapS?: number;
  wrapT?: number;
  flipY?: boolean;
  generateLOD?: boolean;
  optimize?: boolean;
}

export interface TextureCacheEntry {
  texture: THREE.Texture;
  lastAccessed: number;
  memorySize: number;
}

// Supported texture formats
const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'exr', 'hdr'];

// Calculate texture memory usage
const calculateTextureMemory = (texture: THREE.Texture): number => {
  if (!texture.image) return 0;

  const { width, height } = texture.image;
  const bytesPerPixel = texture.format === THREE.RGBAFormat ? 4 : 3;
  return width * height * bytesPerPixel;
};

// LRU cache implementation
class LRUCache<T> {
  private cache = new Map<string, T>();
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const value = this.cache.get(key);
    if (value) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  entries(): IterableIterator<[string, T]> {
    return this.cache.entries();
  }
}

export function useTextureLoader(options: TextureLoaderOptions = {}) {
  const { maxCacheSize = 50, retryAttempts = 3, fallbackTexture } = options;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const cache = useRef(new LRUCache<TextureCacheEntry>(maxCacheSize));
  const performanceMonitor = usePerformanceMonitor();

  // Three.js texture loader
  const loader = useRef(new THREE.TextureLoader());

  // Validate texture format
  const validateFormat = useCallback((url: string): void => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension || !SUPPORTED_FORMATS.includes(extension)) {
      throw new Error(`Unsupported texture format: ${extension}`);
    }
  }, []);

  // Load texture with retry logic
  const loadTextureWithRetry = useCallback(
    async (url: string, attempt: number = 1): Promise<THREE.Texture> => {
      return new Promise((resolve, reject) => {
        loader.current.load(
          url,
          texture => {
            resolve(texture);
          },
          undefined,
          error => {
            if (attempt < retryAttempts) {
              console.warn(
                `Texture load attempt ${attempt} failed, retrying...`,
                error
              );
              setTimeout(() => {
                loadTextureWithRetry(url, attempt + 1)
                  .then(resolve)
                  .catch(reject);
              }, 1000 * attempt); // Exponential backoff
            } else {
              reject(error);
            }
          }
        );
      });
    },
    [retryAttempts]
  );

  // Apply texture configuration
  const configureTexture = useCallback(
    (
      texture: THREE.Texture,
      options: TextureLoadOptions = {}
    ): THREE.Texture => {
      const {
        wrapS = THREE.ClampToEdgeWrapping,
        wrapT = THREE.ClampToEdgeWrapping,
        flipY = false,
        generateLOD = false,
        optimize = false,
      } = options;

      texture.wrapS = wrapS as THREE.Wrapping;
      texture.wrapT = wrapT as THREE.Wrapping;
      texture.flipY = flipY;

      if (generateLOD || optimize) {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
      }

      texture.needsUpdate = true;
      return texture;
    },
    []
  );

  // Main texture loading function
  const loadTexture = useCallback(
    async (
      url: string,
      options: TextureLoadOptions = {}
    ): Promise<THREE.Texture> => {
      // Validate format
      validateFormat(url);

      // Check cache first
      const cacheEntry = cache.current.get(url);
      if (cacheEntry) {
        cacheEntry.lastAccessed = Date.now();
        performanceMonitor.recordMetric('textureCacheHit', 1);
        return cacheEntry.texture;
      }

      setIsLoading(true);
      const timerId = performanceMonitor.startTimer('texture-loading');

      try {
        // Load texture
        const texture = await loadTextureWithRetry(url);

        // Configure texture
        const configuredTexture = configureTexture(texture, options);

        // Calculate memory usage
        const memorySize = calculateTextureMemory(configuredTexture);

        // Cache the texture
        cache.current.set(url, {
          texture: configuredTexture,
          lastAccessed: Date.now(),
          memorySize,
        });

        // Record metrics
        const loadTime = performanceMonitor.endTimer(timerId);
        performanceMonitor.recordMetric('textureLoadTime', loadTime);
        performanceMonitor.recordMetric('textureCacheMiss', 1);

        return configuredTexture;
      } catch (error) {
        performanceMonitor.endTimer(timerId);

        // Try fallback texture if available
        if (fallbackTexture && url !== fallbackTexture) {
          console.warn(`Failed to load texture ${url}, using fallback`, error);
          return loadTexture(fallbackTexture, options);
        }

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      validateFormat,
      loadTextureWithRetry,
      configureTexture,
      performanceMonitor,
      fallbackTexture,
    ]
  );

  // Generate LOD textures
  const generateLODTextures = useCallback(
    async (
      baseUrl: string,
      resolutions: number[]
    ): Promise<THREE.Texture[]> => {
      const lodTextures: THREE.Texture[] = [];

      for (const resolution of resolutions) {
        try {
          // Assuming LOD textures follow naming convention: texture_512.jpg, texture_256.jpg, etc.
          const lodUrl = baseUrl.replace(/(\.[^.]+)$/, `_${resolution}$1`);
          const texture = await loadTexture(lodUrl, { generateLOD: true });
          lodTextures.push(texture);
        } catch (error) {
          console.warn(
            `Failed to load LOD texture at resolution ${resolution}:`,
            error
          );
        }
      }

      return lodTextures;
    },
    [loadTexture]
  );

  // Cache management
  const getCacheSize = useCallback((): number => {
    return cache.current.size();
  }, []);

  const getCacheMemoryUsage = useCallback((): number => {
    let totalMemory = 0;
    const entries = Array.from(cache.current.entries());
    for (const [, entry] of entries) {
      totalMemory += entry.memorySize;
    }
    return totalMemory;
  }, []);

  const clearCache = useCallback((): void => {
    cache.current.clear();
    performanceMonitor.recordMetric('textureCacheCleared', 1);
  }, [performanceMonitor]);

  // Performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return performanceMonitor.getMetrics();
  }, [performanceMonitor]);

  // Expose cache for testing
  const getCacheEntries = useCallback(() => {
    const entries: Record<string, TextureCacheEntry> = {};
    const cacheEntries = Array.from(cache.current.entries());
    for (const [key, value] of cacheEntries) {
      entries[key] = value;
    }
    return entries;
  }, []);

  return {
    // Main functions
    loadTexture,
    generateLODTextures,
    validateFormat,

    // Cache management
    getCacheSize,
    getCacheMemoryUsage,
    clearCache,
    cache: getCacheEntries(),

    // Performance
    getPerformanceMetrics,
    isLoading,
  };
}

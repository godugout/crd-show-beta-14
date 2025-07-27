import { act, renderHook } from '@testing-library/react';
import * as THREE from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePBRMaterial } from '../usePBRMaterial';

// Mock Three.js materials
const mockStandardMaterial = {
  color: { setHex: vi.fn(), copy: vi.fn() },
  metalness: 0,
  roughness: 0.5,
  normalScale: { set: vi.fn() },
  emissive: { setHex: vi.fn(), copy: vi.fn() },
  emissiveIntensity: 0,
  envMapIntensity: 1,
  map: null,
  metalnessMap: null,
  roughnessMap: null,
  normalMap: null,
  emissiveMap: null,
  envMap: null,
  needsUpdate: false,
  dispose: vi.fn(),
};

const mockPhysicalMaterial = {
  ...mockStandardMaterial,
  clearcoat: 0,
  clearcoatRoughness: 0,
  transmission: 0,
  thickness: 0,
  ior: 1.5,
};

vi.mock('three', () => ({
  MeshStandardMaterial: vi.fn(() => mockStandardMaterial),
  MeshPhysicalMaterial: vi.fn(() => mockPhysicalMaterial),
  Color: vi.fn().mockImplementation(color => ({
    r: 1,
    g: 1,
    b: 1,
    setHex: vi.fn(),
    copy: vi.fn(),
    clone: vi.fn(() => ({ r: 1, g: 1, b: 1 })),
  })),
  Vector2: vi.fn().mockImplementation((x = 1, y = 1) => ({
    x,
    y,
    set: vi.fn(),
  })),
  RepeatWrapping: 1000,
  ClampToEdgeWrapping: 1001,
  LinearFilter: 1006,
}));

// Mock material system hook
vi.mock('../useMaterialSystem', () => ({
  useMaterialSystem: () => ({
    currentMaterial: {
      albedo: new THREE.Color(0xffffff),
      metallic: 0.5,
      roughness: 0.3,
      normal: 1.2,
      emission: new THREE.Color(0x000000),
      emissionIntensity: 0,
      envMapIntensity: 1,
    },
    updateMaterialProperty: vi.fn(),
    loadTexture: vi.fn(),
    performanceMetrics: { frameRate: 60 },
  }),
}));

describe('usePBRMaterial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset material properties
    mockStandardMaterial.metalness = 0;
    mockStandardMaterial.roughness = 0.5;
    mockStandardMaterial.emissiveIntensity = 0;
    mockStandardMaterial.envMapIntensity = 1;
    mockStandardMaterial.needsUpdate = false;
  });

  describe('Material Creation', () => {
    it('should create standard PBR material by default', () => {
      const { result } = renderHook(() => usePBRMaterial());

      expect(THREE.MeshStandardMaterial).toHaveBeenCalled();
      expect(result.current.material).toBe(mockStandardMaterial);
      expect(result.current.materialType).toBe('standard');
    });

    it('should create physical material when specified', () => {
      const { result } = renderHook(() =>
        usePBRMaterial({ materialType: 'physical' })
      );

      expect(THREE.MeshPhysicalMaterial).toHaveBeenCalled();
      expect(result.current.material).toBe(mockPhysicalMaterial);
      expect(result.current.materialType).toBe('physical');
    });

    it('should apply initial material properties', () => {
      const { result } = renderHook(() => usePBRMaterial());

      expect(result.current.material.metalness).toBe(0.5);
      expect(result.current.material.roughness).toBe(0.3);
      expect(result.current.material.emissiveIntensity).toBe(0);
      expect(result.current.material.envMapIntensity).toBe(1);
    });
  });

  describe('Material Property Updates', () => {
    it('should update metallic property and trigger material update', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('metallic', 0.8);
      });

      expect(result.current.material.metalness).toBe(0.8);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should update roughness property and trigger material update', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('roughness', 0.2);
      });

      expect(result.current.material.roughness).toBe(0.2);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should update normal scale when normal intensity changes', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('normal', 1.5);
      });

      expect(result.current.material.normalScale.set).toHaveBeenCalledWith(
        1.5,
        1.5
      );
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should update emission properties correctly', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('emissionIntensity', 0.5);
      });

      expect(result.current.material.emissiveIntensity).toBe(0.5);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should update environment map intensity', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('envMapIntensity', 1.2);
      });

      expect(result.current.material.envMapIntensity).toBe(1.2);
      expect(result.current.material.needsUpdate).toBe(true);
    });
  });

  describe('Texture Map Support', () => {
    const mockTexture = {
      wrapS: 1000,
      wrapT: 1000,
      needsUpdate: false,
    };

    it('should apply albedo texture map', async () => {
      const { result } = renderHook(() => usePBRMaterial());

      await act(async () => {
        await result.current.setTextureMap('albedo', mockTexture as any);
      });

      expect(result.current.material.map).toBe(mockTexture);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should apply metallic texture map', async () => {
      const { result } = renderHook(() => usePBRMaterial());

      await act(async () => {
        await result.current.setTextureMap('metallic', mockTexture as any);
      });

      expect(result.current.material.metalnessMap).toBe(mockTexture);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should apply roughness texture map', async () => {
      const { result } = renderHook(() => usePBRMaterial());

      await act(async () => {
        await result.current.setTextureMap('roughness', mockTexture as any);
      });

      expect(result.current.material.roughnessMap).toBe(mockTexture);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should apply normal texture map', async () => {
      const { result } = renderHook(() => usePBRMaterial());

      await act(async () => {
        await result.current.setTextureMap('normal', mockTexture as any);
      });

      expect(result.current.material.normalMap).toBe(mockTexture);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should apply emission texture map', async () => {
      const { result } = renderHook(() => usePBRMaterial());

      await act(async () => {
        await result.current.setTextureMap('emission', mockTexture as any);
      });

      expect(result.current.material.emissiveMap).toBe(mockTexture);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should apply environment texture map', async () => {
      const { result } = renderHook(() => usePBRMaterial());

      await act(async () => {
        await result.current.setTextureMap('environment', mockTexture as any);
      });

      expect(result.current.material.envMap).toBe(mockTexture);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should handle invalid texture map types gracefully', async () => {
      const { result } = renderHook(() => usePBRMaterial());

      await act(async () => {
        await expect(
          result.current.setTextureMap('invalid' as any, mockTexture as any)
        ).rejects.toThrow('Unsupported texture map type: invalid');
      });
    });
  });

  describe('Physical Material Properties', () => {
    it('should support clearcoat properties for physical materials', () => {
      const { result } = renderHook(() =>
        usePBRMaterial({ materialType: 'physical' })
      );

      act(() => {
        result.current.updatePhysicalProperty('clearcoat', 0.8);
      });

      expect((result.current.material as any).clearcoat).toBe(0.8);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should support clearcoat roughness for physical materials', () => {
      const { result } = renderHook(() =>
        usePBRMaterial({ materialType: 'physical' })
      );

      act(() => {
        result.current.updatePhysicalProperty('clearcoatRoughness', 0.3);
      });

      expect((result.current.material as any).clearcoatRoughness).toBe(0.3);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should support transmission for glass-like effects', () => {
      const { result } = renderHook(() =>
        usePBRMaterial({ materialType: 'physical' })
      );

      act(() => {
        result.current.updatePhysicalProperty('transmission', 0.9);
      });

      expect((result.current.material as any).transmission).toBe(0.9);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should support thickness for subsurface scattering', () => {
      const { result } = renderHook(() =>
        usePBRMaterial({ materialType: 'physical' })
      );

      act(() => {
        result.current.updatePhysicalProperty('thickness', 0.5);
      });

      expect((result.current.material as any).thickness).toBe(0.5);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should support IOR (Index of Refraction)', () => {
      const { result } = renderHook(() =>
        usePBRMaterial({ materialType: 'physical' })
      );

      act(() => {
        result.current.updatePhysicalProperty('ior', 1.33); // Water IOR
      });

      expect((result.current.material as any).ior).toBe(1.33);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should not allow physical properties on standard materials', () => {
      const { result } = renderHook(() =>
        usePBRMaterial({ materialType: 'standard' })
      );

      expect(() => {
        act(() => {
          result.current.updatePhysicalProperty('clearcoat', 0.5);
        });
      }).toThrow('Physical properties only available for MeshPhysicalMaterial');
    });
  });

  describe('Real-time Updates', () => {
    it('should batch multiple property updates for performance', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.batchUpdate(() => {
          result.current.updateProperty('metallic', 0.8);
          result.current.updateProperty('roughness', 0.2);
          result.current.updateProperty('envMapIntensity', 1.5);
        });
      });

      expect(result.current.material.metalness).toBe(0.8);
      expect(result.current.material.roughness).toBe(0.2);
      expect(result.current.material.envMapIntensity).toBe(1.5);
      expect(result.current.material.needsUpdate).toBe(true);
    });

    it('should track performance metrics during updates', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('metallic', 0.7);
      });

      expect(result.current.getPerformanceMetrics()).toBeDefined();
      expect(
        result.current.getPerformanceMetrics().updateCount
      ).toBeGreaterThan(0);
    });

    it('should debounce rapid property updates', async () => {
      const { result } = renderHook(() => usePBRMaterial({ debounceMs: 50 }));

      act(() => {
        result.current.updateProperty('metallic', 0.1);
        result.current.updateProperty('metallic', 0.2);
        result.current.updateProperty('metallic', 0.3);
        result.current.updateProperty('metallic', 0.4);
      });

      // Should only apply the last value after debounce
      await new Promise(resolve => setTimeout(resolve, 60));

      expect(result.current.material.metalness).toBe(0.4);
    });
  });

  describe('Material Validation', () => {
    it('should validate metallic values are clamped to 0-1', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('metallic', 1.5);
      });

      expect(result.current.material.metalness).toBe(1); // Clamped to max

      act(() => {
        result.current.updateProperty('metallic', -0.5);
      });

      expect(result.current.material.metalness).toBe(0); // Clamped to min
    });

    it('should validate roughness values are clamped to 0-1', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('roughness', 2.0);
      });

      expect(result.current.material.roughness).toBe(1); // Clamped to max

      act(() => {
        result.current.updateProperty('roughness', -0.2);
      });

      expect(result.current.material.roughness).toBe(0); // Clamped to min
    });

    it('should validate normal intensity is non-negative', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('normal', -0.5);
      });

      expect(result.current.material.normalScale.set).toHaveBeenCalledWith(
        0,
        0
      );
    });

    it('should validate emission intensity is non-negative', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('emissionIntensity', -1.0);
      });

      expect(result.current.material.emissiveIntensity).toBe(0);
    });
  });

  describe('Material Disposal', () => {
    it('should dispose material resources when unmounted', () => {
      const { result, unmount } = renderHook(() => usePBRMaterial());

      unmount();

      expect(result.current.material.dispose).toHaveBeenCalled();
    });

    it('should dispose textures when material is disposed', async () => {
      const { result, unmount } = renderHook(() => usePBRMaterial());
      const mockTexture = { dispose: vi.fn() };

      await act(async () => {
        await result.current.setTextureMap('albedo', mockTexture as any);
      });

      unmount();

      expect(mockTexture.dispose).toHaveBeenCalled();
    });
  });

  describe('Integration with Material System', () => {
    it('should sync with material system state changes', () => {
      const { result } = renderHook(() => usePBRMaterial());

      // Material system state should be reflected in PBR material
      expect(result.current.material.metalness).toBe(0.5);
      expect(result.current.material.roughness).toBe(0.3);
    });

    it('should update material system when PBR properties change', () => {
      const { result } = renderHook(() => usePBRMaterial());

      act(() => {
        result.current.updateProperty('metallic', 0.9);
      });

      // Should trigger update in material system
      expect(result.current.material.metalness).toBe(0.9);
    });
  });
});

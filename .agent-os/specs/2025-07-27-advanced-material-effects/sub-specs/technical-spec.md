# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-07-27-advanced-material-effects/spec.md

> Created: 2025-07-27
> Version: 1.0.0

## Technical Requirements

### Material System Requirements

- **Physically-Based Rendering (PBR)** - Implement standard PBR workflow with albedo, metallic, roughness, normal, and emission maps
- **Material Properties** - Support for metallic values (0-1), roughness values (0-1), normal intensity, and emission strength
- **Texture Support** - Handle 2K resolution textures with automatic LOD generation for performance
- **Real-time Preview** - Material changes must render in real-time with <16ms frame time on desktop

### Lighting System Requirements

- **Dynamic Lighting** - Implement directional, point, and ambient lighting with real-time shadows
- **Environment Mapping** - Support HDRI environment maps for realistic reflections
- **Rim Lighting** - Add rim/edge lighting effects for card silhouettes
- **Ambient Occlusion** - Screen-space ambient occlusion (SSAO) for depth and realism

### Performance Requirements

- **Desktop Performance** - Maintain 60fps (16.67ms frame time) with all effects enabled
- **Mobile Performance** - Maintain 30fps minimum (33.33ms frame time) with quality scaling
- **Memory Usage** - Keep texture memory under 256MB total for all materials
- **Load Times** - Material switching should complete within 200ms

### UI/UX Requirements

- **Material Panel** - Intuitive interface with material preview thumbnails
- **Real-time Sliders** - Immediate visual feedback for material property adjustments
- **Preset System** - One-click application of preset materials with customization options
- **Mobile Touch** - Touch-optimized controls for mobile material editing

## Approach Options

**Option A: Custom Shader Implementation**

- Pros: Full control over rendering pipeline, optimized performance, custom effects
- Cons: High development complexity, maintenance overhead, browser compatibility issues

**Option B: Three.js Standard Materials with Extensions** (Selected)

- Pros: Proven stability, broad browser support, extensive documentation, faster development
- Cons: Limited customization, potential performance overhead, dependency on Three.js updates

**Option C: WebGL2 Direct Implementation**

- Pros: Maximum performance, complete control, no framework dependencies
- Cons: Extremely high complexity, extensive browser testing needed, long development time

**Rationale:** Option B provides the best balance of development speed, stability, and performance. Three.js MeshStandardMaterial and MeshPhysicalMaterial provide excellent PBR support with proven cross-browser compatibility. We can extend with custom shaders for specific effects while maintaining the stable foundation.

## External Dependencies

### Primary Dependencies

- **@react-three/postprocessing** - Post-processing effects for SSAO, bloom, and tone mapping
- **Justification:** Provides optimized post-processing pipeline with minimal performance impact

### Optional Dependencies

- **three-mesh-bvh** - Accelerated raycasting for interactive material selection
- **Justification:** Improves performance for complex card geometries with multiple material zones

### Texture Resources

- **Material Texture Library** - Curated collection of PBR texture sets
- **HDRI Environment Maps** - High-quality environment maps for realistic lighting
- **Justification:** Professional-quality materials require high-quality source textures

## Implementation Architecture

### Component Structure

```
MaterialSystem/
├── MaterialPanel.tsx          // Main UI component
├── MaterialPreview.tsx        // Real-time material preview
├── MaterialSliders.tsx        // Property adjustment controls
├── PresetLibrary.tsx         // Preset material selection
├── hooks/
│   ├── useMaterialSystem.ts  // Material state management
│   ├── useTextureLoader.ts   // Texture loading and caching
│   └── usePerformanceMonitor.ts // Performance tracking
└── shaders/
    ├── cardMaterial.ts       // Custom card material shader
    └── holographicEffect.ts  // Holographic material effect
```

### Material Property Schema

```typescript
interface MaterialProperties {
  albedo: Color;
  metallic: number; // 0-1
  roughness: number; // 0-1
  normal: number; // 0-2 (intensity)
  emission: Color;
  emissionIntensity: number;
  envMapIntensity: number;
}
```

### Performance Optimization Strategy

- **Texture Atlasing** - Combine multiple material textures into atlases
- **LOD System** - Automatic quality reduction based on viewing distance
- **Frustum Culling** - Only render materials for visible cards
- **Shader Variants** - Multiple shader complexity levels for different devices

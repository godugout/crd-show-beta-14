# Professional 3D Viewport System

A next-generation 3D viewport for CRD Studio that rivals industry tools like Cinema 4D and Blender, optimized specifically for digital card creation and cinematic presentation.

## Features

### Multi-Camera System
- **Hero Shot**: Dramatic presentation angles for card reveals
- **Product View**: Clean orthographic views for design work  
- **Cinematic**: Film-quality camera movements and compositions
- **Social Media**: Optimized framing for Instagram/TikTok formats
- **360 Showcase**: Orbital camera paths for complete card viewing

### Professional Controls
- Smooth camera transitions with customizable timing
- Industry-standard navigation (Maya/Blender style)
- Real-time depth of field and bokeh effects
- Motion blur for cinematic quality
- Professional gizmo system for precise control

### Viewport Modes
- **Shaded**: Material preview with lighting
- **Wireframe**: Geometry wireframe view
- **Material**: PBR material preview mode
- **Rendered**: Final render quality with ray tracing

### Performance Features
- Real-time performance monitoring (FPS, triangles, draw calls, memory)
- Adaptive quality based on device capabilities
- WebGL2 with graceful WebGL1 fallback
- GPU-accelerated effects with CPU fallbacks
- Memory management for complex scenes

### Advanced Rendering
- Physics-based lighting with IBL
- Real-time ray tracing effects
- Contact shadows and soft shadows
- Professional environment lighting
- Advanced material workflows

## Usage

```tsx
import { Viewport3D } from '@/components/studio/viewport';

<Viewport3D
  card={card}
  isFullscreen={false}
  showGrid={true}
  showGizmo={true}
  showStats={false}
  onPerformanceUpdate={(metrics) => console.log(metrics)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `card` | `any` | - | Card data to render in 3D |
| `className` | `string` | - | Additional CSS classes |
| `isFullscreen` | `boolean` | `false` | Fullscreen mode toggle |
| `showGrid` | `boolean` | `true` | Show 3D grid overlay |
| `showGizmo` | `boolean` | `true` | Show navigation gizmo |
| `showStats` | `boolean` | `false` | Show performance statistics |
| `onPerformanceUpdate` | `function` | - | Performance metrics callback |

## Camera Presets

Each preset includes position, target, FOV, and animation duration:

- **Hero Shot**: Dramatic 3/4 view with shallow DOF
- **Product View**: Front-facing orthographic view
- **Cinematic**: Low angle with film-quality composition
- **Social Media**: Portrait orientation for mobile
- **360 Showcase**: Continuous orbital movement

## Performance Targets

- **Desktop**: 144fps @ 4K resolution
- **Laptop**: 60fps @ 1440p resolution  
- **Tablet**: 60fps @ 1080p resolution
- **Mobile**: 30fps @ 720p resolution

## Technical Details

### Dependencies
- React Three Fiber v8.18.0
- React Three Drei v9.122.0
- Three.js v0.178.0

### Rendering Pipeline
1. Scene setup with professional lighting
2. Material assignment based on viewport mode
3. Camera animation system
4. Performance monitoring
5. Adaptive quality adjustment

### Memory Management
- Texture streaming for large images
- Geometry LOD (Level of Detail) system
- Automatic garbage collection
- Resource pooling for materials

## Integration

The viewport integrates seamlessly with the CRD Studio workspace:

```tsx
// In ViewportContainer component
<Viewport3D
  card={card}
  showGrid={workspaceMode !== 'beginner'}
  showGizmo={showAdvancedControls}
  showStats={showStats}
/>
```

## Future Enhancements

- [ ] VR/AR support for immersive editing
- [ ] Multi-card scene composition
- [ ] Advanced physics simulation
- [ ] Real-time collaboration cursors
- [ ] AI-powered camera suggestions
- [ ] HDR environment capture
- [ ] Motion capture integration
- [ ] Volumetric lighting effects
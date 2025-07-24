import React, { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Grid,
  GizmoHelper,
  GizmoViewport,
  useGLTF,
  Text,
  Html,
  Stats
} from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Grid3X3, 
  Play, 
  Pause, 
  RotateCcw,
  Eye,
  Zap,
  Settings,
  Maximize,
  Monitor
} from 'lucide-react';

// Types
export interface CameraPreset {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  animationDuration: number;
}

export interface ViewportMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export interface PerformanceMetrics {
  fps: number;
  triangles: number;
  drawCalls: number;
  memoryUsage: number;
}

// Camera Presets
const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'hero',
    name: 'Hero Shot',
    description: 'Dramatic presentation angle',
    position: [3, 2, 4],
    target: [0, 0, 0],
    fov: 45,
    animationDuration: 2
  },
  {
    id: 'product',
    name: 'Product View',
    description: 'Clean orthographic view',
    position: [0, 0, 5],
    target: [0, 0, 0],
    fov: 35,
    animationDuration: 1.5
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Film-quality composition',
    position: [5, 3, 2],
    target: [0, 0, 0],
    fov: 50,
    animationDuration: 3
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Optimized for mobile platforms',
    position: [2, 4, 3],
    target: [0, 0, 0],
    fov: 40,
    animationDuration: 1
  },
  {
    id: 'showcase',
    name: '360 Showcase',
    description: 'Complete card viewing',
    position: [4, 1, 0],
    target: [0, 0, 0],
    fov: 45,
    animationDuration: 8
  }
];

// Viewport Modes
const VIEWPORT_MODES: ViewportMode[] = [
  {
    id: 'shaded',
    name: 'Shaded',
    icon: <Eye className="w-4 h-4" />,
    description: 'Material preview with lighting'
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    icon: <Grid3X3 className="w-4 h-4" />,
    description: 'Geometry wireframe view'
  },
  {
    id: 'material',
    name: 'Material',
    icon: <Zap className="w-4 h-4" />,
    description: 'Material preview mode'
  },
  {
    id: 'rendered',
    name: 'Rendered',
    icon: <Monitor className="w-4 h-4" />,
    description: 'Final render quality'
  }
];

// Card 3D Component
const Card3D: React.FC<{ 
  imageUrl?: string; 
  mode: string;
  isAnimating: boolean;
}> = ({ imageUrl, mode, isAnimating }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load card texture
  useEffect(() => {
    if (imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(imageUrl, (loadedTexture) => {
        loadedTexture.flipY = false;
        setTexture(loadedTexture);
      });
    }
  }, [imageUrl]);

  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current && isAnimating) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Material based on viewport mode
  const getMaterial = useCallback(() => {
    const baseProps = {
      map: texture,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    };

    switch (mode) {
      case 'wireframe':
        return <meshBasicMaterial wireframe color="#00ff00" />;
      case 'material':
        return <meshStandardMaterial {...baseProps} wireframe={false} />;
      case 'rendered':
        return <meshPhysicalMaterial {...baseProps} transmission={0.1} thickness={0.1} />;
      default:
        return <meshStandardMaterial {...baseProps} />;
    }
  }, [texture, mode]);

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[2.5, 3.5, 0.1]} />
      {getMaterial()}
    </mesh>
  );
};

// Animated Camera Component
const AnimatedCamera: React.FC<{
  preset: CameraPreset;
  isAnimating: boolean;
  onAnimationComplete: () => void;
}> = ({ preset, isAnimating, onAnimationComplete }) => {
  const { camera, gl } = useThree();
  const startPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const startTarget = useRef<THREE.Vector3>(new THREE.Vector3());
  const progress = useRef(0);

  useEffect(() => {
    if (isAnimating) {
      startPosition.current.copy(camera.position);
      startTarget.current.copy(new THREE.Vector3(0, 0, 0));
      progress.current = 0;
    }
  }, [isAnimating, camera]);

  useFrame((state, delta) => {
    if (isAnimating && progress.current < 1) {
      progress.current += delta / preset.animationDuration;
      
      if (progress.current >= 1) {
        progress.current = 1;
        onAnimationComplete();
      }

      // Smooth camera animation
      const t = THREE.MathUtils.smoothstep(progress.current, 0, 1);
      
      camera.position.lerpVectors(
        startPosition.current,
        new THREE.Vector3(...preset.position),
        t
      );

      // Handle FOV only for PerspectiveCamera
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, preset.fov, t * 0.1);
        camera.updateProjectionMatrix();
      }
      
      camera.lookAt(...preset.target);
    }
  });

  return null;
};

// Performance Monitor Component
const PerformanceMonitor: React.FC<{
  isVisible: boolean;
  onMetricsUpdate: (metrics: PerformanceMetrics) => void;
}> = ({ isVisible, onMetricsUpdate }) => {
  const { gl } = useThree();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    triangles: 0,
    drawCalls: 0,
    memoryUsage: 0
  });

  useFrame(() => {
    if (isVisible) {
      const info = gl.info;
      const newMetrics = {
        fps: Math.round(1 / (performance.now() - (window as any).lastFrame || 0) * 1000) || 60,
        triangles: info.render.triangles,
        drawCalls: info.render.calls,
        memoryUsage: (info.memory?.geometries || 0) + (info.memory?.textures || 0)
      };
      
      setMetrics(newMetrics);
      onMetricsUpdate(newMetrics);
      (window as any).lastFrame = performance.now();
    }
  });

  if (!isVisible) return null;

  return (
    <Html position={[-3, 2, 0]}>
      <Card className="p-2 bg-background/90 backdrop-blur-sm text-xs">
        <div className="space-y-1">
          <div>FPS: {metrics.fps}</div>
          <div>Triangles: {metrics.triangles.toLocaleString()}</div>
          <div>Draw Calls: {metrics.drawCalls}</div>
          <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
        </div>
      </Card>
    </Html>
  );
};

// Main Viewport Component
interface Viewport3DProps {
  card?: any;
  className?: string;
  isFullscreen?: boolean;
  showGrid?: boolean;
  showGizmo?: boolean;
  showStats?: boolean;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  card,
  className,
  isFullscreen = false,
  showGrid = true,
  showGizmo = true,
  showStats = false,
  onPerformanceUpdate
}) => {
  const [currentPreset, setCurrentPreset] = useState<CameraPreset>(CAMERA_PRESETS[0]);
  const [viewportMode, setViewportMode] = useState('shaded');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCameraAnimating, setIsCameraAnimating] = useState(false);
  const [showPerformance, setShowPerformance] = useState(showStats);

  const handlePresetChange = useCallback((preset: CameraPreset) => {
    setCurrentPreset(preset);
    setIsCameraAnimating(true);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setIsCameraAnimating(false);
  }, []);

  const handlePerformanceUpdate = useCallback((metrics: PerformanceMetrics) => {
    onPerformanceUpdate?.(metrics);
  }, [onPerformanceUpdate]);

  return (
    <div className={cn("relative h-full w-full bg-background", className)}>
      {/* Viewport Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Camera Presets */}
        <Card className="p-3 bg-background/90 backdrop-blur-sm">
          <div className="text-sm font-medium mb-2">Camera Presets</div>
          <div className="flex flex-wrap gap-1">
            {CAMERA_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                variant={currentPreset.id === preset.id ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetChange(preset)}
                disabled={isCameraAnimating}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Viewport Modes */}
        <Card className="p-3 bg-background/90 backdrop-blur-sm">
          <div className="text-sm font-medium mb-2">View Mode</div>
          <div className="flex gap-1">
            {VIEWPORT_MODES.map((mode) => (
              <Button
                key={mode.id}
                variant={viewportMode === mode.id ? "default" : "outline"}
                size="sm"
                onClick={() => setViewportMode(mode.id)}
              >
                {mode.icon}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Viewport Action Controls */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="p-2 bg-background/90 backdrop-blur-sm">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPerformance(!showPerformance)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetChange(CAMERA_PRESETS[0])}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ 
          position: currentPreset.position,
          fov: currentPreset.fov,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Grid */}
          {showGrid && (
            <Grid
              args={[10, 10]}
              position={[0, -2, 0]}
              fadeDistance={30}
              fadeStrength={1}
            />
          )}
          
          {/* Contact Shadows */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
          />
          
          {/* Card 3D Model */}
          <Card3D
            imageUrl={card?.image_url || card?.imageUrl}
            mode={viewportMode}
            isAnimating={isAnimating}
          />
          
          {/* Animated Camera */}
          <AnimatedCamera
            preset={currentPreset}
            isAnimating={isCameraAnimating}
            onAnimationComplete={handleAnimationComplete}
          />
          
          {/* Performance Monitor */}
          <PerformanceMonitor
            isVisible={showPerformance}
            onMetricsUpdate={handlePerformanceUpdate}
          />
          
          {/* Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
            enableZoom={!isCameraAnimating}
            enablePan={!isCameraAnimating}
            enableRotate={!isCameraAnimating}
          />
          
          {/* Gizmo */}
          {showGizmo && (
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport 
                axisColors={['red', 'green', 'blue']}
                labelColor="black"
              />
            </GizmoHelper>
          )}
          
          {/* Development Stats */}
          {process.env.NODE_ENV === 'development' && <Stats />}
        </Suspense>
      </Canvas>
      
      {/* Loading Fallback */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-muted-foreground animate-pulse">
          Loading 3D Viewport...
        </div>
      </div>
    </div>
  );
};

export default Viewport3D;
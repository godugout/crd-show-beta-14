import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { CardData } from '@/types/card';
import {
    ContactShadows,
    Environment,
    OrbitControls,
    Stars,
    useTexture
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import {
    Camera,
    Eye,
    Maximize,
    Minimize,
    Pause,
    Play,
    Sparkles as SparklesIcon,
    Volume2,
    VolumeX
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface EnhancedCardViewer3DProps {
  card: CardData;
  className?: string;
  showControls?: boolean;
  autoRotate?: boolean;
  enableParticles?: boolean;
}

// Particle System Component
const ParticleSystem: React.FC<{ count?: number; color?: string }> = ({ 
  count = 100, 
  color = '#00ff88' 
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>();

  useEffect(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 10;
      pos[i + 1] = (Math.random() - 0.5) * 10;
      pos[i + 2] = (Math.random() - 0.5) * 10;
    }
    positions.current = pos;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current && positions.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current || new Float32Array()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Enhanced Card Mesh with Advanced Effects
const EnhancedCardMesh: React.FC<{ 
  card: CardData; 
  isHovered: boolean;
  isAnimating: boolean;
}> = ({ card, isHovered, isAnimating }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(card.image_url || '/placeholder-card.jpg');
  
  // Card dimensions
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;
  
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Breathing animation
      const breathing = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.position.y = breathing;
      
      // Hover effect
      if (isHovered) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        groupRef.current.scale.setScalar(1.05);
      } else {
        groupRef.current.rotation.y *= 0.95;
        groupRef.current.scale.setScalar(1);
      }
      
      // Animation effects
      if (isAnimating) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      }
    }
  });
  
  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <meshStandardMaterial
          map={texture}
          roughness={card.design_metadata?.effects?.chrome ? 0.1 : 0.3}
          metalness={card.design_metadata?.effects?.chrome ? 0.8 : 0.1}
          emissive={card.design_metadata?.effects?.holographic ? new THREE.Color(0x004444) : new THREE.Color(0x000000)}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Glow effect for holographic cards */}
      {card.design_metadata?.effects?.holographic && (
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[cardWidth + 0.1, cardHeight + 0.1, cardDepth]} />
          <meshBasicMaterial
            color={new THREE.Color(0x00ffff)}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};

// Camera Controller
const CameraController: React.FC<{
  autoRotate: boolean;
  onCameraChange: (position: THREE.Vector3) => void;
}> = ({ autoRotate, onCameraChange }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    if (autoRotate) {
      camera.position.x = Math.sin(Date.now() * 0.001) * 8;
      camera.position.z = Math.cos(Date.now() * 0.001) * 8;
      camera.lookAt(0, 0, 0);
      onCameraChange(camera.position);
    }
  });
  
  return null;
};

export const EnhancedCardViewer3D: React.FC<EnhancedCardViewer3DProps> = ({
  card,
  className = '',
  showControls = true,
  autoRotate = false,
  enableParticles = true
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particleCount, setParticleCount] = useState(50);
  const [cameraPosition, setCameraPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 8));
  const [viewMode, setViewMode] = useState<'normal' | 'cinematic' | 'showcase'>('normal');
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Handle view mode changes
  const handleViewModeChange = useCallback((mode: typeof viewMode) => {
    setViewMode(mode);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  }, []);

  // Environment presets based on view mode
  const getEnvironmentPreset = () => {
    switch (viewMode) {
      case 'cinematic': return 'sunset';
      case 'showcase': return 'dawn';
      default: return 'studio';
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        {/* Environment */}
        <Environment preset={getEnvironmentPreset()} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Stars background for showcase mode */}
        {viewMode === 'showcase' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />}
        
        {/* Particle system */}
        {enableParticles && (
          <ParticleSystem 
            count={particleCount} 
            color={viewMode === 'cinematic' ? '#ff6b6b' : '#00ff88'} 
          />
        )}
        
        {/* Enhanced Card */}
        <EnhancedCardMesh 
          card={card} 
          isHovered={isHovered}
          isAnimating={isAnimating}
        />
        
        {/* Camera Controller */}
        <CameraController 
          autoRotate={autoRotate}
          onCameraChange={setCameraPosition}
        />
        
        {/* Shadows */}
        <ContactShadows
          opacity={0.3}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>

      {/* Overlay Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* View Mode Selector */}
          <div className="flex gap-1 bg-crd-darkest/80 backdrop-blur-sm rounded-lg p-1">
            {(['normal', 'cinematic', 'showcase'] as const).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={viewMode === mode ? "default" : "ghost"}
                onClick={() => handleViewModeChange(mode)}
                className="text-xs px-2 py-1"
              >
                {mode === 'normal' && <Eye className="w-3 h-3" />}
                {mode === 'cinematic' && <Camera className="w-3 h-3" />}
                {mode === 'showcase' && <SparklesIcon className="w-3 h-3" />}
              </Button>
            ))}
          </div>

          {/* Animation Controls */}
          <div className="flex gap-1 bg-crd-darkest/80 backdrop-blur-sm rounded-lg p-1">
            <Button
              size="sm"
              variant={isAnimating ? "default" : "ghost"}
              onClick={() => setIsAnimating(!isAnimating)}
              className="text-xs px-2 py-1"
            >
              {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className="text-xs px-2 py-1"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </Button>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullscreen}
            className="bg-crd-darkest/80 backdrop-blur-sm text-xs px-2 py-1"
          >
            {isFullscreen ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
          </Button>
        </div>
      )}

      {/* Particle Count Slider */}
      {enableParticles && (
        <div className="absolute bottom-4 left-4 bg-crd-darkest/80 backdrop-blur-sm rounded-lg p-3 w-48">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="w-4 h-4 text-crd-green" />
            <span className="text-crd-white text-sm">Particles</span>
          </div>
          <Slider
            value={[particleCount]}
            onValueChange={([value]) => setParticleCount(value)}
            max={200}
            min={10}
            step={10}
            className="w-full"
          />
        </div>
      )}

      {/* Card Info Overlay */}
      <div className="absolute bottom-4 right-4 bg-crd-darkest/80 backdrop-blur-sm rounded-lg p-3 max-w-xs">
        <h3 className="text-crd-white font-medium text-sm mb-1">{card.title}</h3>
        {card.description && (
          <p className="text-crd-lightGray text-xs">{card.description}</p>
        )}
        {card.rarity && (
          <Badge variant="outline" className="mt-2 text-xs">
            {card.rarity}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}; 
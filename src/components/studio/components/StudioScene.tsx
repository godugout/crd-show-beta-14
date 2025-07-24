import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useCameraTexture } from '@/hooks/useCameraTexture';

interface StudioSceneProps {
  backgroundImage?: string;
  convergencePoint: THREE.Vector3;
  showGrid?: boolean;
}

export const StudioScene: React.FC<StudioSceneProps> = ({
  backgroundImage,
  convergencePoint,
  showGrid = true
 }) => {
  // Camera texture for the slab surface
  const { texture: cameraTexture, isActive: cameraActive } = useCameraTexture();
  
  // Use space-themed background image instead of provided one
  const spaceBackgroundUrl = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=2000&q=80';
  const backgroundTexture = useTexture(spaceBackgroundUrl);

  // Create background plane
  const backgroundPlane = useMemo(() => {
    // Always create background with space theme

    // Scale and position the background
    const aspectRatio = backgroundTexture.image.width / backgroundTexture.image.height;
    const planeWidth = 100;
    const planeHeight = planeWidth / aspectRatio;

    return (
      <mesh position={[0, 0, -100]} rotation={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial map={backgroundTexture} side={THREE.DoubleSide} />
      </mesh>
    );
  }, [backgroundTexture]);

  // Create ground plane with camera texture
  const groundPlane = useMemo(() => (
    <mesh position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial
        map={cameraActive && cameraTexture ? cameraTexture : null}
        color={cameraActive && cameraTexture ? 0xffffff : 0x1a1a1a}
        roughness={0.2}
        metalness={0.1}
        transparent={!cameraActive}
        opacity={cameraActive ? 1.0 : 0.3}
      />
    </mesh>
  ), [cameraTexture, cameraActive]);

  // Create grid helper
  const gridHelper = useMemo(() => {
    if (!showGrid) return null;
    
    return (
      <gridHelper
        args={[100, 20, 0x444444, 0x222222]}
        position={[0, -19.9, 0]}
      />
    );
  }, [showGrid]);

  // Convergence point indicator
  const convergenceIndicator = useMemo(() => (
    <group position={convergencePoint.toArray()}>
      {/* Central point */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={0xff4444} transparent opacity={0.6} />
      </mesh>
      
      {/* Convergence lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6}
            array={new Float32Array([
              -5, 0, 0, 5, 0, 0,   // X axis
              0, -5, 0, 0, 5, 0,   // Y axis
              0, 0, -5, 0, 0, 5    // Z axis
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={0xff4444} transparent opacity={0.4} />
      </lineSegments>
    </group>
  ), [convergencePoint]);

  // Atmospheric fog
  const fog = useMemo(() => (
    <fog attach="fog" args={[0x1a1a1a, 50, 200]} />
  ), []);

  return (
    <>
      {/* Scene fog */}
      {fog}

      {/* Background */}
      {backgroundPlane}

      {/* Ground */}
      {groundPlane}

      {/* Grid */}
      {gridHelper}

      {/* Convergence point indicator */}
      {process.env.NODE_ENV === 'development' && convergenceIndicator}

      {/* Ambient particles or atmosphere effects could go here */}
    </>
  );
};

export default StudioScene;
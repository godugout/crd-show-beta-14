import React from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { type LightingPreset, type PathTheme } from '../types/CRDTypes';

interface LightingRigProps {
  preset: LightingPreset;
  pathTheme?: PathTheme;
  intensity?: number;
  enableShadows?: boolean;
}

export const LightingRig: React.FC<LightingRigProps> = ({
  preset,
  pathTheme = 'neutral',
  intensity = 1,
  enableShadows = true
}) => {
  
  // Studio Lighting (Default/Current)
  const StudioLights = () => (
    <>
      {/* HDR Environment */}
      <Environment preset="studio" />
      
      {/* Key Light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={2 * intensity}
        color="#ffffff"
        castShadow={enableShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Rim Light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={1 * intensity}
        color="#87ceeb"
      />
      
      {/* Fill Light */}
      <ambientLight intensity={0.3 * intensity} color="#f0f8ff" />
    </>
  );

  // Dramatic Lighting for showcase mode
  const DramaticLights = () => (
    <>
      <Environment preset="night" />
      
      {/* Strong key light from above */}
      <directionalLight
        position={[0, 15, 8]}
        intensity={3 * intensity}
        color="#ffffff"
        castShadow={enableShadows}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />
      
      {/* Colored rim lights */}
      <directionalLight
        position={[-8, 3, -8]}
        intensity={1.5 * intensity}
        color="#ff6b9d"
      />
      
      <directionalLight
        position={[8, 3, -8]}
        intensity={1.5 * intensity}
        color="#4ecdc4"
      />
      
      {/* Minimal fill */}
      <ambientLight intensity={0.1 * intensity} color="#1a1a2e" />
    </>
  );

  // Soft Lighting for gentle modes
  const SoftLights = () => (
    <>
      <Environment preset="dawn" />
      
      {/* Soft key light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5 * intensity}
        color="#fff8dc"
        castShadow={enableShadows}
      />
      
      {/* Gentle fill */}
      <ambientLight intensity={0.6 * intensity} color="#f5f5dc" />
      
      {/* Subtle rim */}
      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.8 * intensity}
        color="#e6e6fa"
      />
    </>
  );

  // Future: Sports Arena Lighting
  const SportsArenaLights = () => (
    <>
      <Environment preset="warehouse" />
      
      {/* Stadium floodlights */}
      <directionalLight
        position={[0, 20, 0]}
        intensity={4 * intensity}
        color="#ffffff"
        castShadow={enableShadows}
      />
      
      {/* Side spots */}
      <spotLight
        position={[10, 15, 10]}
        intensity={2 * intensity}
        color="#ffffff"
        angle={Math.PI / 4}
        penumbra={0.2}
        castShadow={enableShadows}
      />
      
      <spotLight
        position={[-10, 15, 10]}
        intensity={2 * intensity}
        color="#ffffff"
        angle={Math.PI / 4}
        penumbra={0.2}
        castShadow={enableShadows}
      />
      
      {/* Arena ambience */}
      <ambientLight intensity={0.2 * intensity} color="#f0f0f0" />
    </>
  );

  // Future: Sci-Fi Arcade Lighting  
  const SciFiArcadeLights = () => (
    <>
      <Environment preset="night" />
      
      {/* Neon key light */}
      <directionalLight
        position={[0, 12, 6]}
        intensity={2.5 * intensity}
        color="#00ffff"
        castShadow={enableShadows}
      />
      
      {/* RGB rim lights */}
      <pointLight
        position={[8, 4, 8]}
        intensity={1.5 * intensity}
        color="#ff0080"
        distance={20}
      />
      
      <pointLight
        position={[-8, 4, 8]}
        intensity={1.5 * intensity}
        color="#8000ff"
        distance={20}
      />
      
      {/* Dark ambient for contrast */}
      <ambientLight intensity={0.1 * intensity} color="#0a0a2e" />
    </>
  );

  // Future: Nature Preserve Lighting
  const NaturePreserveLights = () => (
    <>
      <Environment preset="forest" />
      
      {/* Sunlight through trees */}
      <directionalLight
        position={[5, 10, 3]}
        intensity={2 * intensity}
        color="#ffeb3b"
        castShadow={enableShadows}
      />
      
      {/* Scattered forest light */}
      <ambientLight intensity={0.8 * intensity} color="#8bc34a" />
      
      {/* Gentle backlight */}
      <directionalLight
        position={[-3, 5, -5]}
        intensity={0.6 * intensity}
        color="#4caf50"
      />
    </>
  );

  // Select lighting based on preset
  switch (preset) {
    case 'dramatic':
      return <DramaticLights />;
    case 'soft':
      return <SoftLights />;
    case 'sports-arena':
      return <SportsArenaLights />;
    case 'sci-fi-arcade':
      return <SciFiArcadeLights />;
    case 'nature-preserve':
      return <NaturePreserveLights />;
    case 'showcase':
      return <DramaticLights />; // Use dramatic for showcase
    case 'studio':
    default:
      return <StudioLights />;
  }
};
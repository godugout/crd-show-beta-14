import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CardData } from '@/types/card';

interface CardViewer3DProps {
  card: CardData;
  environment?: 'studio' | 'city' | 'sunset' | 'dawn';
  interactive?: boolean;
  autoRotate?: boolean;
}

function CardMesh({ card }: { card: CardData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(card.image_url || '/placeholder-card.jpg');
  
  // Standard trading card dimensions
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Effect-based animations - check design_metadata instead of metadata
      if (card.design_metadata?.effects?.holographic) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });
  
  return (
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
  );
}

export function CardViewer3D({ 
  card, 
  environment = 'studio',
  interactive = true,
  autoRotate = false 
}: CardViewer3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset={environment} />
        <CardMesh card={card} />
        <ContactShadows
          opacity={0.3}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        {interactive && (
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
        )}
      </Canvas>
      
      {/* Effect overlays - check design_metadata */}
      {card.design_metadata?.effects?.holographic && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="holographic-overlay" />
        </div>
      )}
    </div>
  );
}

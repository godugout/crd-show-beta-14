
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MuseumDisplayProps {
  cardDimensions: [number, number, number];
  cardPosition: [number, number, number];
  card: any;
  exploded: boolean;
  layersCount: number;
  autoRotate?: boolean;
  standMaterial?: 'metal' | 'acrylic';
}

export const MuseumDisplay: React.FC<MuseumDisplayProps> = ({
  cardDimensions,
  cardPosition,
  card,
  exploded,
  layersCount,
  autoRotate = true,
  standMaterial = 'metal'
}) => {
  const rotatingGroupRef = useRef<THREE.Group>(null);
  const [cardWidth, cardHeight] = cardDimensions;
  const caseWidth = cardWidth + 0.8;
  const caseHeight = cardHeight + 0.8;
  const caseDepth = 0.8;
  const spacing = exploded ? layersCount * 0.5 : 0;

  useFrame((state) => {
    if (autoRotate && rotatingGroupRef.current && !exploded) {
      rotatingGroupRef.current.rotation.y += 0.005;
      // Add subtle vertical movement
      rotatingGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  const standColor = standMaterial === 'metal' ? '#E5E7EB' : '#ffffff';
  const standMetalness = standMaterial === 'metal' ? 0.9 : 0.1;
  const standRoughness = standMaterial === 'metal' ? 0.1 : 0.05;

  return (
    <group>
      {/* Enhanced Museum Pedestal with multiple tiers */}
      <mesh position={[0, -cardHeight/2 - 0.5, cardPosition[2]]} castShadow receiveShadow>
        <cylinderGeometry args={[Math.max(caseWidth, caseDepth) * 0.7, Math.max(caseWidth, caseDepth) * 0.7, 0.4, 32]} />
        <meshPhysicalMaterial
          color={standColor}
          roughness={standRoughness}
          metalness={standMetalness}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Pedestal Top Ring */}
      <mesh position={[0, -cardHeight/2 - 0.25, cardPosition[2]]} castShadow receiveShadow>
        <cylinderGeometry args={[Math.max(caseWidth, caseDepth) * 0.75, Math.max(caseWidth, caseDepth) * 0.65, 0.1, 32]} />
        <meshPhysicalMaterial
          color={new THREE.Color(standColor).multiplyScalar(1.1)}
          roughness={standRoughness * 0.8}
          metalness={standMetalness}
          clearcoat={1.0}
        />
      </mesh>

      {/* Pedestal Base */}
      <mesh position={[0, -cardHeight/2 - 0.7, cardPosition[2]]} receiveShadow>
        <cylinderGeometry args={[Math.max(caseWidth, caseDepth) * 0.9, Math.max(caseWidth, caseDepth) * 0.9, 0.2, 32]} />
        <meshStandardMaterial
          color={new THREE.Color(standColor).multiplyScalar(0.8)}
          roughness={standRoughness + 0.2}
          metalness={standMetalness * 0.8}
        />
      </mesh>

      <group ref={rotatingGroupRef}>
        {/* Enhanced Glass Display Case with realistic optics */}
        <mesh position={[0, 0, cardPosition[2] + spacing]} castShadow receiveShadow>
          <boxGeometry args={[caseWidth, caseHeight, caseDepth]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.02}
            roughness={0.0}
            metalness={0.0}
            transmission={0.99}
            thickness={0.05}
            ior={1.52}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            reflectivity={0.1}
          />
        </mesh>

        {/* Enhanced Case Frame with detailed edges */}
        <mesh position={[0, caseHeight/2 + 0.03, cardPosition[2] + spacing]} castShadow receiveShadow>
          <boxGeometry args={[caseWidth + 0.1, 0.06, caseDepth + 0.1]} />
          <meshPhysicalMaterial
            color={standColor}
            roughness={standRoughness}
            metalness={standMetalness}
            clearcoat={0.9}
          />
        </mesh>

        {/* Bottom Frame */}
        <mesh position={[0, -caseHeight/2 - 0.03, cardPosition[2] + spacing]} castShadow receiveShadow>
          <boxGeometry args={[caseWidth + 0.1, 0.06, caseDepth + 0.1]} />
          <meshPhysicalMaterial
            color={standColor}
            roughness={standRoughness}
            metalness={standMetalness}
            clearcoat={0.9}
          />
        </mesh>

        {/* Vertical Frame Edges */}
        {[
          [-caseWidth/2 - 0.03, 0, caseDepth/2 + 0.03],
          [caseWidth/2 + 0.03, 0, caseDepth/2 + 0.03],
          [-caseWidth/2 - 0.03, 0, -caseDepth/2 - 0.03],
          [caseWidth/2 + 0.03, 0, -caseDepth/2 - 0.03]
        ].map((position, index) => (
          <mesh key={index} position={[position[0], position[1], cardPosition[2] + spacing + position[2]]}>
            <boxGeometry args={[0.06, caseHeight + 0.12, 0.06]} />
            <meshPhysicalMaterial
              color={standColor}
              roughness={standRoughness}
              metalness={standMetalness}
              clearcoat={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Enhanced Information Placard with realistic materials */}
      <mesh position={[0, -cardHeight/2 - 0.1, cardPosition[2] + caseDepth/2 + 0.12]} castShadow receiveShadow>
        <boxGeometry args={[caseWidth * 0.9, 0.03, 0.2]} />
        <meshPhysicalMaterial
          color="#f8f9fa"
          roughness={0.4}
          metalness={0.05}
          clearcoat={0.3}
        />
      </mesh>

      {/* Placard Border */}
      <mesh position={[0, -cardHeight/2 - 0.1, cardPosition[2] + caseDepth/2 + 0.115]}>
        <boxGeometry args={[caseWidth * 0.95, 0.035, 0.22]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.6} />
      </mesh>

      {/* Museum Lighting Spots */}
      <spotLight
        position={[0, caseHeight + 1, cardPosition[2] + spacing]}
        angle={0.2}
        penumbra={0.5}
        intensity={2}
        color="#ffffff"
        target-position={[0, 0, cardPosition[2] + spacing]}
        castShadow
      />
    </group>
  );
};

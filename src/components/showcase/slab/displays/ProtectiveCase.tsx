
import React from 'react';
import * as THREE from 'three';

interface ProtectiveCaseProps {
  cardDimensions: [number, number, number];
  cardPosition: [number, number, number];
  card: any;
  exploded: boolean;
  layersCount: number;
  caseType: 'top-loader' | 'graded-slab' | 'basic';
  caseColor?: string;
  tint?: string;
  tintOpacity?: number;
  certNumber?: string;
}

export const ProtectiveCase: React.FC<ProtectiveCaseProps> = ({
  cardDimensions,
  cardPosition,
  card,
  exploded,
  layersCount,
  caseType,
  caseColor = '#ffffff',
  tint = '#ffffff',
  tintOpacity = 0.1,
  certNumber
}) => {
  const [cardWidth, cardHeight, cardDepth] = cardDimensions;
  const caseThickness = 0.08;
  const spacing = exploded ? layersCount * 0.5 : 0;

  return (
    <group>
      {/* Enhanced Front Case with better materials */}
      <mesh position={[0, 0, cardPosition[2] + cardDepth/2 + caseThickness + spacing]} castShadow receiveShadow>
        <boxGeometry args={[cardWidth + 0.15, cardHeight + 0.15, caseThickness]} />
        <meshPhysicalMaterial
          color={caseColor}
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          transmission={0.9}
          thickness={caseThickness}
          ior={1.5}
          reflectivity={0.2}
        />
      </mesh>

      {/* Enhanced Back Case */}
      <mesh position={[0, 0, cardPosition[2] - cardDepth/2 - caseThickness - spacing]} castShadow receiveShadow>
        <boxGeometry args={[cardWidth + 0.15, cardHeight + 0.15, caseThickness]} />
        <meshPhysicalMaterial
          color={caseColor}
          roughness={0.1}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Case Edge Frame */}
      <mesh position={[0, 0, cardPosition[2] + spacing]}>
        <boxGeometry args={[cardWidth + 0.18, cardHeight + 0.18, cardDepth + caseThickness * 2 + 0.02]} />
        <meshBasicMaterial
          color="#333333"
          transparent
          opacity={0.8}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Certification Label (for graded slabs) */}
      {caseType === 'graded-slab' && certNumber && (
        <group>
          {/* Label Background */}
          <mesh position={[0, -cardHeight/2 + 0.3, cardPosition[2] + cardDepth/2 + caseThickness + 0.01 + spacing]}>
            <planeGeometry args={[1.2, 0.4]} />
            <meshPhysicalMaterial 
              color="#f8f9fa"
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
          {/* Label Border */}
          <mesh position={[0, -cardHeight/2 + 0.3, cardPosition[2] + cardDepth/2 + caseThickness + 0.015 + spacing]}>
            <planeGeometry args={[1.25, 0.45]} />
            <meshBasicMaterial color="#2c3e50" />
          </mesh>
        </group>
      )}

      {/* Corner Reinforcements */}
      {[
        [-cardWidth/2 - 0.05, cardHeight/2 + 0.05, 0],
        [cardWidth/2 + 0.05, cardHeight/2 + 0.05, 0],
        [-cardWidth/2 - 0.05, -cardHeight/2 - 0.05, 0],
        [cardWidth/2 + 0.05, -cardHeight/2 - 0.05, 0]
      ].map((position, index) => (
        <mesh key={index} position={[position[0], position[1], cardPosition[2] + spacing]}>
          <cylinderGeometry args={[0.02, 0.02, cardDepth + caseThickness * 2]} />
          <meshStandardMaterial color="#666666" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

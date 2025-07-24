
import React from 'react';
import * as THREE from 'three';

interface TrophyPlaqueProps {
  cardDimensions: [number, number, number];
  cardPosition: [number, number, number];
  card: any;
  exploded: boolean;
  layersCount: number;
  woodType?: 'oak' | 'walnut' | 'cherry' | 'mahogany';
  engraving?: string;
}

export const TrophyPlaque: React.FC<TrophyPlaqueProps> = ({
  cardDimensions,
  cardPosition,
  card,
  exploded,
  layersCount,
  woodType = 'walnut',
  engraving = 'PREMIUM COLLECTION'
}) => {
  const [cardWidth, cardHeight] = cardDimensions;
  const baseWidth = cardWidth + 1.2;
  const baseHeight = cardHeight + 1.0;
  const baseThickness = 0.5;
  const spacing = exploded ? layersCount * 0.6 : 0;

  // Enhanced wood colors and materials
  const woodMaterials = {
    oak: { color: '#D2B48C', roughness: 0.7, metalness: 0.1 },
    walnut: { color: '#8B4513', roughness: 0.8, metalness: 0.05 },
    cherry: { color: '#A0522D', roughness: 0.6, metalness: 0.15 },
    mahogany: { color: '#654321', roughness: 0.75, metalness: 0.1 }
  };

  const woodMaterial = woodMaterials[woodType];

  // Define corner positions as proper tuples
  const cornerPositions: [number, number, number][] = [
    [-baseWidth/2 + 0.15, -cardHeight/2 - 0.2, baseHeight/2 - 0.15],
    [baseWidth/2 - 0.15, -cardHeight/2 - 0.2, baseHeight/2 - 0.15],
    [-baseWidth/2 + 0.15, -cardHeight/2 - 0.2, -baseHeight/2 + 0.15],
    [baseWidth/2 - 0.15, -cardHeight/2 - 0.2, -baseHeight/2 + 0.15]
  ];

  return (
    <group>
      {/* Enhanced Wooden Base with grain texture */}
      <mesh position={[0, -cardHeight/2 - 0.4, cardPosition[2] - spacing]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth, baseThickness, baseHeight]} />
        <meshPhysicalMaterial
          color={woodMaterial.color}
          roughness={woodMaterial.roughness}
          metalness={woodMaterial.metalness}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Wood grain detail strips */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            -baseWidth/2 + (i + 1) * (baseWidth/6), 
            -cardHeight/2 - 0.35, 
            cardPosition[2] - spacing + baseHeight/2 - 0.01
          ]} 
          castShadow
        >
          <boxGeometry args={[0.02, baseThickness * 0.8, 0.02]} />
          <meshStandardMaterial
            color={new THREE.Color(woodMaterial.color).multiplyScalar(0.8)}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Enhanced Glass Dome with realistic optics */}
      <mesh position={[0, cardHeight/4, cardPosition[2] + spacing]} castShadow receiveShadow>
        <sphereGeometry args={[Math.max(cardWidth, cardHeight) * 0.65, 64, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          roughness={0.0}
          metalness={0.0}
          transmission={0.98}
          thickness={0.1}
          ior={1.52}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
        />
      </mesh>

      {/* Dome Base Ring */}
      <mesh position={[0, -cardHeight/2 - 0.15, cardPosition[2] + spacing]}>
        <torusGeometry args={[Math.max(cardWidth, cardHeight) * 0.6, 0.05, 16, 100]} />
        <meshPhysicalMaterial
          color="#C0C0C0"
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.8}
        />
      </mesh>

      {/* Enhanced Nameplate with beveled edges */}
      <mesh position={[0, -cardHeight/2 - 0.05, cardPosition[2] + baseHeight/2 + 0.01]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth * 0.7, 0.08, 0.25]} />
        <meshPhysicalMaterial
          color="#FFD700"
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
        />
      </mesh>

      {/* Nameplate Border */}
      <mesh position={[0, -cardHeight/2 - 0.05, cardPosition[2] + baseHeight/2 + 0.005]}>
        <boxGeometry args={[baseWidth * 0.75, 0.1, 0.27]} />
        <meshStandardMaterial color="#B8860B" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Corner Decorations */}
      {cornerPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <octahedronGeometry args={[0.05]} />
          <meshPhysicalMaterial
            color="#CD7F32"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

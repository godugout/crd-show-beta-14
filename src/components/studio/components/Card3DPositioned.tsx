import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/types/card';
import { type CaseStyle, getCaseStyles } from './StudioCaseSelector';

interface Card3DPositionedProps {
  card: CardData;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  isSelected: boolean;
  onClick: () => void;
  onPositionChange?: (position: THREE.Vector3) => void;
  enableDrag?: boolean;
  caseStyle?: CaseStyle;
}

// Standard trading card dimensions (scaled down for 3D scene)
const CARD_WIDTH = 2.5;
const CARD_HEIGHT = 3.5;
const CARD_DEPTH = 0.05;

export const Card3DPositioned: React.FC<Card3DPositionedProps> = ({
  card,
  position,
  rotation,
  scale,
  isSelected,
  onClick,
  onPositionChange,
  enableDrag = false,
  caseStyle = 'none'
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { camera, raycaster, pointer } = useThree();

  // Get safe texture URL - avoid blob URLs for Three.js
  const getTextureUrl = useCallback(() => {
    if (!card.image_url) return 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop';
    
    // If it's a blob URL, it might get invalidated - use thumbnail or fallback
    if (card.image_url.startsWith('blob:')) {
      console.warn('⚠️ Blob URL detected for 3D texture, using fallback:', card.title);
      return card.thumbnail_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop';
    }
    
    return card.image_url;
  }, [card]);

  // Load card texture with blob URL protection
  const texture = useTexture(getTextureUrl(), (texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
  });

  // Animation and effects
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    // Smooth position and rotation transitions
    groupRef.current.position.lerp(position, 0.15);
    groupRef.current.rotation.copy(rotation);
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);

    // Enhanced hover effect - gentle floating with rotation
    if (hovered && !isDragging) {
      const floatY = Math.sin(state.clock.elapsedTime * 2) * 0.15;
      const floatX = Math.cos(state.clock.elapsedTime * 1.5) * 0.05;
      groupRef.current.position.y = position.y + floatY;
      groupRef.current.position.x = position.x + floatX;
      
      // Subtle rotation on hover
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
    }

    // Selected card special effects - enhanced
    if (isSelected) {
      // Dynamic glow effect
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissive) {
        const glowIntensity = 0.15 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
        material.emissiveIntensity = glowIntensity;
      }
      
      // Gentle pulse scale effect
      const pulseMod = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
      groupRef.current.scale.multiplyScalar(pulseMod);
      
      // Enhanced floating for selected card
      const selectedFloat = Math.sin(state.clock.elapsedTime * 1.8) * 0.1;
      groupRef.current.position.y += selectedFloat;
    }
  });

  // Handle click events
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    onClick();
  }, [onClick]);

  // Handle drag events
  const handlePointerDown = useCallback((event: any) => {
    if (!enableDrag) return;
    event.stopPropagation();
    setIsDragging(true);
  }, [enableDrag]);

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (groupRef.current && onPositionChange) {
        onPositionChange(groupRef.current.position);
      }
    }
  }, [isDragging, onPositionChange]);

  // Case-specific material modifications
  const getCaseMaterial = (baseMaterial: THREE.MeshStandardMaterial) => {
    if (caseStyle === 'none') return baseMaterial;
    
    const material = baseMaterial.clone();
    
    switch (caseStyle) {
      case 'penny-sleeve':
        material.transparent = true;
        material.opacity = 0.95;
        break;
      case 'toploader':
        material.roughness = 0.1;
        material.metalness = 0.05;
        break;
      case 'magnetic':
        material.emissive = new THREE.Color(0x004400);
        material.emissiveIntensity = 0.1;
        break;
      case 'graded':
        material.roughness = 0.05;
        material.metalness = 0.1;
        break;
    }
    
    return material;
  };

  // Create materials with enhanced effects and case styling
  const frontMaterial = useMemo(() => {
    const baseMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: isSelected ? 0.05 : 0.25,
      metalness: isSelected ? 0.3 : 0.1,
      emissive: isSelected ? new THREE.Color(0x0066cc) : new THREE.Color(0x000000),
      emissiveIntensity: isSelected ? 0.15 : 0,
      transparent: hovered || isSelected,
      opacity: hovered && !isSelected ? 0.9 : 1.0
    });
    return getCaseMaterial(baseMaterial);
  }, [texture, isSelected, hovered, caseStyle]);

  const backMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isSelected ? 0x2a2a4e : 0x1a1a2e,
    roughness: 0.3,
    metalness: 0.2,
    emissive: isSelected ? new THREE.Color(0x001122) : new THREE.Color(0x000000),
    emissiveIntensity: isSelected ? 0.1 : 0
  }), [isSelected]);

  return (
    <group 
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main Card Mesh */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
        <primitive object={frontMaterial} attach="material" />
      </mesh>

      {/* Enhanced Selection Indicator */}
      {isSelected && (
        <group>
          {/* Outer ring */}
          <mesh position={[0, 0, -0.1]}>
            <ringGeometry args={[CARD_WIDTH * 0.65, CARD_WIDTH * 0.75, 64]} />
            <meshBasicMaterial 
              color={0x0088ff} 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Inner glow ring */}
          <mesh position={[0, 0, -0.08]}>
            <ringGeometry args={[CARD_WIDTH * 0.55, CARD_WIDTH * 0.62, 32]} />
            <meshBasicMaterial 
              color={0x44aaff} 
              transparent 
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Particle-like dots around the card */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = CARD_WIDTH * 0.8;
            return (
              <mesh 
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * radius,
                  0.1
                ]}
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial 
                  color={0x66ccff} 
                  transparent 
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Hover glow effect */}
      {hovered && !isSelected && (
        <mesh position={[0, 0, -0.12]}>
          <ringGeometry args={[CARD_WIDTH * 0.6, CARD_WIDTH * 0.68, 32]} />
          <meshBasicMaterial 
            color={0xffffff} 
            transparent 
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Enhanced Card Info Overlay */}
      {hovered && !isDragging && (
        <Html
          position={[0, CARD_HEIGHT * 0.65, 0]}
          center
          distanceFactor={6}
          occlude
        >
          <div className="bg-gradient-to-r from-black/90 to-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-white/20 shadow-lg">
            <div className="font-semibold text-crd-blue">{card.title}</div>
            {card.rarity && (
              <div className="text-xs text-white/70 mt-1 capitalize">
                {card.rarity} • Click to select
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

export default Card3DPositioned;
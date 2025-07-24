
import React, { useState, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ProtectiveCase } from './slab/displays/ProtectiveCase';
import { TrophyPlaque } from './slab/displays/TrophyPlaque';
import { MuseumDisplay } from './slab/displays/MuseumDisplay';
import type { CardData } from '@/types/card';
import type { SlabPresetConfig } from './SlabPresets';

interface ShowcaseCardProps {
  card: CardData;
  slabConfig: SlabPresetConfig;
  exploded: boolean;
}

// Fallback texture URL for when card images fail to load
const FALLBACK_TEXTURE = '/placeholder.svg';

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  card,
  slabConfig,
  exploded
}) => {
  const [textureError, setTextureError] = useState(false);
  const cardRef = React.useRef<THREE.Group>(null);
  
  // Validate and clean the image URL
  const getValidImageUrl = (url: string | null | undefined): string => {
    if (!url) return FALLBACK_TEXTURE;
    
    // Check if it's a blob URL that might be invalid
    if (url.startsWith('blob:')) {
      console.warn('Blob URL detected, may cause loading issues:', url);
      return FALLBACK_TEXTURE;
    }
    
    // Check if it's a valid HTTP/HTTPS URL
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }
    
    // If none of the above, use fallback
    return FALLBACK_TEXTURE;
  };

  const imageUrl = getValidImageUrl(card.image_url);
  
  let texture;
  try {
    texture = useTexture(textureError ? FALLBACK_TEXTURE : imageUrl);
  } catch (error) {
    console.error('Failed to load texture:', error);
    texture = useTexture(FALLBACK_TEXTURE);
  }

  // Handle texture loading errors
  React.useEffect(() => {
    if (texture) {
      texture.onError = () => {
        console.error('Texture loading failed for:', imageUrl);
        setTextureError(true);
      };
      // Enhance texture quality
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    }
  }, [texture, imageUrl]);

  // Add subtle floating animation
  useFrame((state) => {
    if (cardRef.current && slabConfig.type === 'museum') {
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  // Standard trading card dimensions - enhanced for better proportions
  const cardDimensions: [number, number, number] = [2.5, 3.5, 0.03];
  const cardPosition: [number, number, number] = [0, 0, 0];

  // Enhanced card material
  const cardMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: texture,
    roughness: 0.1,
    metalness: 0.05,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1,
    reflectivity: 0.8,
    side: THREE.DoubleSide,
    transparent: false,
  }), [texture]);

  // Create enhanced card mesh
  const CardMesh = () => (
    <group ref={cardRef}>
      <mesh position={cardPosition} castShadow receiveShadow>
        <boxGeometry args={cardDimensions} />
        <primitive object={cardMaterial} />
      </mesh>
      
      {/* Card edge highlight */}
      <mesh position={cardPosition}>
        <boxGeometry args={[cardDimensions[0] + 0.01, cardDimensions[1] + 0.01, cardDimensions[2]]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );

  // Render appropriate display based on slab config
  const renderDisplay = () => {
    switch (slabConfig.type) {
      case 'toploader':
      case 'onestouch':
      case 'graded':
        return (
          <ProtectiveCase
            cardDimensions={cardDimensions}
            cardPosition={cardPosition}
            card={card}
            exploded={exploded}
            layersCount={0}
            caseType={slabConfig.type === 'toploader' ? 'top-loader' : slabConfig.type === 'graded' ? 'graded-slab' : 'basic'}
            caseColor={slabConfig.caseColor || '#000000'}
            tint={slabConfig.tint}
            tintOpacity={slabConfig.tintOpacity}
            certNumber={slabConfig.certNumber}
          />
        );
      
      case 'trophy':
        return (
          <TrophyPlaque
            cardDimensions={cardDimensions}
            cardPosition={cardPosition}
            card={card}
            exploded={exploded}
            layersCount={0}
            woodType={slabConfig.woodType}
            engraving={slabConfig.engraving}
          />
        );
      
      case 'museum':
        return (
          <MuseumDisplay
            cardDimensions={cardDimensions}
            cardPosition={cardPosition}
            card={card}
            exploded={exploded}
            layersCount={0}
            autoRotate={slabConfig.autoRotate}
            standMaterial={slabConfig.standMaterial}
          />
        );
      
      default:
        return <CardMesh />;
    }
  };

  return (
    <group>
      {renderDisplay()}
    </group>
  );
};

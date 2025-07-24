import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import type { CRDVisualStyle } from '@/types/premiumVisualStyles';
import type { CardData } from '@/types/card';

interface PremiumStyleRendererProps {
  card: CardData;
  style: CRDVisualStyle;
  width: number;
  height: number;
  interactive?: boolean;
  showEnvironment?: boolean;
  className?: string;
}

interface StyleMaterialProps {
  style: CRDVisualStyle;
  texture: THREE.Texture;
  time: number;
}

const StyleMaterial: React.FC<StyleMaterialProps> = ({ style, texture, time }) => {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Create material based on style configuration
  const materialProps = useMemo(() => {
    const { baseMaterial, textureProfile } = style;
    
    const props: any = {
      map: texture,
      roughness: baseMaterial.roughness,
      metalness: baseMaterial.metalness,
      transparent: baseMaterial.transmission ? true : false,
      transmission: baseMaterial.transmission || 0,
      thickness: baseMaterial.transmission ? 0.5 : 0,
      ior: 1.5,
      reflectivity: baseMaterial.reflectivity || 0.5,
      clearcoat: textureProfile.chrome ? 1.0 : 0.3,
      clearcoatRoughness: textureProfile.chrome ? 0.02 : 0.1,
    };

    // Iridescence for holographic effects
    if (baseMaterial.iridescence) {
      props.iridescence = baseMaterial.iridescence;
      props.iridescenceIOR = 1.3;
      props.iridescenceThicknessRange = [100, 800];
    }

    return props;
  }, [style, texture]);

  // Animate material properties
  useFrame(() => {
    if (!materialRef.current) return;

    const { animationProfile, textureProfile } = style;
    
    if (animationProfile) {
      const { speed = 1, amplitude = 0.1 } = animationProfile;
      
      // Shimmer effect for holographic styles
      if (textureProfile.holographic) {
        const shimmer = Math.sin(time * speed * 2) * amplitude;
        materialRef.current.iridescence = (style.baseMaterial.iridescence || 0) + shimmer;
      }
      
      // Flowing effects for liquid/wave styles
      if (textureProfile.waves && materialRef.current.normalMap) {
        materialRef.current.normalScale = new THREE.Vector2(
          1 + Math.sin(time * speed) * amplitude,
          1 + Math.cos(time * speed * 0.7) * amplitude
        );
      }
    }
  });

  return <meshPhysicalMaterial ref={materialRef} {...materialProps} />;
};

interface CardMeshProps {
  card: CardData;
  style: CRDVisualStyle;
}

const CardMesh: React.FC<CardMeshProps> = ({ card, style }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { clock } = useThree();
  
  // Load card texture with fallback
  const texture = useTexture(card.image_url || '/placeholder.svg');
  
  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    }
  }, [texture]);

  // Particle effects for premium styles
  const particleEffect = useMemo(() => {
    if (!style.particleEffect) return null;

    const { count = 50, intensity = 1.0 } = style.particleEffect;
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      particles.push(
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 4,
            Math.random() * 0.5
          ]}
        >
          <sphereGeometry args={[0.005 * intensity, 8, 8]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.6 * intensity}
          />
        </mesh>
      );
    }
    
    return particles;
  }, [style.particleEffect]);

  // Card dimensions (standard trading card ratio)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.03;

  return (
    <group ref={meshRef}>
      {/* Main card */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        <StyleMaterial 
          style={style} 
          texture={texture} 
          time={clock.getElapsedTime()} 
        />
      </mesh>
      
      {/* Card edge highlight */}
      <mesh>
        <boxGeometry args={[cardWidth + 0.01, cardHeight + 0.01, cardThickness]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Particle effects */}
      {particleEffect}
    </group>
  );
};

export const PremiumStyleRenderer: React.FC<PremiumStyleRendererProps> = ({
  card,
  style,
  width,
  height,
  interactive = true,
  showEnvironment = true,
  className = ""
}) => {
  // Environment configuration based on lighting preset
  const environmentConfig = useMemo(() => {
    const { lightingPreset } = style;
    
    switch (lightingPreset.type) {
      case 'studio_hdr':
        return { preset: 'studio' as const, intensity: lightingPreset.intensity };
      case 'cool_backlit':
        return { preset: 'dawn' as const, intensity: lightingPreset.intensity };
      case 'warm_studio':
        return { preset: 'sunset' as const, intensity: lightingPreset.intensity };
      default:
        return { preset: 'city' as const, intensity: lightingPreset.intensity || 1.0 };
    }
  }, [style.lightingPreset]);

  // Performance optimization based on style budget
  const performanceSettings = useMemo(() => {
    const { performanceBudget } = style;
    
    return {
      antialias: performanceBudget.renderPasses > 1,
      powerPreference: 'high-performance' as const,
      alpha: true,
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: false
    };
  }, [style.performanceBudget]);

  return (
    <div className={className} style={{ width, height }}>
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={performanceSettings}
        shadows={style.performanceBudget.renderPasses > 1}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4 * environmentConfig.intensity} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8 * environmentConfig.intensity}
          castShadow={style.performanceBudget.renderPasses > 1}
        />
        
        {/* Environment */}
        {showEnvironment && (
          <Environment 
            preset={environmentConfig.preset}
            backgroundIntensity={0.3}
            environmentIntensity={environmentConfig.intensity}
          />
        )}
        
        {/* Card with premium style */}
        <CardMesh card={card} style={style} />
        
        {/* Contact shadows for realism */}
        {style.performanceBudget.renderPasses > 1 && (
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.4}
            scale={10}
            blur={1.5}
            far={1.8}
          />
        )}
      </Canvas>
    </div>
  );
};
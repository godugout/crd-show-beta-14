import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MonolithMaterialProps {
  intensity?: number;
  animationProgress?: number;
}

export const MonolithMaterial: React.FC<MonolithMaterialProps> = ({ 
  intensity = 1,
  animationProgress = 0 
}) => {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Enhanced monolith material inspired by 2001: A Space Odyssey
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0a0a0a), // Deep black base
      metalness: 0.9, // Highly metallic
      roughness: 0.05, // Very smooth for reflections
      clearcoat: 1.0, // Maximum clearcoat for depth
      clearcoatRoughness: 0.02, // Smooth clearcoat
      reflectivity: 1.0, // Maximum reflectivity
      envMapIntensity: 2.5, // Strong environment reflections
      transmission: 0.1, // Slight transparency for depth
      thickness: 1.0, // Thickness for transmission
      ior: 2.4, // High index of refraction for diamond-like properties
      sheen: 1.0, // Fabric-like sheen on edges
      sheenColor: new THREE.Color(0x111111), // Dark sheen
      iridescence: 0.8, // Iridescent effects
      iridescenceIOR: 2.5, // Strong iridescence
      iridescenceThicknessRange: [100, 800], // Thickness variation
      // Advanced properties for 2001-like appearance
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1.0,
      depthWrite: true,
      depthTest: true,
    });
  }, []);

  // Animate material properties during flight
  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime;
      
      // Breathing glow effect
      const glowPulse = Math.sin(time * 2) * 0.5 + 0.5;
      
      // Enhanced during animation
      const animationMultiplier = 1 + animationProgress * 2;
      
      // Animate iridescence for mystical effect
      materialRef.current.iridescence = (0.8 + glowPulse * 0.2) * intensity * animationMultiplier;
      
      // Animate clearcoat for depth changes
      materialRef.current.clearcoat = (1.0 + glowPulse * 0.3) * intensity;
      
      // Animate environment reflection intensity
      materialRef.current.envMapIntensity = (2.5 + glowPulse * 1.5) * intensity * animationMultiplier;
      
      // Subtle color shift during flight
      if (animationProgress > 0) {
        const flightColor = new THREE.Color().lerpColors(
          new THREE.Color(0x0a0a0a), // Dark base
          new THREE.Color(0x1a1a2e), // Slight blue tint during flight
          animationProgress * 0.3
        );
        materialRef.current.color.copy(flightColor);
      }
      
      // Add subtle emissive glow during peak animation
      if (animationProgress > 0.7) {
        const emissiveIntensity = (animationProgress - 0.7) * 0.3 * glowPulse;
        materialRef.current.emissive.setRGB(emissiveIntensity * 0.1, emissiveIntensity * 0.1, emissiveIntensity * 0.2);
      } else {
        materialRef.current.emissive.setRGB(0, 0, 0);
      }
    }
  });

  return <primitive ref={materialRef} object={material} />;
};
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicClusterProps {
  visible: boolean;
  intensity?: number;
}

const vertexShader = `
  attribute float alpha;
  attribute float size;
  attribute float phase;
  attribute vec3 velocity;
  
  varying float vAlpha;
  varying vec3 vColor;
  varying float vDistance;
  
  uniform float time;
  uniform vec3 nebulaColor1;
  uniform vec3 nebulaColor2;
  uniform vec3 nebulaColor3;
  uniform float intensity;
  
  void main() {
    // Calculate particle movement with slow drift
    vec3 animatedPosition = position + velocity * time * 0.05;
    
    // Add gentle pulsing motion
    float pulse = sin(time * 0.5 + phase) * 0.1;
    animatedPosition += normalize(position) * pulse;
    
    // Calculate distance for color variation
    float distanceFromCenter = length(position) / 50.0;
    vDistance = distanceFromCenter;
    
    // Create color gradient based on position and distance
    float colorMix1 = (sin(animatedPosition.x * 0.01 + time * 0.1) + 1.0) * 0.5;
    float colorMix2 = (sin(animatedPosition.z * 0.01 + time * 0.08) + 1.0) * 0.5;
    
    // Mix nebula colors based on position
    vec3 baseColor = mix(nebulaColor1, nebulaColor2, colorMix1);
    baseColor = mix(baseColor, nebulaColor3, colorMix2 * 0.6);
    
    // Add distance-based color variation
    baseColor = mix(baseColor, nebulaColor3, distanceFromCenter * 0.4);
    
    vColor = baseColor;
    vAlpha = alpha * intensity * (1.0 - distanceFromCenter * 0.5);
    
    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Larger particles that fade based on distance
    float finalSize = size * (2.0 - distanceFromCenter) * intensity;
    gl_PointSize = finalSize * (400.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  varying float vDistance;
  
  void main() {
    // Create soft, gaseous particles with smoother edges
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    // Soft falloff instead of hard cutoff
    if (dist > 0.5) discard;
    
    // Multiple smooth gradient layers for realistic nebula effect
    float smoothDist = smoothstep(0.5, 0.0, dist);
    float innerGlow = pow(smoothDist, 0.5); // Very soft inner glow
    float midGlow = pow(smoothDist, 1.5) * 0.4; // Medium glow
    float outerGlow = pow(smoothDist, 3.0) * 0.15; // Subtle outer edge
    
    // Combine glows with smooth transitions
    float finalAlpha = vAlpha * (innerGlow * 0.2 + midGlow + outerGlow);
    
    // Add subtle noise-like variation for organic feel
    float noise = sin(dist * 20.0) * 0.05 + 1.0;
    finalAlpha *= noise;
    
    // Distance-based brightness with smooth falloff
    finalAlpha *= smoothstep(1.0, 0.2, vDistance);
    
    // Gradual color mixing for smooth transitions
    vec3 finalColor = vColor;
    
    // Add subtle color variation based on particle center distance
    float colorShift = smoothstep(0.5, 0.0, dist);
    finalColor = mix(finalColor, finalColor * 1.3, colorShift * 0.3); // Brighter center
    
    // Add atmospheric scattering effect
    finalColor += vec3(0.05, 0.03, 0.1) * (1.0 - vDistance) * colorShift;
    
    // Reduce overall opacity for subtlety
    finalAlpha *= 0.6;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

export const CosmicCluster: React.FC<CosmicClusterProps> = ({
  visible,
  intensity = 1.0
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Create cosmic particle geometry
  const { geometry, particleCount } = useMemo(() => {
    const count = 2000; // Dense particle field
    const geo = new THREE.BufferGeometry();
    
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create irregular cluster distribution
      const radius = Math.random() * 80 + 20;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      
      // Cluster density - more particles toward center
      const clusterFactor = Math.pow(Math.random(), 1.5);
      const finalRadius = radius * clusterFactor;
      
      positions[i * 3] = Math.sin(theta) * Math.cos(phi) * finalRadius;
      positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * finalRadius;
      positions[i * 3 + 2] = Math.cos(theta) * finalRadius - 50; // Behind card but closer
      
      // Varying particle properties for smooth blending
      alphas[i] = Math.random() * 0.4 + 0.1; // Lower alpha for subtlety
      sizes[i] = Math.random() * 40 + 20; // Larger, softer particles
      phases[i] = Math.random() * Math.PI * 2;
      
      // Slow drift velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    return { geometry: geo, particleCount: count };
  }, []);

  // Cosmic nebula material with realistic colors
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        nebulaColor1: { value: new THREE.Color('#6366f1') }, // Brighter blue
        nebulaColor2: { value: new THREE.Color('#8b5cf6') }, // Brighter purple  
        nebulaColor3: { value: new THREE.Color('#f59e0b') }, // Bright orange/gold
        intensity: { value: intensity }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false
    });
  }, [intensity]);

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;
    
    // Update time for particle animation
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.intensity.value = visible ? intensity : 0;
  });

  return (
    <group visible={visible}>
      <points ref={particlesRef} geometry={geometry} material={material}>
        <primitive object={material} ref={materialRef} attach="material" />
      </points>
    </group>
  );
};
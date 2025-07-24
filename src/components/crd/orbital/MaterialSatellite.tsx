import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSystem } from '../materials/MaterialSystem';
import { type CRDVisualStyle } from '../styles/StyleRegistry';

// Shader for dust particles
const particleVertexShader = `
  attribute float size;
  attribute float phase;
  attribute float speed;
  attribute float isSparkle;
  attribute float orbitRadius;
  attribute float orbitTiltX;
  attribute float orbitTiltZ;
  attribute float orbitEccentricity;
  
  uniform float time;
  uniform float hover;
  uniform vec3 selectedColor;
  
  varying vec3 vColor;
  varying float vOpacity;
  varying float vIsSparkle;
  
  // Function to create a rotation matrix around X axis
  mat3 rotateX(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
      1.0, 0.0, 0.0,
      0.0, c, -s,
      0.0, s, c
    );
  }
  
  // Function to create a rotation matrix around Z axis
  mat3 rotateZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
      c, -s, 0.0,
      s, c, 0.0,
      0.0, 0.0, 1.0
    );
  }
  
  void main() {
    // Use selected color for particles when active/hovered, original color otherwise
    vColor = isSparkle > 0.5 ? vec3(1.0, 1.0, 1.0) : mix(color, selectedColor, hover);
    vIsSparkle = isSparkle;
    
    // Particle movement with Saturn-like rings
    float localTime = time * speed + phase;
    
    // Base orbital position - flat circular orbit
    float angle = localTime * 0.8;
    
    // Calculate orbital position with eccentricity (more elliptical when higher)
    float eccFactor = 1.0 - orbitEccentricity * 0.2;
    float xRadius = orbitRadius;
    float zRadius = orbitRadius * eccFactor;
    
    // Base orbital position
    vec3 orbitalPos = vec3(
      cos(angle) * xRadius,
      0.0,
      sin(angle) * zRadius
     );
     
     // Apply random orbital tilts (both X and Z axis for full randomization)
     orbitalPos = rotateX(orbitTiltX) * orbitalPos;
     orbitalPos = rotateZ(orbitTiltZ) * orbitalPos;
    
    // Add some vertical wobble based on the orbit's natural oscillation
    float verticalWobble = sin(angle * 2.0 + phase) * 0.01 * hover;
    orbitalPos.y += verticalWobble;
    
    // Sparkle behavior - more pronounced movement
    if (isSparkle > 0.5) {
      // Sparkles have more irregular orbits
      orbitalPos += vec3(
        sin(localTime * 3.0) * 0.03 * hover,
        cos(localTime * 2.0) * 0.05 * hover,
        sin(localTime * 4.0) * 0.03 * hover
      );
    }
    
    // Final position
    vec3 pos = position + orbitalPos;
    
    // Apply hover intensity to size - smaller for dust, larger for sparkles
    float dynamicSize = isSparkle > 0.5 
      ? size * (1.5 + hover * 1.5 + sin(localTime * 15.0) * 0.5) // Pulsing sparkles
      : size * (1.0 + hover * 0.3); // Smaller, finer dust
    
    // Calculate opacity based on hover and spiral effect
    vOpacity = isSparkle > 0.5
      ? (0.3 + 0.7 * hover) * (0.2 + 0.8 * pow(sin(localTime * 8.0) * 0.5 + 0.5, 2.0)) // Twinkling sparkles
      : (0.2 + 0.8 * hover) * (0.5 + 0.5 * sin(localTime * 2.0)); // Gentle dust pulsing
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = dynamicSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  uniform sampler2D particleTexture;
  uniform float time;
  
  varying vec3 vColor;
  varying float vOpacity;
  varying float vIsSparkle;
  
  void main() {
    // Soft particle look
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    vec4 texColor = texture2D(particleTexture, uv);
    
    vec3 finalColor = vColor;
    float alpha = texColor.a * vOpacity;
    
    // Special treatment for sparkles
    if (vIsSparkle > 0.5) {
      // Create a twinkling star effect
      float twinkle = pow(texColor.r, 3.0);
      
      // Sharper center for sparkles
      alpha = pow(alpha, 0.7);
      
      // Add rainbow tint to sparkles
      float rainbowPhase = time * 0.5;
      vec3 rainbow;
      rainbow.r = 0.8 + 0.2 * sin(rainbowPhase);
      rainbow.g = 0.8 + 0.2 * sin(rainbowPhase + 2.0);
      rainbow.b = 0.8 + 0.2 * sin(rainbowPhase + 4.0);
      
      finalColor = mix(finalColor, rainbow, 0.3) * (0.8 + 0.2 * twinkle);
    } else {
      // Soften the regular dust particles
      alpha = smoothstep(0.0, 0.8, alpha);
    }
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface MaterialSatelliteProps {
  position: THREE.Vector3;
  style: CRDVisualStyle;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export const MaterialSatellite: React.FC<MaterialSatelliteProps> = ({
  position,
  style,
  isActive,
  isHovered,
  onClick,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const hoverIntensity = useRef(0);
  
  // Generate particle texture - a soft cloud-like particle
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Draw a soft gradient circle
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  // Create particle system
  const [particles, particlesMaterial] = useMemo(() => {
    // Extract color from style gradient
    const extractColorFromGradient = (gradientStr: string): string => {
      const colorMatch = gradientStr.match(/#[0-9a-fA-F]{6}/);
      return colorMatch ? colorMatch[0] : '#4169e1'; // Default blue fallback
    };
    const styleColor = new THREE.Color(extractColorFromGradient(style.uiPreviewGradient));
    
    // Smaller, finer particles with some sparkles
    const regularParticleCount = isActive ? 120 : 80;
    const sparkleCount = isActive ? 20 : 10;
    const totalParticleCount = regularParticleCount + sparkleCount;
    
    // Create geometry with custom attributes
    const geometry = new THREE.BufferGeometry();
    
    // Particle positions - initially scattered in a sphere
    const positions = new Float32Array(totalParticleCount * 3);
    const colors = new Float32Array(totalParticleCount * 3);
    const sizes = new Float32Array(totalParticleCount);
    const phases = new Float32Array(totalParticleCount);
    const speeds = new Float32Array(totalParticleCount);
    const isSparkle = new Float32Array(totalParticleCount);
    const orbitRadius = new Float32Array(totalParticleCount);
    const orbitTiltX = new Float32Array(totalParticleCount);
    const orbitTiltZ = new Float32Array(totalParticleCount);
    const orbitEccentricity = new Float32Array(totalParticleCount);
    
    
    // Generate random ring orientations for each satellite (so they're not all equatorial)
    const randomAxisTiltX = Math.random() * Math.PI * 0.6 - Math.PI * 0.3; // -54° to +54°
    const randomAxisTiltZ = Math.random() * Math.PI * 0.6 - Math.PI * 0.3; // -54° to +54°
    
    // Initialize regular dust particles - organize them into Saturn-like rings
    for (let i = 0; i < regularParticleCount; i++) {
      // Define 3-4 distinct rings with different properties
      const ringIndex = Math.floor(i / (regularParticleCount / 3));
      
      // Ring properties - each ring has different parameters but shares the random axis
      const ringProps = [
        { minRadius: 0.18, maxRadius: 0.22, baseTiltX: randomAxisTiltX, baseTiltZ: randomAxisTiltZ, density: 0.8 },  // Inner dense ring
        { minRadius: 0.25, maxRadius: 0.32, baseTiltX: randomAxisTiltX + 0.02, baseTiltZ: randomAxisTiltZ + 0.02, density: 0.5 }, // Middle ring
        { minRadius: 0.35, maxRadius: 0.45, baseTiltX: randomAxisTiltX + 0.04, baseTiltZ: randomAxisTiltZ + 0.04, density: 0.3 }  // Outer sparse ring
      ][ringIndex];
      
      // Calculate orbital parameters for Saturn-like rings with random orientation
      const ringRadius = ringProps.minRadius + Math.random() * (ringProps.maxRadius - ringProps.minRadius);
      const ringTiltX = ringProps.baseTiltX + Math.random() * 0.05 - 0.025; // Slight variation in tilt
      const ringTiltZ = ringProps.baseTiltZ + Math.random() * 0.05 - 0.025; // Slight variation in tilt
      
      // Particles distributed around the circle of the ring
      const angleOnRing = (i % (regularParticleCount / 3)) / (regularParticleCount / 3) * Math.PI * 2;
      
      // Add slight randomness for natural look, more concentrated near the ring center
      const radialDeviation = (Math.random() - 0.5) * 0.03;
      const finalRadius = ringRadius + radialDeviation;
      
      // Start particles already in their orbital positions (they'll animate around these paths)
      positions[i * 3] = Math.cos(angleOnRing) * finalRadius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.02; // Very small vertical scatter
      positions[i * 3 + 2] = Math.sin(angleOnRing) * finalRadius;
      
      // Store orbit parameters for the shader
      orbitRadius[i] = finalRadius;
      orbitTiltX[i] = ringTiltX;
      orbitTiltZ[i] = ringTiltZ;
      orbitEccentricity[i] = Math.random() * 0.2; // Slight eccentricity for elliptical orbits
      
      // Color variance based on ring position - inner rings slightly different color
      const ringColorVar = 0.08;
      const ringColorShift = (ringIndex - 1) * 0.04; // Subtle color shift between rings
      const r = Math.max(0, Math.min(1, styleColor.r + ringColorShift + (Math.random() - 0.5) * ringColorVar));
      const g = Math.max(0, Math.min(1, styleColor.g + ringColorShift + (Math.random() - 0.5) * ringColorVar));
      const b = Math.max(0, Math.min(1, styleColor.b + ringColorShift + (Math.random() - 0.5) * ringColorVar));
      
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
      
      // Particle size varies by ring - inner rings have smaller, denser particles
      sizes[i] = 0.015 + Math.random() * 0.03 * (1 + ringIndex * 0.5);
      phases[i] = Math.random() * Math.PI * 2;
      
      // Orbital speed based on ring - inner rings move faster (Kepler's laws)
      speeds[i] = (0.5 - ringIndex * 0.1) + Math.random() * 0.2;
      
      isSparkle[i] = 0.0;  // Not a sparkle
    }
    
    // Add sparkles - positioned along the outer edges of rings
    for (let i = 0; i < sparkleCount; i++) {
      const index = regularParticleCount + i;
      
      // Distribute sparkles along rings with preference for outer rings
      const ringChoice = Math.random() < 0.3 ? 0 : Math.random() < 0.5 ? 1 : 2; // More on outer rings
      
      // Sparkle ring properties - position sparkles around ring edges with same random orientation
      const ringProps = [
        { radius: 0.22, tiltX: randomAxisTiltX + 0.01, tiltZ: randomAxisTiltZ + 0.01 }, // Inner ring edge
        { radius: 0.33, tiltX: randomAxisTiltX + 0.03, tiltZ: randomAxisTiltZ + 0.03 }, // Middle ring edge
        { radius: 0.47, tiltX: randomAxisTiltX + 0.05, tiltZ: randomAxisTiltZ + 0.05 }  // Outer ring edge
      ][ringChoice];
      
      // Position around the circumference of the chosen ring
      const angleOnRing = (Math.random() * Math.PI * 2);
      const radialDeviation = (Math.random() - 0.5) * 0.02; // Less deviation for sparkles
      
      // Calculate position on ring
      const finalRadius = ringProps.radius + radialDeviation;
      positions[index * 3] = Math.cos(angleOnRing) * finalRadius;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 0.03; // Slight vertical scatter
      positions[index * 3 + 2] = Math.sin(angleOnRing) * finalRadius;
      
      // Store orbit parameters
      orbitRadius[index] = finalRadius;
      orbitTiltX[index] = ringProps.tiltX + (Math.random() - 0.5) * 0.03; // Random tilt variation
      orbitTiltZ[index] = ringProps.tiltZ + (Math.random() - 0.5) * 0.03; // Random tilt variation
      orbitEccentricity[index] = Math.random() * 0.2; // Slight eccentricity
      
      // Sparkles are bright white with a hint of the material color
      colors[index * 3] = 0.95;
      colors[index * 3 + 1] = 0.95;
      colors[index * 3 + 2] = 0.95;
      
      // Sparkles are smaller but more intense
      sizes[index] = 0.02 + Math.random() * 0.03;
      phases[index] = Math.random() * Math.PI * 2;
      speeds[index] = 0.6 + Math.random() * 1.2; // Slightly slower for better visibility
      isSparkle[index] = 1.0;  // Mark as sparkle
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('isSparkle', new THREE.BufferAttribute(isSparkle, 1));
    geometry.setAttribute('orbitRadius', new THREE.BufferAttribute(orbitRadius, 1));
    geometry.setAttribute('orbitTiltX', new THREE.BufferAttribute(orbitTiltX, 1));
    geometry.setAttribute('orbitTiltZ', new THREE.BufferAttribute(orbitTiltZ, 1));
    geometry.setAttribute('orbitEccentricity', new THREE.BufferAttribute(orbitEccentricity, 1));
    
    // Create material with custom shaders
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        hover: { value: 0 },
        selectedColor: { value: new THREE.Color(extractColorFromGradient(style.uiPreviewGradient)) },
        particleTexture: { value: particleTexture }
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });
    
    return [geometry, material];
  }, [style.uiPreviewGradient, isActive, particleTexture]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Gentle floating animation for the main satellite
    const float = Math.sin(time * 2 + position.x) * 0.02;
    meshRef.current.position.y = position.y + float;
    
    // Update particle system
    if (particlesRef.current && particlesMaterial) {
      // Update uniforms
      particlesMaterial.uniforms.time.value = time;
      
      // Make sure selected color matches the currently selected style's color
      // Extract color from gradient string or use fallback
      const extractColorFromGradient = (gradientStr: string): string => {
        const colorMatch = gradientStr.match(/#[0-9a-fA-F]{6}/);
        return colorMatch ? colorMatch[0] : '#4169e1'; // Default blue fallback
      };
      
      const selectedMaterial = isActive || isHovered 
        ? new THREE.Color(extractColorFromGradient(style.uiPreviewGradient))
        : particlesMaterial.uniforms.selectedColor.value;
      particlesMaterial.uniforms.selectedColor.value = selectedMaterial;
      
      // Smoothly transition hover intensity
      const targetHover = isActive ? 1.5 : isHovered ? 1.0 : 0.2;
      hoverIntensity.current += (targetHover - hoverIntensity.current) * 0.05;
      particlesMaterial.uniforms.hover.value = hoverIntensity.current;
    }
  });

  const handlePointerEnter = useCallback(() => onHover(true), [onHover]);
  const handlePointerLeave = useCallback(() => onHover(false), [onHover]);

  return (
    <group position={position}>
      {/* Particle cloud system */}
      <points ref={particlesRef}>
        <primitive object={particles} attach="geometry" />
        <primitive object={particlesMaterial} attach="material" />
      </points>
      
      {/* Main Satellite with Actual Material */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={isActive ? 1.8 : isHovered ? 1.15 : 1}
      >
        {style.category === 'premium' ? (
          <boxGeometry args={[0.2, 0.2, 0.2]} />
        ) : (
          <sphereGeometry args={[0.15, 16, 16]} />
        )}
        
        {/* Show the actual material */}
        <MaterialSystem 
          mode={style.id as any} 
          intensity={isActive ? 2.2 : 1}
          type="card"
        />
      </mesh>

      {/* Lock indicator for locked styles */}
      {style.locked && (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
      )}
    </group>
  );
};
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFlowRingProps {
  radius: number;
  selectedStyleId: string;
  hoveredSatellite: string | null;
  satellitePositions: Array<{ style: any; position: THREE.Vector3; angle: number }>;
  isPaused?: boolean;
}

const vertexShader = `
  attribute float alpha;
  attribute float size;
  attribute float phase;
  
  varying float vAlpha;
  varying vec3 vColor;
  varying float vLightning;
  
  uniform float time;
  uniform vec3 orangeColor;
  uniform vec3 blueColor;
  uniform vec3 waveColor;
  uniform float flowSpeed;
  uniform float waveProgress;
  uniform float waveAngle;
  uniform bool hasWave;
  uniform bool isPaused;
  uniform float waveRippleProgress;
  uniform float waveRippleCenter;
  uniform bool hasRipple;
  
  void main() {
    vAlpha = alpha * 0.4;
    
    // Calculate particle angle
    float particleAngle = atan(position.z, position.x);
    if (particleAngle < 0.0) particleAngle += 6.28318530718; // Normalize to 0-2π
    
    // Color wave logic
    vec3 baseColor;
    if (hasWave) {
      // Calculate distance from wave front (both directions)
      float waveAngleNorm = waveAngle;
      if (waveAngleNorm < 0.0) waveAngleNorm += 6.28318530718;
      
      float angleDiff1 = abs(particleAngle - waveAngleNorm);
      float angleDiff2 = 6.28318530718 - angleDiff1; // Other direction around circle
      float minAngleDiff = min(angleDiff1, angleDiff2);
      
      // Wave propagation (travels both ways around ring)
      float waveRadius = waveProgress * 0.4;
      float waveFactor = smoothstep(waveRadius + 0.1, waveRadius - 0.1, minAngleDiff);
      
      // Pulsing animation for breathing effect
      float pulseSpeed = 2.0;
      float pulsePhase = sin(time * pulseSpeed) * 0.5 + 0.5;
      
      // Thunder ripple effect that starts from hovered satellite
      float totalLightning = 0.0;
      
      if (hasRipple) {
        // Calculate angular distance from ripple center
        float angleDiff1 = abs(particleAngle - waveRippleCenter);
        float angleDiff2 = 6.28318530718 - angleDiff1;
        float minAngleDiff = min(angleDiff1, angleDiff2);
        
        // Create expanding ripple effect - full round trip
        float rippleRadius = waveRippleProgress * 6.28318530718; // Ripple expands around full circumference
        float rippleWidth = 0.3; // Width of the thunder band
        
        // Calculate distance from ripple front
        float distanceFromFront = abs(minAngleDiff - rippleRadius);
        
        // Thunder effect within the ripple band
        if (distanceFromFront < rippleWidth) {
          float rippleFactor = 1.0 - (distanceFromFront / rippleWidth);
          
          // Lightning intensity based on ripple position
          float lightningFreq = 15.0 + sin(waveRippleProgress * 5.0) * 8.0;
          float lightning = pow(sin(time * lightningFreq + particleAngle * 12.0) * 0.5 + 0.5, 2.0);
          
          // Add crackling effect
          float crackle = sin(time * 30.0 + particleAngle * 20.0) * 0.4 + 0.6;
          lightning *= crackle;
          
          // Apply ripple falloff
          lightning *= rippleFactor * rippleFactor; // Quadratic falloff for smoother edges
          
          totalLightning = lightning;
        }
      }
      
      vLightning = totalLightning;
      
      // Mix colors based on wave
      float angle = particleAngle + time * flowSpeed * 0.2;
      float gradientFactor = (sin(angle) + 1.0) * 0.5;
      vec3 originalColor = mix(orangeColor, blueColor, gradientFactor);
      baseColor = mix(originalColor, waveColor, waveFactor);
    } else {
      vLightning = 0.0;
      // Original gradient
      float angle = particleAngle + time * flowSpeed * 0.2;
      float gradientFactor = (sin(angle) + 1.0) * 0.5;
      baseColor = mix(orangeColor, blueColor, gradientFactor);
    }
    
    vColor = baseColor;
    
    // Animate position along the ring with subtle movement
    float animatedPhase = phase + (isPaused ? 0.0 : time * flowSpeed * 0.5);
    vec3 animatedPosition = position;
    animatedPosition.y += sin(animatedPhase) * 0.05;
    
    // Add subtle radius variation for organic flow
    float radiusVariation = sin(animatedPhase * 3.0) * 0.1;
    animatedPosition.x += normalize(animatedPosition).x * radiusVariation;
    animatedPosition.z += normalize(animatedPosition).z * radiusVariation;
    
    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Smaller, softer particles with lightning enhancement
    float lightningSize = 1.0 + vLightning * 0.5;
    float distanceSize = size * 0.5 * (1.0 + sin(animatedPhase * 2.0) * 0.2) * lightningSize;
    gl_PointSize = distanceSize * (200.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  varying float vLightning;
  
  void main() {
    // Create softer, more gas-like particles
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // More gradual falloff for less obvious circles
    float alpha = vAlpha * pow(1.0 - dist * 2.0, 4.0);
    alpha *= 0.5; // Reduced visibility for subtler effect
    
    // Add layered lightning glow with gradual falloff
    vec3 finalColor = vColor;
    
    // Primary glow layer - strongest in center
    float primaryGlow = pow(vLightning, 0.8);
    finalColor += vec3(0.3, 0.4, 0.5) * primaryGlow * 0.3;
    
    // Secondary glow layer - softer and more widespread
    float secondaryGlow = pow(vLightning, 0.4);
    finalColor += vec3(0.2, 0.3, 0.4) * secondaryGlow * 0.15;
    
    // Outer glow layer - very soft and subtle
    float outerGlow = pow(vLightning, 0.2);
    finalColor += vec3(0.1, 0.15, 0.2) * outerGlow * 0.08;
    
    // Gradual alpha boost based on lightning intensity
    alpha += vLightning * vLightning * 0.15; // Quadratic for smoother falloff
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const ParticleFlowRing: React.FC<ParticleFlowRingProps> = ({
  radius,
  selectedStyleId,
  hoveredSatellite,
  satellitePositions,
  isPaused = false
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Wave animation state
  const waveStateRef = useRef({
    isActive: false,
    startTime: 0,
    duration: 0.8, // Faster wave - 0.8 seconds for full wave
    hoveredAngle: 0,
    hoveredColor: new THREE.Color('#22c55e')
  });

  // Thunder ripple state
  const rippleStateRef = useRef({
    isActive: false,
    startTime: 0,
    duration: 1.2, // Thunder ripple duration
    centerAngle: 0
  });

  // Create particle geometry and attributes
  const { geometry, particleCount } = useMemo(() => {
    const count = 800; // More particles for gas effect
    const geo = new THREE.BufferGeometry();
    
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      
      // More spread for gas effect
      const radiusSpread = (Math.random() - 0.5) * 0.8;
      const particleRadius = radius + radiusSpread;
      
      positions[i * 3] = Math.cos(angle) * particleRadius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4; // More vertical spread
      positions[i * 3 + 2] = Math.sin(angle) * particleRadius;
      
      alphas[i] = Math.random() * 0.6 + 0.2; // Brighter for gradient visibility
      sizes[i] = Math.random() * 8 + 2; // Larger but softer particles
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    
    return { geometry: geo, particleCount: count };
  }, [radius]);

  // Get color for selected style
  const getStyleColor = (styleId: string) => {
    const style = satellitePositions.find(s => s.style.id === styleId)?.style;
    if (!style) return new THREE.Color(0x22c55e); // Default green
    
    // Extract color from gradient or use default
    const gradient = style.ui_preview_gradient;
    if (gradient && gradient.includes('#')) {
      const colorMatch = gradient.match(/#[0-9a-fA-F]{6}/);
      if (colorMatch) {
        return new THREE.Color(colorMatch[0]);
      }
    }
    return new THREE.Color(0x22c55e);
  };

  // Shader material with CRD gradient colors and wave uniforms
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        orangeColor: { value: new THREE.Color('#ff6b35') }, // CRD orange
        blueColor: { value: new THREE.Color('#06b6d4') }, // CRD blue
        waveColor: { value: new THREE.Color('#22c55e') }, // Wave color
        flowSpeed: { value: 0.15 },
        waveProgress: { value: 0 },
        waveAngle: { value: 0 },
        hasWave: { value: false },
        isPaused: { value: isPaused },
        waveRippleProgress: { value: 0 },
        waveRippleCenter: { value: 0 },
        hasRipple: { value: false }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  // Animation loop with wave management and storm system
  useFrame((state) => {
    if (!materialRef.current) return;
    
    // Update time uniform for animation
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.isPaused.value = isPaused;
    
    // Update thunder ripple system during hover
    if (hoveredSatellite && !rippleStateRef.current.isActive) {
      // Start new thunder ripple from hovered satellite
      const hoveredSatellite_ = satellitePositions.find(s => s.style.id === hoveredSatellite);
      if (hoveredSatellite_) {
        rippleStateRef.current.isActive = true;
        rippleStateRef.current.startTime = state.clock.elapsedTime;
        rippleStateRef.current.centerAngle = hoveredSatellite_.angle;
        
        materialRef.current.uniforms.hasRipple.value = true;
        materialRef.current.uniforms.waveRippleCenter.value = hoveredSatellite_.angle;
      }
    }
    
    // Update active thunder ripple
    if (rippleStateRef.current.isActive) {
      const elapsed = state.clock.elapsedTime - rippleStateRef.current.startTime;
      const progress = Math.min(elapsed / rippleStateRef.current.duration, 1.0);
      
      materialRef.current.uniforms.waveRippleProgress.value = progress;
      
      // End ripple when complete
      if (progress >= 1.0) {
        rippleStateRef.current.isActive = false;
        materialRef.current.uniforms.hasRipple.value = false;
        materialRef.current.uniforms.waveRippleProgress.value = 0;
      }
    }
    
    // Stop ripple immediately when hover ends
    if (!hoveredSatellite && rippleStateRef.current.isActive) {
      rippleStateRef.current.isActive = false;
      materialRef.current.uniforms.hasRipple.value = false;
      materialRef.current.uniforms.waveRippleProgress.value = 0;
    }
    
    
    // Stop rotation during hover wave effect or thunder ripple
    let flowSpeed = 0.15; // Normal speed
    if (waveStateRef.current.isActive || rippleStateRef.current.isActive) {
      flowSpeed = 0; // Stop rotation during wave or ripple
    } else if (hoveredSatellite) {
      flowSpeed = 0; // Stop rotation on hover (before effects start)
    }
    
    materialRef.current.uniforms.flowSpeed.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.flowSpeed.value,
      flowSpeed,
      0.1 // Faster lerp for more responsive stopping
    );
    
    // Handle hover wave effect
    if (hoveredSatellite && !waveStateRef.current.isActive) {
      // Start new wave
      const hoveredSatellite_ = satellitePositions.find(s => s.style.id === hoveredSatellite);
      if (hoveredSatellite_) {
        waveStateRef.current.isActive = true;
        waveStateRef.current.startTime = state.clock.elapsedTime;
        waveStateRef.current.hoveredAngle = hoveredSatellite_.angle;
        waveStateRef.current.hoveredColor = getStyleColor(hoveredSatellite);
        
        materialRef.current.uniforms.hasWave.value = true;
        materialRef.current.uniforms.waveAngle.value = hoveredSatellite_.angle;
        materialRef.current.uniforms.waveColor.value = waveStateRef.current.hoveredColor;
      }
    }
    
    // Update active wave
    if (waveStateRef.current.isActive) {
      const elapsed = state.clock.elapsedTime - waveStateRef.current.startTime;
      const progress = Math.min(elapsed / waveStateRef.current.duration, 1.0);
      
      materialRef.current.uniforms.waveProgress.value = progress;
      
      // End wave when complete
      if (progress >= 1.0) {
        waveStateRef.current.isActive = false;
        materialRef.current.uniforms.hasWave.value = false;
        materialRef.current.uniforms.waveProgress.value = 0;
      }
    }
    
    // Stop wave immediately when hover ends
    if (!hoveredSatellite && waveStateRef.current.isActive) {
      waveStateRef.current.isActive = false;
      materialRef.current.uniforms.hasWave.value = false;
      materialRef.current.uniforms.waveProgress.value = 0;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry} material={material}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
};
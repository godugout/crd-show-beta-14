import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarburstMaterial } from '../shaders/StarburstMaterial';

interface SpaceOdysseyResetProps {
  isAnimating: boolean;
  onComplete: () => void;
}

export const SpaceOdysseyReset: React.FC<SpaceOdysseyResetProps> = ({
  isAnimating,
  onComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const animationStartTime = useRef<number>(0);
  const hasStarted = useRef(false);
  
  // Animation duration constants
  const TOTAL_DURATION = 6.0;
  const PHASES = {
    INITIAL_MOVEMENT: { start: 0, duration: 1.0 },
    CAMERA_POSITION: { start: 1.0, duration: 1.0 },
    CARD_HIGHLIGHT: { start: 2.0, duration: 2.5 },
    STARBURST: { start: 3.0, duration: 1.0 },
    FINAL_SETTLE: { start: 4.5, duration: 1.5 }
  };

  useEffect(() => {
    if (isAnimating && !hasStarted.current) {
      hasStarted.current = true;
      animationStartTime.current = Date.now();
    } else if (!isAnimating) {
      hasStarted.current = false;
    }
  }, [isAnimating]);

  useFrame((state) => {
    if (!isAnimating || !groupRef.current) return;

    const elapsed = (Date.now() - animationStartTime.current) / 1000;
    const progress = Math.min(elapsed / TOTAL_DURATION, 1);

    // Phase calculations
    const getPhaseProgress = (phase: { start: number; duration: number }) => {
      const phaseElapsed = elapsed - phase.start;
      return Math.max(0, Math.min(1, phaseElapsed / phase.duration));
    };

    // Smooth camera movement focused on the card
    if (elapsed < PHASES.FINAL_SETTLE.start) {
      const p = Math.min(elapsed / 4.5, 1);
      const eased = 1 - Math.pow(1 - p, 3); // Ease out cubic
      
      // Gentle camera orbit around the card
      const angle = eased * Math.PI * 2;
      state.camera.position.x = Math.sin(angle) * 2;
      state.camera.position.y = Math.cos(angle * 0.5) * 1;
      state.camera.position.z = 15 + Math.sin(angle * 0.3) * 3;
      state.camera.lookAt(0, -2, 0); // Look at card position
    }

    // Final settling - return camera to default
    if (elapsed >= PHASES.FINAL_SETTLE.start) {
      const p = getPhaseProgress(PHASES.FINAL_SETTLE);
      const eased = 1 - Math.pow(1 - p, 3);
      
      // Smoothly return to default camera position
      state.camera.position.x = state.camera.position.x * (1 - eased);
      state.camera.position.y = state.camera.position.y * (1 - eased);
      state.camera.position.z = 15 + (state.camera.position.z - 15) * (1 - eased);
      state.camera.lookAt(0, -2, 0);
      
      if (p >= 1 && hasStarted.current) {
        hasStarted.current = false;
        onComplete();
      }
    }
  });

  if (!isAnimating) return null;

  return (
    <group ref={groupRef}>
      {/* Subtle environment lighting during reset */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.8} 
        color="#ffd700"
        castShadow
      />
      
      {/* Gentle particle effect around the card area */}
      <mesh position={[0, -2, 0]} scale={[8, 8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
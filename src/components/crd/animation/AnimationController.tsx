import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type AnimationMode } from '../types/CRDTypes';

interface AnimationControllerProps {
  mode: AnimationMode;
  intensity: number;
  targetRef: React.RefObject<THREE.Group>;
  basePosition?: THREE.Vector3;
  baseRotation?: THREE.Euler;
  enabled?: boolean;
  onUpdate?: (transform: { position: THREE.Vector3; rotation: THREE.Euler }) => void;
}

export const AnimationController: React.FC<AnimationControllerProps> = ({
  mode,
  intensity,
  targetRef,
  basePosition = new THREE.Vector3(0, 0, 0),
  baseRotation = new THREE.Euler(0, 0, 0),
  enabled = true,
  onUpdate
}) => {
  const lastUpdateTime = useRef(0);

  useFrame((state) => {
    if (!enabled || !targetRef.current) return;
    
    const time = state.clock.elapsedTime;
    const deltaTime = time - lastUpdateTime.current;
    const factor = intensity;
    
    // Throttle updates for performance
    if (deltaTime < 1/60) return; // 60fps max
    lastUpdateTime.current = time;
    
    let posX = 0, posY = 0, posZ = 0;
    let rotX = 0, rotY = 0, rotZ = 0;
    
    switch (mode) {
      case 'monolith':
        // No animation - use base transform
        break;
        
      case 'showcase':
        // Dramatic showcase animation
        posY = Math.sin(time * 1.2) * 0.08 * factor;
        posX = Math.sin(time * 0.9) * 0.06 * factor;
        rotY = time * 0.3 * factor;
        rotX = Math.sin(time * 0.8) * 0.05 * factor;
        rotZ = Math.sin(time * 1.1) * 0.03 * factor;
        break;
        
      case 'ice':
        // Gentle ice-like floating
        posY = Math.sin(time * 0.4) * 0.02 * factor;
        rotY = Math.sin(time * 0.3) * 0.01 * factor;
        break;
        
      case 'gold':
        // Gold shimmer animation
        rotY = Math.sin(time * 0.8) * 0.08 * factor;
        rotX = Math.sin(time * 0.6) * 0.04 * factor;
        posY = Math.sin(time * 1.0) * 0.02 * factor;
        break;
        
      case 'glass':
        // Crystal-like movements
        posY = Math.sin(time * 0.8) * 0.03 * factor;
        rotY = Math.sin(time * 0.5) * 0.04 * factor;
        rotX = Math.sin(time * 0.6) * 0.02 * factor;
        break;
        
      case 'holo':
        // Ultimate holographic effects
        posY = Math.sin(time * 1.5) * 0.12 * factor;
        posX = Math.sin(time * 1.1) * 0.08 * factor;
        posZ = Math.sin(time * 0.9) * 0.02 * factor;
        rotY = time * 0.5 * factor;
        rotX = Math.sin(time * 1.3) * 0.08 * factor;
        rotZ = Math.sin(time * 1.7) * 0.05 * factor;
        break;
    }
    
    // Apply animations relative to base transform
    const finalPosition = new THREE.Vector3(
      basePosition.x + posX,
      basePosition.y + posY,
      basePosition.z + posZ
    );
    const finalRotation = new THREE.Euler(
      baseRotation.x + rotX,
      baseRotation.y + rotY,
      baseRotation.z + rotZ
    );
    
    // Apply transforms
    targetRef.current.position.copy(finalPosition);
    targetRef.current.rotation.copy(finalRotation);
    
    // Notify parent
    if (onUpdate) {
      onUpdate({
        position: finalPosition,
        rotation: finalRotation
      });
    }
  });

  return null; // This is a logic-only component
};
import React, { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSystem } from '../materials/MaterialSystem';
import { type AnimationMode, type MaterialMode } from '../types/CRDTypes';

interface Card3DCoreProps {
  mode: AnimationMode;
  intensity: number;
  materialMode?: MaterialMode;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  enableAnimation?: boolean;
  enableGlassCase?: boolean;
  isLocked?: boolean;
  isPaused?: boolean;
  animationProgress?: number;
  onLockToggle?: (locked: boolean) => void;
  onPauseToggle?: (paused: boolean) => void;
  onHover?: (hovered: boolean) => void;
  onTransformUpdate?: (transform: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
  }) => void;
}

export const Card3DCore = forwardRef<THREE.Group, Card3DCoreProps>(({
  mode,
  intensity,
  materialMode,
  position = new THREE.Vector3(0, 0, 0),
  rotation = new THREE.Euler(0, 0, 0),
  scale = new THREE.Vector3(1, 1, 1),
  enableAnimation = true,
  enableGlassCase = true,
  isLocked = false,
  isPaused = false,
  animationProgress = 0,
  onLockToggle,
  onPauseToggle,
  onHover,
  onTransformUpdate
}, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const lastClickTime = useRef(0);
  const lockedRotation = useRef(new THREE.Euler(0, 0, 0));

  // Combine refs
  React.useImperativeHandle(ref, () => groupRef.current!, []);

  // Expose current rotation for orbital system
  const getCurrentRotation = React.useCallback(() => {
    return groupRef.current?.rotation || new THREE.Euler(0, 0, 0);
  }, []);

  // Add method to ref for external access
  React.useImperativeHandle(ref, () => {
    const group = groupRef.current!;
    return Object.assign(group, { getCurrentRotation });
  }, [getCurrentRotation]);

  // Handle single click to pause/unpause card animation
  const handleClick = React.useCallback(() => {
    onPauseToggle?.(!isPaused);
  }, [isPaused, onPauseToggle]);

  // Handle double-click to lock/unlock and flip card
  const handleDoubleClick = React.useCallback((event: any) => {
    event.stopPropagation(); // Prevent single click from firing
    
    if (isLocked) {
      // Unlock - resume normal behavior
      onLockToggle?.(false);
    } else {
      // Lock - flip to back side (180° rotation)
      if (groupRef.current) {
        lockedRotation.current = new THREE.Euler(0, Math.PI, 0); // Back side
        groupRef.current.rotation.copy(lockedRotation.current);
      }
      onLockToggle?.(true);
    }
  }, [isLocked, onLockToggle]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    
    // If locked, maintain locked rotation and skip animation
    if (isLocked) {
      groupRef.current.position.copy(position);
      groupRef.current.rotation.copy(lockedRotation.current);
      groupRef.current.scale.copy(scale);
      
      // Still notify parent of transform updates even when locked
      if (onTransformUpdate) {
        onTransformUpdate({
          position: position,
          rotation: lockedRotation.current
        });
      }
      return;
    }
    
    // If paused, skip animation but still update position/scale
    if (isPaused && !isLocked) {
      groupRef.current.position.copy(position);
      groupRef.current.rotation.copy(rotation);
      groupRef.current.scale.copy(scale);
      return;
    }
    
    if (!enableAnimation && !isLocked) return;
    
    const time = state.clock.elapsedTime;
    const factor = intensity;
    
    let posX = 0, posY = 0, posZ = 0;
    let rotX = 0, rotY = 0, rotZ = 0;
    
    switch (mode) {
      case 'monolith':
        // No animation
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
    
    // Apply animations to the entire group
    const animatedPosition = new THREE.Vector3(
      position.x + posX,
      position.y + posY,
      position.z + posZ
    );
    const animatedRotation = new THREE.Euler(
      rotation.x + rotX,
      rotation.y + rotY,
      rotation.z + rotZ
    );
    
    groupRef.current.position.copy(animatedPosition);
    groupRef.current.rotation.copy(animatedRotation);
    groupRef.current.scale.copy(scale);
    
    // Notify parent of transform updates
    if (onTransformUpdate) {
      onTransformUpdate({
        position: animatedPosition,
        rotation: animatedRotation
      });
    }
  });

  // Dynamic geometry based on mode
  const getCardGeometry = () => {
    if (mode === 'gold') {
      return <boxGeometry args={[2.3, 3.3, 0.15]} />;
    }
    return <boxGeometry args={[2.3, 3.3, 0.1]} />;
  };

  const getGlassCaseGeometry = () => {
    return <boxGeometry args={[2.6, 3.6, 0.32]} />;
  };

  const handlePointerEnter = React.useCallback(() => {
    onHover?.(true);
  }, [onHover]);

  const handlePointerLeave = React.useCallback(() => {
    onHover?.(false);
  }, [onHover]);

  return (
    <group 
      ref={groupRef} 
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Main Card */}
      <mesh ref={cardRef}>
        {getCardGeometry()}
        <MaterialSystem 
          mode={materialMode || (mode === 'alignment' ? 'monolith' : mode)} 
          intensity={intensity}
          type="card"
          animationProgress={animationProgress}
        />
      </mesh>
      
      {/* Glass Case (if enabled) */}
      {enableGlassCase && (
        <mesh ref={glassRef}>
          {getGlassCaseGeometry()}
          <MaterialSystem 
            mode="glass-case" 
            intensity={intensity}
            type="case"
          />
        </mesh>
      )}
    </group>
  );
});
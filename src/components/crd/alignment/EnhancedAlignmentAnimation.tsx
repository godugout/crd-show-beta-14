import React, { useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface EnhancedAlignmentAnimationProps {
  isTriggered: boolean;
  isPlaying: boolean;
  animationProgress: number;
  onCardControlUpdate?: (params: { 
    positionY?: number;
    lean?: number;
    position?: THREE.Vector3; 
    rotation?: THREE.Euler; 
    controlTaken: boolean 
  }) => void;
  currentCardPosition?: THREE.Vector3;
  currentCardRotation?: THREE.Euler;
  onAnimationComplete?: () => void;
}

type AnimationPhase = 'capture' | 'rotation' | 'descent' | 'tilt' | 'complete';

interface AnimationState {
  phase: AnimationPhase;
  startPosition: THREE.Vector3;
  startRotation: THREE.Euler;
  phaseProgress: number;
  totalDuration: number;
}

export const EnhancedAlignmentAnimation: React.FC<EnhancedAlignmentAnimationProps> = ({
  isTriggered,
  isPlaying,
  animationProgress,
  onCardControlUpdate,
  currentCardPosition = new THREE.Vector3(0, 0, 0),
  currentCardRotation = new THREE.Euler(0, 0, 0),
  onAnimationComplete
}) => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    phase: 'capture',
    startPosition: new THREE.Vector3(),
    startRotation: new THREE.Euler(),
    phaseProgress: 0,
    totalDuration: 5000 // 5 second total animation
  });

  // Phase durations (as percentages of total)
  const PHASE_DURATIONS = {
    capture: 0.05,   // 5% - instant capture
    rotation: 0.4,   // 40% - full rotation 
    descent: 0.25,   // 25% - move down
    tilt: 0.25,      // 25% - tilt forward
    complete: 0.05   // 5% - hold final position
  };

  // Capture starting position when triggered
  useEffect(() => {
    if (isTriggered && animationState.phase === 'capture') {
      console.log('🌌 Enhanced alignment: Capturing starting position');
      setAnimationState(prev => ({
        ...prev,
        startPosition: currentCardPosition.clone(),
        startRotation: currentCardRotation.clone(),
        phase: 'rotation'
      }));
    }
  }, [isTriggered, currentCardPosition, currentCardRotation, animationState.phase]);

  // Calculate current animation phase based on progress
  const getCurrentPhase = useCallback((progress: number): { phase: AnimationPhase; phaseProgress: number } => {
    let cumulativeProgress = 0;
    
    for (const [phase, duration] of Object.entries(PHASE_DURATIONS)) {
      const phaseEnd = cumulativeProgress + duration;
      if (progress <= phaseEnd) {
        const phaseProgress = (progress - cumulativeProgress) / duration;
        return { phase: phase as AnimationPhase, phaseProgress: Math.max(0, Math.min(1, phaseProgress)) };
      }
      cumulativeProgress = phaseEnd;
    }
    
    return { phase: 'complete', phaseProgress: 1 };
  }, []);

  // Update animation based on progress
  useEffect(() => {
    if (!isTriggered || !isPlaying || !onCardControlUpdate) return;

    const { phase, phaseProgress } = getCurrentPhase(animationProgress);
    
    // Update phase if changed
    if (phase !== animationState.phase) {
      console.log(`🌌 Enhanced alignment: Phase change ${animationState.phase} → ${phase}`);
      setAnimationState(prev => ({ ...prev, phase, phaseProgress }));
    }

    // Use the original card control system instead of absolute positioning
    switch (phase) {
      case 'capture':
        // Don't override position during capture
        break;

      case 'rotation': {
        // Keep existing position, just ensure control is taken
        onCardControlUpdate({
          positionY: 0, // Relative to starting position
          lean: 0, // No tilt during rotation
          controlTaken: true
        });
        break;
      }

      case 'descent': {
        // Move down relative to original position
        const descentAmount = -2 * phaseProgress; // Negative Y = down
        onCardControlUpdate({
          positionY: descentAmount,
          lean: 0,
          controlTaken: true
        });
        break;
      }

      case 'tilt': {
        // Final descent + forward tilt
        const finalTilt = 45 * phaseProgress;
        onCardControlUpdate({
          positionY: -2, // Final descent position
          lean: finalTilt,
          controlTaken: true
        });
        break;
      }

      case 'complete': {
        // Hold final position
        onCardControlUpdate({
          positionY: -2,
          lean: 45,
          controlTaken: true
        });
        
        // Trigger completion callback
        if (phaseProgress >= 1 && onAnimationComplete) {
          onAnimationComplete();
        }
        break;
      }
    }

  }, [
    isTriggered, 
    isPlaying, 
    animationProgress, 
    animationState, 
    getCurrentPhase, 
    onCardControlUpdate,
    onAnimationComplete
  ]);

  // Reset when animation stops
  useEffect(() => {
    if (!isPlaying && isTriggered) {
      console.log('🌌 Enhanced alignment: Animation stopped, releasing control');
      if (onCardControlUpdate) {
        onCardControlUpdate({
          position: new THREE.Vector3(0, 0, 0),
          rotation: new THREE.Euler(0, 0, 0),
          controlTaken: false
        });
      }
    }
  }, [isPlaying, isTriggered, onCardControlUpdate]);

  // Reset state when animation resets
  useEffect(() => {
    if (animationProgress === 0 && !isPlaying) {
      setAnimationState(prev => ({
        ...prev,
        phase: 'capture',
        phaseProgress: 0
      }));
    }
  }, [animationProgress, isPlaying]);

  return (
    <div className="fixed top-4 right-4 z-30 pointer-events-none">
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && isTriggered && (
        <div className="bg-black/80 text-white p-3 rounded-lg text-sm space-y-1">
          <div className="font-bold text-orange-400">Enhanced Alignment</div>
          <div>Phase: {animationState.phase}</div>
          <div>Progress: {Math.round(animationProgress * 100)}%</div>
          <div>Phase Progress: {Math.round(animationState.phaseProgress * 100)}%</div>
        </div>
      )}
    </div>
  );
};

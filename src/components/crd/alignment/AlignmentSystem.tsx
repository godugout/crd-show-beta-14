import React, { useState, useEffect, useCallback } from 'react';
import { EnhancedAlignmentAnimation } from './EnhancedAlignmentAnimation';
import * as THREE from 'three';


interface AlignmentSystemProps {
  animationProgress: number;
  isPlaying: boolean;
  cardAngle: number;
  cameraDistance: number;
  isOptimalZoom: boolean;
  isOptimalPosition: boolean;
  onTriggerReached?: () => void;
  onCardControlUpdate?: (params: { 
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    positionY?: number; 
    lean?: number; 
    controlTaken: boolean 
  }) => void;
  currentCardPosition?: THREE.Vector3;
  currentCardRotation?: THREE.Euler;
  onAnimationComplete?: () => void;
}

export const AlignmentSystem: React.FC<AlignmentSystemProps> = React.memo(({
  animationProgress,
  isPlaying,
  cardAngle,
  cameraDistance,
  isOptimalZoom,
  isOptimalPosition,
  onTriggerReached,
  onCardControlUpdate,
  currentCardPosition = new THREE.Vector3(0, 0, 0),
  currentCardRotation = new THREE.Euler(0, 0, 0),
  onAnimationComplete
}) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isAligned, setIsAligned] = useState(false);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  
  // NEW CONDITIONS: 400% zoom, 45°+ tilt, edges span beyond 100% screen width
  const is400PercentZoom = cameraDistance <= 2; // 400%+ zoom
  const isTilted45Plus = cardAngle >= 45; // 45°+ tilt
  const edgesSpanScreen = isOptimalPosition; // Both edges span beyond screen width
  
  // Check if close enough to trigger conditions (progressive feedback)
  const zoomProgress = Math.max(0, Math.min(1, (5 - cameraDistance) / 3)); // 0-1 based on zoom
  const tiltProgress = Math.max(0, Math.min(1, cardAngle / 45)); // 0-1 based on tilt
  const positionProgress = isOptimalPosition ? 1 : 0; // 0 or 1
  const overallProgress = (zoomProgress + tiltProgress + positionProgress) / 3;
  
  // Trigger when close enough to criteria
  const isCloseToAlignment = overallProgress >= 0.8;
  const isPerfectAlignment = is400PercentZoom && isTilted45Plus && edgesSpanScreen;
  
  // Handle 2-second hold timer for perfect alignment
  useEffect(() => {
    if (isPerfectAlignment && !hasTriggered) {
      if (!holdTimer) {
        console.log('🌌 Perfect alignment detected - starting 2s hold timer');
        const timer = setTimeout(() => {
          console.log('🌌 2s hold complete - triggering Kubrick sequence!');
          setHasTriggered(true);
          onTriggerReached?.();
        }, 2000);
        setHoldTimer(timer);
        
        // Progress animation
        let start = Date.now();
        const updateProgress = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / 2000, 1);
          setHoldProgress(progress);
          if (progress < 1) {
            requestAnimationFrame(updateProgress);
          }
        };
        requestAnimationFrame(updateProgress);
      }
    } else if (!isPerfectAlignment && holdTimer) {
      console.log('🌌 Alignment lost - clearing hold timer');
      clearTimeout(holdTimer);
      setHoldTimer(null);
      setHoldProgress(0);
    }
    
    return () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
      }
    };
  }, [isPerfectAlignment, hasTriggered, holdTimer, onTriggerReached]);
  
  // Handle alignment animation - only take control during animation
  useEffect(() => {
    if (hasTriggered && isPlaying && !isAligned) {
      // Only lock card during active animation
      if (onCardControlUpdate) {
        onCardControlUpdate({
          positionY: 0,
          lean: 45, // 45 degree tilt
          controlTaken: true // Lock the card in position only during animation
        });
      }
      setIsAligned(true);
    } else if (hasTriggered && !isPlaying) {
      // Release control when animation stops
      if (onCardControlUpdate) {
        onCardControlUpdate({
          positionY: 0,
          lean: 0,
          controlTaken: false // Release control when not animating
        });
      }
    }
  }, [hasTriggered, isPlaying, isAligned, onCardControlUpdate]);
  
  // Reset when animation resets
  useEffect(() => {
    if (animationProgress === 0 && !isPlaying) {
      setHasTriggered(false);
      setIsAligned(false);
      if (onCardControlUpdate) {
        onCardControlUpdate({
          positionY: 0,
          lean: 0,
          controlTaken: false
        });
      }
    }
  }, [animationProgress, isPlaying, onCardControlUpdate]);
  
  return (
    <>
      {/* Enhanced Alignment Animation Component */}
      <EnhancedAlignmentAnimation
        isTriggered={hasTriggered}
        isPlaying={isPlaying}
        animationProgress={animationProgress}
        onCardControlUpdate={onCardControlUpdate}
        currentCardPosition={currentCardPosition}
        currentCardRotation={currentCardRotation}
        onAnimationComplete={onAnimationComplete}
      />

      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Progressive Alignment Indicator */}
        {isCloseToAlignment && !hasTriggered && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-black/80 backdrop-blur-sm border border-white/30 rounded-lg px-6 py-4 shadow-lg">
              <div className="text-center text-white">
                <div className="text-sm font-medium mb-2">
                  {isPerfectAlignment ? 'PERFECT ALIGNMENT' : 'APPROACHING ALIGNMENT'}
                </div>
                {isPerfectAlignment && (
                  <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-white transition-all duration-100"
                      style={{ width: `${holdProgress * 100}%` }}
                    />
                  </div>
                )}
                {!isPerfectAlignment && (
                  <div className="text-xs opacity-80">
                    Overall: {Math.round(overallProgress * 100)}%
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Debug Status (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-sm">
            <div>Zoom 400%+: {is400PercentZoom ? '✓' : '✗'} ({Math.round(zoomProgress * 100)}%)</div>
            <div>Tilt 45°+: {isTilted45Plus ? '✓' : '✗'} ({Math.round(cardAngle)}°)</div>
            <div>Edges Span: {edgesSpanScreen ? '✓' : '✗'}</div>
            <div>Perfect: {isPerfectAlignment ? '✓' : '✗'}</div>
            <div>Hold: {Math.round(holdProgress * 100)}%</div>
            <div>Overall: {Math.round(overallProgress * 100)}%</div>
          </div>
        )}
      </div>
    </>
  );
});

AlignmentSystem.displayName = 'AlignmentSystem';
import React, { useState, useEffect } from 'react';
import { useFlightAnimation } from '@/contexts/FlightAnimationContext';
import { Canvas } from '@react-three/fiber';
import { CosmicCluster } from './CosmicCluster';

interface MonolithAlignmentProps {
  onAlignmentComplete?: () => void;
  onCardRotationTrigger?: (targetRotation: { x: number; y: number }) => void;
  children?: React.ReactNode;
}

type AnimationPhase = 'hyperspace' | 'hyperspeed' | 'positioning' | 'complete';

export const MonolithAlignment: React.FC<MonolithAlignmentProps> = ({
  onAlignmentComplete,
  onCardRotationTrigger,
  children
}) => {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('hyperspace');
  const [animationProgress, setAnimationProgress] = useState(0);
  const { setFlightActive } = useFlightAnimation();

  // Monolith Hyperspace Animation Sequence
  useEffect(() => {
    console.log('🌌 Monolith Hyperspace sequence initiated!');
    
    // Hide navbar during flight animation
    setFlightActive(true);
    
    // Trigger card rotation to final monolith position immediately
    if (onCardRotationTrigger) {
      // Final position: both sides past bottom corners, touching screen sides
      onCardRotationTrigger({ x: 15, y: 175 });
    }
    
    let startTime = Date.now();
    const totalDuration = 4000; // 4 seconds total
    
    const animateSequence = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Phase transitions
      if (progress < 0.3) {
        setAnimationPhase('hyperspace');
      } else if (progress < 0.6) {
        setAnimationPhase('hyperspeed');
      } else if (progress < 0.9) {
        setAnimationPhase('positioning');
      } else {
        setAnimationPhase('complete');
      }
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animateSequence);
      } else {
        // Show navbar again when animation completes
        setFlightActive(false);
        // Complete after animation
        setTimeout(() => onAlignmentComplete?.(), 1000);
      }
    };

    requestAnimationFrame(animateSequence);

    return () => {
      // Ensure navbar is shown on cleanup
      setFlightActive(false);
    };
  }, [onAlignmentComplete, onCardRotationTrigger, setFlightActive]);

  // Animation phase messages
  const getPhaseMessage = () => {
    switch (animationPhase) {
      case 'hyperspace':
        return 'Monolith materializing... approaching hyperspace...';
      case 'hyperspeed':
        return 'HYPERSPEED ENGAGED - Jumping through dimensions';
      case 'positioning':
        return 'Positioning monolith... final alignment...';
      case 'complete':
        return 'MONOLITH ALIGNED - Where imagination meets tech';
      default:
        return 'Initializing sequence...';
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Dark Space Environment - BEHIND everything */}
      <div 
        className="fixed inset-0 pointer-events-none bg-black"
        style={{ zIndex: 1 }}
      >
        {/* 3D Cosmic Cluster Nebula - Using same particle system as rings */}
        <Canvas
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 5,
            pointerEvents: 'none'
          }}
          camera={{ 
            position: [0, 0, 20], 
            fov: 75,
            near: 0.1,
            far: 1000
          }}
        >
          <CosmicCluster 
            visible={true}
            intensity={animationPhase === 'complete' ? 2.0 : 1.5}
          />
        </Canvas>

        {/* Distant stars overlay */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${0.3 + Math.random() * 0.8}px`,
                height: `${0.3 + Math.random() * 0.8}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Reduced hyperspace particles */}
        {animationPhase === 'hyperspace' && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Reduced hyperspeed lines */}
        {animationPhase === 'hyperspeed' && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"
                style={{
                  width: '200%',
                  left: '-50%',
                  top: `${10 + i * 15}%`,
                  transform: `rotate(${-45 + Math.random() * 90}deg)`,
                  animationDuration: '0.2s',
                  animationIterationCount: 'infinite'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sun - positioned to peek just a few pixels past the top edge of the CRD */}
      {animationPhase === 'complete' && (
        <div 
          className="fixed pointer-events-none" 
          style={{ 
            zIndex: 2,
            top: '40%', // Position behind the CRD card's top edge
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Main sun body - bright and intense like 2001 Space Odyssey */}
          <div 
            className="relative"
            style={{
              width: '300px',
              height: '50px', // Very small visible portion - just peeking out
              background: 'radial-gradient(ellipse at center top, #ffffff 0%, #ffff00 30%, #ff8c00 60%, #ff4500 80%, transparent 100%)',
              borderRadius: '150px 150px 0 0', // Only top half rounded
              filter: 'blur(8px)',
              opacity: 1,
              transition: 'opacity 2s ease-in-out'
            }} 
          />
          
          {/* Intense bright core - the actual sun tip */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: '200px',
              height: '30px',
              background: 'radial-gradient(ellipse at center top, #ffffff 0%, #ffffff 20%, #ffff00 50%, #ff8c00 80%, transparent 100%)',
              borderRadius: '100px 100px 0 0',
              filter: 'blur(4px)',
              opacity: 1
            }} 
          />

          {/* Brilliant white core tip */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: '120px',
              height: '20px',
              background: 'radial-gradient(ellipse at center top, #ffffff 0%, #ffffff 60%, transparent 100%)',
              borderRadius: '60px 60px 0 0',
              filter: 'blur(2px)',
              opacity: 0.9
            }} 
          />

          {/* Dramatic glow emanating from the sun tip */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse"
            style={{
              width: '400px',
              height: '60px',
              background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.3) 0%, rgba(255,255,0,0.2) 40%, rgba(255,140,0,0.1) 70%, transparent 100%)',
              borderRadius: '200px 200px 0 0',
              animationDuration: '3s'
            }} 
          />
        </div>
      )}

      {/* Moon at top - fixed position below navbar */}
      {(animationPhase === 'positioning' || animationPhase === 'complete') && (
        <div 
          className="fixed pointer-events-none transition-all duration-2000" 
          style={{
            top: '100px', // Below navbar
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #f8fafc, #e2e8f0, #cbd5e1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 50, // Above everything to ensure visibility
            opacity: animationPhase === 'complete' ? 1 : 0.7
          }}
        >
          {/* Moon surface details */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '18px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(100,116,139,0.3)'
          }} />
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '16px',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(100,116,139,0.4)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '18px',
            left: '24px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(100,116,139,0.25)'
          }} />
          {/* Moon highlight */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '24px',
            bottom: '24px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.6), transparent 60%)'
          }} />
        </div>
      )}

      {/* Card with obsidian material during flight - positioned ABOVE sun */}
      <div 
        className="relative pointer-events-auto" 
        style={{ 
          zIndex: 10, // Above sun but below moon
          filter: (animationPhase === 'hyperspace' || animationPhase === 'hyperspeed' || animationPhase === 'positioning' || animationPhase === 'complete') 
            ? 'brightness(0.1) contrast(3) saturate(0) hue-rotate(0deg)' 
            : 'none',
          transition: 'filter 1.5s ease-in-out'
        }}
      >
        {children}
        
        {/* Obsidian shine overlay during entire flight */}
        {(animationPhase === 'hyperspace' || animationPhase === 'hyperspeed' || animationPhase === 'positioning' || animationPhase === 'complete') && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 10%, transparent 20%, transparent 80%, rgba(255,255,255,0.25) 90%, rgba(255,255,255,0.5) 100%)',
              borderRadius: 'inherit',
              opacity: animationPhase === 'complete' ? 1 : 0.8,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        )}

        {/* Additional metallic reflection bands */}
        {animationPhase === 'complete' && (
          <>
            <div 
              className="absolute pointer-events-none"
              style={{
                top: '10%',
                left: '5%',
                right: '5%',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                borderRadius: '2px'
              }}
            />
            <div 
              className="absolute pointer-events-none"
              style={{
                bottom: '15%',
                left: '10%',
                right: '60%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                borderRadius: '1px'
              }}
            />
          </>
        )}
      </div>

      {/* Status Message */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              animationPhase === 'hyperspace' ? 'bg-blue-400 animate-pulse' :
              animationPhase === 'hyperspeed' ? 'bg-white animate-ping' :
              animationPhase === 'positioning' ? 'bg-yellow-400 animate-pulse' :
              'bg-green-400'
            }`} />
            <span className="text-white text-sm font-medium">
              {getPhaseMessage()}
            </span>
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 shadow-lg">
          <div className="text-white text-xs">
            <div className="uppercase font-mono">{animationPhase}</div>
            <div className="w-24 h-1 bg-white/20 rounded-full mt-1">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-white rounded-full transition-all duration-300"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fade to black overlay as flight ends */}
      <div 
        className="fixed inset-0 pointer-events-none bg-black transition-opacity duration-2000 ease-out"
        style={{ 
          zIndex: 100,
          opacity: animationProgress > 0.85 ? (animationProgress - 0.85) / 0.15 : 0 
        }}
      />
    </div>
  );
};
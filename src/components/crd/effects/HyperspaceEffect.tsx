import React, { useEffect, useState, useMemo } from 'react';

interface HyperspaceEffectProps {
  isActive: boolean;
  variant: 'star-wars' | 'star-trek';
  duration?: number;
  onComplete?: () => void;
}

interface Star {
  id: number;
  x: number;
  y: number;
  z: number;
  initialX: number;
  initialY: number;
  speed: number;
  opacity: number;
}

export const HyperspaceEffect: React.FC<HyperspaceEffectProps> = ({
  isActive,
  variant,
  duration = 3000,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);

  // Generate stars using useMemo to prevent regeneration on re-renders
  const stars = useMemo(() => {
    const starCount = variant === 'star-wars' ? 100 : 150;
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * window.innerWidth * 2,
      y: (Math.random() - 0.5) * window.innerHeight * 2,
      z: Math.random() * 1000,
      initialX: (Math.random() - 0.5) * window.innerWidth * 2,
      initialY: (Math.random() - 0.5) * window.innerHeight * 2,
      speed: Math.random() * 5 + 2,
      opacity: Math.random() * 0.8 + 0.2
    }));
  }, [variant]);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const animationFrame = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animationFrame);
      } else {
        setTimeout(() => {
          onComplete?.();
        }, 100);
      }
    };

    requestAnimationFrame(animationFrame);
  }, [isActive, duration, onComplete]);

  if (!isActive) return null;

  const renderStarWarsEffect = () => (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden bg-black/30">
      {stars.map((star) => {
        const streakLength = progress * 200 * star.speed;
        const x = star.initialX + (star.x - star.initialX) * progress * star.speed;
        const y = star.initialY + (star.y - star.initialY) * progress * star.speed;
        
        return (
          <div
            key={star.id}
            className="absolute"
            style={{
              left: `${50 + x / 20}%`,
              top: `${50 + y / 20}%`,
              transform: 'translate(-50%, -50%)',
              opacity: star.opacity * (1 - progress * 0.3)
            }}
          >
            {/* Star point */}
            <div 
              className="w-1 h-1 bg-white rounded-full"
              style={{
                boxShadow: `0 0 ${2 + progress * 8}px rgba(255, 255, 255, ${0.8 * star.opacity})`
              }}
            />
            
            {/* Star streak */}
            {progress > 0.3 && (
              <div
                className="absolute bg-gradient-to-r from-white to-transparent"
                style={{
                  width: `${streakLength}px`,
                  height: '1px',
                  right: '2px',
                  top: '50%',
                  transform: `translateY(-50%) rotate(${Math.atan2(y - star.initialY, x - star.initialX) * 180 / Math.PI}deg)`,
                  opacity: star.opacity * (1 - progress * 0.5)
                }}
              />
            )}
          </div>
        );
      })}
      
      {/* Central glow effect */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent"
        style={{
          opacity: progress * 0.5,
          transform: `scale(${1 + progress * 2})`
        }}
      />
    </div>
  );

  const renderStarTrekEffect = () => (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden bg-black/40">
      {/* Tunnel effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 12 }).map((_, ringIndex) => (
          <div
            key={ringIndex}
            className="absolute border border-blue-400/30 rounded-full"
            style={{
              width: `${100 + ringIndex * 80 + progress * 400}px`,
              height: `${100 + ringIndex * 80 + progress * 400}px`,
              opacity: (1 - ringIndex / 12) * (1 - progress * 0.7),
              animation: `tunnel-zoom ${2 + ringIndex * 0.1}s linear infinite`
            }}
          />
        ))}
      </div>

      {/* Warp lines */}
      {stars.map((star) => {
        const lineLength = progress * 300;
        const angle = Math.atan2(star.y, star.x);
        
        return (
          <div
            key={star.id}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${angle}rad)`,
              opacity: star.opacity * (1 - progress * 0.4)
            }}
          >
            <div
              className="bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              style={{
                width: `${lineLength}px`,
                height: '1px',
                transformOrigin: 'left center'
              }}
            />
          </div>
        );
      })}

      {/* Central energy burst */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-blue-400/20 via-cyan-400/10 to-transparent"
        style={{
          opacity: progress * 0.6,
          transform: `scale(${1 + progress * 3})`
        }}
      />
      
      {/* Tunnel light effect */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent"
        style={{
          opacity: Math.sin(progress * Math.PI) * 0.8,
          transform: `scale(${0.5 + progress * 2})`
        }}
      />
    </div>
  );

  return (
    <>
      {variant === 'star-wars' ? renderStarWarsEffect() : renderStarTrekEffect()}
      
      {/* Fade overlay */}
      <div 
        className="fixed inset-0 z-39 pointer-events-none bg-black"
        style={{
          opacity: progress > 0.8 ? (progress - 0.8) * 5 : 0
        }}
      />

      <style>{`
        @keyframes tunnel-zoom {
          from {
            transform: scale(0.1);
            opacity: 1;
          }
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
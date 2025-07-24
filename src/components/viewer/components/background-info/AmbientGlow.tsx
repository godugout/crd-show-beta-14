
import React from 'react';

interface AmbientGlowProps {
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = React.memo(({
  mousePosition,
  isHovering
}) => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 400px 200px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(59, 130, 246, 0.03) 0%, 
            rgba(16, 185, 129, 0.02) 40%,
            transparent 80%)
        `,
        filter: 'blur(2px)',
        opacity: isHovering ? 0.8 : 0.4,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
});

AmbientGlow.displayName = 'AmbientGlow';

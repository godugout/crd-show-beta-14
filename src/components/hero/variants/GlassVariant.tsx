
import React from 'react';

interface GlassVariantProps {
  mousePosition: { x: number; y: number };
  intensity: number;
  speed: number;
  autoRotate: boolean;
  className?: string;
}

export const GlassVariant: React.FC<GlassVariantProps> = ({
  mousePosition,
  intensity,
  speed,
  autoRotate,
  className = ''
}) => {
  const planes = Array.from({ length: 6 }, (_, i) => {
    const offset = i * 15;
    const mouseX = (mousePosition.x - 0.5) * intensity * 8;
    const mouseY = (mousePosition.y - 0.5) * intensity * 8;
    
    return (
      <div
        key={i}
        className="absolute inset-0 rounded-2xl opacity-20 transition-transform duration-800 ease-out"
        style={{
          background: `linear-gradient(${45 + i * 30}deg, 
            hsl(${190 + i * 25} 60% 80% / 0.1), 
            hsl(${220 + i * 25} 60% 80% / 0.05))`,
          transform: `
            translate3d(${mouseX + offset}px, ${mouseY + offset}px, ${i * 10}px)
            rotateX(${mouseY * 0.2}deg)
            rotateY(${mouseX * 0.2}deg)
            ${autoRotate ? `rotateZ(${Date.now() * speed * 0.0005}deg)` : ''}
          `,
          backdropFilter: 'blur(2px)',
          border: `1px solid hsl(${190 + i * 25} 60% 80% / 0.1)`,
          filter: 'blur(1px)'
        }}
      />
    );
  });

  return (
    <div className={`absolute inset-0 ${className}`}>
      {planes}
    </div>
  );
};

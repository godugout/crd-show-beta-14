
import React from 'react';

interface ParticlesVariantProps {
  mousePosition: { x: number; y: number };
  intensity: number;
  speed: number;
  autoRotate: boolean;
  className?: string;
}

export const ParticlesVariant: React.FC<ParticlesVariantProps> = ({
  mousePosition,
  intensity,
  speed,
  autoRotate,
  className = ''
}) => {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 4 + 2;
    
    const mouseX = (mousePosition.x - 0.5) * intensity * 10;
    const mouseY = (mousePosition.y - 0.5) * intensity * 10;
    
    return (
      <div
        key={i}
        className="absolute rounded-full opacity-50 transition-transform duration-1000 ease-out"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, 
            hsl(${160 + i * 10} 70% 70% / 0.6), 
            hsl(${160 + i * 10} 70% 70% / 0))`,
          transform: `
            translate3d(${mouseX * (i % 3 + 1)}px, ${mouseY * (i % 3 + 1)}px, 0)
            ${autoRotate ? `rotate(${Date.now() * speed * 0.001 * (i % 3 + 1)}deg)` : ''}
          `,
          filter: 'blur(0.5px)'
        }}
      />
    );
  });

  return (
    <div className={`absolute inset-0 ${className}`}>
      {particles}
    </div>
  );
};

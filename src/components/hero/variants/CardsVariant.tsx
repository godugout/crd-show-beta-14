
import React from 'react';

interface CardsVariantProps {
  mousePosition: { x: number; y: number };
  intensity: number;
  speed: number;
  autoRotate: boolean;
  className?: string;
}

export const CardsVariant: React.FC<CardsVariantProps> = ({
  mousePosition,
  intensity,
  speed,
  autoRotate,
  className = ''
}) => {
  const cards = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 360;
    const radius = 30;
    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;
    
    const mouseX = (mousePosition.x - 0.5) * intensity * 15;
    const mouseY = (mousePosition.y - 0.5) * intensity * 15;
    
    return (
      <div
        key={i}
        className="absolute w-20 h-28 rounded-lg opacity-40 transition-transform duration-700 ease-out"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          background: `linear-gradient(135deg, 
            hsl(${200 + i * 20} 80% 65% / 0.4), 
            hsl(${260 + i * 20} 80% 65% / 0.3))`,
          transform: `
            translate3d(${mouseX}px, ${mouseY}px, 0)
            rotateX(${mouseY * 0.3}deg)
            rotateY(${mouseX * 0.3}deg)
            ${autoRotate ? `rotate(${angle + Date.now() * speed * 0.002}deg)` : ''}
          `,
          boxShadow: `0 4px 20px hsl(${200 + i * 20} 80% 65% / 0.2)`,
          filter: 'blur(1px)'
        }}
      />
    );
  });

  return (
    <div className={`absolute inset-0 ${className}`}>
      {cards}
    </div>
  );
};

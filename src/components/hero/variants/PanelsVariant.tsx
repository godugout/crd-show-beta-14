
import React from 'react';

interface PanelsVariantProps {
  mousePosition: { x: number; y: number };
  intensity: number;
  speed: number;
  autoRotate: boolean;
  className?: string;
}

export const PanelsVariant: React.FC<PanelsVariantProps> = ({
  mousePosition,
  intensity,
  speed,
  autoRotate,
  className = ''
}) => {
  const panels = Array.from({ length: 12 }, (_, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const delay = (row + col) * 0.2;
    
    const mouseX = (mousePosition.x - 0.5) * intensity * 20;
    const mouseY = (mousePosition.y - 0.5) * intensity * 20;
    
    return (
      <div
        key={i}
        className="absolute w-32 h-32 rounded-lg opacity-30 transition-transform duration-500 ease-out"
        style={{
          left: `${20 + col * 20}%`,
          top: `${20 + row * 25}%`,
          background: `linear-gradient(135deg, 
            hsl(${180 + i * 15} 70% 60% / 0.3), 
            hsl(${240 + i * 15} 70% 60% / 0.2))`,
          transform: `
            translate3d(${mouseX}px, ${mouseY}px, 0)
            rotateX(${mouseY * 0.5}deg)
            rotateY(${mouseX * 0.5}deg)
            ${autoRotate ? `rotate(${Date.now() * speed * 0.001}deg)` : ''}
          `,
          animationDelay: `${delay}s`,
          filter: 'blur(0.5px)'
        }}
      />
    );
  });

  return (
    <div className={`absolute inset-0 ${className}`}>
      {panels}
    </div>
  );
};

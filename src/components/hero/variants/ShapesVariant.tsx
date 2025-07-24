
import React from 'react';

interface ShapesVariantProps {
  mousePosition: { x: number; y: number };
  intensity: number;
  speed: number;
  autoRotate: boolean;
  className?: string;
}

export const ShapesVariant: React.FC<ShapesVariantProps> = ({
  mousePosition,
  intensity,
  speed,
  autoRotate,
  className = ''
}) => {
  const shapes = Array.from({ length: 10 }, (_, i) => {
    const isCircle = i % 2 === 0;
    const size = 20 + (i % 4) * 10;
    const x = 20 + (i % 3) * 30;
    const y = 20 + Math.floor(i / 3) * 25;
    
    const mouseX = (mousePosition.x - 0.5) * intensity * 12;
    const mouseY = (mousePosition.y - 0.5) * intensity * 12;
    
    return (
      <div
        key={i}
        className={`absolute opacity-35 transition-transform duration-600 ease-out ${
          isCircle ? 'rounded-full' : 'rounded-lg'
        }`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          background: isCircle 
            ? `radial-gradient(circle, hsl(${150 + i * 18} 75% 65% / 0.4), hsl(${150 + i * 18} 75% 65% / 0.1))`
            : `linear-gradient(135deg, hsl(${300 + i * 18} 75% 65% / 0.4), hsl(${330 + i * 18} 75% 65% / 0.2))`,
          transform: `
            translate3d(${mouseX}px, ${mouseY}px, 0)
            rotate(${autoRotate ? Date.now() * speed * 0.001 + i * 45 : i * 45}deg)
            scale(${1 + Math.sin(Date.now() * speed * 0.002 + i) * 0.1})
          `,
          filter: 'blur(0.5px)'
        }}
      />
    );
  });

  return (
    <div className={`absolute inset-0 ${className}`}>
      {shapes}
    </div>
  );
};

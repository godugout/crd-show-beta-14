import React, { useEffect, useRef, useState } from 'react';

interface PixelDigitalProps {
  children: string;
  className?: string;
}

export const PixelDigital: React.FC<PixelDigitalProps> = ({ 
  children, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // Higher resolution
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Pixel grid settings
    const gridSize = 3;
    const cols = Math.floor(rect.width / gridSize);
    const rows = Math.floor(rect.height / gridSize);

    // Animation state
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Create animated pixel patterns with Casio Indiglo style
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const wave1 = Math.sin((x * 0.08) + (time * 0.01)) * 0.5 + 0.5;
          const wave2 = Math.cos((y * 0.12) + (time * 0.012)) * 0.5 + 0.5;
          const wave3 = Math.sin(((x + y) * 0.06) + (time * 0.008)) * 0.5 + 0.5;
          
          // Combine waves for pixel artifacts
          const intensity = (wave1 * wave2 * wave3) * 0.6;
          
          // Casio Indiglo color palette (distinctive blue-green)
          const hue = 185 + (wave3 * 25); // Blue-green range like Indiglo
          const saturation = 85 + (intensity * 15);
          const lightness = 15 + (intensity * 45); // Less bright for visible pixels
          
          // Make individual pixels more visible
          if (intensity > 0.3) {
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
          }
        }
      }
      
      time += 1;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <span className={`inline-block ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span 
      className={`relative inline-block ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Pixel grid background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 opacity-25"
        style={{
          width: '100%',
          height: '100%',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Text with Casio Indiglo effect */}
      <span 
        className="relative z-10 font-mono tracking-wider animate-pulse"
        style={{
          textShadow: `
            0 0 4px #00e6ff,
            0 0 8px #00b8e6,
            0 0 12px #00a3d9,
            0 0 16px #00a3d9,
            1px 1px 0px #003d4d,
            -1px -1px 0px #003d4d
          `,
          background: 'linear-gradient(45deg, #00e6ff, #00b8e6, #00a3d9, #008fb3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'contrast(1.2) brightness(1.1)',
          animation: 'glow-pulse 2s ease-in-out infinite alternate',
        }}
      >
        {children}
      </span>
      
      {/* Removed glitch lines overlay as requested */}
      
    </span>
  );
};
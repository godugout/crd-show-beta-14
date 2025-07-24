
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PanelsVariant } from './variants/PanelsVariant';
import { CardsVariant } from './variants/CardsVariant';
import { ParticlesVariant } from './variants/ParticlesVariant';
import { GlassVariant } from './variants/GlassVariant';
import { ShapesVariant } from './variants/ShapesVariant';

export type Animated3DVariant = 'panels' | 'cards' | 'particles' | 'glass' | 'shapes';

interface Animated3DBackgroundProps {
  variant?: Animated3DVariant;
  intensity?: number;
  speed?: number;
  mouseInteraction?: boolean;
  autoRotate?: boolean;
  className?: string;
}

export const Animated3DBackground: React.FC<Animated3DBackgroundProps> = ({
  variant = 'panels',
  intensity = 0.3,
  speed = 1,
  mouseInteraction = true,
  autoRotate = false,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const animationFrameRef = useRef<number>();
  const lastUpdateTime = useRef<number>(0);

  // Throttled mouse move handler for better performance
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdateTime.current < 16) return; // ~60fps throttling
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    lastUpdateTime.current = now;
  }, []);

  useEffect(() => {
    if (!mouseInteraction || !containerRef.current) return;

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mouseInteraction, handleMouseMove]);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return (
      <div 
        ref={containerRef}
        className={`absolute inset-0 opacity-20 ${className}`}
        style={{ background: 'linear-gradient(135deg, hsl(var(--crd-green) / 0.1), hsl(var(--crd-blue) / 0.1))' }}
      />
    );
  }

  const commonProps = {
    mousePosition,
    intensity,
    speed,
    autoRotate,
    className
  };

  const VariantComponent = {
    panels: PanelsVariant,
    cards: CardsVariant,
    particles: ParticlesVariant,
    glass: GlassVariant,
    shapes: ShapesVariant
  }[variant];

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <VariantComponent {...commonProps} />
    </div>
  );
};

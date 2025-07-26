import React, { useRef, useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'sparkle' | 'glow' | 'trail' | 'burst';
}

interface ParticleSystemProps {
  active: boolean;
  intensity?: number;
  mousePosition?: { x: number; y: number };
  trigger?: 'hover' | 'click' | 'continuous' | 'burst';
  theme?: 'magic' | 'success' | 'energy' | 'celebration';
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  active,
  intensity = 1,
  mousePosition,
  trigger = 'continuous',
  theme = 'magic',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const themeConfig = {
    magic: {
      colors: ['#60a5fa', '#a78bfa', '#f472b6', '#fbbf24'],
      particleCount: 25,
      speed: 2,
      life: 120
    },
    success: {
      colors: ['#34d399', '#10b981', '#059669', '#6ee7b7'],
      particleCount: 30,
      speed: 3,
      life: 90
    },
    energy: {
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#fb923c'],
      particleCount: 35,
      speed: 4,
      life: 80
    },
    celebration: {
      colors: ['#ec4899', '#f43f5e', '#8b5cf6', '#06b6d4'],
      particleCount: 50,
      speed: 5,
      life: 150
    }
  };

  const config = themeConfig[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const createParticle = (x: number, y: number, type: Particle['type'] = 'sparkle'): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * config.speed + 1) * intensity;
    
    return {
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: config.life,
      maxLife: config.life,
      size: Math.random() * 4 + 2,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      type
    };
  };

  const createBurst = (x: number, y: number) => {
    const burstCount = Math.floor(config.particleCount * intensity);
    for (let i = 0; i < burstCount; i++) {
      particlesRef.current.push(createParticle(x, y, 'burst'));
    }
  };

  const updateParticles = () => {
    const particles = particlesRef.current;
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Apply gravity for burst particles
      if (particle.type === 'burst') {
        particle.vy += 0.1;
        particle.vx *= 0.99;
      }
      
      // Update life
      particle.life--;
      
      // Remove dead particles
      if (particle.life <= 0) {
        particles.splice(i, 1);
      }
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    particlesRef.current.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      
      if (particle.type === 'glow') {
        // Create glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(
          particle.x - particle.size * 2,
          particle.y - particle.size * 2,
          particle.size * 4,
          particle.size * 4
        );
      } else {
        // Draw sparkle/burst particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle effect
        if (particle.type === 'sparkle' && Math.random() > 0.7) {
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.size, particle.y);
          ctx.lineTo(particle.x + particle.size, particle.y);
          ctx.moveTo(particle.x, particle.y - particle.size);
          ctx.lineTo(particle.x, particle.y + particle.size);
          ctx.stroke();
        }
      }
      
      ctx.restore();
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !active) return;

    updateParticles();
    drawParticles(ctx);

    // Add new particles based on trigger type
    if (trigger === 'continuous' && Math.random() > 0.85) {
      const x = mousePosition?.x ?? Math.random() * dimensions.width;
      const y = mousePosition?.y ?? Math.random() * dimensions.height;
      particlesRef.current.push(createParticle(x, y));
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (active) {
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, mousePosition, trigger, theme, intensity]);

  // Handle click/burst triggers
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (trigger === 'click' || trigger === 'burst') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        createBurst(x, y);
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-${trigger === 'click' || trigger === 'burst' ? 'auto' : 'none'} ${className}`}
      onClick={handleCanvasClick}
      style={{ 
        width: '100%', 
        height: '100%',
        zIndex: trigger === 'click' || trigger === 'burst' ? 10 : 1
      }}
    />
  );
};

// Preset particle effects
export const MagicParticles: React.FC<Omit<ParticleSystemProps, 'theme'>> = (props) => (
  <ParticleSystem {...props} theme="magic" />
);

export const SuccessParticles: React.FC<Omit<ParticleSystemProps, 'theme'>> = (props) => (
  <ParticleSystem {...props} theme="success" />
);

export const EnergyParticles: React.FC<Omit<ParticleSystemProps, 'theme'>> = (props) => (
  <ParticleSystem {...props} theme="energy" />
);

export const CelebrationParticles: React.FC<Omit<ParticleSystemProps, 'theme'>> = (props) => (
  <ParticleSystem {...props} theme="celebration" />
);
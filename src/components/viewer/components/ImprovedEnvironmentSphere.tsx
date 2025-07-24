
import React, { useMemo } from 'react';
import type { EnvironmentScene, EnvironmentControls } from '../types';

interface ImprovedEnvironmentSphereProps {
  scene: EnvironmentScene;
  controls: EnvironmentControls;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const ImprovedEnvironmentSphere: React.FC<ImprovedEnvironmentSphereProps> = ({
  scene,
  controls,
  mousePosition,
  isHovering
}) => {
  // Use the scene's configured background image
  const environmentImage = scene.backgroundImage || scene.panoramicUrl;
  
  // Subtle lighting effect that follows mouse without jarring movement
  const lightingEffect = useMemo(() => ({
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
      ${scene.lighting.color}40 0%, 
      ${scene.lighting.color}20 30%,
      transparent 70%)`,
    mixBlendMode: 'overlay' as const
  }), [scene.lighting.color, mousePosition]);

  // Static depth layers with fixed positions
  const staticDepthLayers = useMemo(() => [
    { 
      depth: -300, 
      opacity: 0.2, 
      scale: 1.3, 
      blur: 8,
      mixBlend: 'multiply' as const
    },
    { 
      depth: -150, 
      opacity: 0.4, 
      scale: 1.15, 
      blur: 4,
      mixBlend: 'normal' as const
    },
    { 
      depth: -75, 
      opacity: 0.6, 
      scale: 1.08, 
      blur: 2,
      mixBlend: 'overlay' as const
    }
  ], []);

  // Atmospheric particles that move independently
  const atmosphericParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    return particles;
  }, []);

  // Depth of field calculation
  const depthOfFieldBlur = useMemo(() => {
    return Math.max(0, controls.depthOfField * 2);
  }, [controls.depthOfField]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main Environment Layer - Static with subtle breathing */}
      <div 
        className="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
        style={{
          backgroundImage: `url(${environmentImage})`,
          backgroundSize: '120% 120%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          transform: `scale(${1 + Math.sin(Date.now() * 0.0008) * 0.01})`,
          filter: `brightness(${scene.lighting.intensity}) contrast(1.1) saturate(1.2) blur(${depthOfFieldBlur}px)`,
          opacity: 0.9
        }}
      />

      {/* Static Depth Layers for 3D Effect */}
      {staticDepthLayers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${environmentImage})`,
            backgroundSize: `${120 * layer.scale}% ${120 * layer.scale}%`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            transform: `translateZ(${layer.depth}px) scale(${layer.scale})`,
            opacity: layer.opacity * (isHovering ? 1.2 : 1),
            filter: `blur(${layer.blur}px) brightness(${scene.lighting.intensity * 0.8})`,
            mixBlendMode: layer.mixBlend
          }}
        />
      ))}

      {/* Dynamic Lighting Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={lightingEffect}
      />

      {/* Volumetric Lighting Rays */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `conic-gradient(from ${mousePosition.x * 180}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            transparent 0deg, 
            ${scene.lighting.color} 5deg, 
            transparent 10deg, 
            transparent 170deg, 
            ${scene.lighting.color} 175deg, 
            transparent 180deg)`,
          transform: `rotate(${Math.sin(Date.now() * 0.001) * 2}deg)`,
          transition: 'transform 2s ease-in-out'
        }}
      />

      {/* Atmospheric Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {atmosphericParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              transform: `translateY(${Math.sin(Date.now() * 0.001 * particle.speed + particle.id) * 20}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        ))}
      </div>

      {/* Scene-specific Environmental Effects */}
      {scene.category === 'fantasy' && (
        <>
          {/* Magical sparkles */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, ${scene.lighting.color}60 0%, transparent 30%),
                radial-gradient(circle at 80% 20%, ${scene.lighting.color}40 0%, transparent 25%)
              `,
              mixBlendMode: 'screen',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />
        </>
      )}

      {scene.category === 'futuristic' && (
        <>
          {/* Digital grid overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(${scene.lighting.color} 1px, transparent 1px),
                linear-gradient(90deg, ${scene.lighting.color} 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `perspective(1000px) rotateX(60deg)`,
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />
        </>
      )}

      {scene.category === 'natural' && (
        <>
          {/* Gentle wind effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, ${scene.lighting.color}30 0%, transparent 60%)`,
              filter: 'blur(20px)',
              mixBlendMode: 'overlay',
              transform: `translateX(${Math.sin(Date.now() * 0.0005) * 10}px)`
            }}
          />
        </>
      )}

      {/* Subtle Card Shadow Projection */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100 + 20}%, 
            rgba(0,0,0,0.4) 0%, 
            rgba(0,0,0,0.2) 20%,
            transparent 40%)`,
          transform: 'translateY(20px)',
          filter: 'blur(15px)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Atmospheric Perspective */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, 
              transparent 0%, 
              rgba(0,0,0,0.1) 70%, 
              rgba(0,0,0,0.3) 100%)
          `,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Interactive Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(255,255,255,0.1) 0%, transparent 50%)`,
          opacity: isHovering ? 0.8 : 0.4
        }}
      />
    </div>
  );
};

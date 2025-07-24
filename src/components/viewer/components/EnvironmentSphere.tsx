
import React, { useMemo } from 'react';
import type { EnvironmentScene } from '../types';

interface EnvironmentSphereProps {
  scene: EnvironmentScene;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const EnvironmentSphere: React.FC<EnvironmentSphereProps> = ({
  scene,
  mousePosition,
  isHovering
}) => {
  // Use the scene's configured background image directly
  const environmentImage = scene.backgroundImage || scene.panoramicUrl;
  
  // Calculate parallax movement based on mouse position
  const parallaxOffset = useMemo(() => ({
    x: (mousePosition.x - 0.5) * 30,
    y: (mousePosition.y - 0.5) * 15
  }), [mousePosition]);

  // Create depth layers for immersion
  const depthLayers = useMemo(() => [
    { depth: -200, opacity: 0.3, scale: 1.2 },
    { depth: -100, opacity: 0.5, scale: 1.1 },
    { depth: -50, opacity: 0.7, scale: 1.05 }
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main Environment Sphere */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${environmentImage})`,
          backgroundSize: '200% 100%',
          backgroundPosition: `${50 + parallaxOffset.x * 0.5}% ${50 + parallaxOffset.y * 0.3}%`,
          backgroundRepeat: 'no-repeat',
          transform: `scale(${isHovering ? 1.02 : 1}) perspective(1000px) rotateY(${parallaxOffset.x * 0.1}deg) rotateX(${parallaxOffset.y * 0.05}deg)`,
          filter: `brightness(${scene.lighting.intensity}) contrast(1.1) saturate(1.2)`,
          opacity: 0.8
        }}
      />

      {/* Depth Layers for 3D Effect */}
      {depthLayers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            backgroundImage: `url(${environmentImage})`,
            backgroundSize: `${200 * layer.scale}% ${100 * layer.scale}%`,
            backgroundPosition: `${50 + parallaxOffset.x * (0.5 + index * 0.1)}% ${50 + parallaxOffset.y * (0.3 + index * 0.05)}%`,
            backgroundRepeat: 'no-repeat',
            transform: `translateZ(${layer.depth}px) scale(${layer.scale})`,
            opacity: layer.opacity * (isHovering ? 1.2 : 1),
            filter: `blur(${index + 1}px) brightness(${scene.lighting.intensity * 0.8})`,
            mixBlendMode: 'screen'
          }}
        />
      ))}

      {/* Atmospheric Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            ${scene.lighting.color}20 0%, 
            ${scene.lighting.color}10 40%,
            transparent 80%)`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Scene-specific environmental effects */}
      {scene.id === 'cyberpunk-city' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(45deg, transparent 30%, #ff008040 35%, transparent 40%),
              linear-gradient(-45deg, transparent 60%, #0080ff40 65%, transparent 70%)
            `,
            animation: 'pulse 3s ease-in-out infinite',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {scene.id === 'mountain' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 80% 20%, #ffa50060 0%, transparent 50%)`,
            filter: 'blur(40px)',
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {scene.id === 'crystal-cave' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, #4a5ee820 0%, transparent 30%),
              radial-gradient(ellipse at 50% 100%, #2c3e5040 0%, transparent 60%)
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Foreground atmospheric particles/effects */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(255,255,255,0.1) 0%, transparent 30%)`,
          transform: `translateX(${parallaxOffset.x * 0.2}px) translateY(${parallaxOffset.y * 0.1}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />
    </div>
  );
};


import React, { useMemo } from 'react';
import type { EnvironmentScene, EnvironmentControls } from '../types';

interface EnhancedEnvironmentSphereProps {
  scene: EnvironmentScene;
  controls: EnvironmentControls;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const EnhancedEnvironmentSphere: React.FC<EnhancedEnvironmentSphereProps> = ({
  scene,
  controls,
  mousePosition,
  isHovering
}) => {
  // Use the scene's configured background image directly
  const environmentImage = scene.backgroundImage || scene.panoramicUrl;
  
  // Subtle lighting effect instead of aggressive parallax
  const lightingEffect = useMemo(() => ({
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
      ${scene.lighting.color}30 0%, 
      ${scene.lighting.color}15 40%,
      transparent 70%)`,
    mixBlendMode: 'overlay' as const
  }), [scene.lighting.color, mousePosition]);

  // Field of view transform with reduced intensity
  const fovTransform = useMemo(() => {
    const fovScale = 1 + (controls.fieldOfView - 75) * 0.005; // Reduced from 0.01
    return `scale(${fovScale})`;
  }, [controls.fieldOfView]);

  // Atmospheric effects with reduced intensity
  const atmosphericStyle = useMemo(() => {
    if (!scene.atmosphere?.fog) return {};
    
    return {
      background: `
        radial-gradient(
          ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
          ${scene.atmosphere.fogColor}${Math.floor(scene.atmosphere.fogDensity * controls.atmosphericDensity * 128).toString(16).padStart(2, '0')} 0%, 
          transparent 60%
        )
      `,
      mixBlendMode: 'multiply' as const
    };
  }, [scene.atmosphere, mousePosition, controls.atmosphericDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main Environment - Reduced movement */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${environmentImage})`,
          backgroundSize: '120% 100%', // Reduced from 200%
          backgroundPosition: 'center center', // Fixed position
          backgroundRepeat: 'no-repeat',
          transform: `${fovTransform} scale(${isHovering ? 1.02 : 1})`, // Removed aggressive rotation
          filter: `brightness(${scene.lighting.intensity}) contrast(1.1) saturate(1.2) blur(${controls.depthOfField * 0.5}px)`,
          opacity: 0.9
        }}
      />

      {/* Static depth layers instead of moving parallax */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url(${environmentImage})`,
          backgroundSize: '130% 130%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: `blur(4px) brightness(${scene.lighting.intensity * 0.7})`,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Subtle lighting overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={lightingEffect}
      />

      {/* Atmospheric Fog Layer */}
      {scene.atmosphere?.fog && (
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={atmosphericStyle}
        />
      )}

      {/* Scene-specific environmental effects */}
      {scene.category === 'fantasy' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, ${scene.lighting.color}40 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${scene.lighting.color}30 0%, transparent 40%)
            `,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {scene.category === 'futuristic' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(45deg, transparent 30%, ${scene.lighting.color}20 35%, transparent 40%),
              linear-gradient(-45deg, transparent 60%, ${scene.lighting.color}15 65%, transparent 70%)
            `,
            animation: 'pulse 4s ease-in-out infinite',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {scene.category === 'natural' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${scene.lighting.color}20 0%, transparent 70%)`,
            filter: 'blur(30px)',
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Gentle ambient glow instead of aggressive interactive rays */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(255,255,255,0.2) 0%, transparent 40%)`,
          opacity: isHovering ? 0.2 : 0.1
        }}
      />
    </div>
  );
};

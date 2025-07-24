import React from 'react';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { type SpaceEnvironment } from '@/components/studio/EnvironmentSwitcher';

interface SpaceEnvironmentProps {
  environment: SpaceEnvironment;
  intensity?: number;
}

export const SpaceEnvironmentRenderer: React.FC<SpaceEnvironmentProps> = ({ 
  environment, 
  intensity = 1.0 
}) => {
  const getEnvironmentConfig = () => {
    switch (environment) {
      case 'starfield':
        return {
          stars: {
            radius: 300,
            depth: 60,
            count: 5000,
            factor: 7,
            saturation: 0,
            fade: true
          },
          lighting: {
            ambient: { intensity: 0.1 * intensity, color: '#4169E1' },
            directional: { 
              position: [10, 10, 5] as [number, number, number], 
              intensity: 0.3 * intensity, 
              color: '#E6E6FA' 
            }
          },
          background: '#000511'
        };

      case 'nebula':
        return {
          stars: {
            radius: 400,
            depth: 80,
            count: 4000,
            factor: 5,
            saturation: 0.3,
            fade: true
          },
          lighting: {
            ambient: { intensity: 0.2 * intensity, color: '#8A2BE2' },
            point: { 
              position: [0, 0, 10] as [number, number, number], 
              intensity: 0.5 * intensity, 
              color: '#FF69B4' 
            }
          },
          background: '#1a0d2e'
        };

      case 'deep_space':
        return {
          stars: {
            radius: 500,
            depth: 50,
            count: 3000,
            factor: 4,
            saturation: 0.1,
            fade: true
          },
          lighting: {
            ambient: { intensity: 0.05 * intensity, color: '#ffffff' },
            spot: { 
              position: [20, 20, 20] as [number, number, number], 
              intensity: 0.2 * intensity, 
              angle: 0.3,
              penumbra: 0.5,
              color: '#ffffff'
            }
          },
          background: '#000000'
        };

      case 'cinematic':
        return {
          stars: {
            radius: 250,
            depth: 40,
            count: 6000,
            factor: 8,
            saturation: 0.2,
            fade: true
          },
          lighting: {
            ambient: { intensity: 0.2 * intensity, color: '#1E1E3F' },
            key: { 
              position: [15, 15, 15] as [number, number, number], 
              intensity: 1.5 * intensity, 
              color: '#FFFFFF' 
            },
            accent: { 
              position: [0, -10, 0] as [number, number, number], 
              intensity: 0.8 * intensity, 
              color: '#FF6B35' 
            }
          },
          background: '#0a0a2e'
        };

      case 'clean':
        return {
          stars: {
            radius: 200,
            depth: 30,
            count: 2000,
            factor: 3,
            saturation: 0,
            fade: true
          },
          lighting: {
            ambient: { intensity: 0.4 * intensity, color: '#E6E6FA' },
            key: { 
              position: [5, 5, 5] as [number, number, number], 
              intensity: 0.8 * intensity, 
              color: '#FFFFFF' 
            },
            fill: { 
              position: [-5, 2, 5] as [number, number, number], 
              intensity: 0.4 * intensity, 
              color: '#F0F8FF' 
            }
          },
          background: '#0f0f23'
        };

      case 'cinematic_deep_space':
        return {
          stars: {
            radius: 600,
            depth: 120,
            count: 8000,
            factor: 12,
            saturation: 0.1,
            fade: true
          },
          lighting: {
            ambient: { intensity: 0.15 * intensity, color: '#1a1a2e' },
            key: { 
              position: [20, 15, 25] as [number, number, number], 
              intensity: 1.8 * intensity, 
              color: '#ffffff' 
            },
            rim: { 
              position: [-15, 10, -20] as [number, number, number], 
              intensity: 0.6 * intensity, 
              color: '#4a90e2' 
            },
            accent: { 
              position: [0, -20, 0] as [number, number, number], 
              intensity: 0.3 * intensity, 
              color: '#6a4c93' 
            }
          },
          background: '#000005'
        };

      default:
        return {
          stars: {
            radius: 300,
            depth: 60,
            count: 5000,
            factor: 7,
            saturation: 0,
            fade: true
          },
          lighting: {
            ambient: { intensity: 0.1 * intensity, color: '#4169E1' }
          },
          background: '#000511'
        };
    }
  };

  const config = getEnvironmentConfig();

  return (
    <>
      {/* Background Color */}
      <color attach="background" args={[config.background]} />
      
      {/* Stars */}
      <Stars 
        radius={config.stars.radius}
        depth={config.stars.depth}
        count={config.stars.count}
        factor={config.stars.factor}
        saturation={config.stars.saturation}
        fade={config.stars.fade}
      />
      
      {/* Ambient Light */}
      <ambientLight 
        intensity={config.lighting.ambient.intensity} 
        color={config.lighting.ambient.color} 
      />
      
      {/* Directional Light */}
      {config.lighting.directional && (
        <directionalLight 
          position={config.lighting.directional.position}
          intensity={config.lighting.directional.intensity}
          color={config.lighting.directional.color}
        />
      )}
      
      {/* Point Light */}
      {config.lighting.point && (
        <pointLight 
          position={config.lighting.point.position}
          intensity={config.lighting.point.intensity}
          color={config.lighting.point.color}
        />
      )}
      
      {/* Spot Light */}
      {config.lighting.spot && (
        <spotLight 
          position={config.lighting.spot.position}
          intensity={config.lighting.spot.intensity}
          angle={config.lighting.spot.angle}
          penumbra={config.lighting.spot.penumbra}
          color={config.lighting.spot.color}
        />
      )}
      
      {/* Key Light (for cinematic) */}
      {config.lighting.key && (
        <directionalLight 
          position={config.lighting.key.position}
          intensity={config.lighting.key.intensity}
          color={config.lighting.key.color}
        />
      )}
      
      {/* Fill Light (for clean) */}
      {config.lighting.fill && (
        <directionalLight 
          position={config.lighting.fill.position}
          intensity={config.lighting.fill.intensity}
          color={config.lighting.fill.color}
        />
      )}
      
      {/* Accent Light (for cinematic) */}
      {config.lighting.accent && (
        <pointLight 
          position={config.lighting.accent.position}
          intensity={config.lighting.accent.intensity}
          color={config.lighting.accent.color}
        />
      )}
      
      {/* Rim Light (for cinematic_deep_space) */}
      {config.lighting.rim && (
        <directionalLight 
          position={config.lighting.rim.position}
          intensity={config.lighting.rim.intensity}
          color={config.lighting.rim.color}
        />
      )}
    </>
  );
};
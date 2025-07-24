import React from 'react';
import * as THREE from 'three';
import { MonolithMaterial } from './MonolithMaterial';
import { type MaterialMode } from '../types/CRDTypes';


interface MaterialSystemProps {
  mode: MaterialMode;
  intensity: number;
  type: 'card' | 'case';
  pathTheme?: 'sports' | 'fantasy' | 'life';
  animationProgress?: number;
}

export const MaterialSystem: React.FC<MaterialSystemProps> = ({ 
  mode, 
  intensity, 
  type,
  pathTheme = 'neutral',
  animationProgress = 0
}) => {
  const time = Date.now() * 0.001;

  // Card Materials
  if (type === 'card') {
    switch (mode) {
      // Premium Visual Styles
      case 'matte':
      case 'MattePaper':
        return (
          <meshStandardMaterial 
            color="#2a2a2a"
            metalness={0}
            roughness={0.8}
            emissive="#1a1a1a"
            emissiveIntensity={0.05 * intensity}
          />
        );

      case 'basicFoil':
      case 'StandardFoil':
        return (
          <meshStandardMaterial 
            color="#e8e8e8"
            metalness={0.7}
            roughness={0.2}
            emissive="#cccccc"
            emissiveIntensity={0.1 * intensity}
            envMapIntensity={1.5}
          />
        );

      case 'classicGloss':
      case 'GlossyCard':
        return (
          <meshStandardMaterial 
            color="#ffffff"
            metalness={0.1}
            roughness={0.02}
            emissive="#f0f0f0"
            emissiveIntensity={0.08 * intensity}
            envMapIntensity={2}
          />
        );

      case 'holoBurst':
      case 'PrismaticFoil':
        const hue = (time * 80) % 360;
        const emissiveHue = (time * 100) % 360;
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(hue / 360, 0.9, 0.7)}
            metalness={1}
            roughness={0.05}
            emissive={new THREE.Color().setHSL(emissiveHue / 360, 1, 0.5)}
            emissiveIntensity={1.2 * intensity}
            envMapIntensity={5}
            transparent={true}
            opacity={0.3}
          />
        );

      case 'crystalInterference':
      case 'CrystalClear':
        return (
          <meshPhysicalMaterial
            color="#e6f7ff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            transparent={true}
            opacity={0.3}
            thickness={0.1}
            ior={2.4}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#80d4ff"
            emissiveIntensity={0.3 * intensity}
            side={THREE.DoubleSide}
            envMapIntensity={4}
          />
        );

      case 'chromeBurst':
      case 'ChromeMetal':
        return (
          <meshStandardMaterial 
            color="#c0c0c0"
            metalness={1}
            roughness={0.01}
            emissive="#808080"
            emissiveIntensity={0.2 * intensity}
            envMapIntensity={3}
          />
        );

      case 'vintageBoil':
      case 'AgedFoil':
        return (
          <meshStandardMaterial 
            color="#d4af37"
            metalness={0.6}
            roughness={0.3}
            emissive="#b8860b"
            emissiveIntensity={0.15 * intensity}
            envMapIntensity={1.8}
          />
        );

      case 'oceanWaves':
      case 'FluidFoil':
        // Create flowing oceanic color transition
        const waveTime = time * 0.8;
        const flow1 = Math.sin(waveTime) * 0.3 + 0.7;
        const flow2 = Math.cos(waveTime * 1.3) * 0.2 + 0.8;
        const flow3 = Math.sin(waveTime * 0.7) * 0.4 + 0.6;
        
        const oceanHue = (180 + Math.sin(waveTime * 0.5) * 40) / 360; // Blue to cyan range
        const waveColor = new THREE.Color().setHSL(oceanHue, flow2, flow1 * 0.6);
        const emissiveColor = new THREE.Color().setHSL((oceanHue + 0.1) % 1, flow3, 0.3);
        
        return (
          <meshStandardMaterial 
            color={waveColor}
            metalness={0.4 + flow3 * 0.3}
            roughness={0.05 + flow1 * 0.1}
            emissive={emissiveColor}
            emissiveIntensity={(0.6 + flow2 * 0.4) * intensity}
            envMapIntensity={3 + flow1 * 2}
            transparent
            opacity={0.95}
          />
        );

      // Original animation-based materials
      case 'ice':
        return (
          <meshPhysicalMaterial
            color="#e6f3ff"
            metalness={0}
            roughness={0}
            transmission={0.98}
            transparent={true}
            opacity={0.4}
            thickness={0.2}
            ior={1.309}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#cce7ff"
            emissiveIntensity={0.05 * intensity}
            side={THREE.DoubleSide}
          />
        );
      
      case 'gold':
        return (
          <meshStandardMaterial 
            color="#ffed4e"
            metalness={1}
            roughness={0.02}
            emissive="#ff9500"
            emissiveIntensity={0.4 * intensity}
            envMapIntensity={2}
          />
        );
      
      case 'glass':
        return (
          <meshPhysicalMaterial
            color="#e6f7ff"
            metalness={0}
            roughness={0}
            transmission={0.99}
            transparent={true}
            opacity={0.6}
            thickness={0.15}
            ior={2.417}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#b3e0ff"
            emissiveIntensity={0.08 * intensity}
            side={THREE.DoubleSide}
            envMapIntensity={3}
          />
        );
      
      case 'holo':
        const holoHue = (time * 50) % 360;
        const holoEmissiveHue = (time * 70) % 360;
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(holoHue / 360, 0.8, 0.6)}
            metalness={1}
            roughness={0.1}
            emissive={new THREE.Color().setHSL(holoEmissiveHue / 360, 0.9, 0.4)}
            emissiveIntensity={0.8 * intensity}
            envMapIntensity={4}
          />
        );

      // Path-specific materials
      case 'sports':
        return (
          <meshStandardMaterial 
            color="#1a472a"
            metalness={0.3}
            roughness={0.4}
            emissive="#0f2817"
            emissiveIntensity={0.2 * intensity}
            envMapIntensity={1.2}
          />
        );

      case 'fantasy':
        const fantasyHue = (time * 30) % 360;
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(fantasyHue / 360, 0.7, 0.5)}
            metalness={0.8}
            roughness={0.2}
            emissive={new THREE.Color().setHSL((fantasyHue + 60) / 360, 0.8, 0.3)}
            emissiveIntensity={0.6 * intensity}
            envMapIntensity={3}
          />
        );

      case 'life':
        return (
          <meshStandardMaterial 
            color="#8b4513"
            metalness={0.1}
            roughness={0.6}
            emissive="#3d1a00"
            emissiveIntensity={0.1 * intensity}
          envMapIntensity={0.8}
          />
        );

      // New Premium Materials
      case 'woodGrain':
      case 'WoodGrain':
        return (
          <meshStandardMaterial 
            color="#8b4513"
            metalness={0}
            roughness={0.9}
            emissive="#5d2f0a"
            emissiveIntensity={0.05 * intensity}
            envMapIntensity={0.3}
          />
        );

      case 'spectralPrism':
      case 'SpectralPrism':
        const spectrumHue = (time * 120) % 360;
        const spectrum2 = (time * 100 + 120) % 360;
        const spectrum3 = (time * 80 + 240) % 360;
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(spectrumHue / 360, 1, 0.6)}
            metalness={0.3}
            roughness={0.1}
            emissive={new THREE.Color().setHSL(spectrum2 / 360, 1, 0.4)}
            emissiveIntensity={1.5 * intensity}
            envMapIntensity={6}
          />
        );

      case 'emeraldGem':
      case 'EmeraldGem':
        return (
          <meshPhysicalMaterial
            color="#50c878"
            metalness={0}
            roughness={0}
            transmission={0.7}
            transparent={true}
            opacity={0.8}
            thickness={0.3}
            ior={1.57} // Emerald IOR
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#228b22"
            emissiveIntensity={0.2 * intensity}
          side={THREE.DoubleSide}
          envMapIntensity={4}
        />
      );

      case 'liquidSwirl':
      case 'LiquidSwirl':
        // Liquid swirl with multiple flowing layers
        const swirl1 = (time * 60) % 360;
        const swirl2 = (time * 80 + 120) % 360;
        const swirl3 = (time * 40 + 240) % 360;
        const flowSpeed = time * 0.5;
        
        // Create flowing blue-cyan base with animated swirls
        const liquidHue = (swirl1 + Math.sin(flowSpeed) * 30 + 200) / 360; // Blue-cyan range
        const liquidSat = 0.8 + Math.sin(time * 3) * 0.2; // Pulsing saturation
        const liquidLight = 0.4 + Math.sin(time * 2) * 0.2; // Breathing luminosity
        
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(liquidHue, liquidSat, liquidLight)}
            metalness={0.1}
            roughness={0.05}
            emissive={new THREE.Color().setHSL((swirl2 + 180) / 360, 0.6, 0.3)}
            emissiveIntensity={0.8 + Math.sin(time * 4) * 0.4}
            envMapIntensity={3 + Math.sin(time * 1.5) * 1}
            transparent={true}
            opacity={0.9}
          />
        );

      case 'rubyGem':
      case 'RubyGem':
        return (
          <meshPhysicalMaterial
            color="#e0115f"
            metalness={0}
            roughness={0}
            transmission={0.6}
            transparent={true}
            opacity={0.85}
            thickness={0.3}
            ior={1.76} // Ruby IOR
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#dc143c"
            emissiveIntensity={0.3 * intensity}
            side={THREE.DoubleSide}
            envMapIntensity={5}
          />
        );

      case 'sapphireGem':
      case 'SapphireGem':
        return (
          <meshPhysicalMaterial
            color="#0f52ba"
            metalness={0}
            roughness={0}
            transmission={0.65}
            transparent={true}
            opacity={0.82}
            thickness={0.3}
            ior={1.77} // Sapphire IOR
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#4169e1"
            emissiveIntensity={0.25 * intensity}
            side={THREE.DoubleSide}
            envMapIntensity={5}
          />
        );

      case 'diamondGem':
      case 'DiamondGem':
        return (
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            transparent={true}
            opacity={0.1}
            thickness={0.2}
            ior={2.42} // Diamond IOR - highest refractive index
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#ffffff"
            emissiveIntensity={0.1 * intensity}
            side={THREE.DoubleSide}
            envMapIntensity={8}
          />
        );

      case 'goldLeaf':
      case 'GoldLeaf':
        return (
          <meshStandardMaterial 
            color="#ffd700"
            metalness={1}
            roughness={0.1}
            emissive="#ffb300"
            emissiveIntensity={0.4 * intensity}
            envMapIntensity={3}
          />
        );

      case 'obsidian':
      case 'Obsidian':
        return (
          <meshStandardMaterial 
            color="#0a0a0a"
            metalness={0.2}
            roughness={0.05}
            emissive="#1a1a1a"
            emissiveIntensity={0.1 * intensity}
            envMapIntensity={6}
          />
        );
      
      case 'opalescent':
      case 'Opalescent':
        const opalHue1 = (time * 60) % 360;
        const opalHue2 = (time * 90 + 120) % 360;
        const opalHue3 = (time * 45 + 240) % 360;
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(opalHue1 / 360, 0.7, 0.8)}
            metalness={0.1}
            roughness={0.3}
            emissive={new THREE.Color().setHSL(opalHue2 / 360, 0.8, 0.4)}
            emissiveIntensity={0.6 + Math.sin(time * 3) * 0.3}
            envMapIntensity={4 + Math.sin(time * 2) * 2}
            transparent={true}
            opacity={0.9}
          />
        );
      
      
      case 'monolith':
        // Enhanced 2001-inspired monolith material
        return <MonolithMaterial intensity={intensity} animationProgress={animationProgress} />;
      
      default:
        // Default showcase material
        return (
          <meshStandardMaterial 
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.1}
            emissive="#0f0f2a"
            emissiveIntensity={(mode === 'showcase' ? 0.3 : 0.05) * intensity}
            envMapIntensity={1.5}
          />
        );
    }
  }
  
  // Glass Case Material
  if (type === 'case') {
    return (
      <meshStandardMaterial 
        color="#e6f3ff"
        metalness={0}
        roughness={0}
        transparent
        opacity={0.12}
        emissive="#ffffff"
        emissiveIntensity={0.03 * intensity}
      />
    );
  }

  // Fallback
  return <meshStandardMaterial color="#666666" />;
};
// Core CRD Types
export type AnimationMode = 'monolith' | 'showcase' | 'ice' | 'gold' | 'glass' | 'holo' | 'alignment';

export type MaterialMode = 
  | 'monolith' 
  | 'showcase' 
  | 'ice' 
  | 'gold' 
  | 'glass' 
  | 'holo'
  | 'alignment'
  | 'glass-case'
  | 'sports'      // Future: Sports path theming
  | 'fantasy'     // Future: Fantasy/Sci-Fi path theming  
  | 'life'        // Future: Life path theming
  // Premium Visual Styles
  | 'matte'
  | 'MattePaper'
  | 'basicFoil'
  | 'StandardFoil'
  | 'classicGloss'
  | 'GlossyCard'
  | 'holoBurst'
  | 'PrismaticFoil'
  | 'crystalInterference'
  | 'CrystalClear'
  | 'chromeBurst'
  | 'ChromeMetal'
  | 'vintageBoil'
  | 'AgedFoil'
  | 'oceanWaves'
  | 'FluidFoil'
  // New Materials
  | 'woodGrain'
  | 'WoodGrain'
  | 'spectralPrism'
  | 'SpectralPrism'
  | 'emeraldGem'
  | 'EmeraldGem'
  | 'liquidSwirl'
  | 'LiquidSwirl'
  | 'rubyGem'
  | 'RubyGem'
  | 'sapphireGem'
  | 'SapphireGem'
  | 'diamondGem'
  | 'DiamondGem'
  | 'goldLeaf'
  | 'GoldLeaf'
  | 'obsidian'
  | 'Obsidian'
  | 'opalescent'
  | 'Opalescent';

export type LightingPreset = 
  | 'studio'
  | 'dramatic'
  | 'soft'
  | 'sports-arena'    // Future: Sports path lighting
  | 'sci-fi-arcade'   // Future: Fantasy/Sci-Fi path lighting
  | 'nature-preserve' // Future: Life path lighting
  | 'showcase';

export type PathTheme = 'sports' | 'fantasy' | 'life' | 'neutral';

export interface CRDTransform {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export interface CRDViewerConfig {
  animationMode: AnimationMode;
  materialMode?: MaterialMode;
  lightingPreset: LightingPreset;
  pathTheme: PathTheme;
  intensity: number;
  enableInteraction: boolean;
  enableGlassCase: boolean;
  autoRotate: boolean;
}

// Future: Achievement Pet Integration
export interface PetInteractionEvent {
  type: 'card-created' | 'card-sold' | 'crd-earned' | 'community-like';
  data: any;
}

// Future: Virtual Space Integration  
export interface VirtualSpaceConfig {
  spaceType: PathTheme;
  ambientEffects: boolean;
  interactiveElements: string[];
}

import * as THREE from 'three';
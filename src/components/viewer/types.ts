
import type { CardData } from '@/types/card';

export interface EnvironmentScene {
  id: string;
  name: string;
  type: '2d' | '3d';
  icon: string;
  category: 'natural' | 'fantasy' | 'futuristic' | 'architectural' | 'professional' | 'luxury' | 'artistic' | 'abstract' | 'minimalist';
  description: string;
  panoramicUrl: string;
  previewUrl: string;
  // Legacy properties for backward compatibility
  backgroundImage?: string;
  gradient?: string;
  lighting: {
    color: string;
    intensity: number;
    elevation: number;
    azimuth: number;
  };
  atmosphere: {
    fog: boolean;
    fogColor: string;
    fogDensity: number;
    particles: boolean;
  };
  depth: {
    layers: number;
    parallaxIntensity: number;
    fieldOfView: number;
  };
}

export interface LightingPreset {
  id: string;
  name: string;
  description: string;
  brightness: number;
  contrast: number;
  shadows: number;
  highlights: number;
  temperature: number;
  position: { x: number; y: number; z: number };
  shadowSoftness: number;
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
  category: 'prismatic' | 'metallic' | 'surface' | 'vintage';
}

export interface MaterialSettings {
  metalness: number;
  roughness: number;
  reflectivity: number;
  clearcoat: number;
}

export interface EnvironmentControls {
  depthOfField: number;
  parallaxIntensity: number;
  fieldOfView: number;
  atmosphericDensity: number;
}

export interface ImmersiveCardViewerProps {
  card: CardData;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

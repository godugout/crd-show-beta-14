
import type { LightingPreset } from '../types';

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Balanced natural lighting',
    brightness: 90,
    contrast: 90,
    shadows: 40,
    highlights: 65,
    temperature: 5500,
    position: { x: 0, y: 1, z: 1 },
    shadowSoftness: 25
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic lighting',
    brightness: 120,
    contrast: 150,
    shadows: 80,
    highlights: 90,
    temperature: 4000,
    position: { x: 1, y: 0.5, z: 0.5 },
    shadowSoftness: 10
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle diffused lighting',
    brightness: 90,
    contrast: 80,
    shadows: 30,
    highlights: 60,
    temperature: 6000,
    position: { x: 0, y: 1, z: 0 },
    shadowSoftness: 40
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Enhanced color vibrancy',
    brightness: 110,
    contrast: 130,
    shadows: 40,
    highlights: 85,
    temperature: 5800,
    position: { x: -0.5, y: 1, z: 1 },
    shadowSoftness: 25
  }
];

import { Sparkles, Zap, Gem, Clock, Flame, Snowflake, Sun, Moon, Star, Zap as ChromeIcon, Waves } from 'lucide-react';
import type { ComboPreset } from './types';

export const COMBO_PRESETS: ComboPreset[] = [
  {
    id: 'holographic-burst',
    name: 'Holographic',
    icon: Sparkles,
    description: 'Rainbow holographic with chrome accents',
    materialHint: 'Deep blue holographic surface',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 270, animated: true },
      chrome: { intensity: 45, sharpness: 80, highlightSize: 60 }
    }
  },
  {
    id: 'metallic-prizm',
    name: 'Prizm',
    icon: Gem,
    description: 'Subtle spectrum film with balanced color',
    materialHint: 'Delicate spectrum film over card surface',
    effects: {
      prizm: { intensity: 40, complexity: 4, colorSeparation: 60 },
      brushedmetal: { intensity: 25, direction: 45, grainDensity: 8 }
    }
  },
  {
    id: 'crystal-interference',
    name: 'Crystal',
    icon: Zap,
    description: 'Crystal facets with soap bubble effects',
    materialHint: 'Translucent crystal surface with light dispersion',
    effects: {
      crystal: { intensity: 80, facets: 12, dispersion: 85, clarity: 60, sparkle: true },
      interference: { intensity: 60, frequency: 15, thickness: 4 }
    }
  },
  {
    id: 'vintage-foil',
    name: 'Vintage',
    icon: Clock,
    description: 'Aged patina with metallic foil spray',
    materialHint: 'Weathered surface with vintage texture',
    effects: {
      vintage: { intensity: 65, aging: 70, patina: '#8b6914' },
      foilspray: { intensity: 50, density: 60, direction: 90 }
    }
  },
  {
    id: 'golden-fire',
    name: 'Golden',
    icon: Flame,
    description: 'Warm gold tones with chromatic shift',
    materialHint: 'Rich golden surface with warm reflections',
    effects: {
      gold: { intensity: 75, shimmerSpeed: 80, platingThickness: 5, goldTone: 'rich', reflectivity: 85, colorEnhancement: true },
      chrome: { intensity: 40, sharpness: 60, highlightSize: 50 }
    }
  },
  {
    id: 'ice-crystal',
    name: 'Ice',
    icon: Snowflake,
    description: 'Cool crystal with silver highlights',
    materialHint: 'Frosted crystal surface with silver accents',
    effects: {
      crystal: { intensity: 70, facets: 8, dispersion: 70, clarity: 60, sparkle: true },
      chrome: { intensity: 35, sharpness: 90, highlightSize: 40 }
    }
  },
  {
    id: 'aurora-flare',
    name: 'Aurora',
    icon: Sun,
    description: 'Aurora-like effect with dynamic wave movement',
    materialHint: 'Shimmering aurora with flowing blue-green waves',
    effects: {
      aurora: { intensity: 70, waveSpeed: 120, colorShift: 180 },
      waves: { intensity: 35, frequency: 8, amplitude: 25, direction: 135, complexity: 3, wobble: 30 },
      interference: { intensity: 25, frequency: 6, thickness: 2 }
    }
  },
  {
    id: 'lunar-shimmer',
    name: 'Lunar',
    icon: Moon,
    description: 'Subtle interference with vintage charm',
    materialHint: 'Soft silvery surface with gentle interference patterns',
    effects: {
      interference: { intensity: 45, frequency: 12, thickness: 3 },
      vintage: { intensity: 35, aging: 40, patina: '#c0c0c0' }
    }
  },
  {
    id: 'starlight-spray',
    name: 'Starlight',
    icon: Star,
    description: 'Sparkling foil spray with atmospheric layers',
    materialHint: 'Metallic chrome surface with starlight atmosphere',
    effects: {
      foilspray: { intensity: 65, density: 80, direction: 135 },
      prizm: { intensity: 35, complexity: 4, colorSeparation: 50 }
    }
  },
  {
    id: 'chrome-burst',
    name: 'Chrome',
    icon: ChromeIcon,
    description: 'Pure chrome with brushed metal finish',
    materialHint: 'Polished chrome surface with directional brushing',
    effects: {
      chrome: { intensity: 80, sharpness: 95, highlightSize: 70 },
      brushedmetal: { intensity: 40, direction: 90, grainDensity: 8 }
    }
  },
  {
    id: 'ocean-waves',
    name: 'Ocean',
    icon: Waves,
    description: 'Gentle ocean waves with subtle prismatic light refraction',
    materialHint: 'Calm ocean surface with natural wave movement',
    effects: {
      waves: { intensity: 45, frequency: 6, amplitude: 35, direction: 0, complexity: 3, wobble: 25 },
      interference: { intensity: 25, frequency: 8, thickness: 3 },
      prizm: { intensity: 15, complexity: 2, colorSeparation: 30 }
    }
  }
];

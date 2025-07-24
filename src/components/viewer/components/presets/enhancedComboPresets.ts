import { Sparkles, Zap, Gem, Clock, Flame, Snowflake, Sun, Moon, Star, Waves, Chrome, Diamond, Palette } from 'lucide-react';
import type { ComboPreset } from './types';

export const ENHANCED_COMBO_PRESETS: ComboPreset[] = [
  {
    id: 'custom-style',
    name: 'Custom',
    icon: Palette,
    emoji: '🎨',
    category: 'Personal',
    description: 'Create your own unique style with simplified controls',
    materialHint: 'Customizable surface with your personal touch',
    tags: ['Personal', 'Creative', 'Custom'],
    effects: {} // Will be handled specially
  },
  {
    id: 'holographic-burst',
    name: 'Holographic',
    icon: Sparkles,
    emoji: '🌈',
    category: 'Premium',
    description: 'Classic holographic trading card with rainbow shimmer',
    materialHint: 'Deep holographic surface with rainbow color shifts',
    tags: ['Popular', 'Trading Cards', 'Premium'],
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 270, animated: true },
      chrome: { intensity: 45, sharpness: 80, highlightSize: 60 }
    }
  },
  {
    id: 'crystal-interference',
    name: 'Crystal',
    icon: Diamond,
    emoji: '💎',
    category: 'Specialty',
    description: 'Multi-faceted crystal with geometric light patterns',
    materialHint: 'Translucent crystal surface with brilliant light dispersion',
    tags: ['Luxury', 'Geometric', 'Brilliant'],
    effects: {
      crystal: { intensity: 80, facets: 12, dispersion: 85, clarity: 60, sparkle: true },
      interference: { intensity: 60, frequency: 15, thickness: 4 }
    }
  },
  {
    id: 'chrome-burst',
    name: 'Chrome',
    icon: Chrome,
    emoji: '🪞',
    category: 'Metallic',
    description: 'Ultra-reflective chrome finish with sharp highlights',
    materialHint: 'Polished chrome surface with mirror-like reflections',
    tags: ['Modern', 'Reflective', 'Sharp'],
    effects: {
      chrome: { intensity: 80, sharpness: 95, highlightSize: 70 },
      brushedmetal: { intensity: 40, direction: 90, grainDensity: 8 }
    }
  },
  {
    id: 'golden-fire',
    name: 'Golden',
    icon: Flame,
    emoji: '🏆',
    category: 'Premium',
    description: 'Luxurious gold finish with warm reflections',
    materialHint: 'Rich golden surface with authentic shimmer',
    tags: ['Luxury', 'Warm', 'Premium'],
    effects: {
      gold: { intensity: 75, shimmerSpeed: 80, platingThickness: 5, goldTone: 'rich', reflectivity: 85, colorEnhancement: true },
      chrome: { intensity: 40, sharpness: 60, highlightSize: 50 }
    }
  },
  {
    id: 'ocean-waves',
    name: 'Ocean',
    icon: Waves,
    emoji: '🌊',
    category: 'Atmospheric',
    description: 'Gentle ocean waves with natural movement',
    materialHint: 'Calm ocean surface with flowing wave patterns',
    tags: ['Natural', 'Flowing', 'Calm'],
    effects: {
      waves: { intensity: 45, frequency: 6, amplitude: 35, direction: 0, complexity: 3, wobble: 25 },
      interference: { intensity: 25, frequency: 8, thickness: 3 },
      prizm: { intensity: 15, complexity: 2, colorSeparation: 30 }
    }
  },
  {
    id: 'aurora-flare',
    name: 'Aurora',
    icon: Sun,
    emoji: '🌌',
    category: 'Atmospheric',
    description: 'Aurora-like effect with dynamic color shifts',
    materialHint: 'Shimmering aurora with flowing light waves',
    tags: ['Dynamic', 'Colorful', 'Magical'],
    effects: {
      aurora: { intensity: 70, waveSpeed: 120, colorShift: 180 },
      waves: { intensity: 35, frequency: 8, amplitude: 25, direction: 135, complexity: 3, wobble: 30 },
      interference: { intensity: 25, frequency: 6, thickness: 2 }
    }
  },
  {
    id: 'metallic-prizm',
    name: 'Prizm',
    icon: Gem,
    emoji: '🔮',
    category: 'Specialty',
    description: 'Subtle spectrum film with balanced color separation',
    materialHint: 'Delicate spectrum film over metallic surface',
    tags: ['Balanced', 'Spectrum', 'Subtle'],
    effects: {
      prizm: { intensity: 40, complexity: 4, colorSeparation: 60 },
      brushedmetal: { intensity: 25, direction: 45, grainDensity: 8 }
    }
  },
  {
    id: 'vintage-foil',
    name: 'Vintage',
    icon: Clock,
    emoji: '📜',
    category: 'Classic',
    description: 'Aged patina with classic metallic foil',
    materialHint: 'Weathered surface with vintage character',
    tags: ['Classic', 'Aged', 'Character'],
    effects: {
      vintage: { intensity: 65, aging: 70, patina: '#8b6914' },
      foilspray: { intensity: 50, density: 60, direction: 90 }
    }
  },
  {
    id: 'ice-crystal',
    name: 'Ice',
    icon: Snowflake,
    emoji: '❄️',
    category: 'Atmospheric',
    description: 'Cool crystal surface with silver highlights',
    materialHint: 'Frosted crystal with natural ice patterns',
    tags: ['Cool', 'Natural', 'Crisp'],
    effects: {
      crystal: { intensity: 70, facets: 8, dispersion: 70, clarity: 60, sparkle: true },
      chrome: { intensity: 35, sharpness: 90, highlightSize: 40 }
    }
  },
  {
    id: 'starlight-spray',
    name: 'Starlight',
    icon: Star,
    emoji: '✨',
    category: 'Atmospheric',
    description: 'Sparkling foil spray with atmospheric shimmer',
    materialHint: 'Metallic surface with starlight atmosphere',
    tags: ['Sparkling', 'Atmospheric', 'Shimmer'],
    effects: {
      foilspray: { intensity: 65, density: 80, direction: 135 },
      prizm: { intensity: 35, complexity: 4, colorSeparation: 50 }
    }
  },
  {
    id: 'lunar-shimmer',
    name: 'Lunar',
    icon: Moon,
    emoji: '🌙',
    category: 'Classic',
    description: 'Subtle interference with vintage space charm',
    materialHint: 'Soft silvery surface with gentle patterns',
    tags: ['Subtle', 'Vintage', 'Space'],
    effects: {
      interference: { intensity: 45, frequency: 12, thickness: 3 },
      vintage: { intensity: 35, aging: 40, patina: '#c0c0c0' }
    }
  }
];

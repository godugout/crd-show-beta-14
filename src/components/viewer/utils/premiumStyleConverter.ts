import type { CRDVisualStyle } from '@/types/premiumVisualStyles';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

/**
 * Converts Premium Visual Style configuration to EffectValues format
 * Maps Premium Style properties to existing effect parameters
 */
export const convertPremiumStyleToEffects = (style: CRDVisualStyle): EffectValues => {
  console.log('🔄 convertPremiumStyleToEffects: Converting style:', style.id, style.displayName);
  const effects: EffectValues = {};

  // Map based on style ID and configuration
  switch (style.id) {
    case 'holographic-burst':
      console.log('🌈 Converting holographic-burst style');
      effects.holographic = {
        intensity: 80,
        shiftSpeed: 180,
        rainbowSpread: 300,
        animated: true
      };
      effects.chrome = {
        intensity: 60,
        sharpness: 85,
        highlightSize: 65
      };
      break;

    case 'crystal-interference':
      console.log('💎 Converting crystal-interference style');
      effects.crystal = {
        intensity: 75,
        facets: 15,
        dispersion: 90,
        clarity: 70,
        sparkle: true
      };
      effects.interference = {
        intensity: 65,
        frequency: 18,
        thickness: 5
      };
      break;

    case 'chrome-burst':
      effects.chrome = {
        intensity: 85,
        sharpness: 98,
        highlightSize: 80
      };
      effects.brushedmetal = {
        intensity: 55,
        direction: 90,
        grainDensity: 10
      };
      break;

    case 'golden-fire':
      effects.gold = {
        intensity: 75,
        shimmerSpeed: 120,
        platingThickness: 7,
        goldTone: 'rich',
        reflectivity: 90,
        colorEnhancement: true
      };
      effects.chrome = {
        intensity: 55,
        sharpness: 70,
        highlightSize: 55
      };
      break;

    case 'ocean-waves':
      effects.waves = {
        intensity: 60,
        frequency: 8,
        amplitude: 40,
        direction: 0,
        complexity: 4,
        wobble: 35
      };
      effects.interference = {
        intensity: 30,
        frequency: 10,
        thickness: 3
      };
      effects.prizm = {
        intensity: 20,
        complexity: 3,
        colorSeparation: 40
      };
      break;

    // Free styles with simpler effects
    case 'basic-foil':
      effects.foilspray = {
        intensity: 60,
        density: 70,
        direction: 45
      };
      break;

    case 'matte-classic':
      // Minimal effects for matte finish
      effects.vintage = {
        intensity: 20,
        aging: 10,
        patina: '#666666'
      };
      break;

    case 'clear-gloss':
      effects.crystal = {
        intensity: 40,
        facets: 6,
        dispersion: 50,
        clarity: 90,
        sparkle: false
      };
      break;

    default:
      // Fallback: convert based on material properties
      const { baseMaterial, textureProfile } = style;
      
      // Map material types to effects
      if (baseMaterial.type === 'prismatic' || textureProfile.holographic) {
        effects.holographic = {
          intensity: (baseMaterial.iridescence || 0.5) * 100,
          shiftSpeed: 120,
          rainbowSpread: 240,
          animated: true
        };
      }
      
      if (baseMaterial.type === 'chrome' || textureProfile.chrome) {
        effects.chrome = {
          intensity: (baseMaterial.reflectivity || 0.5) * 100,
          sharpness: 80,
          highlightSize: 60
        };
      }
      
      if (baseMaterial.type === 'crystal' || textureProfile.interference) {
        effects.crystal = {
          intensity: 70,
          facets: 10,
          dispersion: (baseMaterial.transmission || 0.5) * 100,
          clarity: 65,
          sparkle: true
        };
      }
      
      if (baseMaterial.type === 'gold' || baseMaterial.goldTone) {
        effects.gold = {
          intensity: (baseMaterial.metalness || 0.5) * 100,
          shimmerSpeed: 100,
          platingThickness: 5,
          goldTone: baseMaterial.goldTone || 'rich',
          reflectivity: (baseMaterial.reflectivity || 0.8) * 100,
          colorEnhancement: true
        };
      }
      
      if (textureProfile.waves || baseMaterial.flow) {
        effects.waves = {
          intensity: 50,
          frequency: 10,
          amplitude: 30,
          direction: 45,
          complexity: 3,
          wobble: 40
        };
      }
      
      if (textureProfile.shimmer) {
        effects.foilspray = {
          intensity: 55,
          density: 60,
          direction: 90
        };
      }
      
      break;
  }

  console.log('✅ convertPremiumStyleToEffects: Generated effects for', style.id, ':', effects);
  return effects;
};

/**
 * Creates a combo preset from a Premium Visual Style
 */
export const createComboFromPremiumStyle = (style: CRDVisualStyle) => {
  console.log('🎨 createComboFromPremiumStyle: Creating combo for', style.id);
  const effects = convertPremiumStyleToEffects(style);
  
  const combo = {
    id: style.id,
    name: style.displayName,
    description: style.visualVibe,
    materialHint: style.visualVibe,
    effects,
    isPremium: true,
    category: style.category,
    unlockMethod: style.unlockMethod
  };
  
  console.log('✅ createComboFromPremiumStyle: Created combo:', combo);
  return combo;
};
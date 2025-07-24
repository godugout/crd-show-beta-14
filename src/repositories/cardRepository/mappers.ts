
import type { ValidRarity, ValidVisibility } from './types';

// Map external rarity values to valid database values
export const mapRarityToValidType = (rarity: string): ValidRarity => {
  const rarityMap: Record<string, ValidRarity> = {
    'common': 'common',
    'uncommon': 'uncommon', 
    'rare': 'rare',
    'epic': 'epic',
    'legendary': 'legendary',
    'ultra-rare': 'legendary', // Map ultra-rare to legendary if epic isn't available
    'mythic': 'mythic'
  };
  
  return rarityMap[rarity.toLowerCase()] || 'common';
};

// Map visibility values to valid database values
export const mapVisibilityToValidType = (visibility: string): ValidVisibility => {
  const validVisibilities: ValidVisibility[] = ['public', 'private', 'shared'];
  const mapped = visibility.toLowerCase() as ValidVisibility;
  return validVisibilities.includes(mapped) ? mapped : 'private';
};

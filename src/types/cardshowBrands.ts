
// Re-export types from the service for consistency
export type { CardshowBrand, BrandUsageStats, CreateBrandRequest, BrandMintingRules } from '@/services/cardshowBrandService';

export type BrandRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type UnlockMethod = 'starter' | 'achievement' | 'premium' | 'seasonal' | 'special' | 'legacy';
export type BrandCategory = 'Script' | 'Bold' | 'Retro' | 'Modern' | 'Fantasy' | 'SciFi' | 'Classic';
export type FontStyle = 'Script' | 'Block' | 'Sans' | 'Serif' | 'Display' | 'Unknown';

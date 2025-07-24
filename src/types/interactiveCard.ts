/**
 * Simplified Interactive Card System for CRD Collectibles
 * Focused on essential card creation and display features
 */

// ============= Core Card Types =============

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface CardAssets {
  images: Array<{ 
    id: string; 
    url: string; 
    type: 'main' | 'background' | 'overlay' 
  }>;
  videos?: Array<{ 
    id: string; 
    url: string; 
    type: 'background' | 'effect' 
  }>;
}

// ============= Main Interactive Card Structure =============

export interface InteractiveCardData {
  // Base card properties
  id: string;
  title: string;
  description?: string;
  rarity: CardRarity;
  creator_id: string;
  created_at: string;
  updated_at: string;
  
  // Media assets
  assets: CardAssets;
  
  // Version control
  version: number;
}
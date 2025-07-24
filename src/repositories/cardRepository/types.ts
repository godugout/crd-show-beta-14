
import type { Tables } from '@/integrations/supabase/types';

// Use the actual database type
export type Card = Tables<'cards'>;

export interface CardCreateParams {
  title: string;
  description?: string;
  creator_id: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity?: string;
  tags?: string[];
  design_metadata?: Record<string, any>;
  price?: number;
  is_public?: boolean;
  template_id?: string;
  verification_status?: string;
  print_metadata?: Record<string, any>;
  series?: string;
  visibility?: string;
  marketplace_listing?: boolean;
  edition_number?: number;
  total_supply?: number;
}

export interface CardUpdateParams {
  id: string;
  title?: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity?: string;
  tags?: string[];
  design_metadata?: Record<string, any>;
  price?: number;
  is_public?: boolean;
  template_id?: string;
  verification_status?: string;
  print_metadata?: Record<string, any>;
  series?: string;
  visibility?: string;
  marketplace_listing?: boolean;
  edition_number?: number;
  total_supply?: number;
}

export interface CardListOptions {
  page?: number;
  pageSize?: number;
  creator_id?: string;
  tags?: string[];
  rarity?: string;
  search?: string;
  includePrivate?: boolean;
}

export interface PaginatedCards {
  cards: Card[];
  total: number;
}

// Valid database rarity values based on the schema
export type ValidRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

// Valid database visibility values based on the schema
export type ValidVisibility = 'public' | 'private' | 'shared';

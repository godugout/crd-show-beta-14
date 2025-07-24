import type { CardData } from '@/types/card';
import type { Card } from '@/repositories/cardRepository/types';
import type { DetectedCard } from '@/services/cardCatalog/types';

export type CardSource = 'database' | 'local' | 'detected' | 'external' | 'template';

export type SyncStatus = 'synced' | 'draft' | 'conflict' | 'pending' | 'failed';

export interface UnifiedCard {
  // Core properties that all cards share
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  
  // Source and status tracking
  source: CardSource;
  sync_status: SyncStatus;
  original_data: CardData | Card | DetectedCard | ExternalCard;
  
  // Unified properties (normalized from different sources)
  rarity?: string;
  tags?: string[];
  creator_id?: string;
  creator_name?: string;
  is_public?: boolean;
  visibility?: string;
  view_count?: number;
  favorite_count?: number;
  
  // Source-specific metadata
  metadata: {
    // Database cards
    series_one_number?: number;
    marketplace_listing?: boolean;
    verification_status?: string;
    
    // Local cards
    local_changes?: string[];
    last_sync_attempt?: string;
    
    // Detected cards
    confidence?: number;
    processing_status?: string;
    
    // External cards
    external_url?: string;
    linkback_data?: LinkbackData;
    
    // Template cards
    template_source?: string;
    usage_count?: number;
  };
}

export interface ExternalCard {
  id: string;
  title: string;
  description?: string;
  external_url: string;
  image_url?: string;
  thumbnail_url?: string;
  linkback_data?: LinkbackData;
  created_at?: string;
}

export interface LinkbackData {
  source_domain: string;
  referrer_url?: string;
  seo_title?: string;
  seo_description?: string;
  social_shares?: number;
  click_count?: number;
  last_crawled?: string;
}

export interface CardAggregationOptions {
  includeSources: CardSource[];
  includePrivate: boolean;
  includeUserOnly: boolean;
  includeDrafts: boolean;
  adminAccess: boolean;
}

export interface CardFilter {
  search?: string;
  rarity?: string[];
  tags?: string[];
  creator_id?: string;
  source?: CardSource[];
  sync_status?: SyncStatus[];
  date_range?: {
    start: string;
    end: string;
  };
  price_range?: {
    min: number;
    max: number;
  };
  has_image?: boolean;
  is_public?: boolean;
}

export interface CardSort {
  field: 'created_at' | 'updated_at' | 'title' | 'rarity' | 'view_count' | 'favorite_count' | 'price';
  direction: 'asc' | 'desc';
}

export interface UnifiedCardCatalogState {
  cards: UnifiedCard[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  sources: {
    database: { count: number; loading: boolean; error?: string };
    local: { count: number; loading: boolean; error?: string };
    detected: { count: number; loading: boolean; error?: string };
    external: { count: number; loading: boolean; error?: string };
    template: { count: number; loading: boolean; error?: string };
  };
  sync: {
    pending: number;
    conflicts: number;
    last_sync: string | null;
  };
}
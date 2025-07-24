// Card-related TypeScript interfaces

import type { BaseProps, CropResult } from './common';

export interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  tags?: string[];
  metadata?: Record<string, unknown>;
  visibility?: 'public' | 'private' | 'unlisted';
  is_public?: boolean;
  view_count?: number;
  favorite_count?: number;
  price?: number;
  design_metadata?: Record<string, unknown>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export type ViewMode = 'grid' | 'list' | 'masonry';

export interface CardsTabContentProps extends BaseProps {
  activeTab: string;
  filteredCards: CardData[];
  cardsLoading: boolean;
  viewMode: ViewMode;
  user: User;
  onClearFilters: () => void;
}

export interface CropCompleteData extends CropResult {
  originalImage?: string;
  metadata?: {
    originalWidth: number;
    originalHeight: number;
    cropTimestamp: number;
  };
}

export interface CollectionData {
  id?: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  visibility: 'public' | 'private' | 'unlisted';
  theme?: string;
  template_id?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateCollectionModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (collectionData: CollectionData) => void;
}

export interface GeneratedCard {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  design_metadata: Record<string, unknown>;
  rarity: CardData['rarity'];
  creator_id: string;
  created_at: string;
}

export interface CardFilters {
  rarity?: CardData['rarity'];
  category?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  creator?: string;
  searchQuery?: string;
}

export interface CardSortOptions {
  field: 'created_at' | 'updated_at' | 'title' | 'price' | 'view_count' | 'favorite_count';
  direction: 'asc' | 'desc';
}

export interface PaginatedCards {
  cards: CardData[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface CardOperationResult {
  success: boolean;
  data?: CardData;
  error?: string;
}

export interface CardUploadData {
  file: File;
  title: string;
  description?: string;
  tags?: string[];
  rarity?: CardData['rarity'];
  visibility?: CardData['visibility'];
}

export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  preview_url: string;
  category: string;
  is_premium: boolean;
  template_data: Record<string, unknown>;
  usage_count: number;
  creator_id?: string;
}

export interface CardStats {
  totalCards: number;
  totalViews: number;
  totalFavorites: number;
  rarityDistribution: Record<string, number>;
  topTags: Array<{
    tag: string;
    count: number;
  }>;
}

export interface AuctionData {
  id: string;
  card_id: string;
  starting_price: number;
  current_price: number;
  end_time: string;
  bid_count: number;
  highest_bidder?: string;
  status: 'active' | 'ended' | 'cancelled';
}

export interface BidData {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  timestamp: string;
  is_winning: boolean;
}

import type { Visibility } from '@/types/common';
import type { Memory } from '@/types/memory';

export type CollectionTheme = 'sports' | 'fantasy' | 'scifi' | 'personal' | 'art' | 'gaming';

export interface Collection {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  coverImageUrl?: string;
  coverTemplate?: string;
  visibility: Visibility;
  theme: CollectionTheme;
  shareToken?: string;
  viewCount: number;
  cardCount: number;
  featuredCardId?: string;
  createdAt: string;
  cards?: Memory[]; // Changed from Card to Memory
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  memoryId: string;
  displayOrder: number;
  addedAt: string;
  memory?: Memory; // Add memory field
}

export interface CreateCollectionParams {
  title: string;
  description?: string;
  ownerId: string;
  visibility?: Visibility;
  cards?: string[];
}

export interface UpdateCollectionParams {
  id: string;
  title?: string;
  description?: string;
  visibility?: Visibility;
}

export interface CollectionListOptions {
  page?: number;
  pageSize?: number;
  userId?: string;
  search?: string;
}

export interface PaginatedCollections {
  collections: Collection[];
  total: number;
}

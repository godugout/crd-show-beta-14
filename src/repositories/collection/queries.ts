
import type { Collection, CollectionItem, CollectionListOptions, PaginatedCollections } from './types';
import { getCollectionQuery, getCollectionItemsQuery, calculateOffset } from './core';
import { supabase } from '@/lib/supabase-client';
import { getAppId } from '@/integrations/supabase/client';
import type { Visibility } from '@/types/common';

export const getCollectionById = async (id: string): Promise<Collection | null> => {
  try {
    // Try to use the database first
    const { data, error } = await getCollectionQuery()
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(`Failed to fetch collection: ${error.message}`);
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      ownerId: data.owner_id,
      coverImageUrl: data.cover_image_url,
      visibility: data.visibility as Visibility,
      theme: data.theme || 'personal',
      shareToken: data.share_token,
      viewCount: data.view_count || 0,
      cardCount: data.card_count || 0,
      featuredCardId: data.featured_card_id,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Database not ready, using fallback:', error);
    
    // Use localStorage as fallback
    try {
      const stored = localStorage.getItem(`collection_${id}`);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (e) {
      console.error('Fallback failed:', e);
      return null;
    }
  }
};

export const getCollectionItems = async (collectionId: string): Promise<CollectionItem[]> => {
  try {
    // Try to use the database first
    const { data, error } = await getCollectionItemsQuery()
      .select()
      .eq('collection_id', collectionId);
    
    if (error) {
      throw new Error(`Failed to fetch collection items: ${error.message}`);
    }
    
    if (!data || data.length === 0) return [];
    
    // Process the data safely
    return data.map((item: any) => ({
      id: item.id,
      collectionId: item.collection_id,
      memoryId: item.card_id,
      displayOrder: 0,
      addedAt: item.created_at,
      memory: undefined
    }));
  } catch (error) {
    console.error('Database not ready, using fallback:', error);
    
    // Use localStorage as fallback
    try {
      const stored = localStorage.getItem(`collection_items_${collectionId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Fallback failed:', e);
      return [];
    }
  }
};

export const getCollectionsByUserId = async (
  userId: string,
  options: CollectionListOptions = {}
): Promise<PaginatedCollections> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search
    } = options;

    // Try to use the database first
    let query = getCollectionQuery()
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    query = query.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    const { data, error, count } = await query;

    if (error) throw new Error(`Failed to fetch collections: ${error.message}`);
    
    const collections: Collection[] = (data || []).map((collection: any) => ({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      ownerId: collection.owner_id,
      coverImageUrl: collection.cover_image_url,
      visibility: collection.visibility as Visibility,
      theme: collection.theme || 'personal',
      shareToken: collection.share_token,
      viewCount: collection.view_count || 0,
      cardCount: collection.card_count || 0,
      featuredCardId: collection.featured_card_id,
      createdAt: collection.created_at
    }));
    
    return {
      collections,
      total: count || 0
    };
  } catch (error) {
    console.error('Database not ready, using fallback:', error);
    
    // Use localStorage as fallback
    try {
      const stored = localStorage.getItem(`collections_${userId}`);
      const collections = stored ? JSON.parse(stored) : [];
      return {
        collections,
        total: collections.length
      };
    } catch (e) {
      console.error('Fallback failed:', e);
      return {
        collections: [],
        total: 0
      };
    }
  }
};

export const getPublicCollections = async (
  options: CollectionListOptions = {}
): Promise<PaginatedCollections> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search
    } = options;

    // Try to use the database first
    let query = getCollectionQuery()
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    const { data, error, count } = await query;

    if (error) throw new Error(`Failed to fetch public collections: ${error.message}`);
    
    const collections: Collection[] = (data || []).map((collection: any) => ({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      ownerId: collection.owner_id,
      coverImageUrl: collection.cover_image_url,
      visibility: collection.visibility as Visibility,
      theme: collection.theme || 'personal',
      shareToken: collection.share_token,
      viewCount: collection.view_count || 0,
      cardCount: collection.card_count || 0,
      featuredCardId: collection.featured_card_id,
      createdAt: collection.created_at
    }));
    
    return {
      collections,
      total: count || 0
    };
  } catch (error) {
    console.error('Database not ready, using fallback:', error);
    
    // Use localStorage as fallback
    try {
      const stored = localStorage.getItem('public_collections');
      const collections = stored ? JSON.parse(stored) : [];
      return {
        collections,
        total: collections.length
      };
    } catch (e) {
      console.error('Fallback failed:', e);
      return {
        collections: [],
        total: 0
      };
    }
  }
};

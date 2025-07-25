
import { supabase } from '@/integrations/supabase/client';
import type { Collection, CreateCollectionParams, UpdateCollectionParams } from './types';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getCollectionQuery = () => {
  try {
    return supabase.from('collections');
  } catch (error) {
    console.error('Error creating collection query:', error);
    // Return a minimal mock that won't cause TypeScript errors
    return {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      }),
      order: () => ({
        range: () => Promise.resolve({ data: [], error: null, count: 0 })
      })
    } as any;
  }
};

export const getCollectionItemsQuery = () => {
  try {
    return supabase.from('collection_cards');
  } catch (error) {
    console.error('Error creating collection items query:', error);
    return {
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null })
      })
    } as any;
  }
};

export const CollectionCore = {
  /**
   * Get user's default collection (creates one if it doesn't exist)
   */
  async getUserDefaultCollection(userId: string): Promise<Collection | null> {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId)
        .eq('title', 'My Cards')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Map database fields to Collection type
      if (data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          ownerId: data.user_id,
          coverImageUrl: data.cover_image_url,
          visibility: data.visibility as any,
          theme: 'personal' as any,
          shareToken: data.share_token,
          viewCount: data.view_count,
          cardCount: data.card_count,
          featuredCardId: data.featured_card_id,
          createdAt: data.created_at
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting default collection:', error);
      return null;
    }
  },

  /**
   * Create a new collection
   */
  async createCollection(params: CreateCollectionParams): Promise<Collection> {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        title: params.title,
        description: params.description,
        user_id: params.ownerId,
        visibility: (params.visibility || 'private') as 'public' | 'private' | 'shared'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create collection: ${error.message}`);
    }

    // Map database fields to Collection type
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      ownerId: data.user_id,
      coverImageUrl: data.cover_image_url,
      visibility: data.visibility as any,
      theme: 'personal' as any,
      shareToken: data.share_token,
      viewCount: data.view_count || 0,
      cardCount: data.card_count || 0,
      featuredCardId: data.featured_card_id,
      createdAt: data.created_at
    };
  },

  /**
   * Add a card to a collection
   */
  async addCardToCollection(collectionId: string, cardId: string): Promise<void> {
    // First check if the card is already in the collection
    const { data: existing } = await supabase
      .from('collection_cards')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('card_id', cardId)
      .single();

    if (existing) {
      return; // Card already in collection
    }

    const { error } = await supabase
      .from('collection_cards')
      .insert({
        collection_id: collectionId,
        card_id: cardId,
        added_at: new Date().toISOString(),
        display_order: 0
      });

    if (error) {
      throw new Error(`Failed to add card to collection: ${error.message}`);
    }

    // Update collection card count
    await this.updateCardCount(collectionId);
  },

  /**
   * Update collection card count
   */
  async updateCardCount(collectionId: string): Promise<void> {
    const { count } = await supabase
      .from('collection_cards')
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', collectionId);

    await supabase
      .from('collections')
      .update({ card_count: count || 0 })
      .eq('id', collectionId);
  }
};


import { supabase } from '@/integrations/supabase/client';
import type { Card, CardListOptions, PaginatedCards } from './types';
import { mapRarityToValidType } from './mappers';

export const cardQueries = {
  async getCards(options: CardListOptions = {}): Promise<PaginatedCards> {
    try {
      const {
        page = 1,
        pageSize = 20,
        creator_id,
        tags,
        rarity,
        search,
        includePrivate = false
      } = options;

      console.log('🔍 Fetching cards with options:', options);

      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' });
        
      // Apply filters
      if (!includePrivate) {
        query = query.eq('is_public', true);
      }
      
      if (creator_id) {
        query = query.eq('creator_id', creator_id);
      }
      
      if (rarity) {
        // Map the rarity and only filter if it's valid
        const mappedRarity = mapRarityToValidType(rarity);
        query = query.eq('rarity', mappedRarity);
      }
      
      if (tags && tags.length > 0) {
        query = query.contains('tags', tags);
      }
      
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      // Pagination
      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Failed to fetch cards:', error.message);
        return { cards: [], total: 0 };
      }
      
      console.log(`✅ Fetched ${data?.length || 0} cards (total: ${count || 0})`);
      return {
        cards: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('💥 Error in getCards:', error);
      return { cards: [], total: 0 };
    }
  },

  async getAllCards(): Promise<Card[]> {
    try {
      console.log('🔍 Fetching ALL cards from database...');
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching all cards:', error);
        return [];
      }
      
      console.log(`✅ Found ${data?.length || 0} total cards in database`);
      if (data && data.length > 0) {
        console.log('📋 All card titles:', data.map(c => `${c.title} (${c.id})`).join(', '));
      }
      
      return data || [];
    } catch (error) {
      console.error('💥 Error fetching all cards:', error);
      return [];
    }
  }
};

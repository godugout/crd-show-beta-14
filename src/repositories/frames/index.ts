
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from '@/integrations/supabase/types';

type FrameTemplate = Tables<'card_templates_creator'>;

export interface FrameWithCreator extends FrameTemplate {
  creator_name?: string;
  creator_avatar?: string;
}

export const FrameRepository = {
  // Get frames by category with basic creator info
  getFramesByCategory: async (category?: string, limit = 20): Promise<FrameWithCreator[]> => {
    try {
      let query = supabase
        .from('card_templates_creator')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // For now, return frames without creator details
      // TODO: Add proper creator info once user profiles are properly linked
      return (data || []).map(frame => ({
        ...frame,
        creator_name: 'Creator', // Placeholder
        creator_avatar: undefined
      }));
    } catch (error) {
      console.error('Error fetching frames:', error);
      return [];
    }
  },

  // Get popular/trending frames
  getTrendingFrames: async (limit = 6): Promise<FrameWithCreator[]> => {
    try {
      const { data, error } = await supabase
        .from('card_templates_creator')
        .select('*')
        .eq('is_published', true)
        .order('sales_count', { ascending: false })
        .order('rating', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map(frame => ({
        ...frame,
        creator_name: 'Creator', // Placeholder
        creator_avatar: undefined
      }));
    } catch (error) {
      console.error('Error fetching trending frames:', error);
      return [];
    }
  },

  // Get frames by creator
  getFramesByCreator: async (creatorId: string, limit = 20): Promise<FrameWithCreator[]> => {
    try {
      const { data, error } = await supabase
        .from('card_templates_creator')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map(frame => ({
        ...frame,
        creator_name: 'Creator', // Placeholder
        creator_avatar: undefined
      }));
    } catch (error) {
      console.error('Error fetching creator frames:', error);
      return [];
    }
  },

  // Get frame categories
  getFrameCategories: async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('card_templates_creator')
        .select('category')
        .eq('is_published', true);
      
      if (error) throw error;
      
      const categories = [...new Set((data || []).map(item => item.category))];
      return categories.filter(Boolean);
    } catch (error) {
      console.error('Error fetching frame categories:', error);
      return [];
    }
  }
};

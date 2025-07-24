
import { supabase } from '@/integrations/supabase/client';
import type { Card, CardCreateParams, CardUpdateParams } from './types';
import { mapRarityToValidType, mapVisibilityToValidType } from './mappers';

export const cardOperations = {
  async getCardById(id: string): Promise<Card | null> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching card:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getCardById:', error);
      return null;
    }
  },

  async createCard(params: CardCreateParams): Promise<Card | null> {
    try {
      console.log('🎨 Creating new card with enhanced logging...');
      console.log('📋 Input params:', {
        title: params.title,
        creator_id: params.creator_id,
        rarity: params.rarity,
        visibility: params.visibility,
        hasImage: !!params.image_url,
        tagsCount: params.tags?.length || 0
      });
      
      // Map and validate the data before insertion
      const mappedRarity = mapRarityToValidType(params.rarity || 'common');
      const mappedVisibility = mapVisibilityToValidType(params.visibility || 'private');
      
      console.log('🔄 Mapped values:', { 
        originalRarity: params.rarity, 
        mappedRarity,
        originalVisibility: params.visibility,
        mappedVisibility 
      });

      // Prepare the insert data with enhanced validation
      const insertData = {
        title: params.title,
        description: params.description || null,
        creator_id: params.creator_id,
        image_url: params.image_url || null,
        thumbnail_url: params.thumbnail_url || null,
        rarity: mappedRarity,
        tags: params.tags || [],
        design_metadata: params.design_metadata || {},
        price: params.price || null,
        is_public: params.is_public !== undefined ? params.is_public : false,
        template_id: params.template_id || null,
        verification_status: params.verification_status || 'pending',
        print_metadata: params.print_metadata || {},
        series: params.series || null,
        visibility: mappedVisibility,
        marketplace_listing: params.marketplace_listing !== undefined ? params.marketplace_listing : false,
        edition_number: params.edition_number || null,
        total_supply: params.total_supply || null
      };

      console.log('💾 Final insert data structure:', {
        title: insertData.title,
        creator_id: insertData.creator_id,
        rarity: insertData.rarity,
        visibility: insertData.visibility,
        is_public: insertData.is_public,
        tagsLength: insertData.tags.length,
        hasDesignMetadata: Object.keys(insertData.design_metadata).length > 0
      });

      // Perform the database insertion
      const { data, error } = await supabase
        .from('cards')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insertion error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Enhanced error analysis
        if (error.code === '23502') {
          console.error('🚫 NULL constraint violation - missing required field');
        } else if (error.code === '23503') {
          console.error('🔗 Foreign key constraint violation');
        } else if (error.code === '42501') {
          console.error('🔒 Permission denied - check RLS policies');
        }
        
        console.error('📋 Data that failed to insert:', JSON.stringify(insertData, null, 2));
        return null;
      }

      console.log('✅ Card created successfully:', {
        id: data.id,
        title: data.title,
        rarity: data.rarity
      });
      
      return data;
    } catch (error) {
      console.error('💥 Unexpected error in createCard:', error);
      if (error instanceof Error) {
        console.error('💥 Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      return null;
    }
  },

  async updateCard(params: CardUpdateParams): Promise<Card | null> {
    try {
      const updates: Record<string, any> = {};
      
      // Only include defined values in the update
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id') {
          if (key === 'rarity') {
            updates[key] = mapRarityToValidType(value as string);
          } else if (key === 'visibility') {
            updates[key] = mapVisibilityToValidType(value as string);
          } else {
            updates[key] = value;
          }
        }
      });

      const { data, error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', params.id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update card:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCard:', error);
      return null;
    }
  }
};

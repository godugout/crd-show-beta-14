
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { v4 as uuidv4 } from 'uuid';
import type { CardData } from '@/types/card';

// UUID validation function
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Validation function for card data
const validateCardData = (cardData: CardData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate required fields
  if (!cardData.title?.trim()) {
    errors.push('Title is required');
  }

  // Validate UUID fields
  if (cardData.id && !isValidUUID(cardData.id)) {
    errors.push(`Invalid card ID format: ${cardData.id}`);
  }

  if (cardData.template_id && !isValidUUID(cardData.template_id)) {
    errors.push(`Invalid template_id format: ${cardData.template_id}`);
  }

  // Validate rarity enum - map to database values
  const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  if (cardData.rarity && !validRarities.includes(cardData.rarity)) {
    errors.push(`Invalid rarity: ${cardData.rarity}. Must be one of: ${validRarities.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const useCardOperations = (
  cardData: CardData,
  updateCardData: (data: Partial<CardData>) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user } = useCustomAuth();

  const saveCard = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Check if user is authenticated first
      if (!user?.id) {
        console.error('User not authenticated');
        toast.error('Please sign in to save cards');
        return false;
      }

      // Ensure we have a card ID
      let cardId = cardData.id;
      if (!cardId) {
        cardId = uuidv4();
        updateCardData({ id: cardId });
      }

      // Validate required fields
      if (!cardData.title?.trim()) {
        toast.error('Please enter a card title');
        return false;
      }

      // Comprehensive validation
      const validation = validateCardData({ ...cardData, id: cardId });
      if (!validation.isValid) {
        console.error('Card validation failed:', validation.errors);
        toast.error(`Validation failed: ${validation.errors.join(', ')}`);
        return false;
      }

      // Map rarity to database enum (database doesn't have epic)
      const rarityMapping: Record<string, string> = {
        'common': 'common',
        'uncommon': 'uncommon', 
        'rare': 'rare',
        'epic': 'legendary', // Map epic to legendary
        'legendary': 'legendary'
      };

      // Clean and prepare the card data for saving
      const cardToSave = {
        id: cardId,
        title: cardData.title.trim(),
        description: cardData.description?.trim() || '',
        creator_id: user.id,
        design_metadata: cardData.design_metadata || {},
        image_url: cardData.image_url || null,
        thumbnail_url: cardData.thumbnail_url || null,
        rarity: rarityMapping[cardData.rarity || 'common'] as any,
        tags: cardData.tags || [],
        is_public: cardData.visibility === 'public',
        template_id: (cardData.template_id && isValidUUID(cardData.template_id)) ? cardData.template_id : null,
        verification_status: 'pending' as const,
        print_metadata: cardData.print_metadata || {},
        marketplace_listing: false,
        visibility: cardData.visibility || 'private'
      };

      console.log('Attempting to save card with validated data:', { 
        cardId: cardToSave.id, 
        userId: user.id, 
        isAuthenticated: !!user,
        title: cardToSave.title,
        creator_id: cardToSave.creator_id
      });

      const { error } = await supabase
        .from('cards')
        .upsert(cardToSave, { onConflict: 'id' });

      if (error) {
        console.error('Database error saving card:', error);
        if (error.message.includes('row-level security policy')) {
          toast.error('Authentication required. Please sign in to save cards.');
        } else {
          toast.error(`Failed to save card: ${error.message}`);
        }
        return false;
      }
      
      setLastSaved(new Date());
      toast.success('Card saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to publish cards');
      return false;
    }

    if (!cardData.id) {
      toast.error('Please save the card first before publishing');
      return false;
    }

    try {
      const { error } = await supabase
        .from('cards')
        .update({ is_public: true })
        .eq('id', cardData.id);

      if (error) {
        console.error('Error publishing card:', error);
        toast.error('Failed to publish card');
        return false;
      }
      
      updateCardData({ visibility: 'public' });
      toast.success('Card published successfully');
      return true;
    } catch (error) {
      console.error('Error publishing card:', error);
      toast.error('Failed to publish card');
      return false;
    }
  };

  return {
    saveCard,
    publishCard,
    isSaving,
    lastSaved
  };
};

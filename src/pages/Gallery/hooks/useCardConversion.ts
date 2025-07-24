
import { useCallback } from 'react';
import type { Tables } from '@/integrations/supabase/types';
import type { CardData } from '@/types/card';

type Card = Tables<'cards'>;

export const useCardConversion = () => {
  const convertCardsToCardData = useCallback((cards: Card[]): CardData[] => {
    return cards.map(card => {
      // Map database rarity to CardData rarity
      const mapRarity = (dbRarity: string): CardData['rarity'] => {
        switch (dbRarity) {
          case 'epic': return 'epic';
          case 'mythic': return 'legendary';
          default: return dbRarity as CardData['rarity'];
        }
      };

      // Safely convert design_metadata to Record<string, any>
      const safeDesignMetadata = (): Record<string, any> => {
        if (!card.design_metadata) return {};
        if (typeof card.design_metadata === 'object' && !Array.isArray(card.design_metadata)) {
          return card.design_metadata as Record<string, any>;
        }
        return {};
      };

      return {
        id: card.id, // Required field
        title: card.title,
        description: card.description || '',
        image_url: card.image_url,
        rarity: mapRarity(card.rarity || 'common'),
        tags: card.tags || [],
        design_metadata: safeDesignMetadata(),
        visibility: card.visibility === 'public' ? 'public' : card.visibility === 'shared' ? 'shared' : 'private',
        template_id: card.template_id,
        creator_attribution: {
          creator_name: '',
          creator_id: card.creator_id,
          collaboration_type: 'solo'
        },
        publishing_options: {
          marketplace_listing: card.marketplace_listing || false,
          crd_catalog_inclusion: card.crd_catalog_inclusion || false,
          print_available: card.print_available || false,
          pricing: card.price ? {
            base_price: Number(card.price),
            currency: 'USD'
          } : undefined,
          distribution: {
            limited_edition: false
          }
        },
        // Add the missing properties that Gallery needs
        view_count: card.view_count || 0,
        created_at: card.created_at || new Date().toISOString(),
        price: card.price ? Number(card.price) : undefined
      };
    });
  }, []);

  const convertCardDataToCard = useCallback((cardData: CardData): Partial<Card> => {
    // Map CardData rarity back to database rarity
    const mapRarityToDb = (rarity: CardData['rarity']): string => {
      switch (rarity) {
        case 'epic': return 'epic';
        case 'legendary': return 'mythic';
        default: return rarity;
      }
    };

    return {
      id: cardData.id,
      title: cardData.title,
      description: cardData.description,
      image_url: cardData.image_url,
      rarity: mapRarityToDb(cardData.rarity) as any,
      tags: cardData.tags,
      visibility: cardData.visibility as any,
      design_metadata: cardData.design_metadata,
      template_id: cardData.template_id,
      creator_id: cardData.creator_attribution?.creator_id,
      marketplace_listing: cardData.publishing_options?.marketplace_listing,
      crd_catalog_inclusion: cardData.publishing_options?.crd_catalog_inclusion,
      print_available: cardData.publishing_options?.print_available,
      price: cardData.publishing_options?.pricing?.base_price
    };
  }, []);

  return {
    convertCardsToCardData,
    convertCardDataToCard
  };
};

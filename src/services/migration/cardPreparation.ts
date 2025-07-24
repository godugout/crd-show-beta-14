
import type { CardData } from '@/types/card';

export class CardPreparationService {
  static prepareCardForDatabase(card: CardData, userId: string): any {
    console.log(`🔧 Preparing card for database: ${card.title}`);

    // Map rarity to database enum with fallback
    const rarityMap: Record<string, string> = {
      'common': 'common',
      'uncommon': 'uncommon', 
      'rare': 'rare',
      'epic': 'legendary',
      'legendary': 'legendary'
    };

    const dbRarity = rarityMap[card.rarity] || 'common';
    if (card.rarity && !rarityMap[card.rarity]) {
      console.warn(`📝 Mapped unknown rarity "${card.rarity}" to "common"`);
    }

    const preparedCard = {
      title: card.title?.trim() || 'Untitled Card',
      description: card.description?.trim() || '',
      creator_id: userId,
      image_url: card.image_url || null,
      thumbnail_url: card.thumbnail_url || null,
      rarity: dbRarity,
      tags: Array.isArray(card.tags) ? card.tags : [],
      design_metadata: (card.design_metadata && typeof card.design_metadata === 'object') ? card.design_metadata : {},
      is_public: card.visibility === 'public',
      visibility: card.visibility || 'private',
      marketplace_listing: card.publishing_options?.marketplace_listing || false,
      print_available: card.publishing_options?.print_available || false,
      verification_status: 'pending'
    };

    console.log(`✅ Card prepared for database:`, {
      title: preparedCard.title,
      rarity: preparedCard.rarity,
      hasImage: !!preparedCard.image_url,
      tagsCount: preparedCard.tags.length
    });

    return preparedCard;
  }
}

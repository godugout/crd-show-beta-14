
import { CardRepository } from '@/repositories/cardRepository';
import { CardStorageService } from './cardStorage';
import type { Tables } from '@/integrations/supabase/types';

type Card = Tables<'cards'>;

export class CardFetchingService {
  /**
   * Fetch only featured cards for better performance
   */
  static async fetchFeaturedCards(): Promise<Card[]> {
    try {
      console.log('🔍 Fetching featured cards only...');
      
      const result = await CardRepository.getCards({
        pageSize: 4, // Only load what we need for featured section
        includePrivate: false
      });
      
      console.log(`✅ Fetched ${result.cards.length} featured cards`);
      return result.cards.slice(0, 4); // Take first 4 as featured
    } catch (error) {
      console.error('💥 Error fetching featured cards:', error);
      return [];
    }
  }

  static async fetchAllCardsFromDatabase(): Promise<{
    cards: Card[];
    dataSource: 'database' | 'local' | 'mixed';
  }> {
    try {
      console.log('🔍 Fetching all cards from database...');
      
      const allCards = await CardRepository.getAllCards();
      console.log(`✅ Database query returned ${allCards.length} cards`);
      
      if (allCards.length > 0) {
        console.log('📋 Recent cards:', allCards.slice(0, 5).map(c => ({
          id: c.id,
          title: c.title,
          created_at: c.created_at,
          is_public: c.is_public
        })));
      }
      
      // Check local storage situation
      const storageReport = CardStorageService.getStorageReport();
      console.log(`💾 Local storage report:`, storageReport);
      
      // Determine data source
      let dataSource: 'database' | 'local' | 'mixed' = 'database';
      
      if (allCards.length === 0 && storageReport.totalCards > 0) {
        console.log('⚠️ No database cards found, but local cards exist');
        dataSource = 'local';
      } else if (allCards.length > 0 && storageReport.totalCards > 0) {
        console.log('🔄 Both database and local cards found');
        dataSource = 'mixed';
      }
      
      console.log(`📊 Final result: ${allCards.length} cards from ${dataSource} source`);
      return { cards: allCards, dataSource };
    } catch (error) {
      console.error('💥 Error fetching cards:', error);
      return { cards: [], dataSource: 'database' };
    }
  }

  static async fetchUserCards(userId?: string): Promise<Card[]> {
    if (!userId) return [];
    
    try {
      console.log(`🔍 Fetching cards for user: ${userId}`);
      const result = await CardRepository.getCards({
        creator_id: userId,
        includePrivate: true,
        pageSize: 100
      });
      
      console.log(`✅ Found ${result.cards.length} user cards`);
      return result.cards;
    } catch (error) {
      console.error('💥 Error fetching user cards:', error);
      return [];
    }
  }
}

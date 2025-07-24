
import type { CardData } from '@/types/card';

export interface StorageLocation {
  key: string;
  cards: CardData[];
}

export interface StorageReport {
  totalCards: number;
  locations: StorageLocation[];
  duplicates: number;
  errors: string[];
}

export class CardStorageService {
  private static readonly STANDARD_KEY = 'crd-cards';
  
  // Get all possible storage keys
  private static getStorageKeys(): string[] {
    const keys = Object.keys(localStorage);
    return [
      this.STANDARD_KEY,
      ...keys.filter(key => key.startsWith('cards_'))
    ];
  }

  // Get comprehensive storage report
  static getStorageReport(): StorageReport {
    const locations: StorageLocation[] = [];
    const errors: string[] = [];
    const seenIds = new Set<string>();
    let totalCards = 0;
    let duplicates = 0;

    for (const key of this.getStorageKeys()) {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) continue;

        const cards = JSON.parse(stored);
        if (!Array.isArray(cards)) {
          errors.push(`Invalid data format in ${key}`);
          continue;
        }

        // Validate cards and count duplicates
        const validCards = cards.filter((card: any) => {
          if (!card?.id || !card?.title) {
            errors.push(`Invalid card data in ${key}`);
            return false;
          }
          
          if (seenIds.has(card.id)) {
            duplicates++;
            return false;
          }
          
          seenIds.add(card.id);
          return true;
        });

        locations.push({
          key,
          cards: validCards
        });

        totalCards += validCards.length;
      } catch (error) {
        errors.push(`Error reading ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      totalCards,
      locations,
      duplicates,
      errors
    };
  }

  // Consolidate all cards into standard storage
  static consolidateStorage(): { success: boolean; moved: number; errors: string[] } {
    const report = this.getStorageReport();
    const errors: string[] = [...report.errors];
    
    if (report.totalCards === 0) {
      return { success: true, moved: 0, errors };
    }

    try {
      // Collect all unique cards
      const allCards: CardData[] = [];
      for (const location of report.locations) {
        allCards.push(...location.cards);
      }

      // Save to standard location
      localStorage.setItem(this.STANDARD_KEY, JSON.stringify(allCards));

      // Clean up old locations (except standard)
      let moved = 0;
      for (const location of report.locations) {
        if (location.key !== this.STANDARD_KEY && location.cards.length > 0) {
          localStorage.removeItem(location.key);
          moved += location.cards.length;
        }
      }

      console.log(`✅ Consolidated ${allCards.length} cards, moved ${moved} from other locations`);
      return { success: true, moved, errors };
    } catch (error) {
      errors.push(`Consolidation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, moved: 0, errors };
    }
  }

  // Get all cards from standard location
  static getAllCards(): CardData[] {
    try {
      const stored = localStorage.getItem(this.STANDARD_KEY);
      if (!stored) return [];
      
      const cards = JSON.parse(stored);
      return Array.isArray(cards) ? cards : [];
    } catch (error) {
      console.error('Error reading cards from storage:', error);
      return [];
    }
  }

  // Save a single card
  static saveCard(card: CardData): { success: boolean; error?: string } {
    try {
      const cards = this.getAllCards();
      const cardId = card.id || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const cardWithId = { ...card, id: cardId };
      
      const existingIndex = cards.findIndex(c => c.id === cardId);
      
      if (existingIndex >= 0) {
        cards[existingIndex] = cardWithId;
      } else {
        cards.push(cardWithId);
      }
      
      localStorage.setItem(this.STANDARD_KEY, JSON.stringify(cards));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Remove a card
  static removeCard(cardId: string): { success: boolean; error?: string } {
    try {
      const cards = this.getAllCards();
      const filtered = cards.filter(c => c.id !== cardId);
      localStorage.setItem(this.STANDARD_KEY, JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Clear all storage
  static clearAll(): { success: boolean; error?: string } {
    try {
      // Clear standard location
      localStorage.removeItem(this.STANDARD_KEY);
      
      // Clear user-specific locations
      const userKeys = Object.keys(localStorage).filter(key => key.startsWith('cards_'));
      userKeys.forEach(key => localStorage.removeItem(key));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

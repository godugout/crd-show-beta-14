
import { localForage } from '@/lib/localforage';
import { v4 as uuidv4 } from 'uuid';
import type { CardData } from '@/types/card';
import { CardStorageService } from '@/services/cardStorage';

// Simplified wrapper for backward compatibility
export const localCardStorage = {
  getAllCards(): CardData[] {
    return CardStorageService.getAllCards();
  },

  // Enhanced method to get all cards from all locations with detailed reporting
  getAllCardsFromAllLocations(): { 
    standardCards: CardData[], 
    userCards: CardData[], 
    allCards: CardData[],
    report: any
  } {
    const report = CardStorageService.getStorageReport();
    const standardCards = CardStorageService.getAllCards();
    
    // Separate user-specific cards from standard cards
    const userCards = report.locations
      .filter(loc => loc.key.startsWith('cards_'))
      .flatMap(loc => loc.cards);

    return {
      standardCards,
      userCards,
      allCards: report.locations.flatMap(loc => loc.cards),
      report
    };
  },

  getCard(cardId: string): CardData | null {
    const cards = CardStorageService.getAllCards();
    return cards.find(c => c.id === cardId) || null;
  },

  saveCard(card: CardData): string {
    const result = CardStorageService.saveCard(card);
    if (!result.success) {
      console.error('Failed to save card:', result.error);
      return card.id || '';
    }
    return card.id || '';
  },

  // Consolidate all cards from different storage locations into standard storage
  consolidateAllStorage(): { consolidated: number, cleaned: string[] } {
    const result = CardStorageService.consolidateStorage();
    return {
      consolidated: result.moved,
      cleaned: result.errors
    };
  },

  markAsSynced(cardId: string): void {
    // Implementation kept for compatibility but not needed with new system
    console.log(`Card ${cardId} marked as synced (legacy method)`);
  },

  removeCard(cardId: string): void {
    const result = CardStorageService.removeCard(cardId);
    if (!result.success) {
      console.error('Failed to remove card:', result.error);
    }
  },

  clearAll(): void {
    const result = CardStorageService.clearAll();
    if (!result.success) {
      console.error('Failed to clear storage:', result.error);
    }
  },

  // Check if there are cards that haven't been synced to database
  getUnsyncedCards(): CardData[] {
    // For now, assume all local cards are unsynced
    return CardStorageService.getAllCards();
  }
};

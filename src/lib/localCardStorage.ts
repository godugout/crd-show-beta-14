
import { unifiedDataService } from '@/services/unifiedDataService';
import { CardStorageService } from '@/services/cardStorage';
import type { CardData } from '@/types/card';

// Hybrid backward compatibility wrapper that provides both sync and async methods
export const localCardStorage = {
  // Synchronous methods for backward compatibility (will be phased out)
  getAllCards(): CardData[] {
    // Fallback to old CardStorageService for immediate synchronous access
    return CardStorageService.getAllCards();
  },

  getAllCardsFromAllLocations(): { 
    standardCards: CardData[], 
    userCards: CardData[], 
    allCards: CardData[],
    report: any
  } {
    // Fallback to old service for immediate access
    const report = CardStorageService.getStorageReport();
    const standardCards = CardStorageService.getAllCards();
    
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
    
    // Also save to unified service in background
    unifiedDataService.saveCard(card).catch(error => {
      console.warn('Background save to unified service failed:', error);
    });
    
    return card.id || '';
  },

  consolidateAllStorage(): { consolidated: number, cleaned: string[] } {
    const result = CardStorageService.consolidateStorage();
    
    // Trigger migration to unified service in background
    unifiedDataService.migrateFromOldStorage().catch(error => {
      console.warn('Background migration failed:', error);
    });
    
    return {
      consolidated: result.moved,
      cleaned: result.errors
    };
  },

  markAsSynced(cardId: string): void {
    console.log(`Card ${cardId} marked as synced (legacy method)`);
  },

  removeCard(cardId: string): void {
    const result = CardStorageService.removeCard(cardId);
    if (!result.success) {
      console.error('Failed to remove card:', result.error);
    }
    
    // Also remove from unified service in background
    unifiedDataService.deleteCard(cardId).catch(error => {
      console.warn('Background removal from unified service failed:', error);
    });
  },

  clearAll(): void {
    const result = CardStorageService.clearAll();
    if (!result.success) {
      console.error('Failed to clear storage:', result.error);
    }
    
    // Also clear unified service in background
    unifiedDataService.clear('cards').catch(error => {
      console.warn('Background clear of unified service failed:', error);
    });
  },

  getUnsyncedCards(): CardData[] {
    return CardStorageService.getAllCards();
  },

  // New async methods for modern usage
  async getAllCardsAsync(): Promise<CardData[]> {
    return unifiedDataService.getAllCards();
  },

  async getCardAsync(cardId: string): Promise<CardData | null> {
    return unifiedDataService.getCard(cardId);
  },

  async saveCardAsync(card: CardData): Promise<string> {
    const success = await unifiedDataService.saveCard(card);
    if (!success) {
      console.error('Failed to save card via unified service');
      return card.id || '';
    }
    return card.id || '';
  },

  async removeCardAsync(cardId: string): Promise<void> {
    const success = await unifiedDataService.deleteCard(cardId);
    if (!success) {
      console.error('Failed to remove card via unified service');
    }
  },

  async migrateToUnified(): Promise<{ consolidated: number, cleaned: string[] }> {
    const result = await unifiedDataService.migrateFromOldStorage();
    return {
      consolidated: result.migrated,
      cleaned: result.cleaned
    };
  }
};

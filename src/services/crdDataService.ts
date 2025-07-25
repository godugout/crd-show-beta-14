import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { supabase } from '@/integrations/supabase/client';
import type { CardData } from '@/types/card';

// Enhanced database schema definition
interface CRDDataDB extends DBSchema {
  cards: {
    key: string;
    value: {
      id: string;
      data: CardData;
      createdAt: Date;
      updatedAt: Date;
      syncedAt?: Date;
      needsSync: boolean;
    };
    indexes: {
      'by-created': Date;
      'by-updated': Date;
      'by-sync-status': boolean;
    };
  };
  sessions: {
    key: string;
    value: {
      id: string;
      data: {
        sessionData: any;
        psdData?: any;
        uploadProgress?: number;
        stepData?: Record<string, any>;
      };
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: {
      'by-created': Date;
      'by-updated': Date;
    };
  };
  cache: {
    key: string;
    value: {
      key: string;
      data: any;
      expiresAt?: Date;
      createdAt: Date;
    };
    indexes: {
      'by-expires': Date;
      'by-created': Date;
    };
  };
  user_preferences: {
    key: string;
    value: {
      userId: string;
      preferences: Record<string, any>;
      updatedAt: Date;
    };
    indexes: {
      'by-updated': Date;
    };
  };
}

type StoreNames = 'cards' | 'sessions' | 'cache' | 'user_preferences';

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

class CRDDataService {
  private db: IDBPDatabase<CRDDataDB> | null = null;
  private dbName = 'cardshow-data';
  private dbVersion = 1;

  // Initialize the database
  private async initDB(): Promise<IDBPDatabase<CRDDataDB>> {
    if (this.db) return this.db;

    this.db = await openDB<CRDDataDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Cards store for card data
        if (!db.objectStoreNames.contains('cards')) {
          const cardsStore = db.createObjectStore('cards', { keyPath: 'id' });
          cardsStore.createIndex('by-created', 'createdAt');
          cardsStore.createIndex('by-updated', 'updatedAt');
          cardsStore.createIndex('by-sync-status', 'needsSync');
        }

        // Sessions store for session data
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('by-created', 'createdAt');
          sessionsStore.createIndex('by-updated', 'updatedAt');
        }

        // Cache store for temporary data
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('by-expires', 'expiresAt');
          cacheStore.createIndex('by-created', 'createdAt');
        }

        // User preferences store
        if (!db.objectStoreNames.contains('user_preferences')) {
          const prefsStore = db.createObjectStore('user_preferences', { keyPath: 'userId' });
          prefsStore.createIndex('by-updated', 'updatedAt');
        }
      },
    });

    return this.db;
  }

  // Generic get method
  async get<T = any>(storeName: StoreNames, key: string): Promise<T | null> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const result = await store.get(key);
      
      // Check expiration for cache entries
      if (storeName === 'cache' && result && 'expiresAt' in result && result.expiresAt && new Date() > result.expiresAt) {
        await this.delete(storeName, key);
        return null;
      }
      
      // Return appropriate data based on store type
      if (storeName === 'user_preferences' && result && 'preferences' in result) {
        return result.preferences as T;
      }
      
      return result && 'data' in result ? result.data : null;
    } catch (error) {
      console.error(`Error getting ${key} from ${storeName}:`, error);
      return null;
    }
  }

  // Generic set method
  async set<T = any>(
    storeName: StoreNames, 
    key: string, 
    data: T, 
    expiresInMs?: number
  ): Promise<boolean> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      const now = new Date();
      let record: any;

      switch (storeName) {
        case 'cards':
          record = {
            id: key,
            data,
            createdAt: now,
            updatedAt: now,
            needsSync: true
          };
          break;
        case 'sessions':
          record = {
            id: key,
            data,
            createdAt: now,
            updatedAt: now
          };
          break;
        case 'cache':
          record = {
            key,
            data,
            createdAt: now,
            expiresAt: expiresInMs ? new Date(Date.now() + expiresInMs) : undefined
          };
          break;
        case 'user_preferences':
          record = {
            userId: key,
            preferences: data,
            updatedAt: now
          };
          break;
        default:
          throw new Error(`Unknown store: ${storeName}`);
      }

      await store.put(record);
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in ${storeName}:`, error);
      return false;
    }
  }

  // Generic delete method
  async delete(storeName: StoreNames, key: string): Promise<boolean> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.delete(key);
      return true;
    } catch (error) {
      console.error(`Error deleting ${key} from ${storeName}:`, error);
      return false;
    }
  }

  // Clear all data from a specific store
  async clear(storeName: StoreNames): Promise<boolean> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      return true;
    } catch (error) {
      console.error(`Error clearing ${storeName}:`, error);
      return false;
    }
  }

  // Clear all expired cache entries
  async clearExpiredCache(): Promise<boolean> {
    try {
      const db = await this.initDB();
      const tx = db.transaction('cache', 'readwrite');
      const store = tx.objectStore('cache');
      const index = store.index('by-expires');
      
      const now = new Date();
      const range = IDBKeyRange.upperBound(now);
      const cursor = await index.openCursor(range);
      
      const keysToDelete: string[] = [];
      let currentCursor = cursor;
      
      while (currentCursor) {
        keysToDelete.push(currentCursor.value.key);
        currentCursor = await currentCursor.continue();
      }
      
      for (const key of keysToDelete) {
        await store.delete(key);
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing expired cache:', error);
      return false;
    }
  }

  // Enhanced card-specific methods with Supabase sync
  async saveCard(cardId: string, cardData: CardData): Promise<boolean> {
    try {
      const now = new Date();
      const record = {
        id: cardId,
        data: cardData,
        createdAt: now,
        updatedAt: now,
        needsSync: true // Mark for sync to Supabase
      };

      const db = await this.initDB();
      const tx = db.transaction('cards', 'readwrite');
      const store = tx.objectStore('cards');
      await store.put(record);
      
      console.log('✅ Card saved to IndexedDB:', cardId);
      
      // Attempt background sync to Supabase
      this.syncCardToSupabase(cardId, cardData).catch(error => {
        console.warn('🔄 Background sync failed, will retry later:', error);
      });
      
      return true;
    } catch (error) {
      console.error(`❌ Error saving card ${cardId}:`, error);
      return false;
    }
  }

  async getCard(cardId: string): Promise<CardData | null> {
    const result = await this.get('cards', cardId);
    return result;
  }

  async getAllCards(): Promise<CardData[]> {
    try {
      const db = await this.initDB();
      const tx = db.transaction('cards', 'readonly');
      const store = tx.objectStore('cards');
      const results = await store.getAll();
      
      return results.map(item => item.data).filter(Boolean);
    } catch (error) {
      console.error('❌ Error getting all cards:', error);
      return [];
    }
  }

  async deleteCard(cardId: string): Promise<boolean> {
    try {
      // Delete from IndexedDB
      const localSuccess = await this.delete('cards', cardId);
      
      // Attempt to delete from Supabase
      try {
        const { error } = await supabase
          .from('cards')
          .delete()
          .eq('id', cardId);
          
        if (error) {
          console.warn('🔄 Failed to delete from Supabase:', error);
        } else {
          console.log('✅ Card deleted from Supabase:', cardId);
        }
      } catch (supabaseError) {
        console.warn('🔄 Supabase delete error:', supabaseError);
      }
      
      return localSuccess;
    } catch (error) {
      console.error(`❌ Error deleting card ${cardId}:`, error);
      return false;
    }
  }

  // Supabase sync methods
  async syncCardToSupabase(cardId: string, cardData: CardData): Promise<boolean> {
    try {
      // Convert CardData to Supabase compatible format
      const supabaseCard = this.convertCardDataToSupabaseFormat(cardData);
      
      const { data, error } = await supabase
        .from('cards')
        .upsert([supabaseCard])
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to sync card to Supabase:', error);
        return false;
      }

      // Mark as synced in IndexedDB
      await this.markCardAsSynced(cardId);
      console.log('✅ Card synced to Supabase:', cardId);
      return true;
    } catch (error) {
      console.error('❌ Error syncing card to Supabase:', error);
      return false;
    }
  }

  async markCardAsSynced(cardId: string): Promise<void> {
    try {
      const db = await this.initDB();
      const tx = db.transaction('cards', 'readwrite');
      const store = tx.objectStore('cards');
      const record = await store.get(cardId);
      
      if (record) {
        record.syncedAt = new Date();
        record.needsSync = false;
        await store.put(record);
      }
    } catch (error) {
      console.error('❌ Error marking card as synced:', error);
    }
  }

  async syncAllUnsyncedCards(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: []
    };

    try {
      const db = await this.initDB();
      const tx = db.transaction('cards', 'readonly');
      const store = tx.objectStore('cards');
      const index = store.index('by-sync-status');
      const unsyncedCards = await index.getAll(true); // needsSync = true

      for (const record of unsyncedCards) {
        try {
          const success = await this.syncCardToSupabase(record.id, record.data);
          if (success) {
            result.synced++;
          } else {
            result.failed++;
            result.errors.push(`Failed to sync card ${record.id}`);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Error syncing card ${record.id}: ${error}`);
        }
      }

      result.success = result.failed === 0;
      console.log(`🔄 Sync complete: ${result.synced} synced, ${result.failed} failed`);
      return result;
    } catch (error) {
      console.error('❌ Error during bulk sync:', error);
      result.success = false;
      result.errors.push(`Bulk sync error: ${error}`);
      return result;
    }
  }

  // Enhanced session methods for PSD workflow
  async savePSDSession(sessionId: string, psdData: any, uploadProgress?: number): Promise<boolean> {
    const sessionData = {
      sessionData: { type: 'psd', timestamp: Date.now() },
      psdData,
      uploadProgress: uploadProgress || 0,
      stepData: {}
    };
    return this.set('sessions', sessionId, sessionData);
  }

  async getPSDSession(sessionId: string): Promise<any | null> {
    const session = await this.get('sessions', sessionId);
    return session ? session.psdData : null;
  }

  async updatePSDSessionProgress(sessionId: string, progress: number): Promise<boolean> {
    try {
      const session = await this.get('sessions', sessionId);
      if (session) {
        session.uploadProgress = progress;
        return this.set('sessions', sessionId, session);
      }
      return false;
    } catch (error) {
      console.error('❌ Error updating PSD session progress:', error);
      return false;
    }
  }

  // Session management methods
  async saveSession(sessionId: string, sessionData: any): Promise<boolean> {
    const data = {
      sessionData,
      psdData: sessionData.psdData || null,
      uploadProgress: sessionData.uploadProgress || 0,
      stepData: sessionData.stepData || {}
    };
    return this.set('sessions', sessionId, data);
  }

  async getSession(sessionId: string): Promise<any | null> {
    return this.get('sessions', sessionId);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.delete('sessions', sessionId);
  }

  // Cache-specific methods
  async setCached(key: string, data: any, expiresInMs?: number): Promise<boolean> {
    return this.set('cache', key, data, expiresInMs);
  }

  async getCached(key: string): Promise<any | null> {
    return this.get('cache', key);
  }

  async deleteCached(key: string): Promise<boolean> {
    return this.delete('cache', key);
  }

  // User preferences methods
  async saveUserPreferences(userId: string, preferences: Record<string, any>): Promise<boolean> {
    return this.set('user_preferences', userId, preferences);
  }

  async getUserPreferences(userId: string): Promise<Record<string, any> | null> {
    return this.get('user_preferences', userId);
  }

  // Enhanced migration from localStorage with specific cleanup
  async migrateFromLocalStorage(localStorageKey: string, storeName: StoreNames): Promise<boolean> {
    try {
      const data = localStorage.getItem(localStorageKey);
      if (!data) return false;
      
      const parsedData = JSON.parse(data);
      
      if (Array.isArray(parsedData)) {
        // Handle array data (like card collections)
        for (let i = 0; i < parsedData.length; i++) {
          const item = parsedData[i];
          const key = item.id || `migrated_${i}_${Date.now()}`;
          
          if (storeName === 'cards' && this.isValidCardData(item)) {
            await this.saveCard(key, item);
          } else {
            await this.set(storeName, key, item);
          }
        }
      } else if (parsedData && typeof parsedData === 'object') {
        // Handle object data
        const key = parsedData.id || `migrated_${Date.now()}`;
        
        if (storeName === 'cards' && this.isValidCardData(parsedData)) {
          await this.saveCard(key, parsedData);
        } else {
          await this.set(storeName, key, parsedData);
        }
      }
      
      // Remove from localStorage after successful migration
      localStorage.removeItem(localStorageKey);
      console.log(`✅ Successfully migrated ${localStorageKey} to IndexedDB`);
      return true;
    } catch (error) {
      console.error(`❌ Error migrating ${localStorageKey}:`, error);
      return false;
    }
  }

  // Validate card data structure
  private isValidCardData(data: any): data is CardData {
    return data && 
           typeof data.id === 'string' && 
           typeof data.title === 'string' &&
           (typeof data.creator_id === 'string' || data.creator_id === undefined);
  }

  // Convert CardData to Supabase database format
  private convertCardDataToSupabaseFormat(cardData: CardData): any {
    return {
      id: cardData.id,
      title: cardData.title,
      description: cardData.description,
      creator_id: cardData.creator_id || '',
      image_url: cardData.image_url,
      thumbnail_url: cardData.thumbnail_url || cardData.image_url,
      tags: cardData.tags || [],
      rarity: cardData.rarity || 'common',
      visibility: cardData.visibility || 'private',
      design_metadata: cardData.design_metadata || {},
      // Add default values for required Supabase fields that might be missing
      abilities: [],
      base_price: null,
      card_set_id: null,
      card_type: 'character',
      collection_id: null,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_market_value: null,
      current_supply: 1,
      edition_number: null,
      favorite_count: 0,
      is_public: cardData.visibility === 'public',
      is_tradeable: true,
      locked_image_url: null,
      marketplace_listing: false,
      mana_cost: {},
      minting_metadata: {},
      minting_status: 'not_minted',
      name: null,
      power: null,
      print_available: false,
      print_metadata: {},
      royalty_percentage: 5.00,
      serial_number: null,
      series: null,
      series_one_number: null,
      set_id: null,
      team_id: null,
      template_id: null,
      toughness: null,
      total_supply: null,
      verification_status: 'pending',
      view_count: 0,
      image_locked: false,
      crd_catalog_inclusion: true
    };
  }

  // Bulk migration utility
  async migrateAllLocalStorageData(): Promise<{ migrated: string[], failed: string[] }> {
    const migrated: string[] = [];
    const failed: string[] = [];
    
    // Known localStorage keys used in the app
    const knownKeys = [
      'cardshow_profiles',
      'cardshow-wizard-state', 
      'cardshow_upload_session',
      'betaStabilityMonitor-dismissed',
      'crd-secret-text-settings',
      'template-favorites',
      'template-recent',
      'template-preferences'
    ];
    
    for (const key of knownKeys) {
      try {
        const success = await this.migrateFromLocalStorage(key, 
          key.includes('card') ? 'cards' : 
          key.includes('session') || key.includes('wizard') ? 'sessions' : 
          'user_preferences'
        );
        
        if (success) {
          migrated.push(key);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate ${key}:`, error);
        failed.push(key);
      }
    }
    
    console.log(`🔄 Migration complete: ${migrated.length} migrated, ${failed.length} failed`);
    return { migrated, failed };
  }

  /**
   * Clear all data (useful for testing or complete resets)
   */
  async clearAll(): Promise<boolean> {
    try {
      console.log('🗑️ Clearing all CRD data stores');
      
      // Clear all stores
      await Promise.all([
        this.clear('cards'),
        this.clear('sessions'),
        this.clear('cache'),
        this.clear('user_preferences')
      ]);
      
      console.log('✅ All CRD data stores cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing all data:', error);
      return false;
    }
  }

  // Enhanced database maintenance
  async cleanup(): Promise<void> {
    await this.clearExpiredCache();
    
    // Clean up old sessions (older than 24 hours)
    try {
      const db = await this.initDB();
      const tx = db.transaction('sessions', 'readwrite');
      const store = tx.objectStore('sessions');
      const index = store.index('by-created');
      
      const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      const range = IDBKeyRange.upperBound(cutoffDate);
      const cursor = await index.openCursor(range);
      
      const keysToDelete: string[] = [];
      let currentCursor = cursor;
      
      while (currentCursor) {
        keysToDelete.push(currentCursor.value.id);
        currentCursor = await currentCursor.continue();
      }
      
      for (const key of keysToDelete) {
        await store.delete(key);
      }
      
      if (keysToDelete.length > 0) {
        console.log(`🧹 Cleaned up ${keysToDelete.length} old sessions`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up old sessions:', error);
    }
  }

  // Close database connection
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // Health check method
  async healthCheck(): Promise<{ 
    indexedDB: boolean; 
    supabase: boolean; 
    totalCards: number; 
    unsyncedCards: number 
  }> {
    const health = {
      indexedDB: false,
      supabase: false,
      totalCards: 0,
      unsyncedCards: 0
    };

    try {
      // Test IndexedDB
      const cards = await this.getAllCards();
      health.indexedDB = true;
      health.totalCards = cards.length;

      // Count unsynced cards
      const db = await this.initDB();
      const tx = db.transaction('cards', 'readonly');
      const store = tx.objectStore('cards');
      const index = store.index('by-sync-status');
      const unsyncedRecords = await index.getAll(true);
      health.unsyncedCards = unsyncedRecords.length;
    } catch (error) {
      console.error('❌ IndexedDB health check failed:', error);
    }

    try {
      // Test Supabase connection
      const { error } = await supabase.from('cards').select('id').limit(1);
      health.supabase = !error;
    } catch (error) {
      console.error('❌ Supabase health check failed:', error);
    }

    return health;
  }
}

// Export singleton instance
export const crdDataService = new CRDDataService();

// Auto-cleanup expired cache entries and old sessions every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    crdDataService.cleanup().catch(console.error);
  }, 10 * 60 * 1000);

  // Auto-sync unsynced cards every 5 minutes when online
  setInterval(() => {
    if (navigator.onLine) {
      crdDataService.syncAllUnsyncedCards().catch(console.error);
    }
  }, 5 * 60 * 1000);
}
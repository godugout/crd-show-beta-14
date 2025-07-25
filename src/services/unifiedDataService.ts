import { openDB, type IDBPDatabase } from 'idb';
import { supabase } from '@/integrations/supabase/client';
import type { CardData } from '@/types/card';

type StoreNames = 'cards' | 'sessions' | 'cache' | 'user_preferences' | 'app_state';

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

interface MigrationResult {
  success: boolean;
  migrated: number;
  cleaned: string[];
  errors: string[];
}

/**
 * Unified Data Service - Single source of truth for all app data storage
 * Consolidates localStorage, IndexedDB, and Supabase sync into one service
 */
class UnifiedDataService {
  private db: IDBPDatabase<any> | null = null;
  private dbName = 'cardshow-unified';
  private dbVersion = 2;
  private isInitialized = false;

  // Initialize the database with all required stores
  private async initDB(): Promise<IDBPDatabase<any>> {
    if (this.db && this.isInitialized) return this.db;

    this.db = await openDB(this.dbName, this.dbVersion, {
      upgrade(db, oldVersion) {
        console.log('🔄 Upgrading unified database from version:', oldVersion);

        // Cards store for card data
        if (!db.objectStoreNames.contains('cards')) {
          const cardsStore = db.createObjectStore('cards', { keyPath: 'id' });
          cardsStore.createIndex('by-created', 'createdAt');
          cardsStore.createIndex('by-updated', 'updatedAt');
          cardsStore.createIndex('by-sync-status', 'needsSync');
          cardsStore.createIndex('by-creator', 'creator_id');
        }

        // Sessions store for temporary workflow data
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('by-created', 'createdAt');
          sessionsStore.createIndex('by-updated', 'updatedAt');
          sessionsStore.createIndex('by-type', 'type');
        }

        // Cache store for temporary data with expiration
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

        // App state store for UI state, settings, etc.
        if (!db.objectStoreNames.contains('app_state')) {
          const appStateStore = db.createObjectStore('app_state', { keyPath: 'key' });
          appStateStore.createIndex('by-updated', 'updatedAt');
        }
      },
    });

    this.isInitialized = true;
    console.log('✅ Unified database initialized');
    return this.db;
  }

  // ===== CORE CRUD OPERATIONS =====

  async get<T = any>(storeName: StoreNames, key: string): Promise<T | null> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const result = await store.get(key);
      
      // Handle cache expiration
      if (storeName === 'cache' && result && 'expiresAt' in result && result.expiresAt && new Date() > result.expiresAt) {
        await this.delete(storeName, key);
        return null;
      }
      
      // Return data based on store structure
      if (result && 'data' in result) {
        return result.data as T;
      }
      
      return result as T || null;
    } catch (error) {
      console.error(`❌ Error getting ${key} from ${storeName}:`, error);
      return null;
    }
  }

  async set<T = any>(
    storeName: StoreNames, 
    key: string, 
    data: T, 
    options: { expiresInMs?: number; needsSync?: boolean } = {}
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
            needsSync: options.needsSync ?? true,
            creator_id: (data as any)?.creator_id || '',
          };
          break;
        case 'sessions':
          record = {
            id: key,
            data,
            type: (data as any)?.type || 'generic',
            createdAt: now,
            updatedAt: now
          };
          break;
        case 'cache':
          record = {
            key,
            data,
            createdAt: now,
            expiresAt: options.expiresInMs ? new Date(Date.now() + options.expiresInMs) : undefined
          };
          break;
        case 'user_preferences':
          record = {
            userId: key,
            data,
            updatedAt: now
          };
          break;
        case 'app_state':
          record = {
            key,
            data,
            updatedAt: now
          };
          break;
        default:
          throw new Error(`Unknown store: ${storeName}`);
      }

      await store.put(record);
      return true;
    } catch (error) {
      console.error(`❌ Error setting ${key} in ${storeName}:`, error);
      return false;
    }
  }

  async delete(storeName: StoreNames, key: string): Promise<boolean> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.delete(key);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting ${key} from ${storeName}:`, error);
      return false;
    }
  }

  async clear(storeName: StoreNames): Promise<boolean> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      return true;
    } catch (error) {
      console.error(`❌ Error clearing ${storeName}:`, error);
      return false;
    }
  }

  // ===== CARD-SPECIFIC METHODS =====

  async saveCard(cardData: CardData): Promise<boolean> {
    const cardId = cardData.id || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cardWithId = { ...cardData, id: cardId };
    
    const success = await this.set('cards', cardId, cardWithId, { needsSync: true });
    
    if (success) {
      console.log('✅ Card saved to unified storage:', cardId);
      // Attempt background sync to Supabase
      this.syncCardToSupabase(cardId, cardWithId).catch(error => {
        console.warn('🔄 Background sync failed, will retry later:', error);
      });
    }
    
    return success;
  }

  async getCard(cardId: string): Promise<CardData | null> {
    return this.get<CardData>('cards', cardId);
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
      // Delete from unified storage
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

  // ===== SESSION MANAGEMENT =====

  async saveSession(sessionId: string, sessionData: any): Promise<boolean> {
    return this.set('sessions', sessionId, sessionData);
  }

  async getSession(sessionId: string): Promise<any | null> {
    return this.get('sessions', sessionId);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.delete('sessions', sessionId);
  }

  // ===== CACHE MANAGEMENT =====

  async setCached(key: string, data: any, expiresInMs?: number): Promise<boolean> {
    return this.set('cache', key, data, { expiresInMs });
  }

  async getCached(key: string): Promise<any | null> {
    return this.get('cache', key);
  }

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
      
      console.log(`🧹 Cleared ${keysToDelete.length} expired cache entries`);
      return true;
    } catch (error) {
      console.error('❌ Error clearing expired cache:', error);
      return false;
    }
  }

  // ===== USER PREFERENCES =====

  async saveUserPreferences(userId: string, preferences: Record<string, any>): Promise<boolean> {
    return this.set('user_preferences', userId, preferences);
  }

  async getUserPreferences(userId: string): Promise<Record<string, any> | null> {
    return this.get('user_preferences', userId);
  }

  // ===== APP STATE MANAGEMENT =====

  async saveAppState(key: string, state: any): Promise<boolean> {
    return this.set('app_state', key, state);
  }

  async getAppState(key: string): Promise<any | null> {
    return this.get('app_state', key);
  }

  // ===== MIGRATION FROM OLD STORAGE =====

  async migrateFromOldStorage(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      migrated: 0,
      cleaned: [],
      errors: []
    };

    console.log('🔄 Starting migration from old storage systems...');

    try {
      // Migrate from crdDataService (if exists)
      await this.migrateFromCRDDataService(result);

      // Migrate from localStorage card storage
      await this.migrateFromLocalStorage(result);

      // Migrate from localStorage preferences
      await this.migrateFromLocalStoragePreferences(result);

      console.log(`✅ Migration complete: ${result.migrated} items migrated, ${result.cleaned.length} cleaned up`);
    } catch (error) {
      result.success = false;
      result.errors.push(`Migration error: ${error}`);
      console.error('❌ Migration failed:', error);
    }

    return result;
  }

  private async migrateFromCRDDataService(result: MigrationResult): Promise<void> {
    try {
      // Try to access old crdDataService database
      const oldDB = await openDB('cardshow-data', 1).catch(() => null);
      if (!oldDB) return;

      // Migrate cards
      const cardsStore = oldDB.transaction('cards', 'readonly').objectStore('cards');
      const oldCards = await cardsStore.getAll();
      
      for (const record of oldCards) {
        if (record.data && this.isValidCardData(record.data)) {
          await this.saveCard(record.data);
          result.migrated++;
        }
      }

      // Migrate sessions
      const sessionsStore = oldDB.transaction('sessions', 'readonly').objectStore('sessions');
      const oldSessions = await sessionsStore.getAll();
      
      for (const record of oldSessions) {
        await this.saveSession(record.id, record.data);
        result.migrated++;
      }

      // Close and mark for cleanup
      oldDB.close();
      result.cleaned.push('cardshow-data IndexedDB');
      
    } catch (error) {
      result.errors.push(`CRD Data Service migration error: ${error}`);
    }
  }

  private async migrateFromLocalStorage(result: MigrationResult): Promise<void> {
    const localStorageKeys = [
      'crd-cards',
      'cardshow_profiles',
      'cardshow-wizard-state',
      'betaStabilityMonitor-dismissed',
      'crd-secret-text-settings'
    ];

    // Migrate user-specific card storage
    const userCardKeys = Object.keys(localStorage).filter(key => key.startsWith('cards_'));
    localStorageKeys.push(...userCardKeys);

    for (const key of localStorageKeys) {
      try {
        const data = localStorage.getItem(key);
        if (!data) continue;

        const parsedData = JSON.parse(data);

        if (key === 'crd-cards' || key.startsWith('cards_')) {
          // Handle card arrays
          if (Array.isArray(parsedData)) {
            for (const card of parsedData) {
              if (this.isValidCardData(card)) {
                await this.saveCard(card);
                result.migrated++;
              }
            }
          }
        } else if (key === 'cardshow_profiles') {
          // Handle profiles
          await this.saveAppState('user_profiles', parsedData);
          result.migrated++;
        } else {
          // Handle other app state
          await this.saveAppState(key, parsedData);
          result.migrated++;
        }

        localStorage.removeItem(key);
        result.cleaned.push(key);
      } catch (error) {
        result.errors.push(`localStorage migration error for ${key}: ${error}`);
      }
    }
  }

  private async migrateFromLocalStoragePreferences(result: MigrationResult): Promise<void> {
    // Handle template cache preferences
    const templateKeys = ['cardshow-template-favorites', 'cardshow-template-recent', 'cardshow-template-preferences'];
    
    for (const key of templateKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsedData = JSON.parse(data);
          await this.saveAppState(key, parsedData);
          localStorage.removeItem(key);
          result.migrated++;
          result.cleaned.push(key);
        }
      } catch (error) {
        result.errors.push(`Template preference migration error for ${key}: ${error}`);
      }
    }
  }

  // ===== SUPABASE SYNC =====

  async syncCardToSupabase(cardId: string, cardData: CardData): Promise<boolean> {
    try {
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

      // Mark as synced
      await this.markCardAsSynced(cardId);
      console.log('✅ Card synced to Supabase:', cardId);
      return true;
    } catch (error) {
      console.error('❌ Error syncing card to Supabase:', error);
      return false;
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

  private async markCardAsSynced(cardId: string): Promise<void> {
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

  // ===== UTILITY METHODS =====

  private isValidCardData(data: any): data is CardData {
    return data && 
           typeof data.id === 'string' && 
           typeof data.title === 'string' &&
           (typeof data.creator_id === 'string' || data.creator_id === undefined);
  }

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
      abilities: [],
      stats: {},
      template_id: cardData.template_id || null,
      publishing_options: cardData.publishing_options || {},
      creator_attribution: cardData.creator_attribution || {},
      is_public: cardData.visibility === 'public'
    };
  }

  // ===== CLEANUP METHODS =====

  async cleanup(): Promise<void> {
    try {
      await this.clearExpiredCache();
      console.log('🧹 Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService();

// Auto-migrate on first use
let migrationStarted = false;
const originalInitDB = unifiedDataService['initDB'].bind(unifiedDataService);
unifiedDataService['initDB'] = async function() {
  const result = await originalInitDB();
  
  if (!migrationStarted) {
    migrationStarted = true;
    setTimeout(() => {
      unifiedDataService.migrateFromOldStorage().then(result => {
        console.log('📦 Auto-migration completed:', result);
      }).catch(error => {
        console.error('❌ Auto-migration failed:', error);
      });
    }, 1000);
  }
  
  return result;
};

// Periodic cleanup
if (typeof window !== 'undefined') {
  setInterval(() => {
    unifiedDataService.cleanup().catch(console.error);
  }, 10 * 60 * 1000); // Every 10 minutes

  // Sync when online
  window.addEventListener('online', () => {
    if (navigator.onLine) {
      unifiedDataService.syncAllUnsyncedCards().catch(console.error);
    }
  });
}
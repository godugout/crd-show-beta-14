import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database schema definition
interface CRDDataDB extends DBSchema {
  cards: {
    key: string;
    value: {
      id: string;
      data: any;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: {
      'by-created': Date;
      'by-updated': Date;
    };
  };
  sessions: {
    key: string;
    value: {
      id: string;
      data: any;
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
            updatedAt: now
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

  // Get all entries from a store
  async getAll<T = any>(storeName: StoreNames): Promise<T[]> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const results = await store.getAll();
      
      // For cache, filter out expired entries
      if (storeName === 'cache') {
        const now = new Date();
        return results
          .filter(item => 'expiresAt' in item && (!item.expiresAt || item.expiresAt > now))
          .map(item => 'data' in item ? item.data : item);
      }
      
      // Handle different store types
      return results.map(item => {
        if ('data' in item) return item.data;
        if ('preferences' in item) return item.preferences;
        return item;
      });
    } catch (error) {
      console.error(`Error getting all from ${storeName}:`, error);
      return [];
    }
  }

  // Get entries with pagination
  async getPaginated<T = any>(
    storeName: StoreNames, 
    limit: number, 
    offset: number = 0
  ): Promise<{ data: T[]; total: number; hasMore: boolean }> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      
      const allData = await store.getAll();
      const total = allData.length;
      const data = allData
        .slice(offset, offset + limit)
        .map(item => {
          if ('data' in item) return item.data;
          if ('preferences' in item) return item.preferences;
          return item;
        });
      
      return {
        data,
        total,
        hasMore: offset + limit < total
      };
    } catch (error) {
      console.error(`Error getting paginated data from ${storeName}:`, error);
      return { data: [], total: 0, hasMore: false };
    }
  }

  // Card-specific methods
  async saveCard(cardId: string, cardData: any): Promise<boolean> {
    return this.set('cards', cardId, cardData);
  }

  async getCard(cardId: string): Promise<any | null> {
    return this.get('cards', cardId);
  }

  async getAllCards(): Promise<any[]> {
    return this.getAll('cards');
  }

  async deleteCard(cardId: string): Promise<boolean> {
    return this.delete('cards', cardId);
  }

  // Session-specific methods
  async saveSession(sessionId: string, sessionData: any): Promise<boolean> {
    return this.set('sessions', sessionId, sessionData);
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

  // Migration helper: Import data from localStorage
  async migrateFromLocalStorage(localStorageKey: string, storeName: StoreNames): Promise<boolean> {
    try {
      const data = localStorage.getItem(localStorageKey);
      if (!data) return false;
      
      const parsedData = JSON.parse(data);
      
      if (Array.isArray(parsedData)) {
        // Handle array data
        for (let i = 0; i < parsedData.length; i++) {
          const item = parsedData[i];
          const key = item.id || `item_${i}_${Date.now()}`;
          await this.set(storeName, key, item);
        }
      } else {
        // Handle object data
        const key = `migrated_${Date.now()}`;
        await this.set(storeName, key, parsedData);
      }
      
      // Remove from localStorage after successful migration
      localStorage.removeItem(localStorageKey);
      console.log(`Successfully migrated ${localStorageKey} to IndexedDB`);
      return true;
    } catch (error) {
      console.error(`Error migrating ${localStorageKey}:`, error);
      return false;
    }
  }

  // Database maintenance
  async cleanup(): Promise<void> {
    await this.clearExpiredCache();
  }

  // Close database connection
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const crdDataService = new CRDDataService();

// Auto-cleanup expired cache entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    crdDataService.clearExpiredCache().catch(console.error);
  }, 5 * 60 * 1000);
}
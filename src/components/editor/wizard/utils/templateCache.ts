const CACHE_KEYS = {
  FAVORITES: 'cardshow-template-favorites',
  RECENT: 'cardshow-template-recent',
  PREFERENCES: 'cardshow-template-preferences'
} as const;

export const templateCache = {
  // Favorites
  getFavorites(): string[] {
    try {
      const favorites = localStorage.getItem(CACHE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch {
      return [];
    }
  },

  setFavorites(templateIds: string[]): void {
    try {
      localStorage.setItem(CACHE_KEYS.FAVORITES, JSON.stringify(templateIds));
    } catch (error) {
      console.warn('Failed to save favorites:', error);
    }
  },

  addFavorite(templateId: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(templateId)) {
      favorites.push(templateId);
      this.setFavorites(favorites);
    }
  },

  removeFavorite(templateId: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(id => id !== templateId);
    this.setFavorites(filtered);
  },

  // Recent templates
  getRecentTemplates(): string[] {
    try {
      const recent = localStorage.getItem(CACHE_KEYS.RECENT);
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  },

  addRecentTemplate(templateId: string): void {
    try {
      const recent = this.getRecentTemplates();
      const filtered = recent.filter(id => id !== templateId);
      filtered.unshift(templateId);
      
      // Keep only the last 10 recent templates
      const limited = filtered.slice(0, 10);
      localStorage.setItem(CACHE_KEYS.RECENT, JSON.stringify(limited));
    } catch (error) {
      console.warn('Failed to save recent template:', error);
    }
  },

  // User preferences
  getPreferences() {
    try {
      const prefs = localStorage.getItem(CACHE_KEYS.PREFERENCES);
      return prefs ? JSON.parse(prefs) : {};
    } catch {
      return {};
    }
  },

  setPreferences(preferences: Record<string, any>): void {
    try {
      localStorage.setItem(CACHE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }
};

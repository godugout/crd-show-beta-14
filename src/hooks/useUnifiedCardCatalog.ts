import { useState, useEffect, useCallback, useMemo } from 'react';
import { cardAggregationService } from '@/services/cardAggregation';
import { supabase } from '@/integrations/supabase/client';
import type { 
  UnifiedCard,
  CardAggregationOptions,
  CardFilter,
  CardSort,
  UnifiedCardCatalogState,
  CardSource
} from '@/types/unifiedCard';

interface UseUnifiedCardCatalogOptions {
  autoLoad?: boolean;
  pageSize?: number;
  defaultSources?: CardSource[];
  defaultSort?: CardSort;
}

export function useUnifiedCardCatalog(options: UseUnifiedCardCatalogOptions = {}) {
  const {
    autoLoad = true,
    pageSize = 50,
    defaultSources = ['database', 'local'],
    defaultSort = { field: 'created_at', direction: 'desc' }
  } = options;

  const [state, setState] = useState<UnifiedCardCatalogState>({
    cards: [],
    loading: false,
    error: null,
    total: 0,
    hasMore: false,
    sources: {
      database: { count: 0, loading: false },
      local: { count: 0, loading: false },
      detected: { count: 0, loading: false },
      external: { count: 0, loading: false },
      template: { count: 0, loading: false },
    },
    sync: {
      pending: 0,
      conflicts: 0,
      last_sync: null,
    }
  });

  const [filters, setFilters] = useState<CardFilter>({});
  const [sort, setSort] = useState<CardSort>(defaultSort);
  const [selectedSources, setSelectedSources] = useState<CardSource[]>(defaultSources);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user for access control
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Determine aggregation options based on user and selections
  const aggregationOptions = useMemo<CardAggregationOptions>(() => {
    return {
      includeSources: selectedSources,
      includePrivate: !!currentUser,
      includeUserOnly: !!currentUser,
      includeDrafts: selectedSources.includes('local'),
      adminAccess: false, // TODO: Check admin status
    };
  }, [selectedSources, currentUser]);

  // Load cards from all sources
  const loadCards = useCallback(async (append = false) => {
    if (!append) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      // Update source loading states
      setState(prev => ({
        ...prev,
        sources: {
          ...prev.sources,
          ...Object.fromEntries(
            selectedSources.map(source => [source, { ...prev.sources[source], loading: true }])
          )
        }
      }));

      const allCards = await cardAggregationService.aggregateCards(aggregationOptions);
      
      // Apply filters
      const filteredCards = applyFilters(allCards, filters);
      
      // Apply sorting
      const sortedCards = applySorting(filteredCards, sort);
      
      // Update state with results
      setState(prev => ({
        ...prev,
        cards: append ? [...prev.cards, ...sortedCards] : sortedCards,
        loading: false,
        total: sortedCards.length,
        hasMore: false, // For now, we load all cards
        sources: {
          ...prev.sources,
          ...Object.fromEntries(
            selectedSources.map(source => [
              source, 
              { 
                count: allCards.filter(card => card.source === source).length,
                loading: false 
              }
            ])
          )
        },
        sync: {
          pending: allCards.filter(card => card.sync_status === 'pending').length,
          conflicts: allCards.filter(card => card.sync_status === 'conflict').length,
          last_sync: new Date().toISOString(),
        }
      }));

    } catch (error) {
      console.error('Error loading unified cards:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load cards',
        sources: {
          ...prev.sources,
          ...Object.fromEntries(
            selectedSources.map(source => [
              source, 
              { 
                ...prev.sources[source],
                loading: false,
                error: 'Failed to load'
              }
            ])
          )
        }
      }));
    }
  }, [aggregationOptions, filters, sort, selectedSources]);

  // Apply filters to cards
  const applyFilters = useCallback((cards: UnifiedCard[], filters: CardFilter): UnifiedCard[] => {
    return cards.filter(card => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          card.title.toLowerCase().includes(searchLower) ||
          (card.description && card.description.toLowerCase().includes(searchLower)) ||
          (card.tags && card.tags.some(tag => tag.toLowerCase().includes(searchLower)));
        
        if (!matchesSearch) return false;
      }

      // Rarity filter
      if (filters.rarity && filters.rarity.length > 0) {
        if (!card.rarity || !filters.rarity.includes(card.rarity)) return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!card.tags || !filters.tags.some(tag => card.tags?.includes(tag))) return false;
      }

      // Creator filter
      if (filters.creator_id) {
        if (card.creator_id !== filters.creator_id) return false;
      }

      // Source filter
      if (filters.source && filters.source.length > 0) {
        if (!filters.source.includes(card.source)) return false;
      }

      // Sync status filter
      if (filters.sync_status && filters.sync_status.length > 0) {
        if (!filters.sync_status.includes(card.sync_status)) return false;
      }

      // Public filter
      if (filters.is_public !== undefined) {
        if (card.is_public !== filters.is_public) return false;
      }

      // Has image filter
      if (filters.has_image !== undefined) {
        const hasImage = !!(card.image_url || card.thumbnail_url);
        if (hasImage !== filters.has_image) return false;
      }

      return true;
    });
  }, []);

  // Apply sorting to cards
  const applySorting = useCallback((cards: UnifiedCard[], sort: CardSort): UnifiedCard[] => {
    return [...cards].sort((a, b) => {
      let valueA: any = a[sort.field];
      let valueB: any = b[sort.field];

      // Handle undefined values
      if (valueA === undefined) valueA = '';
      if (valueB === undefined) valueB = '';

      // Handle different data types
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sort.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, []);

  // Refresh cards
  const refresh = useCallback(() => {
    cardAggregationService.clearCache();
    loadCards(false);
  }, [loadCards]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<CardFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Update sort
  const updateSort = useCallback((newSort: CardSort) => {
    setSort(newSort);
  }, []);

  // Update selected sources
  const updateSources = useCallback((sources: CardSource[]) => {
    setSelectedSources(sources);
  }, []);

  // Sync a local card to database
  const syncCard = useCallback(async (cardId: string) => {
    const result = await cardAggregationService.syncLocalCard(cardId);
    if (result.success) {
      // Refresh to show updated sync status
      refresh();
    }
    return result;
  }, [refresh]);

  // Auto-load on mount and when dependencies change
  useEffect(() => {
    if (autoLoad) {
      loadCards(false);
    }
  }, [autoLoad, loadCards]);

  // Reload when filters or sort change
  useEffect(() => {
    if (autoLoad) {
      loadCards(false);
    }
  }, [filters, sort, selectedSources]);

  return {
    // State
    ...state,
    filters,
    sort,
    selectedSources,
    currentUser,

    // Actions
    loadCards,
    refresh,
    updateFilters,
    updateSort,
    updateSources,
    syncCard,

    // Computed values
    isEmpty: state.cards.length === 0 && !state.loading,
    hasFilters: Object.keys(filters).some(key => {
      const value = filters[key as keyof CardFilter];
      return value !== undefined && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }),
  };
}
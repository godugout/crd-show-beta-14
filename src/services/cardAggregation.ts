import { CardRepository } from '@/repositories/cardRepository';
import { localCardStorage } from '@/lib/localCardStorage';
import { supabase } from '@/integrations/supabase/client';
import type { 
  UnifiedCard, 
  CardSource, 
  SyncStatus, 
  CardAggregationOptions,
  ExternalCard,
  LinkbackData 
} from '@/types/unifiedCard';
import type { CardData } from '@/types/card';
import type { Card } from '@/repositories/cardRepository/types';
import type { DetectedCard } from '@/services/cardCatalog/types';

export class CardAggregationService {
  private static instance: CardAggregationService;
  private cache: Map<string, UnifiedCard[]> = new Map();
  private lastFetch: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): CardAggregationService {
    if (!CardAggregationService.instance) {
      CardAggregationService.instance = new CardAggregationService();
    }
    return CardAggregationService.instance;
  }

  async aggregateCards(options: CardAggregationOptions): Promise<UnifiedCard[]> {
    const cacheKey = JSON.stringify(options);
    const now = Date.now();
    
    // Check cache first
    if (this.cache.has(cacheKey) && 
        this.lastFetch.has(cacheKey) && 
        now - this.lastFetch.get(cacheKey)! < this.CACHE_TTL) {
      return this.cache.get(cacheKey)!;
    }

    const allCards: UnifiedCard[] = [];
    const fetchPromises: Promise<UnifiedCard[]>[] = [];

    // Fetch from each requested source
    if (options.includeSources.includes('database')) {
      fetchPromises.push(this.fetchDatabaseCards(options));
    }
    
    if (options.includeSources.includes('local')) {
      fetchPromises.push(this.fetchLocalCards(options));
    }
    
    if (options.includeSources.includes('detected')) {
      fetchPromises.push(this.fetchDetectedCards(options));
    }
    
    if (options.includeSources.includes('external')) {
      fetchPromises.push(this.fetchExternalCards(options));
    }
    
    if (options.includeSources.includes('template')) {
      fetchPromises.push(this.fetchTemplateCards(options));
    }

    // Wait for all sources and combine
    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allCards.push(...result.value);
      } else {
        console.error('Failed to fetch from source:', result.reason);
      }
    });

    // Deduplicate and merge
    const unifiedCards = this.deduplicateCards(allCards);
    
    // Cache the results
    this.cache.set(cacheKey, unifiedCards);
    this.lastFetch.set(cacheKey, now);
    
    return unifiedCards;
  }

  private async fetchDatabaseCards(options: CardAggregationOptions): Promise<UnifiedCard[]> {
    try {
      let query = supabase.from('cards').select('*');
      
      // Apply access control
      if (!options.adminAccess) {
        if (options.includePrivate && options.includeUserOnly) {
          // User can see their own private + all public
          const user = await supabase.auth.getUser();
          if (user.data.user) {
            query = query.or(`is_public.eq.true,creator_id.eq.${user.data.user.id}`);
          } else {
            query = query.eq('is_public', true);
          }
        } else {
          // Only public cards
          query = query.eq('is_public', true);
        }
      }
      
      const { data: cards, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (cards || []).map(card => this.normalizeCard(card, 'database'));
    } catch (error) {
      console.error('Error fetching database cards:', error);
      return [];
    }
  }

  private async fetchLocalCards(options: CardAggregationOptions): Promise<UnifiedCard[]> {
    try {
      const localData = localCardStorage.getAllCardsFromAllLocations();
      const allLocalCards = localData.allCards;
      
      return allLocalCards.map(card => {
        const syncStatus = this.determineSyncStatus(card);
        return this.normalizeCard(card, 'local', syncStatus);
      });
    } catch (error) {
      console.error('Error fetching local cards:', error);
      return [];
    }
  }

  private async fetchDetectedCards(options: CardAggregationOptions): Promise<UnifiedCard[]> {
    // For now, detected cards are handled by the existing catalog system
    // This would integrate with the detection service once available
    return [];
  }

  private async fetchExternalCards(options: CardAggregationOptions): Promise<UnifiedCard[]> {
    // This would fetch cards from external URLs/CDNs
    // Implementation depends on external card registry/API
    return [];
  }

  private async fetchTemplateCards(options: CardAggregationOptions): Promise<UnifiedCard[]> {
    try {
      const { data: templates, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('is_public', true);
      
      if (error) throw error;
      
      return (templates || []).map(template => 
        this.normalizeCard(template, 'template')
      );
    } catch (error) {
      console.error('Error fetching template cards:', error);
      return [];
    }
  }

  private normalizeCard(
    cardData: CardData | Card | DetectedCard | ExternalCard | any, 
    source: CardSource,
    syncStatus: SyncStatus = 'synced'
  ): UnifiedCard {
    const baseCard: UnifiedCard = {
      id: cardData.id,
      title: cardData.title || cardData.name || 'Untitled',
      description: cardData.description,
      image_url: cardData.image_url || cardData.preview_url,
      thumbnail_url: cardData.thumbnail_url,
      created_at: cardData.created_at,
      updated_at: cardData.updated_at,
      source,
      sync_status: syncStatus,
      original_data: cardData,
      rarity: cardData.rarity,
      tags: cardData.tags || [],
      creator_id: cardData.creator_id,
      is_public: cardData.is_public,
      visibility: cardData.visibility,
      view_count: cardData.view_count || 0,
      favorite_count: cardData.favorite_count || 0,
      metadata: {}
    };

    // Add source-specific metadata
    switch (source) {
      case 'database':
        baseCard.metadata = {
          series_one_number: cardData.series_one_number,
          marketplace_listing: cardData.marketplace_listing,
          verification_status: cardData.verification_status,
        };
        break;
        
      case 'local':
        baseCard.metadata = {
          local_changes: this.detectLocalChanges(cardData),
          last_sync_attempt: cardData.last_sync_attempt,
        };
        break;
        
      case 'template':
        baseCard.metadata = {
          template_source: 'supabase',
          usage_count: cardData.usage_count,
        };
        break;
        
      case 'detected':
        baseCard.metadata = {
          confidence: cardData.confidence,
          processing_status: cardData.status,
        };
        break;
        
      case 'external':
        baseCard.metadata = {
          external_url: cardData.external_url,
          linkback_data: cardData.linkback_data,
        };
        break;
    }

    return baseCard;
  }

  private determineSyncStatus(card: CardData): SyncStatus {
    // Check if card exists in database
    if (card.isLocal && !card.creator_id) {
      return 'draft';
    }
    
    // Check for conflicts (would need more sophisticated logic)
    if (card.isLocal && card.creator_id) {
      return 'conflict'; // Simplified - would need actual conflict detection
    }
    
    return 'synced';
  }

  private detectLocalChanges(card: CardData): string[] {
    // Simplified change detection
    const changes: string[] = [];
    
    if (card.isLocal) {
      changes.push('local_only');
    }
    
    return changes;
  }

  private deduplicateCards(cards: UnifiedCard[]): UnifiedCard[] {
    const seen = new Map<string, UnifiedCard>();
    const duplicates: UnifiedCard[] = [];
    
    cards.forEach(card => {
      const existing = seen.get(card.id);
      
      if (!existing) {
        seen.set(card.id, card);
      } else {
        // Merge strategy: prefer database over local, newer over older
        const merged = this.mergeCards(existing, card);
        seen.set(card.id, merged);
        duplicates.push(card);
      }
    });
    
    return Array.from(seen.values());
  }

  private mergeCards(card1: UnifiedCard, card2: UnifiedCard): UnifiedCard {
    // Merge strategy: prioritize by source, then by date
    const sourcePriority: Record<CardSource, number> = {
      database: 1,
      local: 2,
      template: 3,
      detected: 4,
      external: 5
    };
    
    if (sourcePriority[card1.source] <= sourcePriority[card2.source]) {
      return {
        ...card1,
        metadata: { ...card1.metadata, ...card2.metadata },
        sync_status: card1.source === 'local' && card2.source === 'database' ? 'conflict' : card1.sync_status
      };
    } else {
      return {
        ...card2,
        metadata: { ...card2.metadata, ...card1.metadata },
        sync_status: card2.source === 'local' && card1.source === 'database' ? 'conflict' : card2.sync_status
      };
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.lastFetch.clear();
  }

  async syncLocalCard(cardId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const localCard = localCardStorage.getCard(cardId);
      if (!localCard) {
        return { success: false, error: 'Card not found in local storage' };
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Convert to database format and save
      const { data: newCard, error } = await supabase
        .from('cards')
        .insert({
          title: localCard.title,
          description: localCard.description,
          creator_id: user.id,
          image_url: localCard.image_url,
          thumbnail_url: localCard.thumbnail_url,
          rarity: localCard.rarity as any,
          tags: localCard.tags,
          design_metadata: localCard.design_metadata,
          is_public: localCard.is_public,
          visibility: localCard.visibility as any,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local card with sync info
      localCard.creator_id = user.id;
      localCard.isLocal = false;
      localCardStorage.saveCard(localCard);
      
      // Clear cache to force refresh
      this.clearCache();
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const cardAggregationService = CardAggregationService.getInstance();
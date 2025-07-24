import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MarketplaceFilters } from '@/pages/Marketplace';

interface MarketplaceListing {
  id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  rarity: string;
  listing_type: string;
  creator_name?: string;
  creator_avatar?: string;
  views: number;
  auction_end_time?: string;
  created_at: string;
  card_id: string;
}

export const useMarketplaceData = (filters: MarketplaceFilters) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchListings = useCallback(async (loadMore = false) => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('marketplace_listings')
        .select(`
          id,
          price,
          listing_type,
          views,
          auction_end_time,
          created_at,
          card_id,
          cards (
            id,
            title,
            description,
            image_url,
            rarity,
            creator_id,
            user_profiles (
              username,
              avatar_url
            )
          )
        `, { count: 'exact' })
        .eq('status', 'active');

      // Apply search filter
      if (filters.searchQuery) {
        query = query.or(`cards.title.ilike.%${filters.searchQuery}%,cards.description.ilike.%${filters.searchQuery}%`);
      }

      // Apply rarity filter
      if (filters.rarity.length > 0) {
        query = query.in('cards.rarity', filters.rarity as any);
      }

      // Apply price range filter
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }

      // Apply listing type filter
      if (filters.listingType.length > 0) {
        query = query.in('listing_type', filters.listingType);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        case 'ending_soon':
          query = query.order('auction_end_time', { ascending: true });
          break;
      }

      // Pagination
      const pageSize = 20;
      const page = loadMore ? currentPage + 1 : 0;
      query = query.range(page * pageSize, (page + 1) * pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching marketplace listings:', error);
        return;
      }

      // Transform data
      const transformedListings: MarketplaceListing[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.cards?.title || 'Untitled Card',
        description: item.cards?.description,
        price: item.price,
        image_url: item.cards?.image_url,
        rarity: item.cards?.rarity || 'common',
        listing_type: item.listing_type,
        creator_name: item.cards?.user_profiles?.username,
        creator_avatar: item.cards?.user_profiles?.avatar_url,
        views: item.views,
        auction_end_time: item.auction_end_time,
        created_at: item.created_at,
        card_id: item.card_id
      }));

      if (loadMore) {
        setListings(prev => [...prev, ...transformedListings]);
        setCurrentPage(page);
      } else {
        setListings(transformedListings);
        setCurrentPage(0);
      }

      setTotalCount(count || 0);

    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const loadMore = useCallback(() => {
    fetchListings(true);
  }, [fetchListings]);

  return {
    listings,
    loading,
    totalCount,
    fetchListings: () => fetchListings(false),
    loadMore
  };
};
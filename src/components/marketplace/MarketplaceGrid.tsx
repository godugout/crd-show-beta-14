import React from 'react';
import { MarketplaceCard } from './MarketplaceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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

interface MarketplaceGridProps {
  listings: MarketplaceListing[];
  loading: boolean;
  onLoadMore: () => void;
}

export const MarketplaceGrid = ({ listings, loading, onLoadMore }: MarketplaceGridProps) => {
  if (loading && listings.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎴</div>
        <h3 className="text-xl font-semibold mb-2">No cards found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search criteria or filters to find more cards.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <MarketplaceCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Load More */}
      {listings.length > 0 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
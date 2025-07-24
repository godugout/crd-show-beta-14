import React, { useState, useEffect } from 'react';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { MarketplaceGrid } from '@/components/marketplace/MarketplaceGrid';
import { CreateListingModal } from '@/components/marketplace/CreateListingModal';
import { useMarketplaceData } from '@/hooks/useMarketplaceData';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface MarketplaceFilters {
  searchQuery: string;
  rarity: string[];
  priceRange: [number, number];
  listingType: string[];
  sortBy: string;
  categories: string[];
}

const Marketplace = () => {
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    searchQuery: '',
    rarity: [],
    priceRange: [0, 1000],
    listingType: [],
    sortBy: 'newest',
    categories: []
  });

  const { listings, loading, totalCount, fetchListings } = useMarketplaceData(filters);

  useEffect(() => {
    fetchListings();
  }, [filters, fetchListings]);

  const handleFiltersChange = (newFilters: Partial<MarketplaceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search cards by name, creator, or description..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button 
            onClick={() => setShowCreateListing(true)}
            className="h-12 px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Listing
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <MarketplaceFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {totalCount > 0 ? `${totalCount} cards found` : 'No cards found'}
              </h2>
              <div className="text-sm text-muted-foreground">
                Sorted by {filters.sortBy}
              </div>
            </div>

            {/* Cards Grid */}
            <MarketplaceGrid 
              listings={listings}
              loading={loading}
              onLoadMore={() => {/* Implement pagination */}}
            />
          </div>
        </div>
      </div>

      {/* Create Listing Modal */}
      <CreateListingModal 
        open={showCreateListing}
        onClose={() => setShowCreateListing(false)}
        onSuccess={() => {
          setShowCreateListing(false);
          fetchListings();
        }}
      />
    </div>
  );
};

export default Marketplace;
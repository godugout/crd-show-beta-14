import React, { useState, useEffect } from 'react';
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero';
import { PremiumFilters } from '@/components/marketplace/PremiumFilters';
import { FeaturedCarousel } from '@/components/marketplace/FeaturedCarousel';
import { TradingCard } from '@/components/marketplace/TradingCard';
import { CreateListingModal } from '@/components/marketplace/CreateListingModal';
import { BuyNowModal } from '@/components/marketplace/BuyNowModal';
import { useMarketplaceData } from '@/hooks/useMarketplaceData';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List, SlidersHorizontal, ShoppingCart } from 'lucide-react';

export interface MarketplaceFilters {
  searchQuery: string;
  rarity: string[];
  priceRange: [number, number];
  listingType: string[];
  sortBy: string;
  categories: string[];
}

const Marketplace = () => {
  const { currentPalette } = useTeamTheme();
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    searchQuery: '',
    rarity: [],
    priceRange: [0, 1000],
    listingType: [],
    sortBy: 'newest',
    categories: []
  });

  const { listings, loading, totalCount, fetchListings } = useMarketplaceData(filters);

  // Mock featured cards - in real app this would come from API
  const featuredCards = listings.slice(0, 4).map(listing => ({
    id: listing.id,
    title: listing.title || 'Untitled Card',
    imageUrl: listing.image_url,
    price: listing.price || 0,
    rarity: (listing.rarity as 'common' | 'rare' | 'epic' | 'legendary') || 'common',
    creator: {
      name: 'Unknown Creator', // Will be populated from actual data
      avatar: undefined,
    },
    favorites: 0,
    views: 0,
  }));

  useEffect(() => {
    fetchListings();
  }, [filters, fetchListings]);

  const handleFiltersChange = (newFilters: Partial<MarketplaceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const handleCardClick = (cardId: string) => {
    const listing = listings.find(l => l.id === cardId);
    if (listing) {
      setSelectedListing({
        id: listing.id,
        title: listing.title || 'Untitled Card',
        price: listing.price || 0,
        image_url: listing.image_url,
        creator_name: listing.creator_name || 'Unknown Creator'
      });
      setShowBuyModal(true);
    }
  };

  const gridCols = viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1';

  return (
    <div className="min-h-screen bg-crd-black">
      {/* Hero Section */}
      <MarketplaceHero 
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowCreateListing(true)}
              className="bg-primary hover:bg-secondary text-primary-foreground font-semibold px-6 py-3 rounded-lg
                       transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Listing
            </Button>
            
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden bg-crd-surface/90 border-border hover:border-primary/50 
                       text-crd-text hover:bg-primary/10 transition-all duration-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex bg-crd-surface/90 border border-border rounded-lg p-1 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'text-crd-text-dim hover:text-crd-text hover:bg-primary/10'
                }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'text-crd-text-dim hover:text-crd-text hover:bg-primary/10'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <PremiumFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Featured Carousel */}
            {featuredCards.length > 0 && (
              <FeaturedCarousel 
                featuredCards={featuredCards}
                onCardClick={handleCardClick}
              />
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-dm-sans text-page-title font-bold text-crd-text">
                {totalCount > 0 ? `${totalCount} cards found` : 'No cards found'}
              </h2>
              <div className="text-small-body text-crd-text-dim">
                Sorted by {filters.sortBy}
              </div>
            </div>

            {/* Cards Grid */}
            <div className={`grid ${gridCols} gap-6`}>
              {listings.map((listing) => (
                <TradingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title || 'Untitled Card'}
                  imageUrl={listing.image_url}
                  price={listing.price || 0}
                  rarity={(listing.rarity as 'common' | 'rare' | 'epic' | 'legendary') || 'common'}
                  creator={{
                    name: 'Unknown Creator',
                    avatar: undefined,
                  }}
                  favorites={0}
                  views={0}
                  onClick={() => handleCardClick(listing.id)}
                  showBuyButton={true}
                  onBuyClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(listing.id);
                  }}
                />
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="trading-card animate-pulse">
                    <div className="w-full h-[60%] bg-crd-surface-light" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-crd-surface-light rounded" />
                      <div className="h-6 bg-crd-surface-light rounded w-3/4" />
                      <div className="h-5 bg-crd-surface-light rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && listings.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎴</div>
                <h3 className="font-dm-sans text-component font-semibold text-crd-text mb-2">
                  No cards found
                </h3>
                <p className="text-crd-text-dim mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button 
                  onClick={() => handleFiltersChange({
                    searchQuery: '',
                    rarity: [],
                    priceRange: [0, 1000],
                    listingType: [],
                    categories: []
                  })}
                  className="bg-primary hover:bg-secondary text-primary-foreground font-semibold px-6 py-3 rounded-lg
                           transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                >
                  Clear all filters
                </Button>
              </div>
            )}
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

      {/* Buy Now Modal */}
      {selectedListing && (
        <BuyNowModal
          open={showBuyModal}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedListing(null);
          }}
          onSuccess={() => {
            fetchListings();
          }}
          listing={selectedListing}
        />
      )}
    </div>
  );
};

export default Marketplace;
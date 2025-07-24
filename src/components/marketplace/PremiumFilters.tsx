import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X, Zap, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PremiumFiltersProps {
  filters: {
    searchQuery: string;
    rarity: string[];
    priceRange: [number, number];
    listingType: string[];
    sortBy: string;
    categories: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const RARITIES = [
  { value: 'common', label: 'Common', color: 'bg-gray-500' },
  { value: 'rare', label: 'Rare', color: 'bg-crd-blue' },
  { value: 'epic', label: 'Epic', color: 'bg-crd-purple' },
  { value: 'legendary', label: 'Legendary', color: 'bg-crd-yellow' },
];

const CATEGORIES = [
  'Sports', 'Gaming', 'Art', 'Music', 'Collectibles', 'Fantasy', 'Anime', 'Celebrity'
];

const LISTING_TYPES = [
  { value: 'auction', label: 'Auction', icon: Clock },
  { value: 'fixed', label: 'Fixed Price', icon: Zap },
];

const QUICK_FILTERS = [
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'new', label: 'New Arrivals', icon: Zap },
  { value: 'ending', label: 'Ending Soon', icon: Clock },
];

export const PremiumFilters: React.FC<PremiumFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [creatorSearch, setCreatorSearch] = useState('');

  const activeFiltersCount = 
    filters.rarity.length + 
    filters.listingType.length + 
    filters.categories.length + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  const toggleRarity = (rarity: string) => {
    const newRarity = filters.rarity.includes(rarity)
      ? filters.rarity.filter(r => r !== rarity)
      : [...filters.rarity, rarity];
    onFiltersChange({ rarity: newRarity });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ categories: newCategories });
  };

  const toggleListingType = (type: string) => {
    const newTypes = filters.listingType.includes(type)
      ? filters.listingType.filter(t => t !== type)
      : [...filters.listingType, type];
    onFiltersChange({ listingType: newTypes });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      rarity: [],
      priceRange: [0, 1000],
      listingType: [],
      categories: [],
    });
  };

  return (
    <div className="bg-crd-surface border border-crd-border rounded-lg overflow-hidden">
      {/* Header */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 hover:bg-crd-surface-light cursor-pointer">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-crd-orange" />
              <h3 className="font-dm-sans text-component font-semibold text-crd-text">
                Filters
              </h3>
              {activeFiltersCount > 0 && (
                <Badge className="bg-crd-orange text-crd-black text-xs px-2 py-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllFilters();
                  }}
                  className="text-crd-text-dim hover:text-crd-text h-auto p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-crd-text-dim" />
              ) : (
                <ChevronDown className="w-5 h-5 text-crd-text-dim" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="animate-accordion-down">
          <div className="p-4 border-t border-crd-border space-y-6">
            {/* Quick Filters */}
            <div>
              <h4 className="text-small-heading font-semibold text-crd-text mb-3">Quick Filters</h4>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_FILTERS.map((filter) => (
                  <Button
                    key={filter.value}
                    variant="ghost"
                    className={`justify-start h-auto p-3 ${
                      filters.sortBy === filter.value
                        ? 'bg-crd-orange/20 text-crd-orange border-crd-orange'
                        : 'hover:bg-crd-surface-light text-crd-text'
                    }`}
                    onClick={() => onFiltersChange({ sortBy: filter.value })}
                  >
                    <filter.icon className="w-4 h-4 mr-2" />
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-small-heading font-semibold text-crd-text mb-3">
                Price Range (CRD Tokens)
              </h4>
              <div className="space-y-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onFiltersChange({ priceRange: value as [number, number] })}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center gap-2 text-sm text-crd-text-dim">
                  <span className="token-amount">{filters.priceRange[0]}</span>
                  <span>—</span>
                  <span className="token-amount">{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rarity */}
            <div>
              <h4 className="text-small-heading font-semibold text-crd-text mb-3">Rarity</h4>
              <div className="grid grid-cols-2 gap-2">
                {RARITIES.map((rarity) => (
                  <button
                    key={rarity.value}
                    onClick={() => toggleRarity(rarity.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                      filters.rarity.includes(rarity.value)
                        ? `border-opacity-100 bg-opacity-20 ${rarity.color}/20 border-current`
                        : 'border-crd-border hover:border-crd-hover'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded ${rarity.color}`} />
                    <span className={`text-sm font-medium ${
                      filters.rarity.includes(rarity.value) ? 'text-crd-text' : 'text-crd-text-dim'
                    }`}>
                      {rarity.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Listing Type */}
            <div>
              <h4 className="text-small-heading font-semibold text-crd-text mb-3">Listing Type</h4>
              <div className="space-y-2">
                {LISTING_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => toggleListingType(type.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border w-full transition-all ${
                      filters.listingType.includes(type.value)
                        ? 'border-crd-orange bg-crd-orange/20 text-crd-orange'
                        : 'border-crd-border hover:border-crd-hover text-crd-text-dim hover:text-crd-text'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-small-heading font-semibold text-crd-text mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                      filters.categories.includes(category)
                        ? 'bg-crd-green text-crd-black'
                        : 'bg-crd-surface-light text-crd-text-dim hover:bg-crd-hover hover:text-crd-text'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator Search */}
            <div>
              <h4 className="text-small-heading font-semibold text-crd-text mb-3">Creator</h4>
              <Input
                placeholder="Search creators..."
                value={creatorSearch}
                onChange={(e) => setCreatorSearch(e.target.value)}
                className="bg-crd-surface-light border-crd-border text-crd-text placeholder:text-crd-text-dim"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
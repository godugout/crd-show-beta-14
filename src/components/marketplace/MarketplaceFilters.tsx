import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import type { MarketplaceFilters as FiltersType } from '@/pages/Marketplace';

interface MarketplaceFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: Partial<FiltersType>) => void;
}

export const MarketplaceFilters = ({ filters, onFiltersChange }: MarketplaceFiltersProps) => {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  const listingTypes = ['fixed_price', 'auction', 'bundle'];
  const categories = ['Sports', 'Gaming', 'Art', 'Music', 'Photography', 'Digital Art'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'ending_soon', label: 'Ending Soon' }
  ];

  const handleRarityChange = (rarity: string, checked: boolean) => {
    const newRarity = checked 
      ? [...filters.rarity, rarity]
      : filters.rarity.filter(r => r !== rarity);
    onFiltersChange({ rarity: newRarity });
  };

  const handleListingTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.listingType, type]
      : filters.listingType.filter(t => t !== type);
    onFiltersChange({ listingType: newTypes });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ categories: newCategories });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      rarity: [],
      priceRange: [0, 1000],
      listingType: [],
      categories: [],
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.rarity.length > 0 || 
                          filters.listingType.length > 0 || 
                          filters.categories.length > 0 ||
                          filters.priceRange[0] > 0 || 
                          filters.priceRange[1] < 1000;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.sortBy} onValueChange={(value) => onFiltersChange({ sortBy: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ priceRange: value as [number, number] })}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rarity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Rarity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rarities.map(rarity => (
              <div key={rarity} className="flex items-center space-x-2">
                <Checkbox
                  id={`rarity-${rarity}`}
                  checked={filters.rarity.includes(rarity)}
                  onCheckedChange={(checked) => handleRarityChange(rarity, checked as boolean)}
                />
                <Label htmlFor={`rarity-${rarity}`} className="capitalize">
                  {rarity}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Listing Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Listing Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {listingTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.listingType.includes(type)}
                  onCheckedChange={(checked) => handleListingTypeChange(type, checked as boolean)}
                />
                <Label htmlFor={`type-${type}`} className="capitalize">
                  {type.replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`category-${category}`}>
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.rarity.map(rarity => (
                <Badge key={rarity} variant="secondary" className="capitalize">
                  {rarity}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleRarityChange(rarity, false)}
                  />
                </Badge>
              ))}
              {filters.listingType.map(type => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type.replace('_', ' ')}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleListingTypeChange(type, false)}
                  />
                </Badge>
              ))}
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary">
                  {category}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleCategoryChange(category, false)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
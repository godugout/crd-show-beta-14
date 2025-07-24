import React from 'react';
import { CardFilter, UnifiedCard, CardSource, SyncStatus } from '@/types/unifiedCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { X, Search } from 'lucide-react';

interface UnifiedCardFiltersProps {
  filters: CardFilter;
  onFiltersChange: (filters: Partial<CardFilter>) => void;
  availableCards: UnifiedCard[];
}

export const UnifiedCardFilters: React.FC<UnifiedCardFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCards
}) => {
  // Extract unique values from available cards
  const uniqueRarities = Array.from(new Set(
    availableCards.map(card => card.rarity).filter(Boolean)
  )).sort();

  const uniqueTags = Array.from(new Set(
    availableCards.flatMap(card => card.tags || [])
  )).sort();

  const uniqueCreators = Array.from(new Set(
    availableCards.map(card => card.creator_name || card.creator_id).filter(Boolean)
  )).sort();

  const handleRarityToggle = (rarity: string) => {
    const current = filters.rarity || [];
    const updated = current.includes(rarity)
      ? current.filter(r => r !== rarity)
      : [...current, rarity];
    onFiltersChange({ rarity: updated });
  };

  const handleTagToggle = (tag: string) => {
    const current = filters.tags || [];
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onFiltersChange({ tags: updated });
  };

  const handleSourceToggle = (source: CardSource) => {
    const current = filters.source || [];
    const updated = current.includes(source)
      ? current.filter(s => s !== source)
      : [...current, source];
    onFiltersChange({ source: updated });
  };

  const handleSyncStatusToggle = (status: SyncStatus) => {
    const current = filters.sync_status || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    onFiltersChange({ sync_status: updated });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      rarity: [],
      tags: [],
      creator_id: '',
      source: [],
      sync_status: [],
      is_public: undefined,
      has_image: undefined,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.length > 0;
    return value !== undefined;
  });

  return (
    <Card className="bg-crd-dark border-crd-mediumGray">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {hasActiveFilters && (
            <Button onClick={clearAllFilters} variant="outline" size="sm">
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search cards by title, description, or tags..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10 bg-crd-mediumGray border-crd-lightGray text-white"
            />
          </div>
        </div>

        {/* Grid layout for filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Rarity Filter */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Rarity</Label>
            <div className="flex flex-wrap gap-1">
              {uniqueRarities.map(rarity => (
                <Badge
                  key={rarity}
                  variant={filters.rarity?.includes(rarity) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleRarityToggle(rarity)}
                >
                  {rarity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Source Filter */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Source</Label>
            <div className="flex flex-wrap gap-1">
              {(['database', 'local', 'template', 'detected', 'external'] as CardSource[]).map(source => (
                <Badge
                  key={source}
                  variant={filters.source?.includes(source) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleSourceToggle(source)}
                >
                  {source}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sync Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Sync Status</Label>
            <div className="flex flex-wrap gap-1">
              {(['synced', 'draft', 'conflict', 'pending', 'failed'] as SyncStatus[]).map(status => (
                <Badge
                  key={status}
                  variant={filters.sync_status?.includes(status) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleSyncStatusToggle(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          {/* Creator Filter */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Creator</Label>
            <Select
              value={filters.creator_id || ""}
              onValueChange={(value) => onFiltersChange({ creator_id: value || undefined })}
            >
              <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                <SelectValue placeholder="All creators" />
              </SelectTrigger>
              <SelectContent className="bg-crd-dark border-crd-mediumGray">
                <SelectItem value="">All creators</SelectItem>
                {uniqueCreators.map(creator => (
                  <SelectItem key={creator} value={creator}>
                    {creator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Boolean Filters */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-300">Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="public-only"
                  checked={filters.is_public === true}
                  onCheckedChange={(checked) => 
                    onFiltersChange({ is_public: checked ? true : undefined })
                  }
                />
                <Label htmlFor="public-only" className="text-sm text-gray-300">
                  Public only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-image"
                  checked={filters.has_image === true}
                  onCheckedChange={(checked) => 
                    onFiltersChange({ has_image: checked ? true : undefined })
                  }
                />
                <Label htmlFor="has-image" className="text-sm text-gray-300">
                  Has image
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Filter (if we have many tags, show separately) */}
        {uniqueTags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Tags</Label>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {uniqueTags.slice(0, 20).map(tag => (
                <Badge
                  key={tag}
                  variant={filters.tags?.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {uniqueTags.length > 20 && (
                <span className="text-xs text-gray-400 px-2">
                  +{uniqueTags.length - 20} more...
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
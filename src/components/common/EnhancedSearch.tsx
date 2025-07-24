
import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface SearchFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch: (query: string, filters: Record<string, string[]>) => void;
  filters?: SearchFilter[];
  className?: string;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = 'Search...',
  onSearch,
  filters = [],
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    onSearch(newQuery, activeFilters);
  }, [onSearch, activeFilters]);

  const handleFilterChange = useCallback((filterKey: string, value: string, checked: boolean) => {
    setActiveFilters(prev => {
      const current = prev[filterKey] || [];
      const updated = checked 
        ? [...current, value]
        : current.filter(v => v !== value);
      
      const newFilters = { ...prev, [filterKey]: updated };
      if (updated.length === 0) {
        delete newFilters[filterKey];
      }
      
      onSearch(query, newFilters);
      return newFilters;
    });
  }, [query, onSearch]);

  const clearFilter = useCallback((filterKey: string, value?: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value) {
        newFilters[filterKey] = (newFilters[filterKey] || []).filter(v => v !== value);
        if (newFilters[filterKey].length === 0) {
          delete newFilters[filterKey];
        }
      } else {
        delete newFilters[filterKey];
      }
      onSearch(query, newFilters);
      return newFilters;
    });
  }, [query, onSearch]);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    onSearch(query, {});
  }, [query, onSearch]);

  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).reduce((count, values) => count + values.length, 0);
  }, [activeFilters]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-crd-dark border-crd-mediumGray text-white"
          />
        </div>
        
        {filters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-crd-dark border-crd-mediumGray">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Filters</h4>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                
                {filters.map(filter => (
                  <div key={filter.key} className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">{filter.label}</label>
                    <div className="space-y-1">
                      {filter.options.map(option => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(activeFilters[filter.key] || []).includes(option.value)}
                            onChange={(e) => handleFilterChange(filter.key, option.value, e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-300">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([filterKey, values]) =>
            values.map(value => {
              const filter = filters.find(f => f.key === filterKey);
              const option = filter?.options.find(o => o.value === value);
              return (
                <Badge key={`${filterKey}-${value}`} variant="secondary" className="gap-1">
                  {option?.label || value}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => clearFilter(filterKey, value)}
                  />
                </Badge>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

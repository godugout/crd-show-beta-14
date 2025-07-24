import React, { useState } from 'react';
import { useUnifiedCardCatalog } from '@/hooks/useUnifiedCardCatalog';
import { UnifiedCardGrid } from './UnifiedCardGrid';
import { UnifiedCardTable } from './UnifiedCardTable';
import { UnifiedCardFilters } from './UnifiedCardFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Grid3X3, 
  List, 
  Table as TableIcon, 
  RefreshCw, 
  Filter,
  Search,
  AlertCircle
} from 'lucide-react';

type ViewMode = 'grid' | 'row' | 'table';

export const UnifiedCardCatalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    cards,
    loading,
    error,
    total,
    sources,
    sync,
    filters,
    selectedSources,
    refresh,
    updateFilters,
    updateSources,
    isEmpty,
    hasFilters,
    syncCard
  } = useUnifiedCardCatalog({
    defaultSources: ['database', 'local'],
    pageSize: 100
  });

  const handleSourceToggle = (source: string) => {
    const currentSources = [...selectedSources];
    const sourceIndex = currentSources.indexOf(source as any);
    
    if (sourceIndex > -1) {
      currentSources.splice(sourceIndex, 1);
    } else {
      currentSources.push(source as any);
    }
    
    updateSources(currentSources);
  };

  if (error) {
    return (
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>Error loading cards: {error}</span>
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Card Catalog</h2>
          <Badge variant="secondary" className="bg-crd-mediumGray text-white">
            {total} cards
          </Badge>
          {sync.conflicts > 0 && (
            <Badge variant="destructive">
              {sync.conflicts} conflicts
            </Badge>
          )}
          {sync.pending > 0 && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              {sync.pending} pending
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "default" : "outline"}
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasFilters && (
              <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                •
              </Badge>
            )}
          </Button>
          
          <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Source selector */}
      <div className="flex flex-wrap gap-2">
        {(['database', 'local', 'template', 'detected', 'external'] as const).map(source => (
          <Button
            key={source}
            onClick={() => handleSourceToggle(source)}
            variant={selectedSources.includes(source) ? "default" : "outline"}
            size="sm"
            disabled={sources[source].loading}
          >
            {source.charAt(0).toUpperCase() + source.slice(1)}
            <Badge variant="secondary" className="ml-2">
              {sources[source].count}
            </Badge>
            {sources[source].loading && (
              <RefreshCw className="h-3 w-3 ml-2 animate-spin" />
            )}
          </Button>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <UnifiedCardFilters
          filters={filters}
          onFiltersChange={updateFilters}
          availableCards={cards}
        />
      )}

      {/* View mode selector */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <TabsList className="bg-crd-mediumGray">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="row" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Row
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Table
          </TabsTrigger>
        </TabsList>

        {/* Content based on view mode */}
        <TabsContent value="grid" className="mt-6">
          <UnifiedCardGrid 
            cards={cards} 
            loading={loading}
            onSyncCard={syncCard}
          />
        </TabsContent>
        
        <TabsContent value="row" className="mt-6">
          <UnifiedCardGrid 
            cards={cards} 
            loading={loading}
            viewMode="row"
            onSyncCard={syncCard}
          />
        </TabsContent>
        
        <TabsContent value="table" className="mt-6">
          <UnifiedCardTable 
            cards={cards} 
            loading={loading}
            onSyncCard={syncCard}
          />
        </TabsContent>
      </Tabs>

      {/* Empty state */}
      {isEmpty && !loading && (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No cards found</h3>
            <p className="text-gray-400 mb-4">
              {hasFilters 
                ? "Try adjusting your filters or search terms"
                : "No cards available from the selected sources"
              }
            </p>
            {hasFilters && (
              <Button 
                onClick={() => updateFilters({})} 
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
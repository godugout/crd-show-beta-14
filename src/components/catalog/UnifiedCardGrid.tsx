import React from 'react';
import { UnifiedCard } from '@/types/unifiedCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  HardDrive, 
  FileText, 
  Search, 
  ExternalLink,
  RotateCw,
  AlertTriangle,
  Clock,
  Eye,
  Heart
} from 'lucide-react';

interface UnifiedCardGridProps {
  cards: UnifiedCard[];
  loading: boolean;
  viewMode?: 'grid' | 'row';
  onSyncCard?: (cardId: string) => Promise<{ success: boolean; error?: string }>;
}

export const UnifiedCardGrid: React.FC<UnifiedCardGridProps> = ({
  cards,
  loading,
  viewMode = 'grid',
  onSyncCard
}) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'database': return <Database className="h-3 w-3" />;
      case 'local': return <HardDrive className="h-3 w-3" />;
      case 'template': return <FileText className="h-3 w-3" />;
      case 'detected': return <Search className="h-3 w-3" />;
      case 'external': return <ExternalLink className="h-3 w-3" />;
      default: return null;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'database': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'local': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'template': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'detected': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'external': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <RotateCw className="h-3 w-3 text-green-400" />;
      case 'draft': return <Clock className="h-3 w-3 text-yellow-400" />;
      case 'conflict': return <AlertTriangle className="h-3 w-3 text-red-400" />;
      case 'pending': return <Clock className="h-3 w-3 text-blue-400" />;
      case 'failed': return <AlertTriangle className="h-3 w-3 text-red-400" />;
      default: return null;
    }
  };

  const handleSync = async (cardId: string) => {
    if (onSyncCard) {
      await onSyncCard(cardId);
    }
  };

  if (loading) {
    return (
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-[3/4] bg-crd-mediumGray rounded mb-3" />
              <div className="h-4 bg-crd-mediumGray rounded mb-2" />
              <div className="h-3 bg-crd-mediumGray rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const gridClass = viewMode === 'grid' 
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
    : 'grid-cols-1';

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {cards.map((card) => (
        <Card 
          key={`${card.source}-${card.id}`} 
          className="bg-crd-dark border-crd-mediumGray hover:border-crd-lightGray transition-colors group"
        >
          <CardContent className="p-4">
            {viewMode === 'grid' ? (
              // Grid layout
              <div className="space-y-3">
                {/* Image */}
                <div className="aspect-[3/4] bg-crd-mediumGray rounded overflow-hidden">
                  {card.image_url ? (
                    <img 
                      src={card.image_url} 
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <FileText className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Source and sync status badges */}
                <div className="flex items-center justify-between">
                  <Badge className={`${getSourceColor(card.source)} text-xs`}>
                    {getSourceIcon(card.source)}
                    <span className="ml-1">{card.source}</span>
                  </Badge>
                  {getSyncStatusIcon(card.sync_status)}
                </div>

                {/* Title and description */}
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {card.description}
                    </p>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {card.view_count !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {card.view_count}
                    </div>
                  )}
                  {card.favorite_count !== undefined && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {card.favorite_count}
                    </div>
                  )}
                  {card.rarity && (
                    <Badge variant="outline" className="text-xs">
                      {card.rarity}
                    </Badge>
                  )}
                </div>

                {/* Sync button for local cards */}
                {card.source === 'local' && card.sync_status === 'draft' && (
                  <Button
                    onClick={() => handleSync(card.id)}
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <RotateCw className="h-3 w-3 mr-1" />
                    Sync to Database
                  </Button>
                )}
              </div>
            ) : (
              // Row layout
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-crd-mediumGray rounded overflow-hidden flex-shrink-0">
                  {card.image_url ? (
                    <img 
                      src={card.image_url} 
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <FileText className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm truncate">
                      {card.title}
                    </h3>
                    <Badge className={`${getSourceColor(card.source)} text-xs flex-shrink-0`}>
                      {getSourceIcon(card.source)}
                      <span className="ml-1">{card.source}</span>
                    </Badge>
                    {getSyncStatusIcon(card.sync_status)}
                  </div>
                  
                  {card.description && (
                    <p className="text-gray-400 text-xs line-clamp-1 mb-2">
                      {card.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {card.rarity && (
                      <Badge variant="outline" className="text-xs">
                        {card.rarity}
                      </Badge>
                    )}
                    {card.view_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {card.view_count}
                      </div>
                    )}
                    {card.favorite_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {card.favorite_count}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {card.source === 'local' && card.sync_status === 'draft' && (
                  <Button
                    onClick={() => handleSync(card.id)}
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    <RotateCw className="h-3 w-3 mr-1" />
                    Sync
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
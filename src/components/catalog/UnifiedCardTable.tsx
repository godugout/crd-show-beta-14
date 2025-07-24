import React, { useState } from 'react';
import { UnifiedCard } from '@/types/unifiedCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Database, 
  HardDrive, 
  FileText, 
  Search, 
  ExternalLink,
  RotateCw,
  AlertTriangle,
  Clock,
  ChevronUp,
  ChevronDown,
  Eye,
  Heart
} from 'lucide-react';

interface UnifiedCardTableProps {
  cards: UnifiedCard[];
  loading: boolean;
  onSyncCard?: (cardId: string) => Promise<{ success: boolean; error?: string }>;
}

type SortField = 'title' | 'source' | 'sync_status' | 'created_at' | 'view_count' | 'favorite_count' | 'rarity';
type SortDirection = 'asc' | 'desc';

export const UnifiedCardTable: React.FC<UnifiedCardTableProps> = ({
  cards,
  loading,
  onSyncCard
}) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCards = [...cards].sort((a, b) => {
    let valueA: any = a[sortField];
    let valueB: any = b[sortField];

    // Handle undefined values
    if (valueA === undefined) valueA = '';
    if (valueB === undefined) valueB = '';

    // Handle different data types
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSync = async (cardId: string) => {
    if (onSyncCard) {
      await onSyncCard(cardId);
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-crd-mediumGray/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' 
            ? <ChevronUp className="h-3 w-3" />
            : <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </TableHead>
  );

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-crd-mediumGray rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="border border-crd-mediumGray rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-crd-mediumGray/50">
          <TableRow>
            <TableHead className="w-12">Image</TableHead>
            <SortHeader field="title">Title</SortHeader>
            <SortHeader field="source">Source</SortHeader>
            <SortHeader field="sync_status">Status</SortHeader>
            <SortHeader field="rarity">Rarity</SortHeader>
            <SortHeader field="view_count">Views</SortHeader>
            <SortHeader field="favorite_count">Likes</SortHeader>
            <SortHeader field="created_at">Created</SortHeader>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCards.map((card) => (
            <TableRow 
              key={`${card.source}-${card.id}`}
              className="hover:bg-crd-mediumGray/30"
            >
              {/* Image */}
              <TableCell>
                <div className="w-8 h-8 bg-crd-mediumGray rounded overflow-hidden">
                  {card.image_url ? (
                    <img 
                      src={card.image_url} 
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <FileText className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Title */}
              <TableCell>
                <div>
                  <div className="font-medium text-white text-sm">{card.title}</div>
                  {card.description && (
                    <div className="text-gray-400 text-xs truncate max-w-xs">
                      {card.description}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Source */}
              <TableCell>
                <Badge className={`${getSourceColor(card.source)} text-xs`}>
                  {getSourceIcon(card.source)}
                  <span className="ml-1">{card.source}</span>
                </Badge>
              </TableCell>

              {/* Sync Status */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {getSyncStatusIcon(card.sync_status)}
                  <span className="text-sm text-gray-300 capitalize">
                    {card.sync_status}
                  </span>
                </div>
              </TableCell>

              {/* Rarity */}
              <TableCell>
                {card.rarity && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {card.rarity}
                  </Badge>
                )}
              </TableCell>

              {/* Views */}
              <TableCell>
                {card.view_count !== undefined && (
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Eye className="h-3 w-3" />
                    {card.view_count}
                  </div>
                )}
              </TableCell>

              {/* Likes */}
              <TableCell>
                {card.favorite_count !== undefined && (
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Heart className="h-3 w-3" />
                    {card.favorite_count}
                  </div>
                )}
              </TableCell>

              {/* Created Date */}
              <TableCell>
                {card.created_at && (
                  <span className="text-sm text-gray-300">
                    {new Date(card.created_at).toLocaleDateString()}
                  </span>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell>
                {card.source === 'local' && card.sync_status === 'draft' && (
                  <Button
                    onClick={() => handleSync(card.id)}
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs"
                  >
                    <RotateCw className="h-3 w-3" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
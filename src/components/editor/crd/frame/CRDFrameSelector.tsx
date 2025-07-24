import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Star, Download, Filter, Eye } from 'lucide-react';
import { CRDFrameRenderer } from './CRDFrameRenderer';
import { SAMPLE_CRD_FRAMES } from '@/data/sampleCRDFrames';
import type { CRDFrame } from '@/types/crd-frame';
interface CRDFrameSelectorProps {
  selectedFrameId?: string;
  onFrameSelect: (frame: CRDFrame) => void;
  className?: string;
}
export const CRDFrameSelector: React.FC<CRDFrameSelectorProps> = ({
  selectedFrameId,
  onFrameSelect,
  className = ''
}) => {
  // Use sample frames for now
  const frames = SAMPLE_CRD_FRAMES;
  const loading = false;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(frames.map(f => f.category).filter(Boolean))];
    return cats;
  }, [frames]);

  // Filter frames
  const filteredFrames = useMemo(() => {
    return frames.filter(frame => {
      const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) || (frame.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [frames, searchQuery, selectedCategory]);
  if (loading) {
    return <div className={`space-y-6 ${className}`}>
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-crd-mediumGray/20 rounded w-32 animate-pulse" />
          <div className="h-10 bg-crd-mediumGray/20 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-8 w-20 bg-crd-mediumGray/20 rounded animate-pulse" />)}
          </div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-crd-darker border border-crd-mediumGray/20 rounded-lg p-2">
              <div className="aspect-[2/3] bg-crd-mediumGray/20 rounded-lg animate-pulse mb-2" />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-8 bg-crd-mediumGray/20 rounded animate-pulse" />
                    <div className="h-3 w-6 bg-crd-mediumGray/20 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 bg-crd-mediumGray/20 rounded w-16 animate-pulse" />
              </div>
            </div>)}
        </div>
      </div>;
  }
  return <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          
          
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-crd-lightGray" />
          <Input placeholder="Search frames..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-crd-darker border-crd-mediumGray/30 text-crd-white placeholder:text-crd-lightGray focus:border-crd-blue" />
        </div>
        
        {/* Category filters - Emoji Only */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => {
          const getCategoryEmoji = (cat: string) => {
            switch (cat.toLowerCase()) {
              case 'all':
                return '📋';
              case 'sports':
                return '⚽🏀⚾';
              case 'fantasy':
                return '🐉✨🗡️';
              case 'vintage':
                return '📜🕰️🎩';
              case 'modern':
                return '🔷💫⚡';
              case 'nature':
                return '🌿🌊🏔️';
              case 'gaming':
                return '🎮🕹️👾';
              default:
                return '🎨';
            }
          };
          return <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category as string)} className={`${selectedCategory === category ? 'bg-crd-blue hover:bg-crd-blue/80 text-white border-crd-blue' : 'bg-transparent border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20 hover:text-crd-white'}`} title={(category as string).charAt(0).toUpperCase() + (category as string).slice(1)}>
                {getCategoryEmoji(category as string)}
              </Button>;
        })}
        </div>
      </div>

      {/* Frames Grid - Mobile-first 2-column sidebar layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-300px)]">
        {filteredFrames.map(frame => {
        return <div key={frame.id} className={`bg-crd-darker border rounded-lg p-2 cursor-pointer transition-all duration-200 hover:border-crd-blue/50 hover:bg-crd-darker/80 relative ${selectedFrameId === frame.id ? 'border-crd-blue bg-crd-blue/10' : 'border-crd-mediumGray/20'}`} onClick={() => onFrameSelect(frame)}>
              {/* Preview Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="absolute top-1.5 right-1.5 z-10 h-7 w-7 p-0 bg-black/80 border-crd-mediumGray/30 hover:bg-black/60" onClick={e => e.stopPropagation()}>
                    <Eye className="h-3 w-3 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-crd-darker border-crd-mediumGray/30">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-crd-white">{frame.name}</h4>
                    <div className="flex justify-center">
                      <CRDFrameRenderer frame={frame} content={{
                    catalogNumber: 'PRE-001',
                    seriesNumber: '#001',
                    available: '1:1',
                    crdName: frame.name,
                    creator: 'Demo',
                    rarity: 'rare'
                  }} colorTheme={{
                    primary: 'hsl(220, 100%, 50%)',
                    secondary: 'hsl(220, 100%, 70%)',
                    accent: 'hsl(45, 100%, 60%)',
                    neutral: 'hsl(220, 10%, 80%)'
                  }} className="max-w-[200px]" />
                    </div>
                    <p className="text-sm text-crd-lightGray">{frame.description || 'Professional frame template'}</p>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Frame Thumbnail with CRD Frame Preview */}
              <div className="aspect-[2/3] bg-crd-darkest rounded-lg overflow-hidden mb-2 relative">
                <CRDFrameRenderer frame={frame} content={{
              catalogNumber: 'PRE-001',
              seriesNumber: `#${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
              available: Math.random() > 0.7 ? '1:1' : `1:${Math.floor(Math.random() * 100) + 2}`,
              crdName: frame.name,
              creator: 'Demo Creator',
              rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 5)]
            }} colorTheme={{
              primary: frame.category === 'sports' ? 'hsl(220, 100%, 50%)' : frame.category === 'vintage' ? 'hsl(30, 70%, 40%)' : frame.category === 'fantasy' ? 'hsl(280, 100%, 50%)' : frame.category === 'modern' ? 'hsl(200, 100%, 60%)' : 'hsl(220, 100%, 50%)',
              secondary: frame.category === 'sports' ? 'hsl(220, 100%, 70%)' : frame.category === 'vintage' ? 'hsl(30, 50%, 60%)' : frame.category === 'fantasy' ? 'hsl(280, 80%, 70%)' : frame.category === 'modern' ? 'hsl(200, 80%, 80%)' : 'hsl(220, 100%, 70%)',
              accent: 'hsl(45, 100%, 60%)',
              neutral: 'hsl(220, 10%, 80%)'
            }} className="w-full h-full scale-75 origin-center" />
                {/* Frame info overlay */}
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="text-xs text-white font-medium truncate drop-shadow-lg">{frame.name}</div>
                  <div className="text-xs text-white/70 capitalize drop-shadow-lg">{frame.category}</div>
                </div>
              </div>

              {/* Compact Frame Info */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-crd-lightBlue text-crd-lightBlue" />
                      <span className="text-xs text-crd-lightGray">{frame.rating_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3 text-crd-lightGray" />
                      <span className="text-xs text-crd-lightGray">{frame.download_count > 999 ? `${(frame.download_count / 1000).toFixed(1)}k` : frame.download_count}</span>
                    </div>
                  </div>
                  
                  {/* Premium Badge */}
                  {frame.price_cents > 0 && <Badge className="bg-crd-lightBlue/20 text-crd-lightBlue border-crd-lightBlue/30 text-xs px-1.5 py-0">
                      Pro
                    </Badge>}
                </div>

                {/* Tags - Show only one tag for space */}
                {frame.tags && frame.tags.length > 0 && <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs py-0 px-1.5 bg-crd-mediumGray/20 text-crd-lightGray border-none">
                      {frame.tags[0]}
                    </Badge>
                    {frame.tags.length > 1 && <span className="text-xs text-crd-mediumGray">+{frame.tags.length - 1}</span>}
                  </div>}
              </div>
            </div>;
      })}
      </div>

      {/* Empty State */}
      {filteredFrames.length === 0 && !loading && <div className="text-center py-8">
          <Filter className="h-12 w-12 mx-auto mb-3 text-crd-mediumGray" />
          <h4 className="text-crd-white font-medium mb-2">No frames found</h4>
          <p className="text-crd-lightGray text-sm">Try adjusting your search or category filters</p>
        </div>}
    </div>;
};
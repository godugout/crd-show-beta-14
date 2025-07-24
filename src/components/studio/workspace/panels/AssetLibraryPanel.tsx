import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Search,
  Image,
  Palette,
  Sparkles,
  Mountain,
  FolderOpen,
  Star,
  Clock,
  Download
} from 'lucide-react';

interface AssetLibraryPanelProps {
  card: any;
  cards: any[];
  currentCardIndex: number;
  onCardChange: (index: number) => void;
  workspaceMode: string;
  deviceType: string;
}

const MOCK_TEMPLATES = [
  { id: 1, name: 'Classic Frame', category: 'templates', preview: '/api/placeholder/120/180', downloads: 1234, rating: 4.8 },
  { id: 2, name: 'Modern Edge', category: 'templates', preview: '/api/placeholder/120/180', downloads: 892, rating: 4.6 },
  { id: 3, name: 'Vintage Gold', category: 'templates', preview: '/api/placeholder/120/180', downloads: 2103, rating: 4.9 },
];

const MOCK_MATERIALS = [
  { id: 1, name: 'Holographic', category: 'materials', preview: '/api/placeholder/80/80', type: 'special' },
  { id: 2, name: 'Chrome', category: 'materials', preview: '/api/placeholder/80/80', type: 'metallic' },
  { id: 3, name: 'Galaxy', category: 'materials', preview: '/api/placeholder/80/80', type: 'special' },
];

const MOCK_EFFECTS = [
  { id: 1, name: 'Cosmic Glow', category: 'effects', preview: '/api/placeholder/80/80', intensity: 'high' },
  { id: 2, name: 'Particle Burst', category: 'effects', preview: '/api/placeholder/80/80', intensity: 'medium' },
  { id: 3, name: 'Light Rays', category: 'effects', preview: '/api/placeholder/80/80', intensity: 'low' },
];

const MOCK_BACKGROUNDS = [
  { id: 1, name: 'Studio White', category: 'backgrounds', preview: '/api/placeholder/80/80', type: 'solid' },
  { id: 2, name: 'Nebula Storm', category: 'backgrounds', preview: '/api/placeholder/80/80', type: 'dynamic' },
  { id: 3, name: 'City Lights', category: 'backgrounds', preview: '/api/placeholder/80/80', type: 'scene' },
];

export const AssetLibraryPanel: React.FC<AssetLibraryPanelProps> = ({
  workspaceMode,
  deviceType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('templates');

  const renderAssetGrid = (assets: any[], type: string) => {
    const isCompact = deviceType === 'mobile' || workspaceMode === 'beginner';
    
    return (
      <div className={cn(
        "grid gap-3",
        isCompact ? "grid-cols-2" : "grid-cols-3"
      )}>
        {assets.map(asset => (
          <div key={asset.id} className="group cursor-pointer">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2 hover:ring-2 hover:ring-primary transition-all">
              <img 
                src={asset.preview} 
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-medium truncate">{asset.name}</h4>
              {type === 'templates' && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{asset.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{asset.downloads}</span>
                  </div>
                </div>
              )}
              {(type === 'materials' || type === 'effects') && (
                <Badge variant="outline" className="text-xs">
                  {asset.type || asset.intensity}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-3 mb-0">
            <TabsTrigger value="templates" className="text-xs">
              <Image className="w-3 h-3 mr-1" />
              {deviceType !== 'mobile' && 'Templates'}
            </TabsTrigger>
            <TabsTrigger value="materials" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              {deviceType !== 'mobile' && 'Materials'}
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              {deviceType !== 'mobile' && 'Effects'}
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="text-xs">
              <Mountain className="w-3 h-3 mr-1" />
              {deviceType !== 'mobile' && 'Scenes'}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="templates" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3">
                  {workspaceMode !== 'beginner' && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Recent</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {MOCK_TEMPLATES.slice(0, 3).map(template => (
                          <div key={template.id} className="aspect-square bg-muted rounded overflow-hidden">
                            <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <span className="text-sm font-medium">All Templates</span>
                  </div>
                  {renderAssetGrid(MOCK_TEMPLATES, 'templates')}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="materials" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3">
                  {renderAssetGrid(MOCK_MATERIALS, 'materials')}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="effects" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3">
                  {renderAssetGrid(MOCK_EFFECTS, 'effects')}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="backgrounds" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3">
                  {renderAssetGrid(MOCK_BACKGROUNDS, 'backgrounds')}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Quick Actions */}
      {workspaceMode !== 'beginner' && (
        <div className="p-3 border-t border-border">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <FolderOpen className="w-4 h-4" />
            Browse Library
          </Button>
        </div>
      )}
    </div>
  );
};
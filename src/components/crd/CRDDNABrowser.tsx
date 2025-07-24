import React, { useState, useMemo } from 'react';
import { CRD_DNA_ENTRIES, CRDEntry, RarityLevel } from '@/lib/cardshowDNA';
import { Search, Filter, Palette, Tag, Star, Zap, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CRDDNABrowserProps {
  onEntrySelect?: (entry: CRDEntry) => void;
}

export const CRDDNABrowser = ({ onEntrySelect }: CRDDNABrowserProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const filteredEntries = useMemo(() => {
    return CRD_DNA_ENTRIES.filter(entry => {
      const matchesSearch = 
        entry.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.teamCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.teamCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGroup = selectedGroup === 'all' || entry.group === selectedGroup;
      const matchesStyle = selectedStyle === 'all' || entry.styleTag === selectedStyle;
      const matchesRarity = selectedRarity === 'all' || entry.rarity === selectedRarity;
      
      return matchesSearch && matchesGroup && matchesStyle && matchesRarity;
    });
  }, [searchTerm, selectedGroup, selectedStyle, selectedRarity]);

  const groups = ['all', ...Array.from(new Set(CRD_DNA_ENTRIES.map(e => e.group)))];
  const styles = ['all', ...Array.from(new Set(CRD_DNA_ENTRIES.map(e => e.styleTag).filter(Boolean)))];
  const rarities = ['all', ...Array.from(new Set(CRD_DNA_ENTRIES.map(e => e.rarity)))];

  const getStyleBadgeColor = (entry: CRDEntry) => {
    switch (entry.styleTag) {
      case 'Classic': return 'bg-crd-orange/20 text-crd-orange border-crd-orange/30';
      case 'Vintage': return 'bg-crd-orangeDark/20 text-crd-orangeDark border-crd-orangeDark/30';
      case 'Sketch': return 'bg-crd-purple/20 text-crd-purple border-crd-purple/30';
      case '3D': return 'bg-crd-lightBlue/20 text-crd-lightBlue border-crd-lightBlue/30';
      case 'Jersey': return 'bg-crd-green/20 text-crd-green border-crd-green/30';
      default: return 'bg-crd-lightGray/20 text-crd-lightGray border-crd-lightGray/30';
    }
  };

  const getRarityColor = (rarity: RarityLevel) => {
    switch (rarity) {
      case 'Common': return 'bg-crd-lightGray/20 text-crd-lightGray border-crd-lightGray/30';
      case 'Uncommon': return 'bg-crd-green/20 text-crd-green border-crd-green/30';
      case 'Rare': return 'bg-crd-lightBlue/20 text-crd-lightBlue border-crd-lightBlue/30';
      case 'Epic': return 'bg-crd-purple/20 text-crd-purple border-crd-purple/30';
      case 'Legendary': return 'bg-crd-orange/20 text-crd-orange border-crd-orange/30';
      case 'Mythic': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-crd-lightGray/20 text-crd-lightGray border-crd-lightGray/30';
    }
  };

  const getRarityIcon = (rarity: RarityLevel) => {
    switch (rarity) {
      case 'Common': return null;
      case 'Uncommon': return <Star className="h-3 w-3" />;
      case 'Rare': return <Star className="h-3 w-3" />;
      case 'Epic': return <Zap className="h-3 w-3" />;
      case 'Legendary': return <Trophy className="h-3 w-3" />;
      case 'Mythic': return <Trophy className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-crd-blue" />
          <h1 className="text-3xl font-bold text-foreground">CRD:DNA Browser</h1>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            {filteredEntries.length} entries
          </Badge>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams, cities, or codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-crd-blue"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                  <Filter className="h-4 w-4 mr-2" />
                  Group: {selectedGroup}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border-border">
                {groups.map(group => (
                  <DropdownMenuItem 
                    key={group} 
                    onClick={() => setSelectedGroup(group)}
                    className="text-foreground hover:bg-muted"
                  >
                    {group.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                  <Tag className="h-4 w-4 mr-2" />
                  Style: {selectedStyle}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border-border">
                {styles.map(style => (
                  <DropdownMenuItem 
                    key={style} 
                    onClick={() => setSelectedStyle(style)}
                    className="text-foreground hover:bg-muted"
                  >
                    {style || 'Unknown'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                  <Star className="h-4 w-4 mr-2" />
                  Rarity: {selectedRarity}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border-border">
                {rarities.map(rarity => (
                  <DropdownMenuItem 
                    key={rarity} 
                    onClick={() => setSelectedRarity(rarity)}
                    className="text-foreground hover:bg-muted"
                  >
                    {rarity}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEntries.map((entry) => (
          <div
            key={entry.fileName}
            className="group relative bg-card border border-border rounded-2xl p-4 hover:bg-muted hover:border-muted-foreground hover:shadow-2xl hover:shadow-crd-blue/5 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            onClick={() => onEntrySelect?.(entry)}
          >
            {/* Logo */}
            <div className="aspect-square bg-background border border-border rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <img 
                src={entry.imagePath}
                alt={entry.fileName}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<div class="text-muted-foreground text-sm">${entry.fileName}</div>`;
                }}
              />
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              {/* Team Info */}
              <div>
                <h3 className="font-semibold text-foreground">
                  {entry.teamName || entry.styleCode}
                </h3>
                {entry.teamCity && (
                  <p className="text-sm text-muted-foreground">{entry.teamCity}</p>
                )}
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  {entry.group}
                </Badge>
                <Badge className={`text-xs flex items-center gap-1 ${getRarityColor(entry.rarity)}`}>
                  {getRarityIcon(entry.rarity)}
                  {entry.rarity}
                </Badge>
                {entry.styleTag && (
                  <Badge className={`text-xs ${getStyleBadgeColor(entry)}`}>
                    {entry.styleTag}
                  </Badge>
                )}
                {entry.decade && (
                  <Badge className="text-xs bg-destructive/20 text-destructive border-destructive/30">
                    {entry.decade}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-border">
                  {entry.fontStyle}
                </Badge>
              </div>
              
              {/* Gaming Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Power</span>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-background border border-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-crd-orange to-crd-orangeDark rounded-full transition-all duration-300"
                        style={{ width: `${entry.powerLevel}%` }}
                      />
                    </div>
                    <span className="font-mono text-foreground">{entry.powerLevel}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Supply</span>
                  <span className="font-mono text-foreground">
                    {entry.totalSupply ? `${entry.currentSupply}/${entry.totalSupply}` : entry.currentSupply}
                  </span>
                </div>
                
                <div className="flex gap-1 text-xs">
                  {entry.isBlendable && (
                    <Badge variant="outline" className="text-xs bg-crd-lightBlue/10 text-crd-lightBlue border-crd-lightBlue/30">
                      Blendable
                    </Badge>
                  )}
                  {entry.isRemixable && (
                    <Badge variant="outline" className="text-xs bg-crd-purple/10 text-crd-purple border-crd-purple/30">
                      Remixable
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Colors */}
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-border"
                  style={{ backgroundColor: entry.primaryColor }}
                  title={`Primary: ${entry.primaryColor}`}
                />
                <div 
                  className="w-4 h-4 rounded-full border-2 border-border"
                  style={{ backgroundColor: entry.secondaryColor }}
                  title={`Secondary: ${entry.secondaryColor}`}
                />
                {entry.tertiaryColor && (
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-border"
                    style={{ backgroundColor: entry.tertiaryColor }}
                    title={`Tertiary: ${entry.tertiaryColor}`}
                  />
                )}
              </div>
              
              {/* Mascot */}
              {entry.mascot && (
                <p className="text-xs text-muted-foreground">🎭 {entry.mascot}</p>
              )}
              
              {/* Notes */}
              {entry.notes && (
                <p className="text-xs text-muted-foreground italic">{entry.notes}</p>
              )}
            </div>

            {/* Hover Indicator */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-crd-blue transition-all duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
      
      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No entries found</h3>
          <p className="text-muted-foreground">No entries found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
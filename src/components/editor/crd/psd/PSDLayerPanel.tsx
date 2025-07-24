import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Image, 
  Square, 
  Folder,
  ChevronDown,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { PSDLayer } from '../import/CRDPSDProcessor';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface PSDLayerPanelProps {
  layers: PSDLayer[];
  visibleLayers: Set<string>;
  selectedLayer?: string | null;
  layerOpacity: Map<string, number>;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerSelect: (layerId: string | null) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onLayerDelete?: (layerId: string) => void;
  onLayerDuplicate?: (layerId: string) => void;
}

export const PSDLayerPanel: React.FC<PSDLayerPanelProps> = ({
  layers,
  visibleLayers,
  selectedLayer,
  layerOpacity,
  onLayerVisibilityToggle,
  onLayerSelect,
  onLayerOpacityChange,
  onLayerDelete,
  onLayerDuplicate
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'image': return Image;
      case 'group': return Folder;
      case 'shape': return Square;
      default: return Square;
    }
  };

  const toggleGroupExpanded = (layerId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId);
    } else {
      newExpanded.add(layerId);
    }
    setExpandedGroups(newExpanded);
  };

  const renderLayerTree = (layerList: PSDLayer[], depth = 0) => {
    return layerList.map((layer) => {
      const Icon = getLayerIcon(layer.type);
      const isVisible = visibleLayers.has(layer.id);
      const isSelected = selectedLayer === layer.id;
      const isExpanded = expandedGroups.has(layer.id);
      const opacity = layerOpacity.get(layer.id) || (layer.styleProperties?.opacity ?? 1);

      return (
        <div key={layer.id} className="space-y-1">
          {/* Layer item */}
          <div 
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-crd-mediumGray/20 group transition-colors ${
              isSelected ? 'bg-crd-blue/20 border border-crd-blue/30' : ''
            }`}
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            {/* Expand/collapse for groups */}
            {layer.type === 'group' && layer.children && layer.children.length > 0 && (
              <button
                onClick={() => toggleGroupExpanded(layer.id)}
                className="text-crd-lightGray hover:text-crd-white p-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}

            {/* Visibility toggle */}
            <button
              onClick={() => onLayerVisibilityToggle(layer.id)}
              className="text-crd-lightGray hover:text-crd-white p-1"
            >
              {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
            
            {/* Layer icon */}
            <Icon className="w-3 h-3 text-crd-lightGray" />
            
            {/* Layer name - clickable to select */}
            <button
              onClick={() => onLayerSelect(isSelected ? null : layer.id)}
              className="text-crd-white text-xs flex-1 truncate text-left hover:text-crd-blue transition-colors"
            >
              {layer.name}
            </button>
            
            {/* Layer type badge */}
            <Badge 
              variant="outline" 
              className="text-xs px-1 py-0 border-crd-mediumGray/50 text-crd-lightGray"
            >
              {layer.type}
            </Badge>

            {/* Layer options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => onLayerDuplicate?.(layer.id)}>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onLayerDelete?.(layer.id)}
                  className="text-red-400"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Opacity control for selected layer */}
          {isSelected && (
            <div className="px-4 py-2 bg-crd-mediumGray/10 rounded-lg mx-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-crd-white text-xs">Opacity</span>
                <span className="text-crd-lightGray text-xs ml-auto">{Math.round(opacity * 100)}%</span>
              </div>
              <Slider
                value={[opacity]}
                onValueChange={([value]) => onLayerOpacityChange(layer.id, value)}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
              />
            </div>
          )}
          
          {/* Child layers for groups */}
          {layer.type === 'group' && layer.children && isExpanded && (
            <div className="ml-2">
              {renderLayerTree(layer.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-crd-white text-sm flex items-center gap-2">
          <Folder className="w-4 h-4" />
          Layers
          <Badge variant="outline" className="ml-auto text-xs border-crd-mediumGray/50 text-crd-lightGray">
            {layers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {layers.length === 0 ? (
            <p className="text-crd-lightGray text-xs text-center py-4">
              No layers available
            </p>
          ) : (
            renderLayerTree(layers)
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-crd-mediumGray/30">
          <p className="text-crd-lightGray text-xs">
            {layers.length} total layers • {visibleLayers.size} visible
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
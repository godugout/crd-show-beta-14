import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronRight, 
  Move, 
  Copy, 
  Trash2,
  Settings,
  Layers,
  MoreVertical
} from 'lucide-react';
import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PSDLayerControllerProps {
  layers: PSDLayer[];
  visibleLayers: Set<string>;
  selectedLayer?: string | null;
  layerOpacity: Map<string, number>;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerSelect: (layerId: string | null) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onLayerDelete?: (layerId: string) => void;
  onLayerDuplicate?: (layerId: string) => void;
  onApplyToCanvas: () => void;
  onGenerateCard: () => void;
}

export const PSDLayerController: React.FC<PSDLayerControllerProps> = ({
  layers,
  visibleLayers,
  selectedLayer,
  layerOpacity,
  onLayerVisibilityToggle,
  onLayerSelect,
  onLayerOpacityChange,
  onLayerDelete,
  onLayerDuplicate,
  onApplyToCanvas,
  onGenerateCard
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Auto-expand groups that contain visible layers
  useEffect(() => {
    const groupsWithVisibleLayers = new Set<string>();
    
    const findGroupsWithVisibleLayers = (layerList: PSDLayer[], parentPath: string = '') => {
      layerList.forEach(layer => {
        const currentPath = parentPath ? `${parentPath}/${layer.id}` : layer.id;
        
        if (layer.type === 'group' && layer.children) {
          // Check if this group or any child is visible
          const hasVisibleChild = checkHasVisibleChild(layer.children);
          if (hasVisibleChild || visibleLayers.has(layer.id)) {
            groupsWithVisibleLayers.add(layer.id);
          }
          findGroupsWithVisibleLayers(layer.children, currentPath);
        }
      });
    };

    const checkHasVisibleChild = (children: PSDLayer[]): boolean => {
      return children.some(child => 
        visibleLayers.has(child.id) || 
        (child.children && checkHasVisibleChild(child.children))
      );
    };

    findGroupsWithVisibleLayers(layers);
    setExpandedGroups(groupsWithVisibleLayers);
  }, [visibleLayers, layers]);

  const toggleGroupExpanded = (layerId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return '🅰️';
      case 'image':
        return '🖼️';
      case 'shape':
        return '🔷';
      case 'group':
        return '📁';
      default:
        return '📄';
    }
  };

  const renderLayerTree = (layerList: PSDLayer[], depth = 0): React.ReactNode => {
    return layerList.map((layer) => {
      const isVisible = visibleLayers.has(layer.id);
      const isSelected = selectedLayer === layer.id;
      const opacity = layerOpacity.get(layer.id) || layer.opacity || layer.styleProperties?.opacity || 100;
      const isGroup = layer.type === 'group';
      const isExpanded = expandedGroups.has(layer.id);

      return (
        <div key={layer.id}>
          {/* Layer Item */}
          <div
            className={`
              flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
              ${isSelected 
                ? 'bg-crd-blue/20 border border-crd-blue/40' 
                : 'hover:bg-crd-mediumGray/10'
              }
            `}
            style={{ marginLeft: `${depth * 16}px` }}
            onClick={() => onLayerSelect(layer.id)}
          >
            {/* Group Expand/Collapse */}
            {isGroup && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroupExpanded(layer.id);
                }}
                className="p-1 h-6 w-6 text-crd-lightGray hover:text-crd-white"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </Button>
            )}

            {/* Visibility Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLayerVisibilityToggle(layer.id);
              }}
              className="p-1 h-6 w-6 text-crd-lightGray hover:text-crd-white"
            >
              {isVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4 opacity-50" />
              )}
            </Button>

            {/* Layer Icon & Name */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm">{getLayerIcon(layer.type)}</span>
              <span className={`text-sm truncate ${isVisible ? 'text-crd-white' : 'text-crd-lightGray'}`}>
                {layer.name}
              </span>
            </div>

            {/* Layer Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 h-6 w-6 text-crd-lightGray hover:text-crd-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-crd-darker border-crd-mediumGray/20">
                {onLayerDuplicate && (
                  <DropdownMenuItem 
                    onClick={() => onLayerDuplicate(layer.id)}
                    className="text-crd-white hover:bg-crd-mediumGray/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-crd-white hover:bg-crd-mediumGray/20">
                  <Move className="w-4 h-4 mr-2" />
                  Move to Top
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-crd-mediumGray/20" />
                {onLayerDelete && (
                  <DropdownMenuItem 
                    onClick={() => onLayerDelete(layer.id)}
                    className="text-red-400 hover:bg-red-400/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Opacity Control for Selected Layer */}
          {isSelected && (
            <div className="mt-2 p-3 bg-crd-darkest/50 rounded-lg" style={{ marginLeft: `${(depth + 1) * 16}px` }}>
              <div className="flex items-center gap-3">
                <span className="text-xs text-crd-lightGray w-16">Opacity</span>
                <Slider
                  value={[opacity]}
                  onValueChange={([value]) => onLayerOpacityChange(layer.id, value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-crd-white w-10 text-right">{opacity}%</span>
              </div>
            </div>
          )}

          {/* Group Children */}
          {isGroup && isExpanded && layer.children && (
            <div className="mt-1">
              {renderLayerTree(layer.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const visibleLayerCount = Array.from(visibleLayers).length;
  const totalLayerCount = layers.length;

  return (
    <Card className="bg-crd-darker border-crd-mediumGray/20 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-crd-white flex items-center gap-2 text-lg">
          <Layers className="w-5 h-5 text-crd-blue" />
          PSD Layers
        </CardTitle>
        <div className="flex items-center justify-between text-sm">
          <span className="text-crd-lightGray">
            {visibleLayerCount} of {totalLayerCount} visible
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-crd-lightGray hover:text-crd-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col p-4 pt-0">
        {/* Layer Tree */}
        <div className="flex-1 overflow-auto space-y-1 min-h-0">
          {layers.length > 0 ? (
            <div className="group">
              {renderLayerTree(layers)}
            </div>
          ) : (
            <div className="text-center py-8 text-crd-lightGray">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No layers available</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-crd-mediumGray/20 space-y-2">
          <Button
            onClick={onApplyToCanvas}
            className="w-full bg-crd-blue hover:bg-crd-lightBlue text-white"
            disabled={visibleLayerCount === 0}
          >
            Apply to Canvas
          </Button>
          <Button
            onClick={onGenerateCard}
            variant="outline"
            className="w-full border-crd-blue text-crd-blue hover:bg-crd-blue hover:text-white"
            disabled={visibleLayerCount === 0}
          >
            Generate Card
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Image, 
  Type, 
  Square, 
  Folder, 
  Download,
  Plus,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';
import type { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';

interface LayerMappingGridProps {
  layers: PSDLayer[];
  selectedLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onCreateElements: (layerIds: string[]) => void;
  onCreateFrame: () => void;
  className?: string;
}

const LayerTypeIcon = ({ type }: { type: PSDLayer['type'] }) => {
  switch (type) {
    case 'text':
      return <Type className="h-4 w-4" />;
    case 'image':
      return <Image className="h-4 w-4" />;
    case 'shape':
      return <Square className="h-4 w-4" />;
    case 'folder':
    case 'background':
    case 'adjustment':
    case 'group':
      return <Folder className="h-4 w-4" />;
    default:
      return <Image className="h-4 w-4" />;
  }
};

const LayerCard = ({ 
  layer, 
  isSelected, 
  onToggle, 
  onVisibilityToggle, 
  onOpacityChange 
}: {
  layer: PSDLayer;
  isSelected: boolean;
  onToggle: () => void;
  onVisibilityToggle: () => void;
  onOpacityChange: (opacity: number) => void;
}) => {
  const [localOpacity, setLocalOpacity] = useState(Math.round((layer.opacity || layer.styleProperties?.opacity || 1) * 100));

  const handleOpacityChange = (value: number[]) => {
    const opacity = value[0];
    setLocalOpacity(opacity);
    onOpacityChange(opacity / 100);
  };

  return (
    <Card 
      className={`relative transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected ? 'ring-2 ring-crd-primary shadow-lg' : ''
      }`}
      onClick={onToggle}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <LayerTypeIcon type={layer.type} />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium truncate">{layer.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {layer.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {layer.bounds.width}×{layer.bounds.height}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onVisibilityToggle();
              }}
              className="h-8 w-8 p-0"
            >
              {layer.visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3 opacity-50" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Layer Preview */}
        <div className="mb-3">
          {layer.imageUrl ? (
            <div className="relative w-full h-20 bg-muted rounded-md overflow-hidden">
              <img 
                src={layer.imageUrl || layer.content?.imageData || ''} 
                alt={layer.name}
                className="w-full h-full object-contain"
                style={{ opacity: layer.visible ? 1 : 0.5 }}
              />
            </div>
          ) : (
            <div className="w-full h-20 bg-muted rounded-md flex items-center justify-center">
              <LayerTypeIcon type={layer.type} />
            </div>
          )}
        </div>

        {/* Opacity Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Opacity</Label>
            <span className="text-xs text-muted-foreground">{localOpacity}%</span>
          </div>
          <Slider
            value={[localOpacity]}
            onValueChange={handleOpacityChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Text Layer Info */}
        {layer.type === 'text' && (layer.textContent || layer.content?.text) && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground truncate">
              "{layer.textContent || layer.content?.text}"
            </p>
            {(layer.fontSize || layer.content?.fontSize) && (
              <p className="text-xs text-muted-foreground mt-1">
                {layer.fontFamily || layer.content?.fontFamily} • {layer.fontSize || layer.content?.fontSize}px
              </p>
            )}
          </div>
        )}

        {/* Processing Status */}
        {layer.isProcessed !== false && (
          <div className="mt-3">
            <Badge variant="default" className="text-xs">
              Processed
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const LayerMappingGrid: React.FC<LayerMappingGridProps> = ({
  layers,
  selectedLayers,
  onLayerToggle,
  onLayerVisibilityToggle,
  onLayerOpacityChange,
  onCreateElements,
  onCreateFrame,
  className = ""
}) => {
  const [layerOpacity, setLayerOpacity] = useState<Map<string, number>>(new Map());
  
  // Flatten layers for display (excluding folders)
  const flattenLayers = useCallback((layers: PSDLayer[]): PSDLayer[] => {
    const flattened: PSDLayer[] = [];
    layers.forEach(layer => {
      if (layer.type === 'folder' || layer.type === 'group') {
        if (layer.children) {
          flattened.push(...flattenLayers(layer.children));
        }
      } else {
        flattened.push(layer);
      }
    });
    return flattened;
  }, []);

  const displayLayers = flattenLayers(layers).filter(layer => 
    layer.bounds.width > 0 && layer.bounds.height > 0
  );

  const selectedLayerIds = Array.from(selectedLayers);
  const hasSelectedLayers = selectedLayerIds.length > 0;

  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayerOpacity(prev => new Map(prev).set(layerId, opacity));
    onLayerOpacityChange(layerId, opacity);
  };

  const selectAll = () => {
    displayLayers.forEach(layer => {
      if (!selectedLayers.has(layer.id)) {
        onLayerToggle(layer.id);
      }
    });
  };

  const selectNone = () => {
    selectedLayerIds.forEach(layerId => {
      onLayerToggle(layerId);
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Layer Mapping</h3>
          <p className="text-sm text-muted-foreground">
            Select layers to create CRD elements • {displayLayers.length} layers available
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAll}
            disabled={selectedLayerIds.length === displayLayers.length}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={selectNone}
            disabled={selectedLayerIds.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      <Separator />

      {/* Selection Info */}
      {hasSelectedLayers && (
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Badge variant="default">{selectedLayerIds.length} Selected</Badge>
            <span className="text-sm text-muted-foreground">
              Ready to create CRD elements
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onCreateElements(selectedLayerIds)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Elements
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateFrame}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Create Frame
            </Button>
          </div>
        </div>
      )}

      {/* Layer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayLayers.map((layer) => (
          <LayerCard
            key={layer.id}
            layer={layer}
            isSelected={selectedLayers.has(layer.id)}
            onToggle={() => onLayerToggle(layer.id)}
            onVisibilityToggle={() => onLayerVisibilityToggle(layer.id)}
            onOpacityChange={(opacity) => handleOpacityChange(layer.id, opacity)}
          />
        ))}
      </div>

      {/* Empty State */}
      {displayLayers.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Layers Found</h3>
          <p className="text-muted-foreground">
            Upload a PSD file to see extractable layers here.
          </p>
        </div>
      )}
    </div>
  );
};
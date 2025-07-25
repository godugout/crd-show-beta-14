import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy,
  Type,
  Image,
  Square,
  Circle,
  Layers
} from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: string;
}

interface LayerManagementPanelProps {
  layers: Layer[];
  selectedLayer: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
}

export const LayerManagementPanel: React.FC<LayerManagementPanelProps> = ({
  layers,
  selectedLayer,
  onLayerSelect,
  onLayerVisibilityToggle,
  onLayerDelete
}) => {
  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'image': return Image;
      case 'shape': return Square;
      case 'circle': return Circle;
      case 'background': return Layers;
      default: return Square;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium">Layers</h3>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {layers.map((layer) => {
            const LayerIcon = getLayerIcon(layer.type);
            const isSelected = selectedLayer === layer.id;
            
            return (
              <div
                key={layer.id}
                className={`group flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                {/* Layer Icon */}
                <LayerIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                
                {/* Layer Name */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm truncate block">
                    {layer.name}
                  </span>
                </div>
                
                {/* Layer Controls */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Visibility Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerVisibilityToggle(layer.id);
                    }}
                  >
                    {layer.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-muted-foreground" />
                    )}
                  </Button>
                  
                  {/* Lock Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle lock toggle
                    }}
                  >
                    {layer.locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3 text-muted-foreground" />
                    )}
                  </Button>
                  
                  {/* Duplicate */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle duplicate
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  
                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerDelete(layer.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
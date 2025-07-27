import type { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    CheckCircle,
    Eye,
    EyeOff,
    Layers
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PSDProcessorProps {
  layers: PSDLayer[];
  processingProgress: number;
  processingStep: string;
  onLayerToggle?: (layerId: string) => void;
  onLayerVisibilityToggle?: (layerId: string) => void;
  selectedLayers?: Set<string>;
  visibleLayers?: Set<string>;
}

export const PSDProcessor: React.FC<PSDProcessorProps> = ({
  layers,
  processingProgress,
  processingStep,
  onLayerToggle,
  onLayerVisibilityToggle,
  selectedLayers = new Set(),
  visibleLayers = new Set()
}) => {
  const [processedLayers, setProcessedLayers] = useState<PSDLayer[]>([]);
  const [layerCategories, setLayerCategories] = useState<{
    backgrounds: PSDLayer[];
    characters: PSDLayer[];
    effects: PSDLayer[];
    text: PSDLayer[];
    other: PSDLayer[];
  }>({
    backgrounds: [],
    characters: [],
    effects: [],
    text: [],
    other: []
  });

  useEffect(() => {
    if (layers.length > 0) {
      setProcessedLayers(layers);
      categorizeLayers(layers);
    }
  }, [layers]);

  const categorizeLayers = (layerList: PSDLayer[]) => {
    const categories = {
      backgrounds: [] as PSDLayer[],
      characters: [] as PSDLayer[],
      effects: [] as PSDLayer[],
      text: [] as PSDLayer[],
      other: [] as PSDLayer[]
    };

    layerList.forEach(layer => {
      const name = layer.name.toLowerCase();
      if (name.includes('background') || name.includes('bg')) {
        categories.backgrounds.push(layer);
      } else if (name.includes('character') || name.includes('player') || name.includes('person')) {
        categories.characters.push(layer);
      } else if (name.includes('effect') || name.includes('glow') || name.includes('shadow')) {
        categories.effects.push(layer);
      } else if (name.includes('text') || name.includes('title') || name.includes('name')) {
        categories.text.push(layer);
      } else {
        categories.other.push(layer);
      }
    });

    setLayerCategories(categories);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'backgrounds':
        return '🎨';
      case 'characters':
        return '👤';
      case 'effects':
        return '✨';
      case 'text':
        return '📝';
      default:
        return '📄';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'backgrounds':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'characters':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'effects':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'text':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderLayerThumbnail = (layer: PSDLayer) => (
    <div className="w-12 h-12 bg-crd-mediumGray/30 rounded border border-crd-mediumGray/50 flex items-center justify-center overflow-hidden">
      {layer.imageUrl ? (
        <img 
          src={layer.imageUrl} 
          alt={layer.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <Layers className="w-6 h-6 text-crd-mediumGray" />
      )}
    </div>
  );

  const renderLayerCard = (layer: PSDLayer) => {
    const isSelected = selectedLayers.has(layer.id);
    const isVisible = visibleLayers.has(layer.id);

    return (
      <Card 
        key={layer.id}
        className={`p-3 transition-all cursor-pointer ${
          isSelected 
            ? 'bg-crd-green/10 border-crd-green/30' 
            : 'bg-crd-darkGray border-crd-mediumGray/30 hover:bg-crd-mediumGray/20'
        }`}
        onClick={() => onLayerToggle?.(layer.id)}
      >
        <div className="flex items-center gap-3">
          {renderLayerThumbnail(layer)}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-crd-white font-medium text-sm truncate">
              {layer.name}
            </h3>
            <p className="text-crd-lightGray text-xs">
              {layer.bounds.width} × {layer.bounds.height}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLayerVisibilityToggle?.(layer.id);
              }}
              className="p-1 h-6 w-6"
            >
              {isVisible ? (
                <Eye className="w-3 h-3 text-crd-green" />
              ) : (
                <EyeOff className="w-3 h-3 text-crd-lightGray" />
              )}
            </Button>
            
            {isSelected && (
              <CheckCircle className="w-4 h-4 text-crd-green" />
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderCategory = (category: string, layers: PSDLayer[]) => {
    if (layers.length === 0) return null;

    return (
      <div key={category} className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(category)}</span>
          <h3 className="text-crd-white font-semibold capitalize">{category}</h3>
          <Badge variant="outline" className={getCategoryColor(category)}>
            {layers.length} layer{layers.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {layers.map(renderLayerCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Processing Status */}
      {processingProgress < 100 && (
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-crd-blue" />
              Processing PSD File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-crd-lightGray">{processingStep}</span>
                <span className="text-crd-white font-medium">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layer Categories */}
      {processedLayers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-crd-white">Extracted Layers</h2>
            <div className="flex items-center gap-2 text-sm text-crd-lightGray">
              <span>{processedLayers.length} total layers</span>
              <span>•</span>
              <span>{selectedLayers.size} selected</span>
              <span>•</span>
              <span>{visibleLayers.size} visible</span>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(layerCategories).map(([category, layers]) => 
              renderCategory(category, layers)
            )}
          </div>
        </div>
      )}

      {/* Processing Complete */}
      {processingProgress === 100 && processedLayers.length === 0 && (
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-crd-green mx-auto mb-4" />
            <h3 className="text-crd-white font-semibold mb-2">Processing Complete!</h3>
            <p className="text-crd-lightGray">
              Your PSD file has been processed successfully. Layers will appear here shortly.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 
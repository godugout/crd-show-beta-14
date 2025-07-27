import type { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Layers,
    Move,
    Sparkles
} from 'lucide-react';
import React, { useState } from 'react';

interface LayerManagerProps {
  layers: PSDLayer[];
  selectedLayers: Set<string>;
  visibleLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onGenerateFrames: () => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  selectedLayers,
  visibleLayers,
  onLayerToggle,
  onLayerVisibilityToggle,
  onGenerateFrames
}) => {
  const [activeLayers, setActiveLayers] = useState<Set<string>>(selectedLayers);
  const [elementsBucket, setElementsBucket] = useState<Set<string>>(
    new Set(layers.filter(l => !selectedLayers.has(l.id)).map(l => l.id))
  );
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<'active' | 'bucket' | null>(null);

  const moveLayer = (layerId: string, fromActive: boolean) => {
    if (fromActive) {
      setActiveLayers(prev => {
        const newActive = new Set(prev);
        newActive.delete(layerId);
        return newActive;
      });
      setElementsBucket(prev => {
        const newBucket = new Set(prev);
        newBucket.add(layerId);
        return newBucket;
      });
    } else {
      setElementsBucket(prev => {
        const newBucket = new Set(prev);
        newBucket.delete(layerId);
        return newBucket;
      });
      setActiveLayers(prev => {
        const newActive = new Set(prev);
        newActive.add(layerId);
        return newActive;
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    setDraggedLayer(layerId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, zone: 'active' | 'bucket') => {
    e.preventDefault();
    setDragOverZone(zone);
  };

  const handleDrop = (e: React.DragEvent, zone: 'active' | 'bucket') => {
    e.preventDefault();
    if (draggedLayer) {
      const fromActive = activeLayers.has(draggedLayer);
      const toActive = zone === 'active';
      
      if (fromActive !== toActive) {
        moveLayer(draggedLayer, fromActive);
      }
    }
    setDraggedLayer(null);
    setDragOverZone(null);
  };

  const handleDragEnd = () => {
    setDraggedLayer(null);
    setDragOverZone(null);
  };

  const renderLayerCard = (layer: PSDLayer, isActive: boolean) => {
    const isVisible = visibleLayers.has(layer.id);
    const isSelected = isActive ? activeLayers.has(layer.id) : elementsBucket.has(layer.id);

    return (
      <Card 
        key={layer.id}
        draggable
        onDragStart={(e) => handleDragStart(e, layer.id)}
        onDragEnd={handleDragEnd}
        className={`p-3 transition-all cursor-move ${
          draggedLayer === layer.id ? 'opacity-50' : ''
        } ${
          isSelected 
            ? 'bg-crd-green/10 border-crd-green/30' 
            : 'bg-crd-darkGray border-crd-mediumGray/30 hover:bg-crd-mediumGray/20'
        }`}
        onClick={() => onLayerToggle(layer.id)}
      >
        <div className="flex items-center gap-3">
          {/* Layer Thumbnail */}
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

          {/* Layer Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-crd-white font-medium text-sm truncate">
              {layer.name}
            </h3>
            <p className="text-crd-lightGray text-xs">
              {layer.bounds.width} × {layer.bounds.height}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLayerVisibilityToggle(layer.id);
              }}
              className="p-1 h-6 w-6"
            >
              {isVisible ? (
                <Eye className="w-3 h-3 text-crd-green" />
              ) : (
                <EyeOff className="w-3 h-3 text-crd-lightGray" />
              )}
            </Button>
            
            <Move className="w-3 h-3 text-crd-lightGray" />
          </div>
        </div>
      </Card>
    );
  };

  const renderZone = (title: string, layers: PSDLayer[], zone: 'active' | 'bucket') => {
    const isDragOver = dragOverZone === zone;
    const zoneLayers = layers.filter(l => 
      zone === 'active' ? activeLayers.has(l.id) : elementsBucket.has(l.id)
    );

    return (
      <Card 
        className={`transition-all ${
          isDragOver 
            ? 'bg-crd-blue/10 border-crd-blue/50' 
            : 'bg-crd-darker border-crd-mediumGray/30'
        }`}
        onDragOver={(e) => handleDragOver(e, zone)}
        onDrop={(e) => handleDrop(e, zone)}
      >
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              {zone === 'active' ? (
                <Sparkles className="w-5 h-5 text-crd-green" />
              ) : (
                <Layers className="w-5 h-5 text-crd-blue" />
              )}
              {title}
            </div>
            <Badge variant="outline" className="bg-crd-mediumGray/20 text-crd-lightGray">
              {zoneLayers.length} layer{zoneLayers.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {zoneLayers.length === 0 ? (
            <div className="text-center py-8 text-crd-lightGray">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {zone === 'active' 
                  ? 'Drag layers here to add to composition' 
                  : 'Drag layers here to store as elements'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {zoneLayers.map(layer => renderLayerCard(layer, zone === 'active'))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const canGenerateFrames = activeLayers.size > 0;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-crd-blue/10 border border-crd-blue/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Move className="w-5 h-5 text-crd-blue mt-0.5" />
          <div>
            <h3 className="text-crd-white font-semibold mb-1">Layer Organization</h3>
            <p className="text-crd-lightGray text-sm">
              Drag layers between the Active Composition and Elements Bucket to organize your card design. 
              Only layers in the Active Composition will be used to generate frames.
            </p>
          </div>
        </div>
      </div>

      {/* Layer Management Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Composition */}
        {renderZone('Active Composition', layers, 'active')}
        
        {/* Elements Bucket */}
        {renderZone('Elements Bucket', layers, 'bucket')}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveLayers(new Set(layers.map(l => l.id)));
              setElementsBucket(new Set());
            }}
            className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Select All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveLayers(new Set());
              setElementsBucket(new Set(layers.map(l => l.id)));
            }}
            className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <Button
          onClick={onGenerateFrames}
          disabled={!canGenerateFrames}
          className="bg-crd-blue hover:bg-crd-lightBlue text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Frames ({activeLayers.size} layers)
        </Button>
      </div>

      {/* Layer Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-crd-darker p-4 rounded-lg border border-crd-mediumGray/30">
          <div className="text-2xl font-bold text-crd-white">{layers.length}</div>
          <div className="text-sm text-crd-lightGray">Total Layers</div>
        </div>
        <div className="bg-crd-darker p-4 rounded-lg border border-crd-mediumGray/30">
          <div className="text-2xl font-bold text-crd-green">{activeLayers.size}</div>
          <div className="text-sm text-crd-lightGray">Active Layers</div>
        </div>
        <div className="bg-crd-darker p-4 rounded-lg border border-crd-mediumGray/30">
          <div className="text-2xl font-bold text-crd-blue">{elementsBucket.size}</div>
          <div className="text-sm text-crd-lightGray">In Bucket</div>
        </div>
      </div>
    </div>
  );
}; 
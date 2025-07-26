import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, Lock, Unlock, MoreHorizontal, 
  Plus, Trash2, Copy, ChevronDown, ChevronRight,
  Image as ImageIcon, Type, Square, Layers as LayersIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Layer } from '../ProStudio';

interface LayersPanelProps {
  layers: Layer[];
  selectedLayers: string[];
  onLayersUpdate: (layers: Layer[]) => void;
  onSelectionChange: (layerIds: string[]) => void;
}

const BLEND_MODES = [
  'normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light',
  'color-dodge', 'color-burn', 'darken', 'lighten', 'difference', 'exclusion',
  'hue', 'saturation', 'color', 'luminosity'
];

const LAYER_ICONS = {
  image: ImageIcon,
  text: Type,
  shape: Square,
  group: LayersIcon,
  adjustment: Square
};

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayers,
  onLayersUpdate,
  onSelectionChange
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const toggleLayerLock = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, opacity } : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const updateLayerBlendMode = (layerId: string, blendMode: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, blendMode } : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const selectLayer = (layerId: string, multiSelect = false) => {
    if (multiSelect) {
      const newSelection = selectedLayers.includes(layerId)
        ? selectedLayers.filter(id => id !== layerId)
        : [...selectedLayers, layerId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([layerId]);
    }
  };

  const duplicateLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const newLayer: Layer = {
      ...layer,
      id: `${layerId}_copy`,
      name: `${layer.name} Copy`,
    };

    onLayersUpdate([...layers, newLayer]);
  };

  const deleteLayer = (layerId: string) => {
    const updatedLayers = layers.filter(l => l.id !== layerId);
    onLayersUpdate(updatedLayers);
    onSelectionChange(selectedLayers.filter(id => id !== layerId));
  };

  const addNewLayer = (type: Layer['type']) => {
    const newLayer: Layer = {
      id: `layer_${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      effects: [],
      transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 },
      data: {}
    };

    onLayersUpdate([...layers, newLayer]);
    onSelectionChange([newLayer.id]);
  };

  const renderLayerItem = (layer: Layer, depth = 0) => {
    const IconComponent = LAYER_ICONS[layer.type];
    const isSelected = selectedLayers.includes(layer.id);
    const isGroup = layer.type === 'group';
    const isExpanded = expandedGroups.has(layer.id);

    return (
      <div key={layer.id} className="select-none">
        <motion.div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer group transition-colors ${
            isSelected 
              ? 'bg-blue-600/30 border border-blue-500/50' 
              : 'hover:bg-gray-800/50'
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={(e) => selectLayer(layer.id, e.metaKey || e.ctrlKey)}
          whileHover={{ backgroundColor: isSelected ? undefined : 'rgba(55, 65, 81, 0.3)' }}
        >
          {/* Group expand/collapse */}
          {isGroup && (
            <Button
              variant="ghost"
              size="sm"
              className="w-4 h-4 p-0 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedGroups(prev => {
                  const next = new Set(prev);
                  if (next.has(layer.id)) {
                    next.delete(layer.id);
                  } else {
                    next.add(layer.id);
                  }
                  return next;
                });
              }}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}

          {/* Layer icon */}
          <div className="w-4 h-4 opacity-60">
            <IconComponent className="w-4 h-4" />
          </div>

          {/* Layer name */}
          <span className="flex-1 text-sm truncate">{layer.name}</span>

          {/* Layer controls */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerVisibility(layer.id);
              }}
            >
              {layer.visible ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3 opacity-50" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerLock(layer.id);
              }}
            >
              {layer.locked ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Unlock className="w-3 h-3 opacity-50" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Layer properties for selected layers */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-gray-800/30 mx-2 rounded"
            >
              <div className="p-3 space-y-3">
                {/* Opacity */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Opacity</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[layer.opacity]}
                      onValueChange={([value]) => updateLayerOpacity(layer.id, value)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {layer.opacity}%
                    </span>
                  </div>
                </div>

                {/* Blend Mode */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Blend Mode</label>
                  <Select
                    value={layer.blendMode}
                    onValueChange={(value) => updateLayerBlendMode(layer.id, value)}
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLEND_MODES.map(mode => (
                        <SelectItem key={mode} value={mode} className="text-xs">
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => duplicateLayer(layer.id)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs text-red-400 hover:text-red-300"
                    onClick={() => deleteLayer(layer.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render children if group is expanded */}
        {isGroup && isExpanded && layer.children && (
          <div>
            {layer.children.map(childId => {
              const childLayer = layers.find(l => l.id === childId);
              return childLayer ? renderLayerItem(childLayer, depth + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Layers</h3>
          <div className="flex gap-1">
            <Select onValueChange={(value) => addNewLayer(value as Layer['type'])}>
              <SelectTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image Layer</SelectItem>
                <SelectItem value="text">Text Layer</SelectItem>
                <SelectItem value="shape">Shape Layer</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="adjustment">Adjustment Layer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {layers.slice().reverse().map(layer => renderLayerItem(layer))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-gray-800 text-xs text-gray-400">
        {layers.length} layer{layers.length !== 1 ? 's' : ''} • {selectedLayers.length} selected
      </div>
    </div>
  );
};
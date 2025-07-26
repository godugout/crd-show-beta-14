import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Sliders, RotateCcw, Move, 
  Square, Circle, Type, Image as ImageIcon,
  Plus, Minus, Eye, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Layer, LayerEffect } from '../ProStudio';

interface PropertiesPanelProps {
  selectedLayers: string[];
  layers: Layer[];
  onLayersUpdate: (layers: Layer[]) => void;
}

const EFFECT_TYPES = [
  { id: 'shadow', name: 'Drop Shadow', icon: Square },
  { id: 'glow', name: 'Glow', icon: Circle },
  { id: 'bevel', name: 'Bevel & Emboss', icon: Square },
  { id: 'stroke', name: 'Stroke', icon: Square },
  { id: 'gradient', name: 'Gradient Overlay', icon: Square }
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedLayers,
  layers,
  onLayersUpdate
}) => {
  const [activeTab, setActiveTab] = useState('transform');
  
  const selectedLayer = layers.find(l => selectedLayers.includes(l.id));
  
  if (!selectedLayer) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        No layer selected
      </div>
    );
  }

  const updateLayerProperty = (property: string, value: any) => {
    const updatedLayers = layers.map(layer =>
      selectedLayers.includes(layer.id)
        ? { ...layer, [property]: value }
        : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const updateTransform = (property: string, value: number) => {
    const updatedLayers = layers.map(layer =>
      selectedLayers.includes(layer.id)
        ? { ...layer, transform: { ...layer.transform, [property]: value } }
        : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const addEffect = (effectType: string) => {
    const newEffect: LayerEffect = {
      id: `effect_${Date.now()}`,
      type: effectType as LayerEffect['type'],
      enabled: true,
      settings: getDefaultEffectSettings(effectType)
    };

    const updatedLayers = layers.map(layer =>
      selectedLayers.includes(layer.id)
        ? { ...layer, effects: [...layer.effects, newEffect] }
        : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const updateEffect = (effectId: string, settings: Record<string, any>) => {
    const updatedLayers = layers.map(layer =>
      selectedLayers.includes(layer.id)
        ? {
            ...layer,
            effects: layer.effects.map(effect =>
              effect.id === effectId ? { ...effect, settings: { ...effect.settings, ...settings } } : effect
            )
          }
        : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const toggleEffect = (effectId: string) => {
    const updatedLayers = layers.map(layer =>
      selectedLayers.includes(layer.id)
        ? {
            ...layer,
            effects: layer.effects.map(effect =>
              effect.id === effectId ? { ...effect, enabled: !effect.enabled } : effect
            )
          }
        : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const removeEffect = (effectId: string) => {
    const updatedLayers = layers.map(layer =>
      selectedLayers.includes(layer.id)
        ? { ...layer, effects: layer.effects.filter(effect => effect.id !== effectId) }
        : layer
    );
    onLayersUpdate(updatedLayers);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-sm font-medium">Properties</h3>
        <p className="text-xs text-gray-400 mt-1">
          {selectedLayer.name} ({selectedLayer.type})
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-gray-900 m-2">
          <TabsTrigger value="transform" className="flex-1 text-xs">Transform</TabsTrigger>
          <TabsTrigger value="effects" className="flex-1 text-xs">Effects</TabsTrigger>
          <TabsTrigger value="color" className="flex-1 text-xs">Color</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="transform" className="p-3 space-y-4">
            {/* Position */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Position</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">X</Label>
                  <Input
                    type="number"
                    value={selectedLayer.transform.x}
                    onChange={(e) => updateTransform('x', parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Y</Label>
                  <Input
                    type="number"
                    value={selectedLayer.transform.y}
                    onChange={(e) => updateTransform('y', parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Scale</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">Width</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[selectedLayer.transform.scaleX * 100]}
                      onValueChange={([value]) => updateTransform('scaleX', value / 100)}
                      min={1}
                      max={500}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {Math.round(selectedLayer.transform.scaleX * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Height</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[selectedLayer.transform.scaleY * 100]}
                      onValueChange={([value]) => updateTransform('scaleY', value / 100)}
                      min={1}
                      max={500}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {Math.round(selectedLayer.transform.scaleY * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Rotation</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[selectedLayer.transform.rotation]}
                  onValueChange={([value]) => updateTransform('rotation', value)}
                  min={-180}
                  max={180}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-gray-400 w-8 text-right">
                  {selectedLayer.transform.rotation}°
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="p-3 space-y-4">
            {/* Add Effect */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Add Effect</Label>
              <Select onValueChange={addEffect}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Choose effect..." />
                </SelectTrigger>
                <SelectContent>
                  {EFFECT_TYPES.map(effect => (
                    <SelectItem key={effect.id} value={effect.id} className="text-xs">
                      {effect.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Effects List */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Layer Effects</Label>
              {selectedLayer.effects.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No effects applied</p>
              ) : (
                <div className="space-y-2">
                  {selectedLayer.effects.map((effect) => (
                    <EffectItem
                      key={effect.id}
                      effect={effect}
                      onUpdate={(settings) => updateEffect(effect.id, settings)}
                      onToggle={() => toggleEffect(effect.id)}
                      onRemove={() => removeEffect(effect.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="color" className="p-3 space-y-4">
            {/* Layer specific color properties */}
            {selectedLayer.type === 'text' && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Text Color</Label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded border border-gray-600 cursor-pointer" />
                  <Input
                    placeholder="#000000"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}

            {selectedLayer.type === 'shape' && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Fill Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded border border-gray-600 cursor-pointer" />
                    <Input
                      placeholder="#0066cc"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Stroke Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-transparent border-2 border-gray-600 rounded cursor-pointer" />
                    <Input
                      placeholder="#666666"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Universal color adjustments */}
            <div className="space-y-3 pt-2 border-t border-gray-800">
              <Label className="text-xs font-medium">Color Adjustments</Label>
              
              <div>
                <Label className="text-xs text-gray-400">Brightness</Label>
                <Slider
                  defaultValue={[0]}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-400">Contrast</Label>
                <Slider
                  defaultValue={[0]}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-400">Saturation</Label>
                <Slider
                  defaultValue={[0]}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-400">Hue</Label>
                <Slider
                  defaultValue={[0]}
                  min={-180}
                  max={180}
                  step={1}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

// Effect Item Component
interface EffectItemProps {
  effect: LayerEffect;
  onUpdate: (settings: Record<string, any>) => void;
  onToggle: () => void;
  onRemove: () => void;
}

const EffectItem: React.FC<EffectItemProps> = ({ effect, onUpdate, onToggle, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={effect.enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className="text-xs font-medium capitalize">{effect.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
            onClick={onRemove}
          >
            <Minus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-2 pt-0 space-y-2">
              {renderEffectSettings(effect, onUpdate)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const renderEffectSettings = (effect: LayerEffect, onUpdate: (settings: Record<string, any>) => void) => {
  switch (effect.type) {
    case 'shadow':
      return (
        <>
          <div>
            <Label className="text-xs text-gray-400">Distance</Label>
            <Slider
              value={[effect.settings.distance || 5]}
              onValueChange={([value]) => onUpdate({ distance: value })}
              min={0}
              max={50}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Blur</Label>
            <Slider
              value={[effect.settings.blur || 5]}
              onValueChange={([value]) => onUpdate({ blur: value })}
              min={0}
              max={50}
              step={1}
              className="mt-1"
            />
          </div>
        </>
      );
    case 'glow':
      return (
        <>
          <div>
            <Label className="text-xs text-gray-400">Size</Label>
            <Slider
              value={[effect.settings.size || 10]}
              onValueChange={([value]) => onUpdate({ size: value })}
              min={0}
              max={50}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Intensity</Label>
            <Slider
              value={[effect.settings.intensity || 50]}
              onValueChange={([value]) => onUpdate({ intensity: value })}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>
        </>
      );
    default:
      return <p className="text-xs text-gray-500">Settings not available</p>;
  }
};

const getDefaultEffectSettings = (effectType: string): Record<string, any> => {
  switch (effectType) {
    case 'shadow':
      return { distance: 5, blur: 5, color: '#000000', opacity: 75 };
    case 'glow':
      return { size: 10, intensity: 50, color: '#ffffff' };
    case 'bevel':
      return { depth: 5, size: 5, angle: 45 };
    case 'stroke':
      return { size: 1, color: '#000000', position: 'outside' };
    case 'gradient':
      return { angle: 90, colors: ['#ffffff', '#000000'] };
    default:
      return {};
  }
};
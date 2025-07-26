import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Move, Type, Paintbrush, Square, Circle, 
  MousePointer, Hand, ZoomIn, Settings, Play, 
  Save, Undo, Redo, Eye, EyeOff, Lock, Unlock,
  MoreHorizontal, Palette, Image as ImageIcon,
  Maximize2, Minimize2, Grid, Ruler
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LayersPanel } from './panels/LayersPanel';
import { ToolsPanel } from './panels/ToolsPanel';
import { PropertiesPanel } from './panels/PropertiesPanel';
import { TimelinePanel } from './panels/TimelinePanel';
import { CanvasViewport } from './canvas/CanvasViewport';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface ProStudioProps {
  onExit: () => void;
}

export interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'group' | 'adjustment';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  parent?: string;
  children?: string[];
  effects: LayerEffect[];
  transform: {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
  };
  data: any;
}

export interface LayerEffect {
  id: string;
  type: 'shadow' | 'glow' | 'bevel' | 'stroke' | 'gradient';
  enabled: boolean;
  settings: Record<string, any>;
}

export interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  shortcut: string;
  category: 'selection' | 'paint' | 'text' | 'shape' | 'navigation';
  settings?: Record<string, any>;
}

export const ProStudio: React.FC<ProStudioProps> = ({ onExit }) => {
  const [selectedTool, setSelectedTool] = useState<string>('move');
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['layer1']);
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'layer1',
      name: 'Background',
      type: 'image',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      effects: [],
      transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 },
      data: {}
    }
  ]);
  const [panelLayout, setPanelLayout] = useState({
    layers: { visible: true, position: 'right', width: 300 },
    tools: { visible: true, position: 'left', width: 60 },
    properties: { visible: true, position: 'right', width: 300 },
    timeline: { visible: false, position: 'bottom', height: 200 }
  });
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [isRulersVisible, setIsRulersVisible] = useState(true);
  const haptic = useHapticFeedback();

  const tools: Tool[] = [
    { id: 'move', name: 'Move', icon: Move, shortcut: 'V', category: 'selection' },
    { id: 'select', name: 'Select', icon: MousePointer, shortcut: 'M', category: 'selection' },
    { id: 'text', name: 'Text', icon: Type, shortcut: 'T', category: 'text' },
    { id: 'brush', name: 'Brush', icon: Paintbrush, shortcut: 'B', category: 'paint' },
    { id: 'rectangle', name: 'Rectangle', icon: Square, shortcut: 'U', category: 'shape' },
    { id: 'ellipse', name: 'Ellipse', icon: Circle, shortcut: 'O', category: 'shape' },
    { id: 'hand', name: 'Hand', icon: Hand, shortcut: 'H', category: 'navigation' },
    { id: 'zoom', name: 'Zoom', icon: ZoomIn, shortcut: 'Z', category: 'navigation' }
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              // Redo
              console.log('Redo');
            } else {
              // Undo
              console.log('Undo');
            }
            haptic.cardInteraction();
            break;
          case 's':
            e.preventDefault();
            console.log('Save');
            haptic.success();
            break;
        }
      } else {
        // Tool shortcuts
        const tool = tools.find(t => t.shortcut.toLowerCase() === e.key.toLowerCase());
        if (tool) {
          setSelectedTool(tool.id);
          haptic.light();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePanel = (panel: keyof typeof panelLayout) => {
    setPanelLayout(prev => ({
      ...prev,
      [panel]: { ...prev[panel], visible: !prev[panel].visible }
    }));
    haptic.cardInteraction();
  };

  const selectedLayer = layers.find(l => selectedLayers.includes(l.id));

  return (
    <div className="fixed inset-0 bg-gray-900 text-white overflow-hidden z-50">
      {/* Top Menu Bar */}
      <div className="h-12 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Cardshow Pro Studio</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            GPU Accelerated
          </Badge>
          <div className="text-sm text-gray-400">
            Zoom: {Math.round(canvasZoom * 100)}%
          </div>
          <Button variant="ghost" size="sm" onClick={onExit} className="text-gray-400 hover:text-white">
            Exit Pro Mode
          </Button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex h-[calc(100vh-3rem)] relative">
        {/* Left Panels */}
        <div className="flex">
          {/* Tools Panel */}
          <AnimatePresence>
            {panelLayout.tools.visible && (
              <motion.div
                initial={{ x: -panelLayout.tools.width }}
                animate={{ x: 0 }}
                exit={{ x: -panelLayout.tools.width }}
                transition={{ duration: 0.2 }}
                className="bg-gray-950 border-r border-gray-800"
                style={{ width: panelLayout.tools.width }}
              >
                <ToolsPanel
                  tools={tools}
                  selectedTool={selectedTool}
                  onToolSelect={setSelectedTool}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col bg-gray-800 relative">
          {/* Canvas Controls */}
          <div className="h-10 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsGridVisible(!isGridVisible)}
                className={`text-gray-400 hover:text-white ${isGridVisible ? 'bg-gray-700' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRulersVisible(!isRulersVisible)}
                className={`text-gray-400 hover:text-white ${isRulersVisible ? 'bg-gray-700' : ''}`}
              >
                <Ruler className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('timeline')}
                className="text-gray-400 hover:text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Timeline
              </Button>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <CanvasViewport
              layers={layers}
              selectedLayers={selectedLayers}
              selectedTool={selectedTool}
              zoom={canvasZoom}
              position={canvasPosition}
              showGrid={isGridVisible}
              showRulers={isRulersVisible}
              onLayersUpdate={setLayers}
              onSelectionChange={setSelectedLayers}
              onZoomChange={setCanvasZoom}
              onPositionChange={setCanvasPosition}
            />
          </div>

          {/* Timeline Panel */}
          <AnimatePresence>
            {panelLayout.timeline.visible && (
              <motion.div
                initial={{ y: panelLayout.timeline.height }}
                animate={{ y: 0 }}
                exit={{ y: panelLayout.timeline.height }}
                transition={{ duration: 0.2 }}
                className="bg-gray-950 border-t border-gray-800"
                style={{ height: panelLayout.timeline.height }}
              >
                <TimelinePanel
                  layers={layers}
                  selectedLayers={selectedLayers}
                  onLayersUpdate={setLayers}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panels */}
        <div className="flex">
          {/* Properties and Layers Panel */}
          <AnimatePresence>
            {(panelLayout.properties.visible || panelLayout.layers.visible) && (
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                transition={{ duration: 0.2 }}
                className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col"
              >
                <Tabs defaultValue="properties" className="flex-1 flex flex-col">
                  <TabsList className="bg-gray-900 m-2">
                    <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
                    <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="properties" className="flex-1 overflow-hidden">
                    <PropertiesPanel
                      selectedLayers={selectedLayers}
                      layers={layers}
                      onLayersUpdate={setLayers}
                    />
                  </TabsContent>
                  
                  <TabsContent value="layers" className="flex-1 overflow-hidden">
                    <LayersPanel
                      layers={layers}
                      selectedLayers={selectedLayers}
                      onLayersUpdate={setLayers}
                      onSelectionChange={setSelectedLayers}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Panel Toggle Buttons */}
      <div className="fixed top-16 left-2 space-y-1 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePanel('tools')}
          className={`w-8 h-8 p-0 ${panelLayout.tools.visible ? 'bg-gray-700' : 'bg-gray-800'}`}
        >
          <Paintbrush className="w-4 h-4" />
        </Button>
      </div>

      <div className="fixed top-16 right-2 space-y-1 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePanel('layers')}
          className={`w-8 h-8 p-0 ${panelLayout.layers.visible ? 'bg-gray-700' : 'bg-gray-800'}`}
        >
          <Layers className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePanel('properties')}
          className={`w-8 h-8 p-0 ${panelLayout.properties.visible ? 'bg-gray-700' : 'bg-gray-800'}`}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
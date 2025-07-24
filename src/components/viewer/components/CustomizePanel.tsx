
import React from 'react';
import { 
  Sun, 
  Sparkles, 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, VisualEffect, MaterialSettings } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS, VISUAL_EFFECTS } from '../constants';

interface CustomizePanelProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  selectedEffect: VisualEffect;
  effectIntensity: number[];
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  isFullscreen: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effect: VisualEffect) => void;
  onEffectIntensityChange: (value: number[]) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload?: (card: CardData) => void;
  onShare?: (card: CardData) => void;
  onClose?: () => void;
  card: CardData;
}

export const CustomizePanel: React.FC<CustomizePanelProps> = ({
  selectedScene,
  selectedLighting,
  selectedEffect,
  effectIntensity,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  isFullscreen,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onEffectIntensityChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onToggleFullscreen,
  onDownload,
  onShare,
  onClose,
  card
}) => {
  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-black bg-opacity-95 backdrop-blur-lg overflow-hidden border-l border-white/10 z-10 flex flex-col">
      {/* Header with toolbar buttons */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-white" />
          <h3 className="text-white font-medium">Card Settings</h3>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFullscreen}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </Button>
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(card)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <Share2 className="w-4 h-4 text-white" />
            </Button>
          )}
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(card)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <Download className="w-4 h-4 text-white" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="scenes" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-b border-white/10 mx-4 mt-4">
            <TabsTrigger value="scenes" className="text-white data-[state=active]:bg-blue-600">Scenes</TabsTrigger>
            <TabsTrigger value="customize" className="text-white data-[state=active]:bg-blue-600">Customize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scenes" className="flex-1 p-4 overflow-y-auto">
            <h4 className="text-white font-medium mb-4">Environment Scenes</h4>
            <div className="grid grid-cols-2 gap-3">
              {ENVIRONMENT_SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => onSceneChange(scene)}
                  className={`aspect-square rounded-lg p-3 transition-all ${
                    selectedScene.id === scene.id 
                      ? 'ring-2 ring-blue-500 scale-105' 
                      : 'hover:scale-102'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${scene.gradient.split(' ').join(', ')})`
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <span className="text-lg mb-1">{scene.icon}</span>
                    <span className="text-xs font-medium text-center">{scene.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="flex-1 p-4 overflow-y-auto space-y-6">
            {/* Visual Effects */}
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Visual Effects
              </h4>
              <div className="space-y-2 mb-4">
                {VISUAL_EFFECTS.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => onEffectChange(effect)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedEffect.id === effect.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{effect.name}</div>
                    <div className="text-xs opacity-75">{effect.description}</div>
                  </button>
                ))}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-white text-sm mb-2 block">Effect Intensity: {effectIntensity[0]}%</label>
                  <Slider
                    value={effectIntensity}
                    onValueChange={onEffectIntensityChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Lighting */}
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Sun className="w-4 h-4 mr-2" />
                Lighting
              </h4>
              <div className="space-y-2 mb-4">
                {LIGHTING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLightingChange(preset)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedLighting.id === preset.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs opacity-75">{preset.description}</div>
                  </button>
                ))}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-white text-sm mb-2 block">Overall Brightness: {overallBrightness[0]}%</label>
                  <Slider
                    value={overallBrightness}
                    onValueChange={onBrightnessChange}
                    min={50}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Interactive Lighting</span>
                  <button
                    onClick={onInteractiveLightingToggle}
                    className={`px-3 py-1 rounded text-xs ${
                      interactiveLighting ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {interactiveLighting ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            {/* Material Properties */}
            <div>
              <h4 className="text-white font-medium mb-3">Material Properties</h4>
              <div className="space-y-3 text-sm">
                {Object.entries(materialSettings).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-white mb-2 block capitalize">
                      {key}: {value.toFixed(2)}
                    </label>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => 
                        onMaterialSettingsChange({ ...materialSettings, [key]: newValue })
                      }
                      min={0}
                      max={1}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer with save actions */}
      <div className="p-4 border-t border-gray-700">
        <h4 className="text-white font-medium mb-3">Save & Share</h4>
        <p className="text-gray-400 text-sm mb-4">Save your customized card or share with others</p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onDownload && onDownload(card)}
          >
            Save
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-white hover:bg-gray-700"
            onClick={() => onShare && onShare(card)}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

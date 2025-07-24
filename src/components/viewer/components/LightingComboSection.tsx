
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sun, Lightbulb } from 'lucide-react';
import type { LightingPreset } from '../types';
import { LIGHTING_PRESETS } from '../constants';

interface LightingComboSectionProps {
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const LightingComboSection: React.FC<LightingComboSectionProps> = ({
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  const getLightingColor = (preset: LightingPreset) => {
    switch (preset.id) {
      case 'warm': return 'bg-orange-500';
      case 'cool': return 'bg-blue-500';
      case 'neutral': return 'bg-gray-500';
      case 'dramatic': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Lighting Presets */}
      <div className="space-y-2">
        {LIGHTING_PRESETS.map((preset) => (
          <div
            key={preset.id}
            onClick={() => onLightingChange(preset)}
            className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
              selectedLighting.id === preset.id
                ? 'border-green-500 bg-green-500/10'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getLightingColor(preset)}`}></div>
              <div className="flex-1">
                <div className={`font-medium text-sm ${
                  selectedLighting.id === preset.id ? 'text-green-400' : 'text-white'
                }`}>
                  {preset.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {preset.description}
                </div>
              </div>
              {selectedLighting.id === preset.id && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Overall Brightness */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">Brightness</span>
          </div>
          <span className="text-green-400 text-sm font-medium">
            {overallBrightness[0]}%
          </span>
        </div>
        <div className="relative">
          <Slider
            value={overallBrightness}
            onValueChange={onBrightnessChange}
            min={50}
            max={200}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Interactive Lighting Toggle */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Interactive Lighting</span>
          </div>
          <Button
            onClick={onInteractiveLightingToggle}
            variant="outline"
            size="sm"
            className={`h-8 px-3 text-xs ${
              interactiveLighting 
                ? 'bg-green-500 text-black border-green-500 hover:bg-green-600' 
                : 'bg-transparent text-white border-white/20 hover:border-white/40'
            }`}
          >
            {interactiveLighting ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
    </div>
  );
};

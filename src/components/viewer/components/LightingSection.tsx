
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sun, Lightbulb } from 'lucide-react';
import { EnhancedColoredSlider } from './EnhancedColoredSlider';
import type { LightingPreset } from '../types';
import { LIGHTING_PRESETS } from '../constants';
import { cn } from '@/lib/utils';

interface LightingSectionProps {
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

const LIGHTING_COLORS = {
  warm: {
    primary: '#F59E0B',
    secondary: '#EAB308',
    gradient: 'linear-gradient(90deg, #F59E0B, #EAB308, #FCD34D)'
  },
  cool: {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    gradient: 'linear-gradient(90deg, #0EA5E9, #06B6D4, #7DD3FC)'
  },
  neutral: {
    primary: '#6B7280',
    secondary: '#9CA3AF',
    gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF, #D1D5DB)'
  },
  dramatic: {
    primary: '#8B5CF6',
    secondary: '#A855F7',
    gradient: 'linear-gradient(90deg, #8B5CF6, #A855F7, #C084FC)'
  },
  default: {
    primary: '#6B7280',
    secondary: '#9CA3AF',
    gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF, #D1D5DB)'
  }
};

export const LightingSection: React.FC<LightingSectionProps> = ({
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  const getColorsForPreset = (presetId: string) => {
    return LIGHTING_COLORS[presetId as keyof typeof LIGHTING_COLORS] || LIGHTING_COLORS.default;
  };

  return (
    <div className="space-y-4">
      {/* Lighting Presets */}
      <div className="space-y-2">
        {LIGHTING_PRESETS.map((preset) => {
          const isSelected = selectedLighting.id === preset.id;
          const colors = getColorsForPreset(preset.id);
          
          return (
            <div
              key={preset.id}
              onClick={() => onLightingChange(preset)}
              className={cn(
                "relative p-3 rounded-lg border cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-white/40 bg-white/10 shadow-lg"
                  : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/8"
              )}
              style={isSelected ? {
                borderColor: colors.primary,
                backgroundColor: `${colors.primary}15`,
                boxShadow: `0 0 15px ${colors.primary}30`
              } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ background: colors.gradient }}
                  />
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium text-sm",
                      isSelected ? "text-white" : "text-gray-200"
                    )}>
                      {preset.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {preset.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-16 h-3 rounded-full"
                    style={{ background: colors.gradient }}
                  />
                  {isSelected && (
                    <div 
                      className="w-2 h-2 rounded-full ml-2"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Brightness */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <Label className="text-white text-sm font-medium">Brightness</Label>
          </div>
          <span className="text-yellow-400 text-sm font-medium">
            {overallBrightness[0]}%
          </span>
        </div>
        <EnhancedColoredSlider
          value={overallBrightness}
          onValueChange={onBrightnessChange}
          min={50}
          max={200}
          step={5}
          isActive={overallBrightness[0] !== 100}
          styleColor="#EAB308"
          effectName="Brightness"
        />
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
            className={cn(
              "h-8 px-3 text-xs transition-all",
              interactiveLighting 
                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600" 
                : "bg-transparent text-white border-white/20 hover:border-white/40"
            )}
          >
            {interactiveLighting ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
    </div>
  );
};

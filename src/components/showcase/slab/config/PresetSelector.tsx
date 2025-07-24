
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { SlabPresetConfig } from '../../SlabPresets';

interface PresetSelectorProps {
  config: SlabPresetConfig;
  onPresetSelect: (type: SlabPresetConfig['type']) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  config,
  onPresetSelect
}) => {
  const presets: Array<{ 
    type: SlabPresetConfig['type']; 
    label: string; 
    description: string;
    premium?: boolean;
  }> = [
    { type: 'none', label: 'None', description: 'Raw card display' },
    { type: 'toploader', label: 'Top Loader', description: 'Basic protective sleeve' },
    { type: 'onestouch', label: 'One Touch', description: 'Magnetic holder' },
    { type: 'graded', label: 'Graded Slab', description: 'Professional grading' },
    { type: 'trophy', label: 'Trophy Case', description: 'Championship display', premium: true },
    { type: 'museum', label: 'Museum Display', description: 'Professional exhibition', premium: true },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-200">Display Style</Label>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.type}
            variant={config.type === preset.type ? "default" : "outline"}
            className={`h-auto p-3 flex flex-col items-start gap-1 text-left ${
              config.type === preset.type 
                ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700' 
                : 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700'
            } ${
              preset.premium ? 'border-yellow-400/50' : ''
            }`}
            onClick={() => onPresetSelect(preset.type)}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium text-sm">
                {preset.label}
                {preset.premium && <span className="text-yellow-400 ml-1">★</span>}
              </span>
            </div>
            <span className="text-xs opacity-70 text-left">{preset.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

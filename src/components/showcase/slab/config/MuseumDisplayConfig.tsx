
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { SlabPresetConfig } from '../../SlabPresets';

interface MuseumDisplayConfigProps {
  config: SlabPresetConfig;
  onConfigChange: (config: SlabPresetConfig) => void;
}

export const MuseumDisplayConfig: React.FC<MuseumDisplayConfigProps> = ({
  config,
  onConfigChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
      <Label className="text-sm font-medium flex items-center gap-2 text-gray-200">
        <span className="text-blue-400">★</span>
        Museum Display Configuration
      </Label>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs text-gray-300">Display Stand</Label>
          <Select 
            value={config.standMaterial || 'metal'} 
            onValueChange={(value: 'metal' | 'acrylic') => 
              onConfigChange({ ...config, standMaterial: value })
            }
          >
            <SelectTrigger className="w-full bg-gray-800 text-gray-200 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="metal" className="text-gray-200 hover:bg-gray-700">Museum Steel</SelectItem>
              <SelectItem value="acrylic" className="text-gray-200 hover:bg-gray-700">Crystal Clear</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoRotate"
            checked={config.autoRotate !== false}
            onCheckedChange={(checked) => 
              onConfigChange({ ...config, autoRotate: !!checked })
            }
            className="border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <Label htmlFor="autoRotate" className="text-xs text-gray-300">
            Auto-rotate showcase
          </Label>
        </div>
      </div>
    </div>
  );
};

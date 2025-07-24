
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SlabPresetConfig } from '../../SlabPresets';

interface TrophyPlaqueConfigProps {
  config: SlabPresetConfig;
  onConfigChange: (config: SlabPresetConfig) => void;
}

export const TrophyPlaqueConfig: React.FC<TrophyPlaqueConfigProps> = ({
  config,
  onConfigChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
      <Label className="text-sm font-medium flex items-center gap-2 text-gray-200">
        <span className="text-yellow-400">★</span>
        Championship Trophy Configuration
      </Label>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs text-gray-300">Trophy Material</Label>
          <Select 
            value={config.woodType || 'walnut'} 
            onValueChange={(value: 'oak' | 'walnut' | 'cherry' | 'mahogany') => 
              onConfigChange({ ...config, woodType: value })
            }
          >
            <SelectTrigger className="w-full bg-gray-800 text-gray-200 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="oak" className="text-gray-200 hover:bg-gray-700">Gold Trophy (Oak)</SelectItem>
              <SelectItem value="walnut" className="text-gray-200 hover:bg-gray-700">Silver Trophy (Walnut)</SelectItem>
              <SelectItem value="cherry" className="text-gray-200 hover:bg-gray-700">Bronze Trophy (Cherry)</SelectItem>
              <SelectItem value="mahogany" className="text-gray-200 hover:bg-gray-700">Platinum Trophy (Mahogany)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-gray-300">Championship Engraving</Label>
          <Input
            value={config.engraving || 'CHAMPIONSHIP COLLECTION'}
            onChange={(e) => onConfigChange({ ...config, engraving: e.target.value })}
            placeholder="Enter trophy text"
            className="text-xs bg-gray-800 text-gray-200 border-gray-600 placeholder:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

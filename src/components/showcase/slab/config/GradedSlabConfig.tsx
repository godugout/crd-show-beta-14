
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SlabPresetConfig } from '../../SlabPresets';

interface GradedSlabConfigProps {
  config: SlabPresetConfig;
  onConfigChange: (config: SlabPresetConfig) => void;
}

export const GradedSlabConfig: React.FC<GradedSlabConfigProps> = ({
  config,
  onConfigChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-gray-800 border border-gray-600 rounded-lg">
      <Label className="text-sm font-medium text-gray-200">Graded Slab Configuration</Label>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs text-gray-300">Certification Number</Label>
          <Input
            value={config.certNumber || ''}
            onChange={(e) => onConfigChange({ ...config, certNumber: e.target.value })}
            placeholder="Enter cert number"
            className="text-xs bg-gray-700 text-gray-200 border-gray-600 placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-300">Case Color</Label>
          <Input
            type="color"
            value={config.caseColor || '#ffffff'}
            onChange={(e) => onConfigChange({ ...config, caseColor: e.target.value })}
            className="h-9 w-full bg-gray-700 border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

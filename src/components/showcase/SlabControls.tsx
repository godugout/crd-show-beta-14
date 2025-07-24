
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { SlabPresetConfig } from './SlabPresets';

interface SlabControlsProps {
  config: SlabPresetConfig;
  onConfigChange: (config: SlabPresetConfig) => void;
  exploded: boolean;
  onExplodedChange: (exploded: boolean) => void;
}

export const SlabControls: React.FC<SlabControlsProps> = ({
  config,
  onConfigChange,
  exploded,
  onExplodedChange
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <Label className="text-sm font-medium text-gray-200 mb-3 block">
          Display Controls
        </Label>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="exploded-view" className="text-xs text-gray-300">
              Exploded View
            </Label>
            <Switch
              id="exploded-view"
              checked={exploded}
              onCheckedChange={onExplodedChange}
            />
          </div>

          {config.type === 'museum' && (
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-rotate" className="text-xs text-gray-300">
                Auto Rotate
              </Label>
              <Switch
                id="auto-rotate"
                checked={config.autoRotate !== false}
                onCheckedChange={(checked) => 
                  onConfigChange({ ...config, autoRotate: checked })
                }
              />
            </div>
          )}
        </div>
      </div>

      {config.type !== 'none' && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <Label className="text-sm font-medium text-gray-200 mb-3 block">
            Quick Actions
          </Label>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => onConfigChange({ type: 'none' })}
            >
              Remove Display
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

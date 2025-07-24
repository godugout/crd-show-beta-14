import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { WorkspaceMode, CameraPreset } from '../types';
import {
  Camera,
  RotateCcw,
  Maximize,
  Move3d,
  Focus,
  Eye,
  Settings,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface CameraControlsProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  workspaceMode: WorkspaceMode;
  selectedPreset: string;
  onPresetChange?: (preset: string) => void;
  className?: string;
}

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'default',
    name: 'Default',
    position: [0, 0, 5],
    rotation: [0, 0, 0],
    fov: 75,
    description: 'Standard viewing angle',
    hotkey: '1'
  },
  {
    id: 'close-up',
    name: 'Close-up',
    position: [0, 0, 2],
    rotation: [0, 0, 0],
    fov: 50,
    description: 'Detailed view of card',
    hotkey: '2'
  },
  {
    id: 'wide',
    name: 'Wide',
    position: [0, 0, 8],
    rotation: [0, 0, 0],
    fov: 90,
    description: 'Full scene overview',
    hotkey: '3'
  },
  {
    id: 'hero',
    name: 'Hero Shot',
    position: [2, 1, 4],
    rotation: [-10, 15, 0],
    fov: 60,
    description: 'Dynamic presentation angle',
    hotkey: '4'
  },
  {
    id: 'top-down',
    name: 'Top-down',
    position: [0, 5, 0],
    rotation: [-90, 0, 0],
    fov: 75,
    description: 'Bird\'s eye view',
    hotkey: '5'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    position: [3, 2, 6],
    rotation: [-15, 25, 0],
    fov: 35,
    description: 'Film-like perspective',
    hotkey: '6'
  }
];

const getPositionClasses = (position: string) => {
  switch (position) {
    case 'top-left': return 'top-4 left-4';
    case 'top-right': return 'top-4 right-4';
    case 'bottom-left': return 'bottom-4 left-4';
    case 'bottom-right': return 'bottom-4 right-4';
    default: return 'bottom-4 left-4';
  }
};

export const CameraControls: React.FC<CameraControlsProps> = ({
  position,
  workspaceMode,
  selectedPreset,
  onPresetChange,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fov, setFov] = useState([75]);
  const [distance, setDistance] = useState([5]);

  const selectedPresetData = CAMERA_PRESETS.find(p => p.id === selectedPreset) || CAMERA_PRESETS[0];

  // Show different controls based on workspace mode
  const getControlsForMode = () => {
    switch (workspaceMode) {
      case 'beginner':
        return {
          showPresets: true,
          showManualControls: false,
          showAdvanced: false,
          presets: CAMERA_PRESETS.slice(0, 3) // Only basic presets
        };
      case 'pro':
        return {
          showPresets: true,
          showManualControls: true,
          showAdvanced: false,
          presets: CAMERA_PRESETS.slice(0, 5)
        };
      case 'director':
        return {
          showPresets: true,
          showManualControls: true,
          showAdvanced: true,
          presets: CAMERA_PRESETS // All presets
        };
      default:
        return {
          showPresets: true,
          showManualControls: true,
          showAdvanced: false,
          presets: CAMERA_PRESETS
        };
    }
  };

  const controls = getControlsForMode();

  return (
    <Card className={cn(
      "absolute z-10 bg-background/90 backdrop-blur-sm border-border shadow-lg transition-all duration-200",
      getPositionClasses(position),
      isExpanded ? "w-80" : "w-48",
      className
    )}>
      <CardContent className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Camera</span>
            <Badge variant="outline" className="text-xs">
              {selectedPresetData.name}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 p-0"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1 mb-3">
          <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
            <Focus className="w-3 h-3" />
            Focus
          </Button>
        </div>

        {/* Preset Selector */}
        {controls.showPresets && (
          <div className="space-y-2 mb-3">
            <label className="text-xs text-muted-foreground">Preset</label>
            <Select value={selectedPreset} onValueChange={onPresetChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {controls.presets.map(preset => (
                  <SelectItem key={preset.id} value={preset.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{preset.name}</span>
                      {preset.hotkey && (
                        <Badge variant="outline" className="text-xs ml-2">
                          {preset.hotkey}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {selectedPresetData.description}
            </p>
          </div>
        )}

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="space-y-4 border-t border-border pt-3">
            {/* Manual Controls */}
            {controls.showManualControls && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Field of View</label>
                    <span className="text-xs font-mono">{fov[0]}°</span>
                  </div>
                  <Slider
                    value={fov}
                    onValueChange={setFov}
                    min={20}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Distance</label>
                    <span className="text-xs font-mono">{distance[0].toFixed(1)}</span>
                  </div>
                  <Slider
                    value={distance}
                    onValueChange={setDistance}
                    min={1}
                    max={15}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Advanced Controls (Director Mode) */}
            {controls.showAdvanced && (
              <div className="space-y-3 border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Settings className="w-3 h-3" />
                  <span>Advanced</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <Move3d className="w-3 h-3" />
                    Orbit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <Eye className="w-3 h-3" />
                    Track
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="font-mono">
                      {selectedPresetData.position.map(v => v.toFixed(1)).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rotation:</span>
                    <span className="font-mono">
                      {selectedPresetData.rotation.map(v => v.toFixed(1)).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hotkeys (Director Mode) */}
            {workspaceMode === 'director' && (
              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted-foreground mb-2">Hotkeys</div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {controls.presets.slice(0, 6).map(preset => (
                    <div key={preset.id} className="flex items-center justify-between">
                      <span className="truncate">{preset.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {preset.hotkey}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
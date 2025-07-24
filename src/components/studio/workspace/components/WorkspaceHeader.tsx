import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { WorkspaceMode, WorkspacePreset, WorkspacePanel, DeviceType } from '../types';
import {
  Play,
  Pause,
  Maximize,
  RotateCcw,
  Monitor,
  Grid3x3,
  Zap,
  Crown,
  Film,
  Settings,
  Keyboard,
  Users
} from 'lucide-react';

interface WorkspaceHeaderProps {
  mode: WorkspaceMode;
  preset: WorkspacePreset;
  onModeChange: (mode: WorkspaceMode) => void;
  onPresetChange: (preset: WorkspacePreset) => void;
  onTogglePanel: (panelId: string) => void;
  visiblePanels: WorkspacePanel[];
  isPlaying: boolean;
  onPlayToggle: () => void;
  onFullscreen: () => void;
  onResetLayout: () => void;
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
  deviceType: DeviceType;
}

const MODE_CONFIGS = {
  beginner: {
    icon: Zap,
    label: 'Beginner',
    description: 'Simplified interface for quick edits',
    color: 'bg-green-500/10 text-green-500 border-green-500/20'
  },
  pro: {
    icon: Crown,
    label: 'Pro',
    description: 'Advanced tools for professional work',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  director: {
    icon: Film,
    label: 'Director',
    description: 'Full cinematic production suite',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  }
};

const PRESET_CONFIGS = {
  'quick-edit': { label: 'Quick Edit', description: 'Fast edits and basic adjustments' },
  'animation-studio': { label: 'Animation Studio', description: 'Timeline and keyframe tools' },
  'cinematic-mode': { label: 'Cinematic Mode', description: 'Professional lighting and cameras' },
  'custom': { label: 'Custom', description: 'Your personalized layout' }
};

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  mode,
  preset,
  onModeChange,
  onPresetChange,
  onTogglePanel,
  visiblePanels,
  isPlaying,
  onPlayToggle,
  onFullscreen,
  onResetLayout,
  isMonitoring,
  onToggleMonitoring,
  deviceType
}) => {
  const currentModeConfig = MODE_CONFIGS[mode];
  const CurrentModeIcon = currentModeConfig.icon;

  return (
    <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4 gap-4">
      {/* Left Section - Brand & Mode */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CRD</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline">Studio</span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <Select value={mode} onValueChange={onModeChange}>
            <SelectTrigger className="w-32">
              <div className="flex items-center gap-2">
                <CurrentModeIcon className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MODE_CONFIGS).map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span>{config.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {config.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Badge variant="outline" className={cn("text-xs", currentModeConfig.color)}>
            <CurrentModeIcon className="w-3 h-3 mr-1" />
            {currentModeConfig.label}
          </Badge>
        </div>

        {/* Preset Selector */}
        {deviceType === 'desktop' && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <Select value={preset} onValueChange={onPresetChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRESET_CONFIGS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col">
                      <span>{config.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {config.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {/* Center Section - Playback Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPlayToggle}
          className="gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onFullscreen}
          className="gap-2"
        >
          <Maximize className="w-4 h-4" />
          <span className="hidden sm:inline">Fullscreen</span>
        </Button>
      </div>

      {/* Right Section - Tools & Monitoring */}
      <div className="flex items-center gap-2">
        {/* Panel Toggles (Desktop only) */}
        {deviceType === 'desktop' && visiblePanels.length > 0 && (
          <>
            <div className="flex items-center gap-1">
              {visiblePanels.slice(0, 3).map(panel => {
                const IconComponent = panel.icon;
                return (
                  <Button
                    key={panel.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onTogglePanel(panel.id)}
                    title={`Toggle ${panel.title} (${panel.hotkey?.toUpperCase()})`}
                    className="w-8 h-8 p-0"
                  >
                    <IconComponent className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        {/* Performance Monitor Toggle */}
        <Button
          variant={isMonitoring ? "default" : "outline"}
          size="sm"
          onClick={onToggleMonitoring}
          title="Performance Monitor (M)"
          className="gap-2"
        >
          <Monitor className="w-4 h-4" />
          <span className="hidden lg:inline">Monitor</span>
        </Button>

        {/* Reset Layout */}
        <Button
          variant="outline"
          size="sm"
          onClick={onResetLayout}
          title="Reset Layout (R)"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden lg:inline">Reset</span>
        </Button>

        {/* Settings & Collaboration */}
        {deviceType === 'desktop' && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              title="Hotkeys"
              className="w-8 h-8 p-0"
            >
              <Keyboard className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Collaboration"
              className="w-8 h-8 p-0"
            >
              <Users className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Settings"
              className="w-8 h-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
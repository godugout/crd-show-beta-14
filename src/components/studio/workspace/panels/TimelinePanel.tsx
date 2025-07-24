import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Clock,
  Zap,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus
} from 'lucide-react';

interface TimelinePanelProps {
  card: any;
  workspaceMode: string;
  deviceType: string;
}

const MOCK_KEYFRAMES = [
  { id: 1, time: 0, property: 'rotation', value: '0°', layer: 'card' },
  { id: 2, time: 1000, property: 'rotation', value: '360°', layer: 'card' },
  { id: 3, time: 500, property: 'scale', value: '1.2x', layer: 'effect' },
  { id: 4, time: 1500, property: 'opacity', value: '0.8', layer: 'background' },
];

const TIMELINE_LAYERS = [
  { id: 'card', name: 'Card', type: 'main', color: 'bg-blue-500', visible: true, locked: false },
  { id: 'effect', name: 'Effects', type: 'effect', color: 'bg-purple-500', visible: true, locked: false },
  { id: 'background', name: 'Background', type: 'scene', color: 'bg-green-500', visible: true, locked: false },
];

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  workspaceMode,
  deviceType
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([0]);
  const [duration, setDuration] = useState([3000]); // 3 seconds
  const [selectedLayer, setSelectedLayer] = useState('card');
  const [zoom, setZoom] = useState([1]);

  const isCompact = deviceType === 'mobile' || workspaceMode === 'beginner';
  const showAdvancedControls = workspaceMode === 'director';

  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Timeline Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Timeline</span>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {formatTime(currentTime[0])} / {formatTime(duration[0])}
          </Badge>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            <SkipBack className="w-3 h-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 p-0"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            <SkipForward className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layer List */}
        <div className={cn(
          "border-r border-border bg-muted/30",
          isCompact ? "w-20" : "w-32"
        )}>
          <div className="p-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">
              {isCompact ? 'Layers' : 'Animation Layers'}
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-1 space-y-1">
              {TIMELINE_LAYERS.map(layer => (
                <div
                  key={layer.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                    selectedLayer === layer.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div className={cn("w-3 h-3 rounded", layer.color)} />
                  {!isCompact && (
                    <>
                      <span className="text-xs flex-1 truncate">{layer.name}</span>
                      <div className="flex gap-1">
                        <button className="w-4 h-4 p-0 hover:text-primary transition-colors">
                          {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                        <button className="w-4 h-4 p-0 hover:text-primary transition-colors">
                          {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {showAdvancedControls && (
            <div className="p-2 border-t border-border">
              <Button variant="outline" size="sm" className="w-full gap-1">
                <Plus className="w-3 h-3" />
                {!isCompact && 'Add Layer'}
              </Button>
            </div>
          )}
        </div>

        {/* Timeline Track */}
        <div className="flex-1 flex flex-col">
          {/* Time Ruler */}
          <div className="h-8 border-b border-border bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center px-2">
              {Array.from({ length: Math.ceil(duration[0] / 500) }, (_, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground absolute"
                  style={{ left: `${(i * 500 / duration[0]) * 100}%` }}
                >
                  {formatTime(i * 500)}
                </div>
              ))}
            </div>
            
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
              style={{ left: `${(currentTime[0] / duration[0]) * 100}%` }}
            />
          </div>

          {/* Keyframe Track */}
          <div className="flex-1 relative overflow-hidden">
            <ScrollArea className="h-full">
              <div className="relative h-full min-h-32 p-2">
                {/* Timeline Background Grid */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: Math.ceil(duration[0] / 100) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-border"
                      style={{ left: `${(i * 100 / duration[0]) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Keyframes */}
                {MOCK_KEYFRAMES.filter(kf => kf.layer === selectedLayer).map(keyframe => (
                  <div
                    key={keyframe.id}
                    className="absolute w-3 h-3 bg-primary rounded-full border-2 border-background cursor-pointer hover:scale-110 transition-transform"
                    style={{ 
                      left: `${(keyframe.time / duration[0]) * 100}%`,
                      top: '20px'
                    }}
                    title={`${keyframe.property}: ${keyframe.value} at ${formatTime(keyframe.time)}`}
                  />
                ))}

                {/* Animation Curves (Director Mode) */}
                {showAdvancedControls && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 0 30 Q 50 10 100 30 T 200 30"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Timeline Controls */}
          <div className="p-3 border-t border-border space-y-3">
            {/* Scrubber */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Position</span>
                <span className="text-xs font-mono">{formatTime(currentTime[0])}</span>
              </div>
              <Slider
                value={currentTime}
                onValueChange={setCurrentTime}
                min={0}
                max={duration[0]}
                step={10}
                className="w-full"
              />
            </div>

            {/* Advanced Controls */}
            {showAdvancedControls && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <span className="text-xs font-mono">{formatTime(duration[0])}</span>
                  </div>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    min={1000}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Zoom</span>
                    <span className="text-xs font-mono">{zoom[0].toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={zoom}
                    onValueChange={setZoom}
                    min={0.5}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Zap className="w-3 h-3" />
                Auto-key
              </Button>
              {!isCompact && (
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Plus className="w-3 h-3" />
                  Add Key
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
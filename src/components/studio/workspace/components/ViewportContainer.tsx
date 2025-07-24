import React from 'react';
import { Viewport3D } from '../../viewport/Viewport3D';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { WorkspaceMode, PerformanceMetrics } from '../types';
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  RotateCcw,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ViewportContainerProps {
  card: any;
  cards: any[];
  currentCardIndex: number;
  onCardChange: (index: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
  performanceMetrics: PerformanceMetrics;
  isFullscreen: boolean;
  onEnterFullscreen?: () => void;
  onExitFullscreen?: () => void;
  workspaceMode: WorkspaceMode;
}

const getPerformanceStatus = (metrics: PerformanceMetrics) => {
  if (metrics.fps >= 55) return { status: 'excellent', color: 'text-green-500', icon: CheckCircle };
  if (metrics.fps >= 30) return { status: 'good', color: 'text-yellow-500', icon: Zap };
  return { status: 'poor', color: 'text-red-500', icon: AlertTriangle };
};

export const ViewportContainer: React.FC<ViewportContainerProps> = ({
  card,
  cards,
  currentCardIndex,
  onCardChange,
  isPlaying,
  onPlayToggle,
  performanceMetrics,
  isFullscreen,
  onEnterFullscreen,
  onExitFullscreen,
  workspaceMode
}) => {
  const performanceStatus = getPerformanceStatus(performanceMetrics);
  const StatusIcon = performanceStatus.icon;

  // Get mode-specific viewport enhancements
  const getModeEnhancements = () => {
    switch (workspaceMode) {
      case 'beginner':
        return {
          showStats: false,
          showAdvancedControls: false,
          autoOptimize: true
        };
      case 'pro':
        return {
          showStats: true,
          showAdvancedControls: true,
          autoOptimize: false
        };
      case 'director':
        return {
          showStats: true,
          showAdvancedControls: true,
          autoOptimize: false,
          enableCinematicMode: true
        };
      default:
        return {
          showStats: true,
          showAdvancedControls: true,
          autoOptimize: false
        };
    }
  };

  const modeEnhancements = getModeEnhancements();

  return (
    <div className="relative h-full bg-background overflow-hidden">
      {/* Viewport Header (when not fullscreen) */}
      {!isFullscreen && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-sm">
                {card?.title || 'Untitled Card'}
              </h3>
              
              {modeEnhancements.showStats && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs gap-1">
                    <StatusIcon className={cn("w-3 h-3", performanceStatus.color)} />
                    {Math.round(performanceMetrics.fps)} FPS
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs">
                    {Math.round(performanceMetrics.frameTime)}ms
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs">
                    {Math.round(performanceMetrics.memoryUsage)}MB
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Playback Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onPlayToggle}
                className="gap-1"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              {/* Reset Camera */}
              <Button
                variant="ghost"
                size="sm"
                title="Reset Camera"
                className="w-8 h-8 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onEnterFullscreen}
                title="Enter Fullscreen"
                className="w-8 h-8 p-0"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Fullscreen (when fullscreen) */}
      {isFullscreen && onExitFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExitFullscreen}
          className="absolute top-4 right-4 z-20 gap-2"
        >
          <Minimize className="w-4 h-4" />
          Exit Fullscreen
        </Button>
      )}

      {/* Main 3D Viewport */}
      <div className={cn(
        "h-full",
        !isFullscreen && "pt-12" // Account for header height
      )}>
        <Viewport3D
          card={card}
          className="h-full"
          isFullscreen={isFullscreen}
          showGrid={workspaceMode !== 'beginner'}
          showGizmo={modeEnhancements.showAdvancedControls}
          showStats={modeEnhancements.showStats}
          onPerformanceUpdate={(metrics) => {
            // Performance metrics are handled by parent component
          }}
        />
      </div>

      {/* Mode-specific overlays */}
      {workspaceMode === 'director' && modeEnhancements.enableCinematicMode && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Cinematic aspect ratio guides */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 transform -translate-y-1/2" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10 transform -translate-y-1/2" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10 transform -translate-y-1/2" />
          
          {/* Center cross */}
          <div className="absolute top-1/2 left-1/2 w-8 h-px bg-white/30 transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-px h-8 bg-white/30 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Performance Warning Overlay */}
      {performanceStatus.status === 'poor' && modeEnhancements.showStats && (
        <div className="absolute bottom-4 left-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Performance Warning</span>
          </div>
          <p className="text-xs text-red-400 mt-1">
            Low frame rate detected. Consider reducing quality settings.
          </p>
        </div>
      )}

      {/* Auto-optimization notice */}
      {modeEnhancements.autoOptimize && performanceStatus.status !== 'excellent' && (
        <div className="absolute bottom-4 right-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-blue-500">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Auto-Optimizing</span>
          </div>
          <p className="text-xs text-blue-400 mt-1">
            Adjusting quality for best performance.
          </p>
        </div>
      )}
    </div>
  );
};
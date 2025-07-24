import React, { useState } from 'react';
import { 
  Film, Play, Pause, RotateCcw, Settings, ArrowRight, 
  ChevronUp, ChevronDown, Zap, Target, Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { TemplateEngine } from '@/templates/engine';

interface TemplateControlsCardProps {
  templateEngine?: TemplateEngine;
  animationProgress?: number;
  isCosmicPlaying?: boolean;
  playbackSpeed?: number;
  cardAngle?: number;
  cameraDistance?: number;
  isOptimalZoom?: boolean;
  isOptimalPosition?: boolean;
  hasTriggered?: boolean;
  onReplayTemplate?: () => void;
  onStudioEntry?: () => void;
  onProgressChange?: (progress: number) => void;
  onPlayToggle?: () => void;
  onSpeedChange?: (speed: number) => void;
  onReset?: () => void;
  onAngleReset?: () => void;
}

export const TemplateControlsCard: React.FC<TemplateControlsCardProps> = ({
  templateEngine,
  animationProgress = 0,
  isCosmicPlaying = false,
  playbackSpeed = 1,
  cardAngle = 0,
  cameraDistance = 0,
  isOptimalZoom = false,
  isOptimalPosition = false,
  hasTriggered = false,
  onReplayTemplate,
  onStudioEntry,
  onProgressChange,
  onPlayToggle,
  onSpeedChange,
  onReset,
  onAngleReset
}) => {
  const [isMinimized, setIsMinimized] = useState(true);

  if (!templateEngine) return null;

  const isTemplateReplayable = templateEngine.replayable || false;
  const hasTemplateCompleted = animationProgress >= 1 && !isCosmicPlaying;
  const canTransitionToStudio = templateEngine.transitionToStudio && hasTemplateCompleted;

  const handleProgressSliderChange = (value: number[]) => {
    onProgressChange?.(value[0] / 100);
  };

  const handleSpeedSliderChange = (value: number[]) => {
    onSpeedChange?.(value[0]);
  };

  return (
    <Card className="fixed bottom-20 left-4 z-30 w-80 bg-black/90 border-white/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-crd-orange" />
            <span className="text-sm font-medium text-white">
              {templateEngine.name || templateEngine.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-white/60">
              {isCosmicPlaying ? 'Playing' : hasTemplateCompleted ? 'Complete' : 'Ready'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-white/60 hover:text-white"
            >
              {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="space-y-4">
          {/* Progress and Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span>Progress</span>
              <span>{Math.round(animationProgress * 100)}%</span>
            </div>
            <Slider
              value={[animationProgress * 100]}
              onValueChange={handleProgressSliderChange}
              max={100}
              step={1}
              className="w-full"
              disabled={isCosmicPlaying}
            />
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPlayToggle}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                {isCosmicPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {isCosmicPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Playback Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span>Speed</span>
              <span>{playbackSpeed.toFixed(1)}x</span>
            </div>
            <Slider
              value={[playbackSpeed]}
              onValueChange={handleSpeedSliderChange}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Scene Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-white/60">
              <Target className="w-3 h-3" />
              <span>Angle: {Math.round(cardAngle)}°</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <Zap className="w-3 h-3" />
              <span>Distance: {cameraDistance.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <span className={`w-2 h-2 rounded-full ${isOptimalZoom ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span>Zoom: {isOptimalZoom ? 'Optimal' : 'Adjusting'}</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <span className={`w-2 h-2 rounded-full ${isOptimalPosition ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span>Position: {isOptimalPosition ? 'Optimal' : 'Adjusting'}</span>
            </div>
          </div>

          {/* Frame Actions */}
          <div className="flex gap-2">
            {isTemplateReplayable && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReplayTemplate}
                disabled={isCosmicPlaying}
                className={
                  isCosmicPlaying
                    ? 'border-white/10 text-white/30 cursor-not-allowed'
                    : 'border-crd-orange/50 text-crd-orange hover:bg-crd-orange/10'
                }
              >
                <Play className="w-3 h-3 mr-1" />
                Replay
              </Button>
            )}
            
            {canTransitionToStudio && onStudioEntry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onStudioEntry}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                Customize
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onAngleReset}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>

          {/* Frame Info */}
          {templateEngine.replayable && (
            <div className="text-xs text-crd-orange bg-crd-orange/10 rounded px-2 py-1">
              This frame is replayable
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, Zap } from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

interface AnimationSectionProps {
  // Basic animation props
  animationMode: string;
  animationIntensity: number;
  onAnimationModeChange: (mode: string) => void;
  onAnimationIntensityChange: (intensity: number) => void;
  
  // Alignment animation props
  animationProgress: number;
  isAlignmentPlaying: boolean;
  playbackSpeed: number;
  cardAngle: number;
  cameraDistance: number;
  isOptimalZoom: boolean;
  isOptimalPosition: boolean;
  hasTriggered: boolean;
  onProgressChange: (progress: number) => void;
  onPlayToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onAngleReset: () => void;
  
  // Section state
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

const SPEED_OPTIONS = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 4, label: '4x' },
];

const ANIMATION_MODES = [
  { value: 'none', label: 'Static' },
  { value: 'subtle', label: 'Subtle Float' },
  { value: 'dynamic', label: 'Dynamic Motion' },
  { value: 'alignment', label: 'Alignment' },
];

export const AnimationSection: React.FC<AnimationSectionProps> = ({
  animationMode,
  animationIntensity,
  onAnimationModeChange,
  onAnimationIntensityChange,
  animationProgress,
  isAlignmentPlaying,
  playbackSpeed,
  cardAngle,
  cameraDistance,
  isOptimalZoom,
  isOptimalPosition,
  hasTriggered,
  onProgressChange,
  onPlayToggle,
  onSpeedChange,
  onReset,
  onAngleReset,
  isOpen,
  onToggle
}) => {
  const { isMobile } = useResponsiveBreakpoints();
  const [showAlignmentDetails, setShowAlignmentDetails] = useState(false);
  
  const statusText = hasTriggered ? "Aligned" : 
                    animationMode === 'alignment' ? "Alignment Ready" :
                    animationMode !== 'none' ? "Animating" : "Static";

  const isAlignmentMode = animationMode === 'alignment';
  const isAlignmentReady = cardAngle >= 45 && isOptimalZoom && isOptimalPosition;

  return (
    <CollapsibleSection
      title="Animation"
      emoji="⚡"
      statusText={statusText}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-6">
        {/* Basic Animation Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-crd-lightGray">Animation Mode</h4>
          
          {/* Animation Mode Selection */}
          <div className="grid grid-cols-2 gap-2">
            {ANIMATION_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onAnimationModeChange(mode.value)}
                className={`p-3 rounded-lg border transition-all text-sm ${
                  animationMode === mode.value
                    ? 'border-crd-green bg-crd-green/10 text-crd-green'
                    : 'border-border bg-card text-muted-foreground hover:border-crd-green/50'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Animation Intensity */}
          {animationMode !== 'none' && animationMode !== 'alignment' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-crd-lightGray">Intensity</Label>
                <span className="text-xs text-muted-foreground">{Math.round(animationIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={animationIntensity}
                onChange={(e) => onAnimationIntensityChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Alignment Controls */}
        {isAlignmentMode && (
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-crd-lightGray flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Alignment
              </h4>
              {!isMobile && (
                <button
                  onClick={() => setShowAlignmentDetails(!showAlignmentDetails)}
                  className="text-xs text-muted-foreground hover:text-crd-lightGray transition-colors"
                >
                  {showAlignmentDetails ? 'Hide Details' : 'Show Details'}
                </button>
              )}
            </div>


            {/* Alignment Trigger Status */}
            {hasTriggered && (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-300/30 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-orange-200">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                  🌌 ALIGNMENT ACTIVE
                </div>
                <div className="text-xs text-orange-300/80 mt-1">
                  "My God, it's full of stars..."
                </div>
              </div>
            )}

            {/* Readiness Checklist */}
            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <div className="text-xs text-muted-foreground">Alignment Checklist</div>
              <div className="space-y-1">
                <div className={`flex items-center gap-2 text-xs ${cardAngle >= 45 ? 'text-green-400' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${cardAngle >= 45 ? 'bg-green-500' : 'bg-muted'}`} />
                  45° Lean {cardAngle >= 45 ? '✓' : `(${Math.round(cardAngle)}°)`}
                </div>
                <div className={`flex items-center gap-2 text-xs ${isOptimalZoom ? 'text-green-400' : 'text-yellow-400'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isOptimalZoom ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  Zoom {isOptimalZoom ? '✓' : `(${cameraDistance.toFixed(1)})`}
                </div>
                <div className={`flex items-center gap-2 text-xs ${isOptimalPosition ? 'text-green-400' : 'text-yellow-400'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isOptimalPosition ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  Position {isOptimalPosition ? '✓' : 'off-center'}
                </div>
              </div>
              <div className={`text-xs p-2 rounded border mt-2 ${
                 isAlignmentReady
                  ? 'bg-green-950/50 border-green-500 text-green-200'
                  : 'bg-yellow-950/50 border-yellow-500 text-yellow-200'
              }`}>
                {isAlignmentReady ? '🌌 Ready for alignment' : '⚙️ Adjust position & zoom'}
              </div>
            </div>

            {/* Timeline Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-crd-lightGray">Timeline</Label>
                <span className="text-xs text-muted-foreground">{Math.round(animationProgress * 100)}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={animationProgress}
                  onChange={(e) => onProgressChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--crd-orange)) 0%, hsl(var(--crd-orange)) ${animationProgress * 100}%, hsl(var(--muted)) ${animationProgress * 100}%, hsl(var(--muted)) 100%)`
                  }}
                />
                {/* Keyframe markers */}
                <div className="absolute top-0 w-full h-2 pointer-events-none">
                  {[0.25, 0.5, 0.75, 1.0].map((marker) => (
                    <div
                      key={marker}
                      className="absolute w-0.5 h-2 bg-muted-foreground/50 rounded"
                      style={{ left: `${marker * 100}%`, transform: 'translateX(-50%)' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={onPlayToggle}
                className="flex items-center justify-center w-8 h-8 bg-crd-orange hover:bg-crd-orange/80 rounded-lg text-white transition-colors"
              >
                {isAlignmentPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              
              <div className="flex-1">
                <div className="flex gap-1">
                  {SPEED_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSpeedChange(option.value)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        playbackSpeed === option.value
                          ? 'bg-crd-orange text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onReset}
                className="p-1 text-muted-foreground hover:text-crd-lightGray transition-colors"
                title="Reset Animation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop: Show detailed controls when expanded */}
            {!isMobile && showAlignmentDetails && (
              <div className="space-y-3 border-t border-border pt-3">
                {/* Card Angle Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-crd-lightGray">Card Lean</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(cardAngle)}°</span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-muted rounded-lg overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          cardAngle >= 45 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (cardAngle / 90) * 100)}%` }}
                      />
                    </div>
                    <div 
                      className="absolute top-0 w-0.5 h-2 bg-crd-orange"
                      style={{ left: '50%', transform: 'translateX(-50%)' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0°</span>
                    <span className="text-crd-orange">45° Trigger</span>
                    <span>90°</span>
                  </div>
                </div>

                {/* Reset Card Position */}
                <button
                  onClick={onAngleReset}
                  disabled={hasTriggered}
                  className={`w-full py-2 text-sm rounded-lg transition-colors ${
                    hasTriggered 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-card border border-border hover:border-crd-green/50 text-crd-lightGray'
                  }`}
                >
                  {hasTriggered ? 'Animation Active...' : 'Reset Card Position'}
                </button>
              </div>
            )}

            {/* Status Indicators */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isAlignmentPlaying ? 'bg-green-500' : 'bg-muted'}`} />
                <span className="text-muted-foreground">{isAlignmentPlaying ? 'Playing' : 'Paused'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${hasTriggered ? 'bg-green-500 animate-pulse' : cardAngle >= 45 ? 'bg-crd-orange animate-pulse' : 'bg-muted'}`} />
                <span className="text-muted-foreground">{hasTriggered ? 'Aligned' : cardAngle >= 45 ? 'Triggered' : 'Manual'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};
import React from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface AlignmentControlsProps {
  animationProgress: number;
  isPlaying: boolean;
  playbackSpeed: number;
  hasTriggered: boolean;
  onProgressChange: (progress: number) => void;
  onPlayToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export const AlignmentControls: React.FC<AlignmentControlsProps> = ({
  animationProgress,
  isPlaying,
  playbackSpeed,
  hasTriggered,
  onProgressChange,
  onPlayToggle,
  onSpeedChange,
  onReset
}) => {
  return (
    <div className="fixed bottom-6 left-6 z-50 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-4 min-w-80">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-crd-blue" />
          <span className="text-white text-sm font-medium">Alignment Controls</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Progress</span>
            <span>{Math.round(animationProgress * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={animationProgress * 100}
            onChange={(e) => onProgressChange(Number(e.target.value) / 100)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayToggle}
            className="flex items-center gap-2 px-3 py-2 bg-crd-blue/20 hover:bg-crd-blue/30 border border-crd-blue/40 rounded-lg transition-colors duration-200 text-white text-sm"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-lg transition-colors duration-200 text-white text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Speed</span>
            <span>{playbackSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-white/10">
          <div className="text-xs text-gray-300">
            Status: <span className={`${hasTriggered ? 'text-green-400' : 'text-yellow-400'}`}>
              {hasTriggered ? 'Alignment Triggered' : 'Zoom to 60%+ and center card'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
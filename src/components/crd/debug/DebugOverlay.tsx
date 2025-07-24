import React, { useState } from 'react';
import { Monitor, Settings, RotateCcw, Play, Pause, Eye, EyeOff } from 'lucide-react';

interface DebugOverlayProps {
  alignmentState: {
    zoom: number;
    tilt: number;
    coverage: number;
    isTriggered: boolean;
    phase: 'idle' | 'transformation' | 'sun-rise' | 'moon-descent' | 'alignment' | 'climax';
    progress: number;
  };
  onManualTrigger: () => void;
  onReset: () => void;
  onPhaseSkip: (phase: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  alignmentState,
  onManualTrigger,
  onReset,
  onPhaseSkip,
  isVisible,
  onToggleVisibility
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getProgressColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-400';
    if (value >= threshold * 0.75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarWidth = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggleVisibility}
        className="fixed bottom-4 left-4 z-50 p-2 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-black/90 transition-all"
        title="Show Debug Overlay"
      >
        <Eye className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 text-white p-4 font-mono text-xs max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-semibold">MONOLITH DEBUG</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={onToggleVisibility}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Hide Debug Overlay"
          >
            <EyeOff className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Current State */}
      <div className="mb-3 space-y-1">
        <div className="flex justify-between">
          <span>Phase:</span>
          <span className="text-cyan-400 uppercase">{alignmentState.phase}</span>
        </div>
        <div className="flex justify-between">
          <span>Progress:</span>
          <span className="text-cyan-400">{(alignmentState.progress * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Triggered:</span>
          <span className={alignmentState.isTriggered ? 'text-green-400' : 'text-red-400'}>
            {alignmentState.isTriggered ? 'YES' : 'NO'}
          </span>
        </div>
      </div>

      {/* Alignment Metrics */}
      <div className="mb-3 space-y-2">
        <div className="text-gray-400 uppercase text-xs font-semibold">ALIGNMENT METRICS</div>
        
        {/* Zoom */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Zoom:</span>
            <span className={getProgressColor(alignmentState.zoom, 400)}>
              {alignmentState.zoom.toFixed(0)}% / 400%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div 
              className="bg-blue-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${getProgressBarWidth(alignmentState.zoom, 400)}%` }}
            />
          </div>
        </div>

        {/* Tilt */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Tilt:</span>
            <span className={getProgressColor(alignmentState.tilt, 45)}>
              {alignmentState.tilt.toFixed(1)}° / 45°
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div 
              className="bg-green-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${getProgressBarWidth(alignmentState.tilt, 45)}%` }}
            />
          </div>
        </div>

        {/* Coverage */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Coverage:</span>
            <span className={getProgressColor(alignmentState.coverage, 100)}>
              {alignmentState.coverage.toFixed(1)}% / 100%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div 
              className="bg-purple-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${getProgressBarWidth(alignmentState.coverage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <div className="text-gray-400 uppercase text-xs font-semibold">CONTROLS</div>
        
        <div className="flex gap-2">
          <button
            onClick={onManualTrigger}
            className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-600/20 border border-green-400/30 rounded hover:bg-green-600/30 transition-colors text-green-400"
            title="Force Trigger Sequence"
          >
            <Play className="w-3 h-3" />
            <span className="text-xs">TRIGGER</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-600/20 border border-red-400/30 rounded hover:bg-red-600/30 transition-colors text-red-400"
            title="Reset State"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-xs">RESET</span>
          </button>
        </div>

        {/* Phase Skip Buttons */}
        {isExpanded && (
          <div className="grid grid-cols-2 gap-1 mt-2">
            {['transformation', 'sun-rise', 'moon-descent', 'alignment', 'climax'].map((phase) => (
              <button
                key={phase}
                onClick={() => onPhaseSkip(phase)}
                className="p-1 bg-yellow-600/20 border border-yellow-400/30 rounded hover:bg-yellow-600/30 transition-colors text-yellow-400 text-xs"
                title={`Skip to ${phase}`}
              >
                {phase.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Values */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-gray-400 uppercase text-xs font-semibold mb-2">LIVE VALUES</div>
          <div className="space-y-1 text-xs text-gray-300">
            <div>Phase Progress: {(alignmentState.progress * 100).toFixed(2)}%</div>
            <div>Zoom Rate: {(alignmentState.zoom / 400 * 100).toFixed(1)}%</div>
            <div>Tilt Rate: {(alignmentState.tilt / 45 * 100).toFixed(1)}%</div>
            <div>Coverage Rate: {alignmentState.coverage.toFixed(1)}%</div>
          </div>
        </div>
      )}
    </div>
  );
};
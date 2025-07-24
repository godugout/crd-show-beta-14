import React from 'react';
import { Play, Pause, RotateCcw, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateEngine } from '@/templates/engine';
import { useTemplatePreset } from '@/hooks/useTemplatePreset';

interface TemplateControlsProps {
  templateEngine?: TemplateEngine;
  isPlaying: boolean;
  animationProgress: number;
  onPlayToggle: () => void;
  onReplay: () => void;
  onSavePreset?: () => void;
  onStudioEntry?: () => void;
  className?: string;
}

export const TemplateControls: React.FC<TemplateControlsProps> = ({
  templateEngine,
  isPlaying,
  animationProgress,
  onPlayToggle,
  onReplay,
  onSavePreset,
  onStudioEntry,
  className = ''
}) => {
  const { savePreset } = useTemplatePreset();
  
  const isAnimationComplete = animationProgress >= 1 && !isPlaying;
  const canTransitionToStudio = templateEngine?.transitionToStudio && isAnimationComplete;

  const handleSavePreset = async () => {
    if (!templateEngine) return;
    
    try {
      const preset = {
        name: `${templateEngine.name} Preset`,
        templateId: templateEngine.id,
        camera: templateEngine.initialCamera || {
          position: [0, 0, 15] as [number, number, number],
          target: [0, 0, 0] as [number, number, number],
          zoom: 1
        },
        materials: {
          styleId: 'matte', // Default style
          intensity: 1,
          lightingPreset: 'studio'
        }
      };
      
      await savePreset(preset);
      onSavePreset?.();
    } catch (error) {
      console.error('Failed to save preset:', error);
    }
  };

  if (!templateEngine) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Play/Pause Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPlayToggle}
        className="border-crd-orange/50 text-crd-orange hover:bg-crd-orange/10"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 mr-2" />
        ) : (
          <Play className="w-4 h-4 mr-2" />
        )}
        {isPlaying ? 'Pause' : 'Play'}
      </Button>

      {/* Replay Button (only if template is replayable) */}
      {templateEngine.replayable && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReplay}
          disabled={isPlaying}
          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Replay
        </Button>
      )}

      {/* Save Preset */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSavePreset}
        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
      >
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>

      {/* Studio Transition (only when animation is complete) */}
      {canTransitionToStudio && onStudioEntry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onStudioEntry}
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Customize
        </Button>
      )}
    </div>
  );
};
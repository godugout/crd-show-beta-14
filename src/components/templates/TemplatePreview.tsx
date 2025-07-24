import React, { useState, useEffect } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CRDViewer } from '@/components/crd/CRDViewer';
import { TemplateEngine, TemplateConfig } from '@/templates/engine';
import { useStudioManager } from '@/hooks/useStudioManager';

interface TemplatePreviewProps {
  template: TemplateEngine;
  className?: string;
  onLaunchStudio?: () => void;
  autoPlay?: boolean;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  className = '',
  onLaunchStudio,
  autoPlay = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const { onTemplateComplete } = useStudioManager();
  
  const templateConfig: TemplateConfig = {
    templateId: template.id,
    mode: 'preview',
    triggerOnLoad: autoPlay
  };

  useEffect(() => {
    if (autoPlay && !hasPlayedOnce) {
      // Start animation after a brief delay
      const timeout = setTimeout(() => {
        setIsPlaying(true);
        setHasPlayedOnce(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [autoPlay, hasPlayedOnce]);

  const handleAnimationComplete = () => {
    setIsPlaying(false);
    // Auto-restart preview after delay
    setTimeout(() => {
      setIsPlaying(true);
    }, 3000);
  };

  const handleLaunchStudio = () => {
    onLaunchStudio?.();
    onTemplateComplete(template);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-black ${className}`}>
      {/* 3D Preview */}
      <div className="aspect-video relative">
        <CRDViewer
          mode="alignment"
          templateConfig={templateConfig}
          enableControls={false}
          showPauseButton={false}
          hideAlignmentControls={true}
          className="w-full h-full"
          onAlignmentStateChange={(state) => {
            if (state.animationProgress >= 1 && state.isPlaying) {
              handleAnimationComplete();
            }
          }}
        />
        
        {/* Preview Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Template Info */}
          <div className="absolute top-4 left-4 z-30">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
              <h3 className="text-white font-medium text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-crd-orange" />
                {template.name}
              </h3>
              <p className="text-white/70 text-xs">Cinematic Template</p>
            </div>
          </div>
          
          {/* Launch Studio Button */}
          <div className="absolute bottom-4 right-4 z-30 pointer-events-auto">
            <Button
              onClick={handleLaunchStudio}
              className="bg-crd-orange hover:bg-crd-orange/80 text-white"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Launch Studio
            </Button>
          </div>
          
          {/* Play State Indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                onClick={() => setIsPlaying(true)}
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 pointer-events-auto"
              >
                <Play className="w-6 h-6 mr-2" />
                Play Preview
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
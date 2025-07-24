
import React from 'react';
import { Download, Share2, Maximize2, Minimize2, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateEngine } from '@/templates/engine';

interface StudioFooterProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  templateEngine?: TemplateEngine;
  animationProgress?: number;
  onReplay?: () => void;
  onContinueToCustomize?: () => void;
  mode?: 'cinematic' | 'preview' | 'studio';
}

export const StudioFooter: React.FC<StudioFooterProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onDownload,
  onShare,
  templateEngine,
  animationProgress = 0,
  onReplay,
  onContinueToCustomize,
  mode = 'studio'
}) => {
  // Get footer HUD configuration from template
  const footerHUD = templateEngine?.footerHUD;
  
  // Update status lines based on animation progress
  const getStatusLines = (): string[] => {
    if (!footerHUD) return [];
    
    const lines = [...footerHUD.statusLines];
    
    // Update progress-based status for cinematic mode
    if (mode === 'cinematic' && animationProgress !== undefined) {
      const progressPercentage = Math.round(animationProgress * 100);
      if (lines.length > 1) {
        lines[1] = `Animation Progress: ${progressPercentage}%`;
      }
      
      // Update final line based on completion
      if (animationProgress >= 1 && lines.length > 3) {
        lines[3] = 'Animation complete - Ready to customize';
      }
    }
    
    return footerHUD.compact ? lines.slice(0, 4) : lines;
  };

  const statusLines = getStatusLines();

  return (
    <div className="border-t border-white/10 p-3 lg:p-4 bg-black/50 w-full">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-end lg:gap-4">
        {/* Status lines - Stack on mobile */}
        {footerHUD && mode === 'cinematic' && (
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-2 lg:gap-1">
              {statusLines.map((line, index) => (
                <div 
                  key={index}
                  className="text-xs lg:text-sm text-white/80 truncate"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action buttons - Horizontal scroll on mobile */}
        <div className="order-1 lg:order-2">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 flex-shrink-0">
            {/* Template-specific buttons */}
            {footerHUD && mode === 'cinematic' && (
              <>
                {footerHUD.showReplay && onReplay && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReplay}
                    className="mobile-btn border-purple-500/50 text-purple-400 hover:bg-purple-500/10 flex-shrink-0"
                  >
                    <RotateCcw className="w-4 h-4 mr-0 lg:mr-2" />
                    <span className="hidden lg:inline">Replay</span>
                  </Button>
                )}
                
                {footerHUD.showContinue && onContinueToCustomize && animationProgress >= 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onContinueToCustomize}
                    className="mobile-btn border-crd-green/50 text-crd-green hover:bg-crd-green/10 flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4 mr-0 lg:mr-2" />
                    <span className="hidden lg:inline">Continue to Customize</span>
                  </Button>
                )}
              </>
            )}
            
            {/* Standard controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFullscreen}
              className="mobile-btn border-white/20 text-white hover:bg-white/10 flex-shrink-0"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 mr-0 lg:mr-2" /> : <Maximize2 className="w-4 h-4 mr-0 lg:mr-2" />}
              <span className="hidden lg:inline">View</span>
            </Button>
            
            {onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                className="mobile-btn border-blue-500/50 text-blue-400 hover:bg-blue-500/10 flex-shrink-0"
              >
                <Share2 className="w-4 h-4 mr-0 lg:mr-2" />
                <span className="hidden lg:inline">Share</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="mobile-btn border-crd-green/50 text-crd-green hover:bg-crd-green/10 flex-shrink-0"
            >
              <Download className="w-4 h-4 mr-0 lg:mr-2" />
              <span className="hidden lg:inline">Save</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

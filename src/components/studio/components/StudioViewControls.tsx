import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize, Play, Pause } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface StudioViewControlsProps {
  onResetView: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const StudioViewControls: React.FC<StudioViewControlsProps> = ({
  onResetView,
  autoRotate,
  onToggleAutoRotate,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  isFullscreen
}) => {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-crd-dark/90 backdrop-blur-sm p-3 rounded-lg border border-crd-mediumGray">
      <div className="flex gap-2">
        <CRDButton
          size="sm"
          variant="outline"
          onClick={onResetView}
          className="border border-crd-mediumGray hover:border-crd-blue hover:bg-crd-blue/10"
          title="Reset View"
        >
          <RotateCcw size={16} />
        </CRDButton>
        
        <CRDButton
          size="sm"
          variant={autoRotate ? "primary" : "outline"}
          onClick={onToggleAutoRotate}
          className={autoRotate ? "" : "border border-crd-mediumGray hover:border-crd-blue hover:bg-crd-blue/10"}
          title={autoRotate ? "Stop Auto Rotate" : "Start Auto Rotate"}
        >
          {autoRotate ? <Pause size={16} /> : <Play size={16} />}
        </CRDButton>
      </div>
      
      <div className="flex gap-2">
        <CRDButton
          size="sm"
          variant="outline"
          onClick={onZoomIn}
          className="border border-crd-mediumGray hover:border-crd-blue hover:bg-crd-blue/10"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </CRDButton>
        
        <CRDButton
          size="sm"
          variant="outline"
          onClick={onZoomOut}
          className="border border-crd-mediumGray hover:border-crd-blue hover:bg-crd-blue/10"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </CRDButton>
      </div>
      
      <CRDButton
        size="sm"
        variant="outline"
        onClick={onToggleFullscreen}
        className="border border-crd-mediumGray hover:border-crd-blue hover:bg-crd-blue/10"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        <Maximize size={16} />
      </CRDButton>
    </div>
  );
};
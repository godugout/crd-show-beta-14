import React from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, Grid3x3, Ruler, 
  Move, Eye, Maximize2 
} from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDCanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomFit: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  gridType: 'standard' | 'print' | 'golden';
  onGridTypeChange: (type: 'standard' | 'print' | 'golden') => void;
  showRulers: boolean;
  onRulersToggle: () => void;
  isPanning: boolean;
  onPanToggle: () => void;
}

export const CRDCanvasControls: React.FC<CRDCanvasControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomFit,
  showGrid,
  onGridToggle,
  gridType,
  onGridTypeChange,
  showRulers,
  onRulersToggle,
  isPanning,
  onPanToggle
}) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
      {/* Zoom Controls */}
      <div className="bg-crd-darker/90 backdrop-blur-sm border border-crd-mediumGray/20 rounded-lg p-2 flex items-center gap-2">
        <CRDButton
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={zoom <= 25}
          className="p-2 h-8 w-8"
        >
          <ZoomOut className="w-4 h-4" />
        </CRDButton>
        
        <div className="text-crd-white text-xs font-mono bg-crd-darkest px-2 py-1 rounded min-w-[50px] text-center">
          {Math.round(zoom)}%
        </div>
        
        <CRDButton
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={zoom >= 300}
          className="p-2 h-8 w-8"
        >
          <ZoomIn className="w-4 h-4" />
        </CRDButton>
        
        <div className="w-px h-6 bg-crd-mediumGray/30" />
        
        <CRDButton
          variant="ghost"
          size="sm"
          onClick={onZoomReset}
          className="p-2 h-8 w-8"
          title="Reset zoom (100%)"
        >
          <RotateCcw className="w-4 h-4" />
        </CRDButton>
        
        <CRDButton
          variant="ghost"
          size="sm"
          onClick={onZoomFit}
          className="p-2 h-8 w-8"
          title="Fit to screen"
        >
          <Maximize2 className="w-4 h-4" />
        </CRDButton>
      </div>

      {/* View Controls */}
      <div className="bg-crd-darker/90 backdrop-blur-sm border border-crd-mediumGray/20 rounded-lg p-2 flex items-center gap-2">
        <CRDButton
          variant={showGrid ? "primary" : "ghost"}
          size="sm"
          onClick={onGridToggle}
          className="p-2 h-8 w-8"
          title="Toggle grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </CRDButton>
        
        {showGrid && (
          <select
            value={gridType}
            onChange={(e) => onGridTypeChange(e.target.value as 'standard' | 'print' | 'golden')}
            className="bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1 text-xs text-crd-white"
          >
            <option value="standard">Standard</option>
            <option value="print">Print</option>
            <option value="golden">Golden</option>
          </select>
        )}
        
        <CRDButton
          variant={showRulers ? "primary" : "ghost"}
          size="sm"
          onClick={onRulersToggle}
          className="p-2 h-8 w-8"
          title="Toggle rulers"
        >
          <Ruler className="w-4 h-4" />
        </CRDButton>
        
        <CRDButton
          variant={isPanning ? "primary" : "ghost"}
          size="sm"
          onClick={onPanToggle}
          className="p-2 h-8 w-8"
          title="Pan mode"
        >
          <Move className="w-4 h-4" />
        </CRDButton>
      </div>
    </div>
  );
};

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  ZoomIn, 
  ZoomOut,
  Eye,
  EyeOff,
  Undo,
  Redo,
  Grid3X3,
  ArrowLeft
} from 'lucide-react';

interface StreamlinedCropperToolbarProps {
  cropCount: number;
  showPreview: boolean;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onTogglePreview: () => void;
  onToggleGrid: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExtractAll: () => void;
  onCancel: () => void;
  imageLoaded: boolean;
  isExtracting: boolean;
}

export const StreamlinedCropperToolbar: React.FC<StreamlinedCropperToolbarProps> = ({
  cropCount,
  showPreview,
  showGrid,
  canUndo,
  canRedo,
  onTogglePreview,
  onToggleGrid,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onUndo,
  onRedo,
  onExtractAll,
  onCancel,
  imageLoaded,
  isExtracting
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-crd-darkest border-b border-crd-mediumGray/30">
      {/* Left: Title and Status */}
      <div className="flex items-center gap-4">
        <h3 className="text-white font-semibold text-lg">Crop Your Cards</h3>
        <Badge className="bg-crd-green text-black font-medium">
          {cropCount} area{cropCount !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Right: Core Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Controls */}
        <div className="flex items-center gap-2 mr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray hover:text-white"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray hover:text-white"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleGrid}
            className={`${showGrid ? 'bg-crd-blue text-white border-crd-blue' : 'bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray'}`}
            title="Toggle Grid"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
            className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray hover:text-white"
            title="Toggle Preview"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 mr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            disabled={zoom <= 0.5}
            className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray hover:text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          <button
            onClick={onZoomFit}
            className="text-white text-sm hover:text-crd-green transition-colors min-w-[60px] font-medium"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            disabled={zoom >= 3}
            className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray hover:text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Primary Actions */}
        <Button
          onClick={onExtractAll}
          disabled={!imageLoaded || isExtracting}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-6"
        >
          {isExtracting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Crop className="w-4 h-4 mr-2" />
              Extract Cards
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};

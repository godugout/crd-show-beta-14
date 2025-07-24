
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  ZoomIn, 
  ZoomOut,
  Eye,
  EyeOff,
  RotateCw,
  Copy,
  Scissors,
  Undo,
  Redo,
  Grid3X3,
  Move,
  MousePointer,
  Settings
} from 'lucide-react';

interface EnhancedCropperToolbarProps {
  cropCount: number;
  selectedCount: number;
  showPreview: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  activeTool: 'select' | 'crop' | 'rotate' | 'zoom';
  canUndo: boolean;
  canRedo: boolean;
  onTogglePreview: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onToolChange: (tool: 'select' | 'crop' | 'rotate' | 'zoom') => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onExtractAll: () => void;
  onCancel: () => void;
  imageLoaded: boolean;
  isExtracting: boolean;
}

export const EnhancedCropperToolbar: React.FC<EnhancedCropperToolbarProps> = ({
  cropCount,
  selectedCount,
  showPreview,
  showGrid,
  snapToGrid,
  activeTool,
  canUndo,
  canRedo,
  onTogglePreview,
  onToggleGrid,
  onToggleSnap,
  onToolChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onUndo,
  onRedo,
  onCopy,
  onCut,
  onPaste,
  onDuplicate,
  onExtractAll,
  onCancel,
  imageLoaded,
  isExtracting
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-editor-border bg-editor-dark">
      <div className="flex items-center gap-4">
        <h3 className="text-white font-medium">Enhanced Cropping Tool</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-crd-green text-black">
            {cropCount} crop{cropCount !== 1 ? 's' : ''}
          </Badge>
          {selectedCount > 0 && (
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              {selectedCount} selected
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Tool Selection */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToolChange('select')}
            className={`${activeTool === 'select' ? 'bg-crd-green text-black' : 'bg-editor-tool border-editor-border text-gray-300'}`}
          >
            <MousePointer className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToolChange('crop')}
            className={`${activeTool === 'crop' ? 'bg-crd-green text-black' : 'bg-editor-tool border-editor-border text-gray-300'}`}
          >
            <Crop className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToolChange('rotate')}
            className={`${activeTool === 'rotate' ? 'bg-crd-green text-black' : 'bg-editor-tool border-editor-border text-gray-300'}`}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        {/* History Controls */}
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>

        {/* Clipboard Operations */}
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          disabled={selectedCount === 0}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
          title="Copy (Ctrl+C)"
        >
          <Copy className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onCut}
          disabled={selectedCount === 0}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
          title="Cut (Ctrl+X)"
        >
          <Scissors className="w-4 h-4" />
        </Button>

        {/* View Controls */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleGrid}
          className={`${showGrid ? 'bg-blue-600 text-white' : 'bg-editor-tool border-editor-border text-gray-300'}`}
          title="Toggle Grid"
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          Preview
        </Button>

        {/* Zoom Controls */}
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <button
          onClick={onZoomFit}
          className="text-gray-300 text-sm hover:text-white transition-colors min-w-[60px]"
          title="Click to fit to window"
        >
          {Math.round(zoom * 100)}%
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          disabled={zoom >= 3}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        {/* Main Actions */}
        <Button
          onClick={onExtractAll}
          disabled={!imageLoaded || isExtracting}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          {isExtracting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              Extracting...
            </>
          ) : (
            <>
              <Crop className="w-4 h-4 mr-2" />
              Extract All Crops
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

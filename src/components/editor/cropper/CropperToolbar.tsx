
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  ZoomIn, 
  ZoomOut,
  Eye,
  EyeOff
} from 'lucide-react';

interface CropperToolbarProps {
  cropCount: number;
  showPreview: boolean;
  onTogglePreview: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExtractAll: () => void;
  onCancel: () => void;
  imageLoaded: boolean;
  isExtracting: boolean;
}

export const CropperToolbar: React.FC<CropperToolbarProps> = ({
  cropCount,
  showPreview,
  onTogglePreview,
  zoom,
  onZoomIn,
  onZoomOut,
  onExtractAll,
  onCancel,
  imageLoaded,
  isExtracting
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-editor-border bg-editor-dark">
      <div className="flex items-center gap-4">
        <h3 className="text-white font-medium">Advanced Cropping Tool</h3>
        <Badge variant="secondary" className="bg-crd-green text-black">
          {cropCount} crop{cropCount !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          Preview
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <span className="text-gray-300 text-sm">{Math.round(zoom * 100)}%</span>

        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          disabled={zoom >= 3}
          className="bg-editor-tool border-editor-border text-gray-300 hover:bg-editor-border hover:text-white"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

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

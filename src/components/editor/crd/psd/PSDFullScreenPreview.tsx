
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Edit3 } from 'lucide-react';
import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';

interface PSDFullScreenPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onStartEditing: () => void;
  layers: PSDLayer[];
  thumbnail: string;
}

export const PSDFullScreenPreview: React.FC<PSDFullScreenPreviewProps> = ({
  isOpen,
  onClose,
  onStartEditing,
  layers,
  thumbnail
}) => {
  const [zoom, setZoom] = useState(100);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(layers.map(layer => layer.id))
  );

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const toggleLayerVisibility = (layerId: string) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const handleStartEditing = () => {
    onStartEditing();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-crd-darkest border-crd-mediumGray/20 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-crd-mediumGray/20">
          <div>
            <h2 className="text-xl font-bold text-crd-white">PSD Preview</h2>
            <p className="text-sm text-crd-lightGray">
              {layers.length} layers • Review before editing
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-crd-darker/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="text-crd-lightGray hover:text-crd-white"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-crd-white min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="text-crd-lightGray hover:text-crd-white"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                className="text-crd-lightGray hover:text-crd-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleStartEditing}
              className="bg-crd-blue hover:bg-crd-lightBlue text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Start Editing
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-crd-lightGray hover:text-crd-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-crd-darker to-crd-darkest overflow-auto">
            <div 
              className="relative bg-white rounded-lg shadow-2xl"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center'
              }}
            >
              <img 
                src={thumbnail} 
                alt="PSD Composite" 
                className="max-w-none rounded-lg"
                style={{ width: '400px', height: '560px' }}
              />
              
              {/* Layer overlay indicators */}
              <div className="absolute inset-0 pointer-events-none">
                {layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`absolute transition-opacity ${
                      visibleLayers.has(layer.id) ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{
                      left: `${(layer.bounds?.x || 0) / 10}%`,
                      top: `${(layer.bounds?.y || 0) / 10}%`,
                      width: `${(layer.bounds?.width || 100) / 10}%`,
                      height: `${(layer.bounds?.height || 100) / 10}%`,
                    }}
                  >
                    <div className="w-full h-full border border-crd-blue/30 bg-crd-blue/5 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Layer List Sidebar */}
          <div className="w-80 bg-crd-darker border-l border-crd-mediumGray/20 flex flex-col">
            <div className="p-4 border-b border-crd-mediumGray/20">
              <h3 className="font-medium text-crd-white">Layers</h3>
              <p className="text-sm text-crd-lightGray">Toggle visibility to preview</p>
            </div>
            
            <div className="flex-1 overflow-auto">
              <div className="p-2 space-y-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-crd-mediumGray/10 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className="p-1 h-8 w-8 text-crd-lightGray hover:text-crd-white"
                    >
                      {visibleLayers.has(layer.id) ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-crd-white truncate">
                        {layer.name}
                      </p>
                      <p className="text-xs text-crd-lightGray">
                        {layer.type} • {Math.round((layer.styleProperties?.opacity || 1) * 100)}% opacity
                      </p>
                    </div>
                    
                    <div className="w-8 h-8 bg-crd-darkest rounded border border-crd-mediumGray/20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-crd-mediumGray/20">
              <div className="text-center">
                <p className="text-sm text-crd-lightGray mb-3">
                  Ready to integrate into your card?
                </p>
                <Button
                  onClick={handleStartEditing}
                  className="w-full bg-crd-blue hover:bg-crd-lightBlue text-white"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Start Editing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

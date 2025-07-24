
import React from 'react';
import { CropArea, DragHandle } from './types';
import { RotateCw, Move, X } from 'lucide-react';

interface StreamlinedCropOverlayProps {
  cropAreas: CropArea[];
  selectedCropIds: string[];
  zoom: number;
  imageLoaded: boolean;
  showGrid: boolean;
  gridSize: number;
  onMouseDown: (e: React.MouseEvent, cropId: string, handle?: DragHandle) => void;
  onCropSelect: (cropId: string, multiSelect?: boolean) => void;
  onRemoveCrop?: (cropId: string) => void;
}

export const StreamlinedCropOverlay: React.FC<StreamlinedCropOverlayProps> = ({
  cropAreas,
  selectedCropIds,
  zoom,
  imageLoaded,
  showGrid,
  gridSize,
  onMouseDown,
  onCropSelect,
  onRemoveCrop
}) => {
  if (!imageLoaded) return null;

  const isSelected = (cropId: string) => selectedCropIds.includes(cropId);

  return (
    <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
      {/* Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Crop Areas */}
      {cropAreas.map((crop) => {
        const selected = isSelected(crop.id);
        const handleSize = 10;
        
        return (
          <div
            key={crop.id}
            className={`absolute border-2 cursor-move transition-all duration-200 ${
              selected ? 'border-4 shadow-lg' : 'border-2 hover:border-4'
            }`}
            style={{
              left: crop.x,
              top: crop.y,
              width: crop.width,
              height: crop.height,
              borderColor: crop.color,
              boxShadow: selected ? `0 0 0 2px ${crop.color}40, 0 4px 12px rgba(0,0,0,0.15)` : 'none',
              transform: `rotate(${crop.rotation}deg)`,
              transformOrigin: 'center',
              borderRadius: crop.cornerRadius || 4,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onCropSelect(crop.id, e.ctrlKey || e.metaKey);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              onMouseDown(e, crop.id, 'move');
            }}
          >
            {/* Label */}
            <div 
              className="absolute -top-8 left-0 text-white text-xs font-medium px-3 py-1 rounded-full pointer-events-none flex items-center gap-2"
              style={{ backgroundColor: crop.color }}
            >
              {crop.label}
              {crop.rotation !== 0 && <span>({crop.rotation}°)</span>}
              {crop.id !== 'main' && onRemoveCrop && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCrop(crop.id);
                  }}
                  className="pointer-events-auto hover:bg-black/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Selection Handles - Only show when selected */}
            {selected && (
              <>
                {/* Corner Handles */}
                {['tl', 'tr', 'bl', 'br'].map((handle) => (
                  <div
                    key={handle}
                    className="absolute border-2 cursor-pointer hover:scale-125 transition-transform bg-white border-gray-600 rounded-sm"
                    style={{
                      width: handleSize,
                      height: handleSize,
                      backgroundColor: crop.color,
                      top: handle.includes('t') ? -handleSize/2 : 'auto',
                      bottom: handle.includes('b') ? -handleSize/2 : 'auto',
                      left: handle.includes('l') ? -handleSize/2 : 'auto',
                      right: handle.includes('r') ? -handleSize/2 : 'auto',
                      cursor: handle === 'tl' || handle === 'br' ? 'nw-resize' : 'ne-resize'
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMouseDown(e, crop.id, handle as DragHandle);
                    }}
                  />
                ))}

                {/* Rotation Handle */}
                <div
                  className="absolute flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-white border-2 border-gray-600 rounded-full"
                  style={{
                    width: handleSize + 2,
                    height: handleSize + 2,
                    backgroundColor: crop.color,
                    top: -handleSize * 2.5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMouseDown(e, crop.id, 'rotate');
                  }}
                >
                  <RotateCw className="w-3 h-3 text-white" />
                </div>

                {/* Move Handle (center) */}
                <div
                  className="absolute flex items-center justify-center cursor-move hover:scale-110 transition-transform bg-white border-2 border-gray-600 rounded"
                  style={{
                    width: handleSize + 4,
                    height: handleSize + 4,
                    backgroundColor: `${crop.color}E6`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMouseDown(e, crop.id, 'move');
                  }}
                >
                  <Move className="w-3 h-3 text-white" />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

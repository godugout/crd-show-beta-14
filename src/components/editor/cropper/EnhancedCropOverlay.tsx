
import React from 'react';
import { CropArea, DragHandle } from './types';
import { RotateCw, Move } from 'lucide-react';

interface EnhancedCropOverlayProps {
  cropAreas: CropArea[];
  selectedCropIds: string[];
  zoom: number;
  imageLoaded: boolean;
  showGrid: boolean;
  gridSize: number;
  onMouseDown: (e: React.MouseEvent, cropId: string, handle?: DragHandle) => void;
  onCropSelect: (cropId: string, multiSelect?: boolean) => void;
}

export const EnhancedCropOverlay: React.FC<EnhancedCropOverlayProps> = ({
  cropAreas,
  selectedCropIds,
  zoom,
  imageLoaded,
  showGrid,
  gridSize,
  onMouseDown,
  onCropSelect
}) => {
  if (!imageLoaded) return null;

  const isSelected = (cropId: string) => selectedCropIds.includes(cropId);
  const isMultiSelected = selectedCropIds.length > 1;

  return (
    <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
      {/* Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Crop Areas */}
      {cropAreas.map((crop) => {
        const selected = isSelected(crop.id);
        const handleSize = 8;
        
        return (
          <div
            key={crop.id}
            className={`absolute border-2 cursor-move transition-all ${selected ? 'border-4' : ''}`}
            style={{
              left: crop.x,
              top: crop.y,
              width: crop.width,
              height: crop.height,
              borderColor: crop.color,
              boxShadow: selected ? `0 0 0 2px ${crop.color}40` : 'none',
              transform: `rotate(${crop.rotation}deg)`,
              transformOrigin: 'center',
              borderRadius: crop.cornerRadius || 0,
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
              className="absolute top-1 left-1 text-white text-xs px-2 py-1 rounded pointer-events-none"
              style={{ backgroundColor: crop.color }}
            >
              {crop.label}
              {crop.rotation !== 0 && <span className="ml-1">({crop.rotation}°)</span>}
            </div>

            {/* Selection Handles */}
            {selected && (
              <>
                {/* Corner Handles */}
                {['tl', 'tr', 'bl', 'br'].map((handle) => (
                  <div
                    key={handle}
                    className="absolute border border-gray-300 cursor-pointer hover:scale-125 transition-transform bg-white"
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

                {/* Edge Handles */}
                {['t', 'r', 'b', 'l'].map((handle) => (
                  <div
                    key={handle}
                    className="absolute bg-white border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      width: handle === 't' || handle === 'b' ? handleSize * 2 : handleSize,
                      height: handle === 'l' || handle === 'r' ? handleSize * 2 : handleSize,
                      backgroundColor: `${crop.color}80`,
                      top: handle === 't' ? -handleSize/2 : handle === 'b' ? 'auto' : '50%',
                      bottom: handle === 'b' ? -handleSize/2 : 'auto',
                      left: handle === 'l' ? -handleSize/2 : handle === 'r' ? 'auto' : '50%',
                      right: handle === 'r' ? -handleSize/2 : 'auto',
                      transform: (handle === 'l' || handle === 'r') ? 'translateY(-50%)' : 'translateX(-50%)',
                      cursor: handle === 't' || handle === 'b' ? 'ns-resize' : 'ew-resize'
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
                  className="absolute flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-white border border-gray-300 rounded-full"
                  style={{
                    width: handleSize + 4,
                    height: handleSize + 4,
                    backgroundColor: crop.color,
                    top: -handleSize * 3,
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
                  className="absolute flex items-center justify-center cursor-move hover:scale-110 transition-transform bg-white border border-gray-300 rounded"
                  style={{
                    width: handleSize + 2,
                    height: handleSize + 2,
                    backgroundColor: `${crop.color}90`,
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

            {/* Multi-selection indicator */}
            {isMultiSelected && selected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{selectedCropIds.indexOf(crop.id) + 1}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

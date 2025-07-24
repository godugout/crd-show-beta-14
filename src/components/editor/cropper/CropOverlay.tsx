
import React from 'react';
import { CropArea } from './types';

interface CropOverlayProps {
  cropAreas: CropArea[];
  zoom: number;
  imageLoaded: boolean;
  onMouseDown: (e: React.MouseEvent, cropId: string, handle?: string) => void;
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropAreas,
  zoom,
  imageLoaded,
  onMouseDown
}) => {
  if (!imageLoaded) return null;

  return (
    <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
      {cropAreas.map((crop) => (
        <div
          key={crop.id}
          className={`absolute border-2 cursor-move ${crop.selected ? 'border-4' : ''}`}
          style={{
            left: crop.x,
            top: crop.y,
            width: crop.width,
            height: crop.height,
            borderColor: crop.color,
            boxShadow: crop.selected ? `0 0 0 2px ${crop.color}40` : 'none',
          }}
          onMouseDown={(e) => onMouseDown(e, crop.id, 'move')}
        >
          {/* Corner handles */}
          {crop.selected && ['tl', 'tr', 'bl', 'br'].map((handle) => (
            <div
              key={handle}
              className="absolute w-3 h-3 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
              style={{
                backgroundColor: crop.color,
                top: handle.includes('t') ? -6 : 'auto',
                bottom: handle.includes('b') ? -6 : 'auto',
                left: handle.includes('l') ? -6 : 'auto',
                right: handle.includes('r') ? -6 : 'auto',
                cursor: handle === 'tl' || handle === 'br' ? 'nw-resize' : 'ne-resize'
              }}
              onMouseDown={(e) => onMouseDown(e, crop.id, handle)}
            />
          ))}
          
          {/* Label */}
          <div 
            className="absolute top-1 left-1 text-white text-xs px-2 py-1 rounded"
            style={{ backgroundColor: crop.color }}
          >
            {crop.label}
          </div>
        </div>
      ))}
    </div>
  );
};

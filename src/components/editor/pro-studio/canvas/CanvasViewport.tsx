import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Layer } from '../ProStudio';

interface CanvasViewportProps {
  layers: Layer[];
  selectedLayers: string[];
  selectedTool: string;
  zoom: number;
  position: { x: number; y: number };
  showGrid: boolean;
  showRulers: boolean;
  onLayersUpdate: (layers: Layer[]) => void;
  onSelectionChange: (layerIds: string[]) => void;
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  layers,
  selectedLayers,
  selectedTool,
  zoom,
  position,
  showGrid,
  showRulers,
  onLayersUpdate,
  onSelectionChange,
  onZoomChange,
  onPositionChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize] = useState({ width: 800, height: 600 }); // Standard card size

  // Handle mouse wheel for zooming
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
      onZoomChange(newZoom);
    }
  }, [zoom, onZoomChange]);

  // Handle mouse events for panning and tool interactions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'hand' || e.button === 1) { // Middle mouse button or hand tool
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [selectedTool, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      onPositionChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Render grid
  const renderGrid = () => {
    if (!showGrid) return null;

    const gridSize = 20 * zoom;
    const lines = [];
    const viewportWidth = canvasRef.current?.clientWidth || 800;
    const viewportHeight = canvasRef.current?.clientHeight || 600;

    // Vertical lines
    for (let x = position.x % gridSize; x < viewportWidth; x += gridSize) {
      lines.push(
        <div
          key={`v-${x}`}
          className="absolute top-0 bottom-0 w-px bg-gray-700/30 pointer-events-none"
          style={{ left: x }}
        />
      );
    }

    // Horizontal lines
    for (let y = position.y % gridSize; y < viewportHeight; y += gridSize) {
      lines.push(
        <div
          key={`h-${y}`}
          className="absolute left-0 right-0 h-px bg-gray-700/30 pointer-events-none"
          style={{ top: y }}
        />
      );
    }

    return <div className="absolute inset-0 pointer-events-none">{lines}</div>;
  };

  // Render rulers
  const renderRulers = () => {
    if (!showRulers) return null;

    return (
      <>
        {/* Horizontal ruler */}
        <div className="absolute top-0 left-6 right-0 h-6 bg-gray-900 border-b border-gray-700 pointer-events-none">
          <div className="relative h-full">
            {Array.from({ length: Math.ceil(800 / 50) }, (_, i) => i * 50).map(x => {
              const screenX = x * zoom + position.x;
              return (
                <div
                  key={x}
                  className="absolute top-0 bottom-0 flex items-end justify-center"
                  style={{ left: screenX }}
                >
                  <div className="w-px h-2 bg-gray-400" />
                  <span className="absolute bottom-0 text-xs text-gray-400 transform -translate-x-1/2">
                    {x}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vertical ruler */}
        <div className="absolute top-6 left-0 bottom-0 w-6 bg-gray-900 border-r border-gray-700 pointer-events-none">
          <div className="relative h-full">
            {Array.from({ length: Math.ceil(600 / 50) }, (_, i) => i * 50).map(y => {
              const screenY = y * zoom + position.y;
              return (
                <div
                  key={y}
                  className="absolute left-0 right-0 flex items-center justify-end"
                  style={{ top: screenY }}
                >
                  <div className="h-px w-2 bg-gray-400" />
                  <span className="absolute right-0 text-xs text-gray-400 transform -translate-y-1/2 rotate-90 origin-center">
                    {y}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corner */}
        <div className="absolute top-0 left-0 w-6 h-6 bg-gray-900 border-r border-b border-gray-700" />
      </>
    );
  };

  // Render layer
  const renderLayer = (layer: Layer) => {
    const isSelected = selectedLayers.includes(layer.id);
    const { transform } = layer;
    
    const layerStyle: React.CSSProperties = {
      transform: `translate(${transform.x * zoom + position.x}px, ${transform.y * zoom + position.y}px) 
                  rotate(${transform.rotation}deg) 
                  scale(${transform.scaleX * zoom}, ${transform.scaleY * zoom})`,
      opacity: layer.opacity / 100,
      visibility: layer.visible ? 'visible' : 'hidden',
      pointerEvents: layer.locked ? 'none' : 'auto'
    };

    let content;
    switch (layer.type) {
      case 'text':
        content = (
          <div
            className="min-w-[100px] min-h-[30px] p-2 bg-transparent border border-dashed border-gray-600 flex items-center justify-center text-white"
            style={layerStyle}
          >
            {layer.data.text || 'Sample Text'}
          </div>
        );
        break;
      case 'shape':
        content = (
          <div
            className="w-24 h-24 bg-blue-500 border border-gray-600"
            style={{
              ...layerStyle,
              borderRadius: layer.data.shape === 'circle' ? '50%' : '0'
            }}
          />
        );
        break;
      case 'image':
        content = (
          <div
            className="w-32 h-32 bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-400"
            style={layerStyle}
          >
            {layer.data.src ? (
              <img src={layer.data.src} alt={layer.name} className="w-full h-full object-cover" />
            ) : (
              'Image'
            )}
          </div>
        );
        break;
      default:
        content = (
          <div
            className="w-24 h-24 bg-gray-600 border border-gray-500"
            style={layerStyle}
          />
        );
    }

    return (
      <motion.div
        key={layer.id}
        className={`absolute cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (selectedTool === 'move' || selectedTool === 'select') {
            onSelectionChange([layer.id]);
          }
        }}
        whileHover={selectedTool === 'move' ? { scale: 1.02 } : {}}
      >
        {content}
        
        {/* Selection outline */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
            {/* Corner handles */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gray-800 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Rulers */}
      {renderRulers()}

      {/* Main canvas area */}
      <div 
        className="absolute bg-gray-700"
        style={{
          left: showRulers ? 24 : 0,
          top: showRulers ? 24 : 0,
          right: 0,
          bottom: 0
        }}
      >
        {/* Grid */}
        {renderGrid()}

        {/* Canvas background */}
        <div
          className="absolute bg-white shadow-lg"
          style={{
            width: canvasSize.width * zoom,
            height: canvasSize.height * zoom,
            left: position.x,
            top: position.y,
            transformOrigin: '0 0'
          }}
        >
          {/* Layers */}
          {layers.map(layer => renderLayer(layer))}
        </div>

        {/* Canvas outline */}
        <div
          className="absolute border-2 border-gray-900 pointer-events-none"
          style={{
            width: canvasSize.width * zoom,
            height: canvasSize.height * zoom,
            left: position.x,
            top: position.y
          }}
        />
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded text-xs text-gray-300">
        {Math.round(zoom * 100)}%
      </div>

      {/* Tool cursor indicator */}
      <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded text-xs text-gray-300">
        Tool: {selectedTool}
      </div>
    </div>
  );
};
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage, Text as FabricText, Group as FabricGroup, Rect as FabricRect } from 'fabric';
import { PSDLayer } from '../import/CRDPSDProcessor';

interface PSDCanvasRendererProps {
  layers: PSDLayer[];
  visibleLayers: Set<string>;
  onLayerSelect?: (layerId: string | null) => void;
  selectedLayer?: string | null;
  className?: string;
}

export const PSDCanvasRenderer: React.FC<PSDCanvasRendererProps> = ({
  layers,
  visibleLayers,
  onLayerSelect,
  selectedLayer,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const layerObjectsRef = useRef<Map<string, any>>(new Map());

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 560, // Standard card ratio
      backgroundColor: '#ffffff',
      selection: false,
      preserveObjectStacking: true
    });

    setFabricCanvas(canvas);

    // Handle object selection
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      if (obj && (obj as any).layerId) {
        onLayerSelect?.((obj as any).layerId);
      }
    });

    canvas.on('selection:cleared', () => {
      onLayerSelect?.(null);
    });

    return () => {
      canvas.dispose();
      setFabricCanvas(null);
    };
  }, [onLayerSelect]);

  // Render layers when data changes
  useEffect(() => {
    if (!fabricCanvas || layers.length === 0) return;

    // Clear existing objects
    fabricCanvas.clear();
    layerObjectsRef.current.clear();

    // Render layers recursively
    renderLayersToCanvas(layers, fabricCanvas).then(() => {
      fabricCanvas.renderAll();
    });
  }, [fabricCanvas, layers, visibleLayers]);

  // Update layer visibility
  useEffect(() => {
    if (!fabricCanvas) return;

    layerObjectsRef.current.forEach((obj, layerId) => {
      const isVisible = visibleLayers.has(layerId);
      obj.set({ visible: isVisible });
    });

    fabricCanvas.renderAll();
  }, [fabricCanvas, visibleLayers]);

  // Update selection highlighting
  useEffect(() => {
    if (!fabricCanvas) return;

    layerObjectsRef.current.forEach((obj, layerId) => {
      const isSelected = layerId === selectedLayer;
      obj.set({
        stroke: isSelected ? '#3b82f6' : undefined,
        strokeWidth: isSelected ? 2 : 0
      });
    });

    fabricCanvas.renderAll();
  }, [fabricCanvas, selectedLayer]);

  const renderLayersToCanvas = async (layerList: PSDLayer[], canvas: FabricCanvas) => {
    for (const layer of layerList) {
      if (layer.children && layer.children.length > 0) {
        // Handle group layers
        const groupObjects: any[] = [];
        for (const childLayer of layer.children) {
          const childObj = await createFabricObject(childLayer);
          if (childObj) {
            groupObjects.push(childObj);
          }
        }

        if (groupObjects.length > 0) {
          const group = new FabricGroup(groupObjects, {
            left: layer.bounds.x,
            top: layer.bounds.y,
            selectable: true
          });
          
          // Add custom properties
          (group as any).layerId = layer.id;
          (group as any).layerName = layer.name;
          
          canvas.add(group);
          layerObjectsRef.current.set(layer.id, group);
        }
      } else {
        // Handle individual layers
        const obj = await createFabricObject(layer);
        if (obj) {
          canvas.add(obj);
          layerObjectsRef.current.set(layer.id, obj);
        }
      }
    }
  };

  const createFabricObject = async (layer: PSDLayer) => {
    const baseProps = {
      left: layer.bounds.x,
      top: layer.bounds.y,
      selectable: true,
      opacity: layer.styleProperties?.opacity || 1
    };

    switch (layer.type) {
      case 'text':
        const textObj = new FabricText(layer.content?.text || '', {
          ...baseProps,
          fontSize: layer.content?.fontSize || 16,
          fontFamily: layer.content?.fontFamily || 'Arial',
          fill: layer.content?.color || '#000000'
        });
        (textObj as any).layerId = layer.id;
        (textObj as any).layerName = layer.name;
        return textObj;

      case 'image':
        if (layer.content?.imageData) {
          try {
            const img = await FabricImage.fromURL(layer.content.imageData, {
              crossOrigin: 'anonymous'
            });
            img.set({
              ...baseProps,
              scaleX: layer.bounds.width / (img.width || 1),
              scaleY: layer.bounds.height / (img.height || 1)
            });
            (img as any).layerId = layer.id;
            (img as any).layerName = layer.name;
            return img;
          } catch (error) {
            console.error('Failed to load image:', error);
            return null;
          }
        }
        break;

      case 'shape':
        // Create a simple rectangle for shapes
        const rectObj = new FabricRect({
          ...baseProps,
          width: layer.bounds.width,
          height: layer.bounds.height,
          fill: '#cccccc',
          stroke: '#999999',
          strokeWidth: 1
        });
        (rectObj as any).layerId = layer.id;
        (rectObj as any).layerName = layer.name;
        return rectObj;

      default:
        return null;
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
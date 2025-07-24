import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage, Text as FabricText, Group as FabricGroup, Rect as FabricRect } from 'fabric';
import { PSDLayer } from '../import/CRDPSDProcessor';

interface PSDCanvasIntegrationProps {
  layers: PSDLayer[];
  visibleLayers: Set<string>;
  targetCanvas: FabricCanvas | null;
}

export const PSDCanvasIntegration: React.FC<PSDCanvasIntegrationProps> = ({
  layers,
  visibleLayers,
  targetCanvas
}) => {
  const processedLayersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!targetCanvas || layers.length === 0) return;

    // Clear existing PSD objects
    const objects = targetCanvas.getObjects();
    objects.forEach(obj => {
      if ((obj as any).isPSDLayer) {
        targetCanvas.remove(obj);
      }
    });

    // Process and add new layers
    processLayersToCanvas(layers, targetCanvas, visibleLayers);
    targetCanvas.renderAll();

    return () => {
      // Cleanup on unmount
      processedLayersRef.current.clear();
    };
  }, [targetCanvas, layers, visibleLayers]);

  const processLayersToCanvas = async (layerList: PSDLayer[], canvas: FabricCanvas, visible: Set<string>) => {
    for (const layer of layerList) {
      if (!visible.has(layer.id)) continue;

      try {
        const fabricObject = await createFabricObjectFromLayer(layer);
        if (fabricObject) {
          // Mark as PSD layer for identification
          (fabricObject as any).isPSDLayer = true;
          (fabricObject as any).layerId = layer.id;
          (fabricObject as any).layerName = layer.name;
          
          canvas.add(fabricObject);
          processedLayersRef.current.set(layer.id, fabricObject);
        }
      } catch (error) {
        console.error(`Failed to process layer ${layer.name}:`, error);
      }

      // Process child layers recursively
      if (layer.children && layer.children.length > 0) {
        await processLayersToCanvas(layer.children, canvas, visible);
      }
    }
  };

  const createFabricObjectFromLayer = async (layer: PSDLayer): Promise<any | null> => {
    const baseProps = {
      left: layer.bounds.x,
      top: layer.bounds.y,
      selectable: true,
      opacity: layer.styleProperties?.opacity || 1
    };

    switch (layer.type) {
      case 'text':
        return new FabricText(layer.content?.text || '', {
          ...baseProps,
          fontSize: layer.content?.fontSize || 16,
          fontFamily: layer.content?.fontFamily || 'Arial',
          fill: layer.content?.color || '#000000'
        });

      case 'image':
        if (layer.content?.imageData) {
          return new Promise<FabricImage>((resolve, reject) => {
            FabricImage.fromURL(layer.content.imageData, {
              crossOrigin: 'anonymous'
            }).then((img) => {
              img.set({
                ...baseProps,
                scaleX: layer.bounds.width / (img.width || 1),
                scaleY: layer.bounds.height / (img.height || 1)
              });
              resolve(img);
            }).catch(reject);
          });
        }
        break;

      case 'shape':
        return new FabricRect({
          ...baseProps,
          width: layer.bounds.width,
          height: layer.bounds.height,
          fill: 'rgba(200, 200, 200, 0.5)',
          stroke: '#999999',
          strokeWidth: 1
        });

      case 'group':
        if (layer.children && layer.children.length > 0) {
          const groupObjects: any[] = [];
          for (const childLayer of layer.children) {
            const childObj = await createFabricObjectFromLayer(childLayer);
            if (childObj) {
              groupObjects.push(childObj);
            }
          }

          if (groupObjects.length > 0) {
            return new FabricGroup(groupObjects, {
              ...baseProps
            });
          }
        }
        break;

      default:
        return null;
    }

    return null;
  };

  // This component doesn't render anything visible
  return null;
};

export default PSDCanvasIntegration;
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { PSDLayer } from '../import/CRDPSDProcessor';
import { PSDCanvasIntegration } from './PSDCanvasIntegration';

interface PSDFabricCanvasProps {
  layers: PSDLayer[];
  visibleLayers: Set<string>;
  thumbnail?: string;
  onLayerSelect?: (layerId: string | null) => void;
  selectedLayer?: string | null;
}

export const PSDFabricCanvas: React.FC<PSDFabricCanvasProps> = ({
  layers,
  visibleLayers,
  thumbnail,
  onLayerSelect,
  selectedLayer
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('🎨 Initializing PSD Fabric Canvas...');
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 320,
      height: 420,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    // Set up selection handlers
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      if (obj && (obj as any).layerId) {
        onLayerSelect?.((obj as any).layerId);
      }
    });

    canvas.on('selection:cleared', () => {
      onLayerSelect?.(null);
    });

    setFabricCanvas(canvas);
    console.log('✅ PSD Fabric Canvas initialized');

    return () => {
      canvas.dispose();
    };
  }, [onLayerSelect]);

  // Handle layer processing
  useEffect(() => {
    if (layers.length > 0 && fabricCanvas) {
      setIsLoading(true);
      console.log(`🔄 Processing ${layers.length} PSD layers...`);
      console.log(`👁️ Visible layers: ${Array.from(visibleLayers).join(', ')}`);
      
      // Small delay to show loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [layers, fabricCanvas, visibleLayers]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-crd-darkest">
      {isLoading && (
        <div className="absolute inset-0 bg-crd-darker/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center space-y-2">
            <div className="animate-spin w-6 h-6 border-2 border-crd-orange border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-crd-text-secondary">Processing layers...</p>
          </div>
        </div>
      )}

      <div className="relative border border-crd-border rounded-lg overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="max-w-full max-h-full" />
        
        {/* PSD Integration Component */}
        {fabricCanvas && (
          <PSDCanvasIntegration
            layers={layers}
            visibleLayers={visibleLayers}
            targetCanvas={fabricCanvas}
          />
        )}
      </div>

      {/* Layer count info */}
      {layers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-crd-darker/80 backdrop-blur-sm px-3 py-1 rounded text-xs text-crd-text-secondary">
          {Array.from(visibleLayers).length} of {layers.length} layers visible
        </div>
      )}
    </div>
  );
};
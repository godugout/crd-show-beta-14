import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { ArrowLeft, Eye, EyeOff, Layers, Download } from 'lucide-react';
import { crdDataService } from '@/services/crdDataService';
import { toast } from 'sonner';
import type { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';

interface LayerState {
  layer: PSDLayer;
  visible: boolean;
}

export const CRDMKRPSDReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [layers, setLayers] = useState<LayerState[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingFrame, setIsCreatingFrame] = useState(false);

  // Load PSD data from location state or from storage
  useEffect(() => {
    const loadPSDData = async () => {
      try {
        let psdData = location.state?.psdData;
        
        if (!psdData) {
          // Try to load from crdDataService if not in location state
          const sessionData = await crdDataService.getSession('current_psd_upload');
          if (sessionData) {
            psdData = sessionData;
          }
        }

        if (!psdData || !psdData.layers) {
          toast.error('No PSD data found. Please upload a file first.');
          navigate('/');
          return;
        }

        setFileName(psdData.fileName || 'Untitled');
        setLayers(psdData.layers.map((layer: PSDLayer) => ({
          layer,
          visible: true // All layers visible by default
        })));
      } catch (error) {
        console.error('Error loading PSD data:', error);
        toast.error('Failed to load PSD data');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadPSDData();
  }, [location.state, navigate]);

  // Update canvas when layers change
  useEffect(() => {
    updateCanvas();
  }, [layers]);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || layers.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on the largest layer dimensions
    let maxWidth = 800;
    let maxHeight = 600;
    
    layers.forEach(({ layer }) => {
      maxWidth = Math.max(maxWidth, layer.bounds.width);
      maxHeight = Math.max(maxHeight, layer.bounds.height);
    });

    canvas.width = maxWidth;
    canvas.height = maxHeight;

    // Clear canvas
    ctx.clearRect(0, 0, maxWidth, maxHeight);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, maxWidth, maxHeight);

    // Draw visible layers
    const visibleLayers = layers.filter(({ visible }) => visible);
    
    visibleLayers.forEach(({ layer }) => {
      if (layer.imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(
            img,
            layer.bounds.x,
            layer.bounds.y,
            layer.bounds.width,
            layer.bounds.height
          );
        };
        img.src = layer.imageUrl;
      }
    });
  };

  const toggleLayerVisibility = (index: number) => {
    setLayers(prev => prev.map((layerState, i) => 
      i === index 
        ? { ...layerState, visible: !layerState.visible }
        : layerState
    ));
  };

  const handleCreateFrame = async () => {
    setIsCreatingFrame(true);
    
    try {
      const visibleLayers = layers.filter(({ visible }) => visible);
      
      if (visibleLayers.length === 0) {
        toast.error('Please select at least one layer to create a frame');
        return;
      }

      // Save frame configuration to crdDataService
      const frameData = {
        id: `frame_${Date.now()}`,
        name: `${fileName} Frame`,
        layers: visibleLayers.map(({ layer }) => ({
          id: layer.id,
          name: layer.name,
          imageUrl: layer.imageUrl,
          bounds: layer.bounds,
          visible: true
        })),
        createdAt: new Date().toISOString()
      };

      await crdDataService.setCached(`frame_${frameData.id}`, frameData);
      
      toast.success('Frame created successfully!');
      navigate('/cards/create', { 
        state: { 
          frameData,
          fromPSDReview: true 
        }
      });
    } catch (error) {
      console.error('Error creating frame:', error);
      toast.error('Failed to create frame');
    } finally {
      setIsCreatingFrame(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-crd-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading PSD data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Layer List */}
        <div className="w-80 bg-crd-darker border-r border-crd-mediumGray flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-crd-mediumGray">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoBack}
                className="border-crd-mediumGray text-white hover:bg-crd-mediumGray"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-white font-semibold text-lg">{fileName}</h1>
                <p className="text-crd-lightGray text-sm">PSD Review</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-crd-lightGray">
              <Layers className="w-4 h-4" />
              <span>{layers.length} layers</span>
              <span>•</span>
              <span>{layers.filter(({ visible }) => visible).length} visible</span>
            </div>
          </div>

          {/* Layer List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {layers.map((layerState, index) => (
                <Card 
                  key={layerState.layer.id} 
                  className={`p-3 bg-crd-darkGray border-crd-mediumGray/30 transition-all ${
                    layerState.visible ? 'border-crd-green/30' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Layer Thumbnail */}
                    <div className="w-12 h-12 bg-crd-mediumGray/30 rounded border border-crd-mediumGray/50 flex items-center justify-center overflow-hidden">
                      {layerState.layer.imageUrl ? (
                        <img 
                          src={layerState.layer.imageUrl} 
                          alt={layerState.layer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Layers className="w-6 h-6 text-crd-mediumGray" />
                      )}
                    </div>

                    {/* Layer Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm truncate">
                        {layerState.layer.name}
                      </h3>
                      <p className="text-crd-lightGray text-xs">
                        {layerState.layer.bounds.width} × {layerState.layer.bounds.height}
                      </p>
                    </div>

                    {/* Visibility Toggle */}
                    <Toggle
                      pressed={layerState.visible}
                      onPressedChange={() => toggleLayerVisibility(index)}
                      size="sm"
                      className="data-[state=on]:bg-crd-green data-[state=on]:text-white"
                    >
                      {layerState.visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Toggle>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-crd-mediumGray">
            <Button
              onClick={handleCreateFrame}
              disabled={isCreatingFrame || layers.filter(({ visible }) => visible).length === 0}
              className="w-full bg-crd-primary hover:bg-crd-primary/90 text-white"
            >
              {isCreatingFrame ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating Frame...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Create Frame
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 bg-crd-darkest p-6 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-white text-xl font-semibold mb-2">Live Preview</h2>
              <p className="text-crd-lightGray text-sm">
                Toggle layers on the left to see the composite result
              </p>
            </div>

            <div className="flex-1 bg-white rounded-lg border border-crd-mediumGray/30 overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRDMKRPSDReviewPage;
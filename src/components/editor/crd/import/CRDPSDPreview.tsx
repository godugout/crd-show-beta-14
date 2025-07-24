import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDButton } from '@/components/ui/design-system/Button';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Type, 
  Image, 
  Square, 
  Folder,
  Wand2,
  Download,
  Play
} from 'lucide-react';
import { PSDLayer, GeneratedFrame } from './CRDPSDProcessor';

interface CRDPSDPreviewProps {
  layers: PSDLayer[];
  generatedFrames: GeneratedFrame[];
  onGenerateCard: (frameData: any) => void;
  onUseFrame: (frameData: any) => void;
}

export const CRDPSDPreview: React.FC<CRDPSDPreviewProps> = ({
  layers,
  generatedFrames,
  onGenerateCard,
  onUseFrame
}) => {
  const [selectedFrame, setSelectedFrame] = useState<GeneratedFrame | null>(
    generatedFrames[0] || null
  );
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(layers.filter(l => l.visible).map(l => l.id))
  );

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'image': return Image;
      case 'group': return Folder;
      case 'shape': return Square;
      default: return Layers;
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    const newVisible = new Set(visibleLayers);
    if (newVisible.has(layerId)) {
      newVisible.delete(layerId);
    } else {
      newVisible.add(layerId);
    }
    setVisibleLayers(newVisible);
  };

  const renderLayerTree = (layerList: PSDLayer[], depth = 0) => {
    return layerList.map((layer) => {
      const Icon = getLayerIcon(layer.type);
      const isVisible = visibleLayers.has(layer.id);
      
      return (
        <div key={layer.id} className="space-y-1">
          <div 
            className="flex items-center gap-2 p-2 rounded hover:bg-crd-mediumGray/20 group"
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            <button
              onClick={() => toggleLayerVisibility(layer.id)}
              className="text-crd-lightGray hover:text-crd-white"
            >
              {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
            
            <Icon className="w-3 h-3 text-crd-lightGray" />
            
            <span className="text-crd-white text-xs flex-1 truncate">
              {layer.name}
            </span>
            
            <Badge 
              variant="outline" 
              className="text-xs px-1 py-0 border-crd-mediumGray/50 text-crd-lightGray"
            >
              {layer.type}
            </Badge>
          </div>
          
          {layer.children && layer.children.length > 0 && (
            <div className="ml-2">
              {renderLayerTree(layer.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Extracted Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="frames" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-crd-darkGray/50">
              <TabsTrigger value="frames" className="text-xs">Generated Frames</TabsTrigger>
              <TabsTrigger value="layers" className="text-xs">Layer Structure</TabsTrigger>
            </TabsList>
            
            <TabsContent value="frames" className="mt-4 space-y-3">
              {generatedFrames.length === 0 ? (
                <p className="text-crd-lightGray text-xs text-center py-4">
                  No frames were generated from this PSD
                </p>
              ) : (
                generatedFrames.map((frame) => (
                  <div
                    key={frame.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFrame?.id === frame.id
                        ? 'border-crd-blue bg-crd-blue/10'
                        : 'border-crd-mediumGray/30 hover:border-crd-blue/50 hover:bg-crd-mediumGray/10'
                    }`}
                    onClick={() => setSelectedFrame(frame)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-crd-white text-sm font-medium">
                          {frame.name}
                        </h4>
                        <p className="text-crd-lightGray text-xs">
                          {Object.keys(frame.layerMapping).length} layers mapped
                        </p>
                      </div>
                      
                      {frame.autoGenerated && (
                        <Badge variant="outline" className="text-xs border-crd-blue/50 text-crd-blue">
                          <Wand2 className="w-3 h-3 mr-1" />
                          Auto
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <CRDButton
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUseFrame(frame);
                        }}
                        className="flex-1 text-xs"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Use Frame
                      </CRDButton>
                      
                      <CRDButton
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateCard(frame);
                        }}
                        className="flex-1 text-xs bg-crd-blue hover:bg-crd-blue/80"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Generate Card
                      </CRDButton>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="layers" className="mt-4">
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {layers.length === 0 ? (
                  <p className="text-crd-lightGray text-xs text-center py-4">
                    No layers found in this PSD
                  </p>
                ) : (
                  renderLayerTree(layers)
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-crd-mediumGray/30">
                <p className="text-crd-lightGray text-xs">
                  {layers.length} total layers • {visibleLayers.size} visible
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedFrame && (
        <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-sm">
              Frame Preview: {selectedFrame.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-crd-darkGray/50 p-3 rounded-lg">
              <h5 className="text-crd-white text-xs font-medium mb-2">Frame Configuration</h5>
              <pre className="text-crd-lightGray text-xs overflow-x-auto">
                {JSON.stringify(selectedFrame.frameConfig, null, 2)}
              </pre>
            </div>
            
            <div className="flex gap-2">
              <CRDButton
                variant="outline"
                onClick={() => onUseFrame(selectedFrame)}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Apply to Editor
              </CRDButton>
              
              <CRDButton
                variant="default"
                onClick={() => onGenerateCard(selectedFrame)}
                className="flex-1 bg-crd-blue hover:bg-crd-blue/80"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Card Now
              </CRDButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
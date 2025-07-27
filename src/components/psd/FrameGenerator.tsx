import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowRight,
    CheckCircle,
    Crown,
    Download,
    Eye,
    Sparkles,
    Star
} from 'lucide-react';
import React, { useState } from 'react';

interface Frame {
  id: string;
  name: string;
  preview: string;
  layers: string[];
  style?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

interface FrameGeneratorProps {
  frames: Frame[];
  onExportFrame: (frameId: string) => void;
}

export const FrameGenerator: React.FC<FrameGeneratorProps> = ({
  frames,
  onExportFrame
}) => {
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [previewFrame, setPreviewFrame] = useState<string | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black';
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <Crown className="w-4 h-4" />;
      case 'epic':
        return <Star className="w-4 h-4" />;
      case 'rare':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const renderFrameCard = (frame: Frame) => {
    const isSelected = selectedFrame === frame.id;
    const isPreview = previewFrame === frame.id;

    return (
      <Card 
        key={frame.id}
        className={`cursor-pointer transition-all hover:scale-105 ${
          isSelected 
            ? 'ring-2 ring-crd-green bg-crd-green/10' 
            : 'bg-crd-darker border-crd-mediumGray/30 hover:bg-crd-mediumGray/20'
        }`}
        onClick={() => setSelectedFrame(frame.id)}
        onMouseEnter={() => setPreviewFrame(frame.id)}
        onMouseLeave={() => setPreviewFrame(null)}
      >
        <CardContent className="p-4">
          {/* Frame Preview */}
          <div className="aspect-[5/7] rounded-lg overflow-hidden mb-3 bg-crd-darkGray relative">
            {frame.preview ? (
              <img 
                src={frame.preview} 
                alt={frame.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-crd-blue to-crd-purple rounded mx-auto mb-2" />
                  <p className="text-xs text-crd-mediumGray">Preview</p>
                </div>
              </div>
            )}
            
            {/* Rarity Badge */}
            {frame.rarity && (
              <div className="absolute top-2 right-2">
                <Badge className={getRarityColor(frame.rarity)}>
                  {getRarityIcon(frame.rarity)}
                  <span className="ml-1 capitalize text-xs">{frame.rarity}</span>
                </Badge>
              </div>
            )}

            {/* Preview Overlay */}
            {isPreview && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          {/* Frame Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-crd-white text-sm truncate">{frame.name}</h3>
              {isSelected && (
                <CheckCircle className="w-4 h-4 text-crd-green" />
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-crd-lightGray">{frame.layers.length} layers</span>
              {frame.style && (
                <Badge variant="outline" className="bg-crd-mediumGray/20 text-crd-lightGray">
                  {frame.style}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFrameDetails = () => {
    const frame = frames.find(f => f.id === selectedFrame);
    if (!frame) return null;

    return (
      <Card className="bg-crd-darker border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center justify-between">
            <span>{frame.name}</span>
            {frame.rarity && (
              <Badge className={getRarityColor(frame.rarity)}>
                {getRarityIcon(frame.rarity)}
                <span className="ml-1 capitalize">{frame.rarity}</span>
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Frame Preview */}
          <div className="aspect-[5/7] rounded-lg overflow-hidden bg-crd-darkGray">
            {frame.preview ? (
              <img 
                src={frame.preview} 
                alt={frame.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-crd-blue to-crd-purple rounded mx-auto mb-2" />
                  <p className="text-crd-mediumGray">Preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Frame Properties */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-crd-lightGray">Layers:</span>
                <span className="text-crd-white ml-2">{frame.layers.length}</span>
              </div>
              <div>
                <span className="text-crd-lightGray">Style:</span>
                <span className="text-crd-white ml-2">{frame.style || 'Custom'}</span>
              </div>
            </div>

            {/* Layer List */}
            <div>
              <h4 className="text-crd-white font-medium mb-2">Included Layers:</h4>
              <div className="space-y-1">
                {frame.layers.map((layerId, index) => (
                  <div key={layerId} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-crd-green rounded-full" />
                    <span className="text-crd-lightGray">Layer {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={() => onExportFrame(frame.id)}
            className="w-full bg-crd-blue hover:bg-crd-lightBlue text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as CRD Template
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (frames.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-crd-white mb-2">No Frames Generated</h3>
        <p className="text-crd-lightGray">
          Generate frame variations from your selected layers to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Frame Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frames.map(renderFrameCard)}
      </div>

      {/* Frame Details */}
      {selectedFrame && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-crd-white mb-4">Frame Details</h3>
          {renderFrameDetails()}
        </div>
      )}

      {/* Export All */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={() => {
            frames.forEach(frame => onExportFrame(frame.id));
          }}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Download className="w-4 h-4 mr-2" />
          Export All Frames
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}; 
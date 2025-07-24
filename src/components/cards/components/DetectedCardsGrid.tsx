
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Crop, RotateCw } from 'lucide-react';
import type { CardDetectionResult } from '@/services/cardDetection';

interface DetectedCardsGridProps {
  results: CardDetectionResult[];
  onStartOver: () => void;
  onAdvancedCrop?: (imageUrl: string) => void;
}

export const DetectedCardsGrid: React.FC<DetectedCardsGridProps> = ({
  results,
  onStartOver,
  onAdvancedCrop
}) => {
  const totalCards = results.reduce((sum, result) => sum + result.detectedCards.length, 0);

  // Convert File objects to object URLs for display
  const resultsWithUrls = useMemo(() => {
    return results.map(result => ({
      ...result,
      originalImageUrl: result.originalImage instanceof File 
        ? URL.createObjectURL(result.originalImage)
        : result.originalImage
    }));
  }, [results]);

  const handleDownloadAll = () => {
    results.forEach((result, resultIndex) => {
      result.detectedCards.forEach((card, index) => {
        const link = document.createElement('a');
        link.href = card.croppedImageUrl;
        link.download = `detected-card-${resultIndex}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  };

  const handleAdvancedCrop = (result: CardDetectionResult, index: number) => {
    if (onAdvancedCrop) {
      const imageUrl = resultsWithUrls[index].originalImageUrl;
      onAdvancedCrop(imageUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Cards Detected</h2>
          <p className="text-crd-lightGray">
            Found {totalCards} card{totalCards !== 1 ? 's' : ''} across {results.length} image{results.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleDownloadAll}
            className="bg-crd-blue hover:bg-crd-blue/90 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
          <Button
            onClick={onStartOver}
            variant="outline"
            className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-8">
        {results.map((result, resultIndex) => (
          <div key={`result-${resultIndex}`} className="space-y-4">
            {/* Source Image Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={resultsWithUrls[resultIndex].originalImageUrl}
                  alt="Source"
                  className="w-16 h-16 object-cover rounded-lg border border-crd-mediumGray"
                />
                <div>
                  <h3 className="text-white font-semibold">Source Image</h3>
                  <p className="text-crd-lightGray text-sm">
                    {result.detectedCards.length} card{result.detectedCards.length !== 1 ? 's' : ''} detected
                  </p>
                </div>
              </div>
              {onAdvancedCrop && (
                <Button
                  onClick={() => handleAdvancedCrop(result, resultIndex)}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Crop className="w-4 h-4 mr-2" />
                  Advanced Crop
                </Button>
              )}
            </div>

            {/* Detected Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {result.detectedCards.map((card, index) => (
                <Card key={index} className="bg-crd-darkGray border-crd-mediumGray/30 overflow-hidden group hover:border-crd-blue/50 transition-all">
                  <div className="aspect-[2.5/3.5] relative">
                    <img
                      src={card.croppedImageUrl}
                      alt={`Detected card ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        onClick={() => window.open(card.croppedImageUrl, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = card.croppedImageUrl;
                          link.download = `detected-card-${resultIndex}-${index + 1}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Card Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">
                        Card {index + 1}
                      </span>
                      <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                        {Math.round(card.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

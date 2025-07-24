import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Eye, 
  Download, 
  RefreshCw, 
  Zap,
  Frame,
  Palette,
  Layout
} from 'lucide-react';
import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';

interface FrameSuggestion {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'sport' | 'gaming' | 'art' | 'business';
  confidence: number;
  features: string[];
}

interface PSDFrameSuggestionsProps {
  layers: PSDLayer[];
  onFrameSelect: (frameId: string) => void;
  onPreviewFrame: (frameId: string) => void;
  onGenerateMore: () => void;
  selectedFrame?: string;
}

export const PSDFrameSuggestions: React.FC<PSDFrameSuggestionsProps> = ({
  layers,
  onFrameSelect,
  onPreviewFrame,
  onGenerateMore,
  selectedFrame
}) => {
  const [suggestions, setSuggestions] = useState<FrameSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate smart suggestions based on PSD analysis
  useEffect(() => {
    const generateSuggestions = () => {
      // Analyze PSD layers to suggest appropriate frames
      const textLayers = layers.filter(layer => layer.type === 'text').length;
      const imageLayers = layers.filter(layer => layer.type === 'image').length;
      const shapeLayers = layers.filter(layer => layer.type === 'shape').length;

      const baseSuggestions: FrameSuggestion[] = [
        {
          id: 'modern-portrait',
          name: 'Modern Portrait',
          description: 'Clean layout perfect for character cards',
          preview: '/api/placeholder/200/280',
          category: 'art',
          confidence: 95,
          features: ['Portrait Focus', 'Clean Typography', 'Color Harmony']
        },
        {
          id: 'sports-hero',
          name: 'Sports Hero',
          description: 'Dynamic frame for athlete cards',
          preview: '/api/placeholder/200/280',
          category: 'sport',
          confidence: 87,
          features: ['Action Ready', 'Stats Display', 'Team Colors']
        },
        {
          id: 'gaming-legend',
          name: 'Gaming Legend',
          description: 'Epic frame for gaming characters',
          preview: '/api/placeholder/200/280',
          category: 'gaming',
          confidence: 92,
          features: ['RGB Effects', 'Power Stats', 'Legendary Feel']
        },
        {
          id: 'business-pro',
          name: 'Business Pro',
          description: 'Professional layout for corporate cards',
          preview: '/api/placeholder/200/280',
          category: 'business',
          confidence: 78,
          features: ['Corporate Style', 'Info Panels', 'Premium Look']
        }
      ];

      // Adjust confidence based on layer analysis
      const adjustedSuggestions = baseSuggestions.map(suggestion => {
        let confidence = suggestion.confidence;
        
        // Boost confidence based on layer content
        if (suggestion.category === 'art' && imageLayers > 0) confidence += 10;
        if (suggestion.category === 'sport' && textLayers > 2) confidence += 8;
        if (suggestion.category === 'gaming' && shapeLayers > 3) confidence += 12;
        
        return { ...suggestion, confidence: Math.min(confidence, 99) };
      });

      // Sort by confidence
      setSuggestions(adjustedSuggestions.sort((a, b) => b.confidence - a.confidence));
    };

    generateSuggestions();
  }, [layers]);

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add new suggestions
    const newSuggestions: FrameSuggestion[] = [
      {
        id: 'retro-classic',
        name: 'Retro Classic',
        description: 'Vintage-inspired design',
        preview: '/api/placeholder/200/280',
        category: 'art',
        confidence: 84,
        features: ['Vintage Style', 'Warm Colors', 'Classic Typography']
      },
      {
        id: 'cyber-punk',
        name: 'Cyber Punk',
        description: 'Futuristic neon aesthetic',
        preview: '/api/placeholder/200/280',
        category: 'gaming',
        confidence: 89,
        features: ['Neon Accents', 'Futuristic UI', 'Tech Elements']
      }
    ];

    setSuggestions(prev => [...prev, ...newSuggestions]);
    setIsGenerating(false);
    onGenerateMore();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sport': return '⚽';
      case 'gaming': return '🎮';
      case 'art': return '🎨';
      case 'business': return '💼';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sport': return 'bg-green-500/20 text-green-400';
      case 'gaming': return 'bg-purple-500/20 text-purple-400';
      case 'art': return 'bg-pink-500/20 text-pink-400';
      case 'business': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-crd-darker border-crd-mediumGray/20 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-crd-white flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-crd-blue" />
          Smart Frames
        </CardTitle>
        <p className="text-sm text-crd-lightGray">
          AI-suggested frames based on your PSD content
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col p-4 pt-0">
        {/* Frame Grid */}
        <div className="flex-1 overflow-auto space-y-4 min-h-0">
          {suggestions.map((suggestion) => {
            const isSelected = selectedFrame === suggestion.id;
            
            return (
              <div
                key={suggestion.id}
                className={`
                  relative group rounded-lg border transition-all cursor-pointer
                  ${isSelected 
                    ? 'border-crd-blue bg-crd-blue/5' 
                    : 'border-crd-mediumGray/20 hover:border-crd-blue/40 hover:bg-crd-mediumGray/5'
                  }
                `}
                onClick={() => onFrameSelect(suggestion.id)}
              >
                {/* Preview Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={suggestion.preview} 
                    alt={suggestion.name}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Confidence Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      className={`${getCategoryColor(suggestion.category)} border-0`}
                    >
                      {suggestion.confidence}% match
                    </Badge>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewFrame(suggestion.id);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFrameSelect(suggestion.id);
                      }}
                      className="bg-crd-blue hover:bg-crd-lightBlue text-white border-0"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                    <h3 className="font-medium text-crd-white">{suggestion.name}</h3>
                  </div>
                  
                  <p className="text-sm text-crd-lightGray mb-3">
                    {suggestion.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {suggestion.features.map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="outline" 
                        className="text-xs text-crd-lightGray border-crd-mediumGray/30"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generate More Button */}
        <div className="mt-4 pt-4 border-t border-crd-mediumGray/20">
          <Button
            onClick={handleGenerateMore}
            disabled={isGenerating}
            variant="outline"
            className="w-full border-crd-blue text-crd-blue hover:bg-crd-blue hover:text-white"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate More
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
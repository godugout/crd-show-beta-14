import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    RefreshCw,
    Sparkles,
    TrendingUp,
    Wand2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AISuggestion {
  id: string;
  type: 'color' | 'effect' | 'layout' | 'style';
  title: string;
  description: string;
  confidence: number;
  preview?: string;
  tags: string[];
}

interface AIDesignAssistantProps {
  cardTitle?: string;
  cardDescription?: string;
  cardImage?: string;
  onSuggestionApply: (suggestion: AISuggestion) => void;
  className?: string;
}

export const AIDesignAssistant: React.FC<AIDesignAssistantProps> = ({
  cardTitle,
  cardDescription,
  cardImage,
  onSuggestionApply,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'color' | 'effect' | 'layout' | 'style'>('all');

  // AI-powered suggestion generation
  const generateSuggestions = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockSuggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'color',
        title: 'Dynamic Gradient',
        description: 'Based on your card content, a vibrant gradient would create visual impact',
        confidence: 0.92,
        tags: ['vibrant', 'modern', 'eye-catching']
      },
      {
        id: '2',
        type: 'effect',
        title: 'Holographic Finish',
        description: 'Perfect for premium cards with metallic accents',
        confidence: 0.88,
        tags: ['premium', 'metallic', 'luxury']
      },
      {
        id: '3',
        type: 'layout',
        title: 'Asymmetric Composition',
        description: 'Creates dynamic visual flow and modern appeal',
        confidence: 0.85,
        tags: ['dynamic', 'modern', 'balanced']
      },
      {
        id: '4',
        type: 'style',
        title: 'Minimalist Elegance',
        description: 'Clean lines and subtle effects for sophisticated cards',
        confidence: 0.78,
        tags: ['clean', 'elegant', 'sophisticated']
      },
      {
        id: '5',
        type: 'color',
        title: 'Neon Accents',
        description: 'Bold neon colors for high-energy, futuristic cards',
        confidence: 0.82,
        tags: ['bold', 'futuristic', 'energetic']
      },
      {
        id: '6',
        type: 'effect',
        title: 'Particle Animation',
        description: 'Subtle floating particles for magical card effects',
        confidence: 0.79,
        tags: ['magical', 'animated', 'subtle']
      }
    ];
    
    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);
    toast.success('AI analysis complete! 🎨');
  };

  // Filter suggestions by category
  const filteredSuggestions = suggestions.filter(suggestion => 
    selectedCategory === 'all' || suggestion.type === selectedCategory
  );

  // Apply suggestion
  const handleApplySuggestion = (suggestion: AISuggestion) => {
    onSuggestionApply(suggestion);
    toast.success(`Applied: ${suggestion.title} ✨`);
  };

  // Auto-analyze when card content changes
  useEffect(() => {
    if (cardTitle || cardDescription || cardImage) {
      generateSuggestions();
    }
  }, [cardTitle, cardDescription, cardImage]);

  return (
    <Card className={`bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white text-lg flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-crd-green" />
          AI Design Assistant
          {isAnalyzing && (
            <Badge variant="secondary" className="ml-2">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Analyzing...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-5 bg-crd-darkest/50">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="color" className="text-xs">Colors</TabsTrigger>
            <TabsTrigger value="effect" className="text-xs">Effects</TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-3 bg-crd-darkest/60 border border-crd-mediumGray/30 rounded-lg hover:border-crd-green/50 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-crd-white font-medium text-sm">
                      {suggestion.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-crd-green/30 text-crd-green"
                    >
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                  
                  <p className="text-crd-lightGray text-xs mb-3">
                    {suggestion.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {suggestion.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="text-xs bg-crd-mediumGray/20 text-crd-lightGray"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity border-crd-green/30 text-crd-green hover:bg-crd-green/10"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-crd-mediumGray/20">
          <Button
            variant="outline"
            size="sm"
            onClick={generateSuggestions}
            disabled={isAnalyzing}
            className="flex-1 border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh Suggestions'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-crd-green/30 text-crd-green hover:bg-crd-green/10"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 
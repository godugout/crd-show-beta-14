
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Crown, 
  Gem, 
  Star,
  Sparkles,
  Filter,
  Grid,
  List
} from 'lucide-react';

interface TemplateSelectionSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
  onPrevious: () => void;
}

export const TemplateSelectionSection: React.FC<TemplateSelectionSectionProps> = ({
  cardEditor,
  onNext,
  onPrevious
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Mock data until useFrames hook is available
  const frames = [
    {
      id: 'classic-gold',
      name: 'Classic Gold',
      description: 'Traditional gold-bordered frame',
      price: 0,
      sales_count: 1234,
      rating: 4.8,
      preview_images: [],
      template_data: { border: 'gold', style: 'classic' }
    },
    {
      id: 'holographic',
      name: 'Holographic',
      description: 'Shimmering holographic effect',
      price: 5,
      sales_count: 567,
      rating: 4.9,
      preview_images: [],
      template_data: { border: 'holographic', style: 'modern' }
    },
    {
      id: 'legendary',
      name: 'Legendary',
      description: 'Premium legendary card frame',
      price: 25,
      sales_count: 89,
      rating: 5.0,
      preview_images: [],
      template_data: { border: 'legendary', style: 'premium' }
    }
  ];
  
  const trendingFrames = frames.slice(0, 2);
  const categories = ['fantasy', 'modern', 'classic', 'premium'];
  const loading = false;

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-4 w-4 text-orange-400" />;
      case 'epic': return <Gem className="h-4 w-4 text-purple-400" />;
      default: return <Star className="h-4 w-4 text-blue-400" />;
    }
  };

  const getFrameRarity = (price: number) => {
    if (price >= 20) return 'legendary';
    if (price >= 5) return 'epic';
    return 'common';
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    cardEditor.updateCardField('template_id', templateId);
    
    // Find the template and apply any default design metadata
    const template = [...frames, ...trendingFrames].find(f => f.id === templateId);
    if (template && template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
  };

  const filteredFrames = frames.filter(frame =>
    frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frame.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canProceed = selectedTemplate !== null;

  return (
    <div className="space-y-8">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-crd-white">Choose Your Frame</h3>
          <p className="text-crd-lightGray">Select a frame template that matches your card's style</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-mediumGray w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-white"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-crd-green text-black' : 'text-crd-lightGray hover:text-crd-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-crd-green text-black' : 'text-crd-lightGray hover:text-crd-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'all' 
              ? 'bg-crd-green text-black' 
              : 'bg-crd-mediumGray/20 text-crd-lightGray hover:bg-crd-mediumGray/30'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition-colors capitalize ${
              selectedCategory === category 
                ? 'bg-crd-green text-black' 
                : 'bg-crd-mediumGray/20 text-crd-lightGray hover:bg-crd-mediumGray/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Trending Templates */}
      {trendingFrames.length > 0 && searchQuery === '' && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-crd-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
            Trending Templates
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingFrames.slice(0, 4).map((frame) => {
              const frameRarity = getFrameRarity(frame.price);
              const isSelected = selectedTemplate === frame.id;
              
              return (
                <Card
                  key={frame.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    isSelected 
                      ? 'ring-2 ring-crd-green bg-crd-green/10' 
                      : 'bg-crd-mediumGray/20 hover:bg-crd-mediumGray/30'
                  } border-crd-mediumGray/30`}
                  onClick={() => handleTemplateSelect(frame.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[5/7] rounded-lg overflow-hidden mb-3 bg-crd-darkGray">
                      {frame.preview_images && frame.preview_images.length > 0 ? (
                        <img 
                          src={frame.preview_images[0]} 
                          alt={frame.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-600 rounded mx-auto mb-2" />
                            <p className="text-xs text-crd-mediumGray">Preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-crd-white text-sm truncate">{frame.name}</h5>
                        <div className="flex items-center">
                          {getRarityIcon(frameRarity)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${
                          frame.price === 0 ? 'text-crd-green' : 'text-crd-orange'
                        }`}>
                          {frame.price === 0 ? 'Free' : `$${frame.price}`}
                        </span>
                        <span className="text-crd-mediumGray">{frame.sales_count} uses</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-crd-white">
          {selectedCategory === 'all' ? 'All Templates' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Templates`}
          <span className="text-crd-mediumGray text-sm font-normal ml-2">
            ({filteredFrames.length} found)
          </span>
        </h4>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[5/7] bg-crd-mediumGray/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredFrames.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-crd-mediumGray" />
            </div>
            <p className="text-crd-lightGray">No templates found matching your criteria.</p>
            <p className="text-crd-mediumGray text-sm mt-2">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'space-y-4'
          }>
            {filteredFrames.map((frame) => {
              const frameRarity = getFrameRarity(frame.price);
              const isSelected = selectedTemplate === frame.id;
              
              return (
                <Card
                  key={frame.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    isSelected 
                      ? 'ring-2 ring-crd-green bg-crd-green/10' 
                      : 'bg-crd-mediumGray/20 hover:bg-crd-mediumGray/30'
                  } border-crd-mediumGray/30`}
                  onClick={() => handleTemplateSelect(frame.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[5/7] rounded-lg overflow-hidden mb-3 bg-crd-darkGray">
                      {frame.preview_images && frame.preview_images.length > 0 ? (
                        <img 
                          src={frame.preview_images[0]} 
                          alt={frame.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-600 rounded mx-auto mb-2" />
                            <p className="text-xs text-crd-mediumGray">Preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-crd-white text-sm truncate">{frame.name}</h5>
                        <div className="flex items-center">
                          {getRarityIcon(frameRarity)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${
                          frame.price === 0 ? 'text-crd-green' : 'text-crd-orange'
                        }`}>
                          {frame.price === 0 ? 'Free' : `$${frame.price}`}
                        </span>
                        <span className="text-crd-mediumGray">{frame.sales_count} uses</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-crd-mediumGray/20">
        <CRDButton variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </CRDButton>
        
        <div className="text-sm text-crd-lightGray">
          Step 2 of 5 - {selectedTemplate ? 'Frame selected!' : 'Choose a frame template'}
        </div>
        
        <CRDButton 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[120px]"
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </CRDButton>
      </div>
    </div>
  );
};

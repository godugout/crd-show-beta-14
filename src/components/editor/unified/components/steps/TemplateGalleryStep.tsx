import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Search, Grid, Filter, Star, Zap, Eye } from 'lucide-react';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { BASEBALL_CARD_TEMPLATES } from '@/components/editor/templates/BaseballCardTemplates';
import { CreationLayout } from '../shared/CreationLayout';
import { CreationPanels } from '../shared/CreationPanels';
import { CRDDetailsSection } from '../shared/CRDDetailsSection';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { DesignTemplate } from '@/types/card';

interface TemplateGalleryStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const TemplateGalleryStep = ({ mode, cardData, onFieldUpdate }: TemplateGalleryStepProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);

  const categories = [
    { id: 'all', name: 'All Frames', icon: Grid },
    { id: 'sports', name: 'Sports', icon: Star },
    { id: 'fantasy', name: 'Fantasy', icon: Zap },
    { id: 'scifi', name: 'Sci-Fi', icon: Grid },
    { id: 'vintage', name: 'Vintage', icon: Grid },
  ];

  const filteredTemplates = BASEBALL_CARD_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'sports' && (template.name.includes('Baseball') || template.name.includes('Sports'))) ||
                           (selectedCategory === 'fantasy' && (template.name.includes('Fantasy') || template.name.includes('Magic'))) ||
                           (selectedCategory === 'scifi' && (template.name.includes('Sci-Fi') || template.name.includes('Cyber'))) ||
                           (selectedCategory === 'vintage' && (template.name.includes('Vintage') || template.name.includes('Classic')));
    
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    // Store template selection in a way that matches CardData structure
    onFieldUpdate('rarity', template.name.includes('Premium') ? 'epic' : 'common');
  };

  const leftPanel = (
    <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-crd-lightGray text-sm font-medium">Search Frames</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frames..."
              className="pl-10 bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white h-11 text-base focus:border-crd-green/50"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="text-crd-lightGray text-sm font-medium">Categories</label>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-crd-green text-black'
                      : 'text-crd-lightGray hover:bg-crd-mediumGray/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Selection */}
        {selectedTemplate && (
          <div className="border-t border-crd-mediumGray/20 pt-4">
            <label className="text-crd-lightGray text-sm mb-2 block font-medium">Selected Frame</label>
            <div className="bg-crd-darkest/50 rounded-lg p-3">
              <p className="text-crd-white font-medium">{selectedTemplate.name}</p>
              <p className="text-crd-lightGray text-xs mt-1">
                {selectedTemplate.description || 'No description available'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const centerPanel = (
    <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1 flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
          <Eye className="w-5 h-5" />
          Frame Gallery
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-auto">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'ring-3 ring-crd-green scale-105 shadow-lg shadow-crd-green/20'
                  : 'hover:scale-102 hover:ring-2 hover:ring-crd-lightGray/50 hover:shadow-md'
              }`}
            >
              <SVGTemplateRenderer
                template={template}
                playerName={cardData.title || 'PLAYER NAME'}
                teamName="TEAM"
                imageUrl={cardData.image_url}
                className="w-full h-full"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              
              {/* Frame Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 className="text-white text-sm font-medium mb-1">{template.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-crd-lightGray text-xs">
                    {template.name.includes('Premium') ? 'Premium' : 'Free'}
                  </span>
                  {selectedTemplate?.id === template.id && (
                    <div className="w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Badge */}
              {template.name.includes('Premium') && (
                <div className="absolute top-2 right-2 bg-crd-green text-black text-xs px-2 py-1 rounded-full font-semibold">
                  PRO
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Grid className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
            <h3 className="text-crd-white text-lg font-medium mb-2">No frames found</h3>
            <p className="text-crd-lightGray">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const rightPanel = (
    <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white text-lg">Frame Info</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedTemplate ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-crd-white font-semibold text-base mb-1">{selectedTemplate.name}</h4>
              <p className="text-crd-lightGray text-sm">
                {selectedTemplate.description || 'Professional frame design'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-crd-lightGray text-sm">Type:</span>
                <span className="text-crd-white text-sm">
                  {selectedTemplate.name.includes('Premium') ? 'Premium' : 'Free'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-crd-lightGray text-sm">Category:</span>
                <span className="text-crd-white text-sm">Sports</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crd-lightGray text-sm">Resolution:</span>
                <span className="text-crd-white text-sm">High Quality</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-crd-lightGray py-8">
            <Grid className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a frame to see details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <CreationLayout
      title="Browse Frames"
      subtitle="Explore our frame gallery and find the perfect design for your card"
      currentStep={3}
      totalSteps={4}
    >
      <CreationPanels
        leftPanel={leftPanel}
        centerPanel={centerPanel}
        rightPanel={rightPanel}
      />
    </CreationLayout>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Search, Grid, Filter, Star, Zap, Eye, Sparkles } from 'lucide-react';
import { EnhancedTemplateGrid } from '@/components/editor/templates/EnhancedTemplateGrid';
import { EnhancedEffectsPanel } from '@/components/editor/tools/EnhancedEffectsPanel';
import { SmartCardAnalyzer } from '@/components/editor/tools/SmartCardAnalyzer';
import { CreationLayout } from '../shared/CreationLayout';
import { CreationPanels } from '../shared/CreationPanels';
import { CRDDetailsSection } from '../shared/CRDDetailsSection';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface TemplateGalleryStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const TemplateGalleryStep = ({ mode, cardData, onFieldUpdate }: TemplateGalleryStepProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'effects' | 'analyzer'>('templates');

  const categories = [
    { id: 'all', name: 'All Frames', icon: Grid },
    { id: 'sports', name: 'Sports', icon: Star },
    { id: 'fantasy', name: 'Fantasy', icon: Zap },
    { id: 'modern', name: 'Modern', icon: Grid },
    { id: 'vintage', name: 'Vintage', icon: Grid },
    { id: 'premium', name: 'Premium', icon: Sparkles },
  ];

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    // Store template selection in CardData structure
    onFieldUpdate('rarity', template.rarity || 'common');
    // Apply template design to card
    onFieldUpdate('design_metadata', {
      template_id: template.id,
      template_name: template.name,
      template_category: template.category
    });
  };

  const handleEffectChange = (effects: any[]) => {
    // Store effects in card metadata
    onFieldUpdate('design_metadata', {
      ...cardData.design_metadata,
      effects: effects.filter(e => e.enabled)
    });
  };

  const handleAnalysisComplete = (analysis: any) => {
    // Store analysis results
    onFieldUpdate('design_metadata', {
      ...cardData.design_metadata,
      ai_analysis: analysis
    });
  };

  const leftPanel = (
    <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
          <Filter className="w-5 h-5" />
          Design Tools
        </CardTitle>
        
        {/* Tab Navigation */}
        <div className="flex bg-crd-darkest/50 rounded-lg p-1 mt-4">
          {[
            { id: 'templates', name: 'Templates', icon: Grid },
            { id: 'effects', name: 'Effects', icon: Sparkles },
            { id: 'analyzer', name: 'AI Analysis', icon: Eye }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-crd-green text-black'
                    : 'text-crd-lightGray hover:text-crd-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activeTab === 'templates' && (
          <>
            {/* Search */}
            <div className="space-y-2">
              <label className="text-crd-lightGray text-sm font-medium">Search Templates</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
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
          </>
        )}
        
        {activeTab === 'effects' && (
          <div className="max-h-96 overflow-y-auto">
            <EnhancedEffectsPanel onEffectChange={handleEffectChange} />
          </div>
        )}
        
        {activeTab === 'analyzer' && (
          <div className="max-h-96 overflow-y-auto">
            <SmartCardAnalyzer 
              cardData={cardData} 
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {/* Current Selection */}
        {selectedTemplate && (
          <div className="border-t border-crd-mediumGray/20 pt-4">
            <label className="text-crd-lightGray text-sm mb-2 block font-medium">Selected Template</label>
            <div className="bg-crd-darkest/50 rounded-lg p-3">
              <p className="text-crd-white font-medium">{selectedTemplate.name}</p>
              <p className="text-crd-lightGray text-xs mt-1">
                {selectedTemplate.description || 'Professional card template'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  selectedTemplate.isPremium 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/40' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-400/40'
                }`}>
                  {selectedTemplate.isPremium ? 'Premium' : 'Free'}
                </span>
                <span className="px-2 py-1 rounded text-xs bg-crd-green/20 text-crd-green border border-crd-green/40 capitalize">
                  {selectedTemplate.rarity || 'common'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const mainContent = (
    <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
          <Grid className="w-5 h-5" />
          Enhanced Template Gallery
          <span className="text-sm bg-crd-green/20 text-crd-green px-2 py-1 rounded">
            Premium Collection
          </span>
        </CardTitle>
        <p className="text-crd-lightGray text-sm mt-2">
          Professional templates with advanced effects and AI-powered analysis
        </p>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto">
          <EnhancedTemplateGrid
            onTemplateSelect={handleTemplateSelect}
            selectedTemplate={selectedTemplate?.id}
            category={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </CardContent>
    </Card>
  );

  const rightPanel = (
    <CRDDetailsSection
      cardData={cardData}
    />
  );

  return (
    <CreationLayout
      title="Enhanced Template Studio"
      subtitle="Choose from premium templates, apply effects, and get AI-powered design insights"
      currentStep={3}
      totalSteps={5}
    >
      <CreationPanels
        leftPanel={leftPanel}
        centerPanel={mainContent}
        rightPanel={rightPanel}
      />
    </CreationLayout>
  );
};
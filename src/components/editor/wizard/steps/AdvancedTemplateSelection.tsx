
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Heart, Star, Crown, Sparkles, Eye, ArrowRight } from 'lucide-react';
import { useWizardContext } from '../WizardContext';
import { mockTemplates, getTemplatesByCategory, searchTemplates, getAIRecommendations } from '../data/mockTemplates';
import type { Template, TemplateFilters } from '../types/templateTypes';

const categories = [
  { id: 'all', name: 'All Templates', count: mockTemplates.length },
  { id: 'sports', name: 'Sports', count: mockTemplates.filter(t => t.category === 'sports').length },
  { id: 'entertainment', name: 'Entertainment', count: mockTemplates.filter(t => t.category === 'entertainment').length },
  { id: 'business', name: 'Business', count: mockTemplates.filter(t => t.category === 'business').length },
  { id: 'gaming', name: 'Gaming', count: mockTemplates.filter(t => t.category === 'gaming').length },
  { id: 'custom', name: 'Custom', count: mockTemplates.filter(t => t.category === 'custom').length }
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'best_match', label: 'Best Match' },
  { value: 'price', label: 'Price: Low to High' }
];

export const AdvancedTemplateSelection: React.FC = () => {
  const { state, dispatch } = useWizardContext();
  const [filters, setFilters] = useState<TemplateFilters>({
    category: 'all',
    search: '',
    colorScheme: '',
    style: '',
    sortBy: 'popular',
    showOnlyFree: false,
    showOnlyPremium: false
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const aiRecommendations = useMemo(() => getAIRecommendations(), []);

  const filteredTemplates = useMemo(() => {
    let templates = mockTemplates;

    // Category filter
    if (filters.category !== 'all') {
      templates = getTemplatesByCategory(filters.category);
    }

    // Search filter
    if (filters.search) {
      templates = searchTemplates(filters.search);
    }

    // Premium/Free filter
    if (filters.showOnlyFree) {
      templates = templates.filter(t => !t.is_premium);
    }
    if (filters.showOnlyPremium) {
      templates = templates.filter(t => t.is_premium);
    }

    // Sort templates
    switch (filters.sortBy) {
      case 'popular':
        templates.sort((a, b) => b.popularity_score - a.popularity_score);
        break;
      case 'newest':
        templates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price':
        templates.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      default:
        break;
    }

    return templates;
  }, [filters]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template.id);
    dispatch({ 
      type: 'UPDATE_CARD_DATA', 
      payload: { 
        template_id: template.id
      } 
    });
  };

  const toggleFavorite = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const TemplateCard: React.FC<{ template: Template; isRecommended?: boolean }> = ({ 
    template, 
    isRecommended = false 
  }) => {
    const isSelected = selectedTemplate === template.id;
    const isFavorited = favorites.has(template.id);

    return (
      <div
        className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
          isSelected 
            ? 'ring-2 ring-crd-green shadow-xl scale-105' 
            : 'hover:scale-102 hover:shadow-lg'
        } ${isRecommended ? 'ring-1 ring-crd-orange/50' : ''}`}
        onClick={() => handleTemplateSelect(template)}
        style={{ width: '300px', height: '420px' }}
      >
        {/* Template Preview Image */}
        <div className="relative w-full h-full">
          <img
            src={template.thumbnail_url}
            alt={template.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {template.is_trending && (
              <div className="bg-crd-orange px-2 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Trending
              </div>
            )}
            {template.is_new && (
              <div className="bg-crd-green px-2 py-1 rounded-full text-xs font-medium text-black">
                New
              </div>
            )}
            {template.is_premium && (
              <div className="bg-yellow-500 px-2 py-1 rounded-full text-xs font-medium text-black flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </div>
            )}
            {isRecommended && (
              <div className="bg-crd-purple px-2 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                <Star className="w-3 h-3" />
                AI Pick
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => toggleFavorite(template.id, e)}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-black/70"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>

          {/* Preview Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewModal(template);
            }}
            className="absolute top-3 right-14 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-black/70 opacity-0 group-hover:opacity-100"
          >
            <Eye className="w-4 h-4 text-white" />
          </button>

          {/* Template Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg truncate">{template.name}</h3>
                <div className="flex items-center gap-1 text-crd-lightGray text-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {(template.popularity_score / 20).toFixed(1)}
                </div>
              </div>
              
              <p className="text-crd-lightGray text-sm line-clamp-2">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-crd-lightGray">
                    {template.download_count.toLocaleString()} uses
                  </span>
                  {template.creator_info.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  {template.is_premium ? (
                    <span className="text-crd-green font-semibold">${template.price}</span>
                  ) : (
                    <span className="text-crd-green font-semibold">Free</span>
                  )}
                </div>
              </div>

              <button className="w-full bg-crd-green text-black font-medium py-2 rounded-lg hover:bg-crd-green/90 transition-colors">
                Use Template
              </button>
            </div>
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-crd-green rounded-full flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">Choose Your Template</h2>
        <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
          Discover the perfect starting point for your trading card with our AI-powered template marketplace
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-crd-mediumGray w-5 h-5" />
          <input
            type="text"
            placeholder="Search templates by name, category, or style..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-crd-darkGray/50 border border-crd-mediumGray/30 rounded-xl pl-12 pr-4 py-4 text-white placeholder-crd-mediumGray focus:border-crd-green focus:outline-none transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                filters.category === category.id
                  ? 'bg-crd-green text-black shadow-lg'
                  : 'bg-crd-mediumGray/20 text-crd-lightGray hover:bg-crd-mediumGray/30 hover:text-white'
              }`}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-70">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Sort and Additional Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg px-4 py-2 text-white focus:border-crd-green focus:outline-none"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button
            onClick={() => setFilters(prev => ({ ...prev, showOnlyFree: !prev.showOnlyFree }))}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filters.showOnlyFree ? 'bg-crd-green text-black' : 'bg-crd-mediumGray/20 text-crd-lightGray hover:bg-crd-mediumGray/30'
            }`}
          >
            Free Only
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, showOnlyPremium: !prev.showOnlyPremium }))}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filters.showOnlyPremium ? 'bg-crd-green text-black' : 'bg-crd-mediumGray/20 text-crd-lightGray hover:bg-crd-mediumGray/30'
            }`}
          >
            Premium Only
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && filters.search === '' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-crd-orange" />
              AI Recommended for You
            </h3>
            <p className="text-crd-lightGray mt-2">Templates our AI thinks you'll love</p>
          </div>
          
          <div className="flex gap-6 justify-center overflow-x-auto pb-4">
            {aiRecommendations.slice(0, 3).map((rec) => {
              const template = mockTemplates.find(t => t.id === rec.template_id);
              if (!template) return null;
              return (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  isRecommended={true}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            {filters.category === 'all' ? 'All Templates' : `${categories.find(c => c.id === filters.category)?.name} Templates`}
          </h3>
          <span className="text-crd-lightGray">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-[300px] h-[420px] bg-crd-mediumGray/20 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-12 h-12 text-crd-mediumGray" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-crd-lightGray mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={() => setFilters({
                category: 'all',
                search: '',
                colorScheme: '',
                style: '',
                sortBy: 'popular',
                showOnlyFree: false,
                showOnlyPremium: false
              })}
              className="px-6 py-2 bg-crd-green text-black rounded-lg font-medium hover:bg-crd-green/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      {selectedTemplate && (
        <div className="flex justify-center pt-8">
          <button className="flex items-center gap-3 bg-crd-green text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-crd-green/90 transition-all duration-200 shadow-lg hover:shadow-xl">
            Continue with Selected Template
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

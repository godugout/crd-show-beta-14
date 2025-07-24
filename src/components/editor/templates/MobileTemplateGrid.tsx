import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Check, Grid3X3, List, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PremiumTooltip } from '@/components/monetization/PremiumTooltip';
import { useMonetizationTracking } from '@/components/monetization/hooks/useMonetizationTracking';

interface Template {
  id: string;
  name: string;
  preview_url?: string;
  category: string;
  is_premium?: boolean;
}

interface MobileTemplateGridProps {
  templates: Template[];
  selectedTemplate?: string;
  onTemplateSelect: (template: Template) => void;
  loading?: boolean;
}

export const MobileTemplateGrid: React.FC<MobileTemplateGridProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  loading = false
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { trackEvent } = useMonetizationTracking();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-crd-white">Choose Frame</h3>
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 bg-crd-mediumGray/20" />
            <Skeleton className="w-10 h-10 bg-crd-mediumGray/20" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] bg-crd-mediumGray/20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const TemplateCard = ({ template }: { template: Template }) => {
    const isSelected = selectedTemplate === template.id;
    const isLocked = template.is_premium;
    const creditCost = 50; // Mock cost for premium templates
    
    const handleTemplateClick = () => {
      if (isLocked) {
        trackEvent('premium_template_clicked', {
          template_id: template.id,
          template_name: template.name,
          cost: creditCost
        });
        return;
      }
      onTemplateSelect(template);
    };
    
    const templateCard = (
      <div 
        className={`
          relative cursor-pointer transition-all duration-200
          ${isSelected ? 'ring-2 ring-crd-green' : 'hover:ring-1 hover:ring-crd-green/50'}
          ${isLocked ? 'opacity-75' : ''}
        `}
        onClick={handleTemplateClick}
      >
        <Card className="card-themed overflow-hidden">
          <div className="aspect-[3/4] relative bg-crd-mediumGray/20">
            {template.preview_url ? (
              <img
                src={template.preview_url}
                alt={template.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-crd-lightGray">
                <div className="text-center">
                  <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">Frame</span>
                </div>
              </div>
            )}
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-black" />
              </div>
            )}
            
            {/* Premium badge */}
            {template.is_premium && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-crd-orange rounded text-xs text-black font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                PRO
              </div>
            )}
          </div>
          
          {viewMode === 'list' && (
            <CardContent className="p-3">
              <h4 className="text-crd-white font-medium text-sm truncate">{template.name}</h4>
              <p className="text-crd-lightGray text-xs capitalize">{template.category}</p>
            </CardContent>
          )}
        </Card>
        
        {viewMode === 'grid' && (
          <div className="mt-2">
            <h4 className="text-crd-white font-medium text-sm truncate">{template.name}</h4>
            <p className="text-crd-lightGray text-xs capitalize">{template.category}</p>
          </div>
        )}
      </div>
    );

    if (isLocked) {
      return (
        <PremiumTooltip
          cost={creditCost}
          featureName={template.name}
          description={`Unlock this premium ${template.category} frame`}
          isLocked={true}
        >
          {templateCard}
        </PremiumTooltip>
      );
    }

    return templateCard;
  };

  return (
    <div className="space-y-4">
      {/* Header with view mode toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-crd-white">Choose Frame</h3>
        <div className="flex gap-1 bg-crd-mediumGray/20 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded min-h-[44px] min-w-[44px] transition-colors ${
              viewMode === 'grid' 
                ? 'bg-crd-green text-black' 
                : 'text-crd-lightGray hover:text-crd-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded min-h-[44px] min-w-[44px] transition-colors ${
              viewMode === 'list' 
                ? 'bg-crd-green text-black' 
                : 'text-crd-lightGray hover:text-crd-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Template grid */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
          : 'grid grid-cols-1 gap-3'
      }>
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8">
          <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-crd-lightGray opacity-50" />
          <p className="text-crd-lightGray">No frames available</p>
        </div>
      )}
    </div>
  );
};
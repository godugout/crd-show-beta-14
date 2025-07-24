
import React from 'react';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface TemplateSelectionStepProps {
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
}

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  console.log('🎨 TemplateSelectionStep: Rendering with templates:', templates);

  const renderTemplatePreview = (template: DesignTemplate) => {
    // Safely handle template data
    const templateData = template.template_data || {};
    const background = templateData.background || '#1a1a2e';
    const primaryColor = templateData.primaryColor || '#16a085';
    
    return (
      <div 
        key={template.id}
        className={`relative cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
          selectedTemplate?.id === template.id 
            ? 'border-crd-green shadow-lg' 
            : 'border-crd-mediumGray/30 hover:border-crd-lightGray/50'
        }`}
        onClick={() => onTemplateSelect(template)}
      >
        <div 
          className="aspect-[2/3] rounded-lg p-4 flex flex-col justify-between"
          style={{ 
            background: background,
            border: `2px solid ${primaryColor}`
          }}
        >
          {/* Template Preview Content */}
          <div className="text-center">
            <div 
              className="text-sm font-bold mb-2"
              style={{ color: primaryColor }}
            >
              {template.name}
            </div>
            <div className="w-full h-16 bg-white/10 rounded mb-2"></div>
          </div>
          
          <div className="text-xs text-white/70 text-center">
            {template.category}
          </div>
        </div>
        
        {template.is_premium && (
          <div className="absolute top-2 right-2 bg-crd-gold text-black text-xs px-2 py-1 rounded">
            Premium
          </div>
        )}
      </div>
    );
  };

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-crd-lightGray mb-4">No templates available</div>
        <div className="text-sm text-crd-lightGray">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2">Choose a Frame</h3>
        <p className="text-crd-lightGray text-sm">
          Select a template to style your card
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map(renderTemplatePreview)}
      </div>

      {selectedTemplate && (
        <div className="text-center mt-4">
          <div className="text-crd-green text-sm">
            ✓ Selected: {selectedTemplate.name}
          </div>
        </div>
      )}
    </div>
  );
};

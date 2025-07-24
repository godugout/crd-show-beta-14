import React from 'react';
import { TemplatePreview } from '@/components/templates/TemplatePreview';
import { templateRegistry } from '@/templates/engine';
import { useNavigate } from 'react-router-dom';

export const TemplateShowcase: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLaunchStudio = () => {
    navigate('/create');
  };

  // Get first template for demo (cosmic)
  const cosmicTemplate = templateRegistry.cosmic;

  if (!cosmicTemplate) return null;

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Cinematic Templates
          </h2>
          <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
            Experience stunning animated sequences that bring your cards to life with Hollywood-quality effects.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <TemplatePreview
            template={cosmicTemplate}
            onLaunchStudio={handleLaunchStudio}
            autoPlay={true}
            className="w-full"
          />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-crd-lightGray text-sm">
            More cinematic templates coming soon
          </p>
        </div>
      </div>
    </section>
  );
};
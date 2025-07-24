
import React from 'react';
import { WizardContainer } from './WizardContainer';
import type { CardData } from '@/hooks/useCardEditor';

interface ProfessionalWizardProps {
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const ProfessionalWizard: React.FC<ProfessionalWizardProps> = ({
  onComplete,
  onCancel
}) => {
  console.log('🎨 ProfessionalWizard: Rendering with web scraping functionality');
  
  try {
    return (
      <WizardContainer 
        onComplete={onComplete}
        onCancel={onCancel}
      />
    );
  } catch (error) {
    console.error('❌ ProfessionalWizard: Error rendering:', error);
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Card Creator Loading...</h2>
          <p className="text-crd-lightGray">Initializing wizard components...</p>
        </div>
      </div>
    );
  }
};

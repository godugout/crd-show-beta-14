
import React from 'react';
import { useWizardContext } from './WizardContext';
import { WizardStepContent } from './WizardStepContent';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useWizardTemplates } from './hooks/useWizardTemplates';

export const WizardStepRenderer: React.FC = () => {
  const { wizardState, handlers } = useWizardContext();
  const cardEditor = useCardEditor();
  const { templates } = useWizardTemplates();

  console.log('🔄 WizardStepRenderer: Current step:', wizardState.currentStep);

  if (!wizardState || !handlers) {
    console.log('⚠️ WizardStepRenderer: Missing context data');
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading wizard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <WizardStepContent
          currentStep={wizardState.currentStep}
          wizardState={wizardState}
          cardData={cardEditor.cardData}
          templates={templates}
          handlers={{
            ...handlers,
            onBulkUpload: () => {
              console.log('🔄 Bulk upload requested');
            }
          }}
          cardEditor={cardEditor}
        />
      </div>
    </div>
  );
};

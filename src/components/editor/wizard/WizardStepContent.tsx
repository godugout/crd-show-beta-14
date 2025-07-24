
import React from 'react';
import { PhotoUploadStep } from './PhotoUploadStep';
import { TemplateSelectionStep } from './TemplateSelectionStep';
import { CardDetailsStep } from './CardDetailsStep';
import { PublishingOptionsStep } from './PublishingOptionsStep';
import { EffectsTab } from '../sidebar/EffectsTab';
import type { WizardState, WizardHandlers } from './types';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface WizardStepContentProps {
  currentStep: number;
  wizardState: WizardState;
  cardData: CardData;
  templates: DesignTemplate[];
  handlers: WizardHandlers & { onBulkUpload?: () => void };
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
}

export const WizardStepContent = ({ 
  currentStep, 
  wizardState, 
  cardData, 
  templates, 
  handlers,
  cardEditor
}: WizardStepContentProps) => {
  switch (currentStep) {
    case 1:
      // Upload & Frames - Combined step
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photo Upload Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload Photo</h3>
              <PhotoUploadStep
                selectedPhoto={wizardState.selectedPhoto}
                onPhotoSelect={handlers.handlePhotoSelect}
                onAnalysisComplete={handlers.handleAiAnalysis}
                onBulkUpload={handlers.onBulkUpload}
              />
            </div>
            
            {/* Frame Selection Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Choose Frame</h3>
              <TemplateSelectionStep
                templates={templates}
                selectedTemplate={wizardState.selectedTemplate}
                onTemplateSelect={handlers.handleTemplateSelect}
              />
            </div>
          </div>
        </div>
      );
    case 2:
      // Effects & Lighting
      return (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Effects & Lighting</h3>
          <EffectsTab 
            searchQuery=""
            onEffectsComplete={() => {}}
            cardEditor={cardEditor}
          />
        </div>
      );
    case 3:
      // Publish & Share
      return (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Publish & Share</h3>
          <PublishingOptionsStep
            publishingOptions={cardData.publishing_options}
            selectedTemplate={wizardState.selectedTemplate}
            onPublishingUpdate={handlers.updatePublishingOptions}
          />
        </div>
      );
    // Legacy 4-step support (for backward compatibility)
    case 4:
      return (
        <PublishingOptionsStep
          publishingOptions={cardData.publishing_options}
          selectedTemplate={wizardState.selectedTemplate}
          onPublishingUpdate={handlers.updatePublishingOptions}
        />
      );
    default:
      return null;
  }
};

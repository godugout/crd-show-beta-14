
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from './components/StepIndicator';
import { StepContent } from './components/StepContent';
import { IntentStep } from './components/steps/IntentStep';
import { PhotoStep } from './components/steps/PhotoStep';
import { WIZARD_STEPS } from '@/components/editor/wizard/wizardConfig';
import type { CreationMode, CreationStep } from './types';
import type { DesignTemplate } from '@/types/card';

interface EnhancedCardCreatorProps {
  onComplete: (cardData: import('@/hooks/useCardEditor').CardData) => void;
  onCancel: () => void;
}

export const EnhancedCardCreator = ({ onComplete, onCancel }: EnhancedCardCreatorProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CreationStep>('intent');
  const [selectedMode, setSelectedMode] = useState<CreationMode>('quick');
  const cardEditor = useCardEditor();
  const [selectedFrame, setSelectedFrame] = useState<DesignTemplate | undefined>();

  const handleModeSelect = (mode: CreationMode) => {
    setSelectedMode(mode);
    setCurrentStep('create');
  };

  const handleFrameSelect = (frame: DesignTemplate) => {
    setSelectedFrame(frame);
    cardEditor.updateCardField('template_id', frame.id);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'intent':
        setCurrentStep('create');
        break;
      case 'create':
        setCurrentStep('templates');
        break;
      case 'templates':
        setCurrentStep('studio');
        break;
      case 'studio':
        setCurrentStep('publish');
        break;
      case 'publish':
        setCurrentStep('complete');
        break;
      default:
        console.warn('Unknown step:', currentStep);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'create':
        setCurrentStep('intent');
        break;
      case 'templates':
        setCurrentStep('create');
        break;
      case 'studio':
        setCurrentStep('templates');
        break;
      case 'publish':
        setCurrentStep('studio');
        break;
      case 'complete':
        setCurrentStep('publish');
        break;
      default:
        console.warn('Unknown step:', currentStep);
    }
  };

  const handleStartOver = useCallback(() => {
    setCurrentStep('intent');
    setSelectedMode('quick');
    cardEditor.updateCardField('image_url', '');
  }, [cardEditor]);

  const handleComplete = async () => {
    console.log('Completing card creation...');
    await cardEditor.saveCard();
    onComplete(cardEditor.cardData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intent':
        return (
          <IntentStep
            onModeSelect={handleModeSelect}
            onBulkUpload={() => navigate('/cards/bulk-upload')}
          />
        );

      case 'create':
      case 'templates':
      case 'studio':
      case 'publish':
      case 'complete':
        return (
          <StepContent
            step={currentStep}
            mode={selectedMode}
            cardData={cardEditor.cardData}
            onModeSelect={handleModeSelect}
            onPhotoSelect={(photo) => cardEditor.updateCardField('image_url', photo)}
            onFieldUpdate={cardEditor.updateCardField}
            onBulkUpload={() => navigate('/cards/bulk-upload')}
            onGoToGallery={() => navigate('/gallery')}
            onStartOver={handleStartOver}
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-themed-primary text-center mb-8">
          Create Your Card
        </h1>

        <StepIndicator steps={WIZARD_STEPS} currentStep={currentStep} />

        {/* Navigation Bar - Moved here from footer */}
        <div className="flex justify-between items-center mb-8 card-themed rounded-lg p-4">
          <CRDButton
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </CRDButton>
          <div className="flex gap-4">
            {currentStep !== 'intent' && (
              <CRDButton
                variant="outline"
                onClick={handleBack}
              >
                Back
              </CRDButton>
            )}
            {currentStep !== 'complete' ? (
              <CRDButton
                onClick={handleNext}
                className="min-w-[120px]"
              >
                Next
              </CRDButton>
            ) : (
              <CRDButton
                onClick={handleComplete}
                className="min-w-[120px]"
              >
                Complete
              </CRDButton>
            )}
          </div>
        </div>

        <div className="card-themed">
          <div className="p-8">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useWizardState } from './wizard/useWizardState';
import { PhotoUploadStep } from './wizard/PhotoUploadStep';
import { TemplateSelectionStep } from './wizard/TemplateSelectionStep';
import { EffectsTab } from './sidebar/EffectsTab';
import { PublishingOptionsStep } from './wizard/PublishingOptionsStep';
import type { CardData } from '@/types/card';

interface SimpleCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onBulkUpload?: () => void;
}

export const SimpleCardWizard = ({ onComplete, onBulkUpload }: SimpleCardWizardProps) => {
  const { wizardState, cardData, handlers, isSaving, templates, updateCardField, cardEditor } = useWizardState(onComplete);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Upload & Frames' },
    { number: 2, title: 'Effects & Lighting' },
    { number: 3, title: 'Publish & Share' }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    handlers.handleComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
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
                  onBulkUpload={onBulkUpload}
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Progress Steps */}
      <div className="bg-crd-darkest border-b border-crd-mediumGray/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    currentStep >= step.number 
                      ? 'bg-crd-green text-black' 
                      : 'bg-crd-mediumGray text-crd-lightGray'
                  }`}>
                    {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.number}
                  </div>
                  <div className="text-white text-base font-medium mt-3 text-center">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-6 transition-colors ${
                    currentStep > step.number ? 'bg-crd-green' : 'bg-crd-mediumGray'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {wizardState.aiAnalysisComplete && (
            <div className="text-center mt-6">
              <span className="text-crd-green text-sm font-medium">✨ AI analysis complete!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-crd-darkGray rounded-xl border border-crd-mediumGray/30 p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-crd-lightGray text-sm">
            Step {currentStep} of {steps.length}
          </div>

          <div className="flex space-x-3">
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                disabled={isSaving}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                disabled={isSaving}
              >
                {isSaving ? 'Creating...' : 'Create Card'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

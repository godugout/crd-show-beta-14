
import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useUnifiedCreator } from './hooks/useUnifiedCreator';
import { ProgressIndicator } from './components/ProgressIndicator';
import { StepContent } from './components/StepContent';
import type { CreationMode } from './types';
import type { CardData } from '@/hooks/useCardEditor';

interface UnifiedCardCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const UnifiedCardCreator = ({
  initialMode = 'quick',
  onComplete,
  onCancel
}: UnifiedCardCreatorProps) => {
  const {
    state,
    cardEditor,
    modeConfigs,
    currentConfig,
    actions
  } = useUnifiedCreator({
    initialMode,
    onComplete,
    onCancel
  });

  const handlePhotoSelect = (photo: string) => {
    cardEditor.updateCardField('image_url', photo);
    if (state.mode === 'quick') {
      actions.nextStep();
    }
  };

  const handleFieldUpdate = (field: keyof CardData, value: any) => {
    cardEditor.updateCardField(field, value);
  };

  const handleModeSelect = (mode: CreationMode) => {
    actions.setMode(mode);
    actions.nextStep();
  };

  const canProceed = actions.validateStep(state.currentStep);
  const showNavigation = state.currentStep !== 'intent' && state.currentStep !== 'complete';
  const showModeSwitch = state.currentStep !== 'intent' && state.currentStep !== 'complete';

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-crd-white">
              {currentConfig?.title || 'Create Card'}
            </h1>
            {showModeSwitch && (
              <CRDButton
                variant="outline"
                size="sm"
                onClick={() => actions.updateState({ currentStep: 'intent' })}
                className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Switch Mode
              </CRDButton>
            )}
          </div>

          {onCancel && (
            <CRDButton
              variant="outline"
              onClick={onCancel}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
            >
              Cancel
            </CRDButton>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      {currentConfig && state.currentStep !== 'intent' && (
        <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProgressIndicator
              steps={currentConfig.steps}
              currentStep={state.currentStep}
              progress={state.progress}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {state.creationError && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-4 py-3 mx-4 mt-4 rounded">
          <p className="text-sm">
            <strong>Error:</strong> {state.creationError}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepContent
          step={state.currentStep}
          mode={state.mode}
          cardData={cardEditor.cardData}
          onModeSelect={handleModeSelect}
          onPhotoSelect={handlePhotoSelect}
          onFieldUpdate={handleFieldUpdate}
          onBulkUpload={() => actions.setMode('bulk')}
          onGoToGallery={actions.goToGallery}
          onStartOver={actions.startOver}
        />
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="fixed bottom-0 left-0 right-0 bg-crd-darker border-t border-crd-mediumGray/20 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <CRDButton
              variant="outline"
              onClick={actions.previousStep}
              disabled={!state.canGoBack}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </CRDButton>

            <div className="text-crd-lightGray text-sm">
              Step {currentConfig?.steps.indexOf(state.currentStep)! + 1} of {currentConfig?.steps.length}
            </div>

            {state.currentStep === 'publish' ? (
              <CRDButton
                variant="primary"
                onClick={actions.completeCreation}
                disabled={!canProceed || state.isCreating}
                className="bg-crd-green hover:bg-crd-green/80 text-black"
              >
                {state.isCreating ? 'Creating...' : 'Create Card'}
              </CRDButton>
            ) : (
              <CRDButton
                variant="primary"
                onClick={actions.nextStep}
                disabled={!canProceed}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

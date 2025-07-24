
import React, { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useCardEditor } from '@/hooks/useCardEditor';
import { StepContent } from './components/StepContent';
import { CompactCRDDetails } from './components/shared/CompactCRDDetails';
import type { CreationMode, CreationStep } from './types';
import type { CardData } from '@/types/card';

interface SimpleCardCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
  skipIntent?: boolean;
}

// Static configuration to prevent re-creation
const STEP_CONFIGS = {
  quick: ['intent', 'create', 'templates', 'publish'] as CreationStep[],
  guided: ['intent', 'create', 'templates', 'studio', 'publish'] as CreationStep[],
  advanced: ['intent', 'create', 'templates', 'studio', 'publish'] as CreationStep[],
  bulk: ['intent', 'create', 'complete'] as CreationStep[]
};

export const SimpleCardCreator = ({
  initialMode = 'quick',
  onComplete,
  onCancel,
  skipIntent = false
}: SimpleCardCreatorProps) => {
  console.log('🚀 SimpleCardCreator: Initializing with mode:', initialMode, 'skipIntent:', skipIntent);
  
  const navigate = useNavigate();
  
  // Simple, direct state management
  const [currentMode, setCurrentMode] = useState<CreationMode>(initialMode);
  const [currentStep, setCurrentStep] = useState<CreationStep>(
    skipIntent ? 'create' : 'intent'
  );
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize card editor once
  const cardEditor = useCardEditor({
    autoSave: false,
    autoSaveInterval: 0
  });

  // Get current steps for mode
  const currentSteps = useMemo(() => STEP_CONFIGS[currentMode], [currentMode]);
  
  // Calculate progress - adjust for skipped intent step
  const currentIndex = useMemo(() => {
    const index = currentSteps.indexOf(currentStep);
    return skipIntent && index > 0 ? index - 1 : index;
  }, [currentSteps, currentStep, skipIntent]);
  
  const progress = useMemo(() => {
    const totalSteps = skipIntent ? currentSteps.length - 1 : currentSteps.length;
    return currentIndex >= 0 ? (currentIndex / (totalSteps - 1)) * 100 : 0;
  }, [currentIndex, currentSteps.length, skipIntent]);

  // Navigation handlers
  const handleModeSelect = useCallback((mode: CreationMode) => {
    console.log('🎯 SimpleCardCreator: Mode selected:', mode);
    setCurrentMode(mode);
    setCurrentStep(skipIntent ? 'create' : STEP_CONFIGS[mode][1] || 'create');
    setError(null);
  }, [skipIntent]);

  const handleNextStep = useCallback(() => {
    const nextIndex = currentSteps.indexOf(currentStep) + 1;
    if (nextIndex < currentSteps.length) {
      const nextStep = currentSteps[nextIndex];
      console.log('➡️ SimpleCardCreator: Moving to step:', nextStep);
      setCurrentStep(nextStep);
      setError(null);
    }
  }, [currentSteps, currentStep]);

  const handlePreviousStep = useCallback(() => {
    const currentIdx = currentSteps.indexOf(currentStep);
    const prevIndex = currentIdx - 1;
    // Don't go back to intent if we're skipping it
    const minIndex = skipIntent ? 1 : 0;
    if (prevIndex >= minIndex) {
      const prevStep = currentSteps[prevIndex];
      console.log('⬅️ SimpleCardCreator: Moving to step:', prevStep);
      setCurrentStep(prevStep);
      setError(null);
    }
  }, [currentSteps, currentStep, skipIntent]);

  // Validation - moved to callback to prevent render loops
  const validateCurrentStep = useCallback(() => {
    if (!cardEditor?.cardData) return false;
    
    const { cardData } = cardEditor;
    
    switch (currentStep) {
      case 'intent':
        return true;
      case 'create':
        return !!(cardData.image_url && cardData.title && cardData.title.trim() && cardData.title !== 'My New Card');
      case 'templates':
      case 'studio':
      case 'publish':
      default:
        return true;
    }
  }, [currentStep, cardEditor?.cardData]);

  // Complete creation with comprehensive error handling
  const handleCompleteCreation = useCallback(async () => {
    if (!cardEditor) {
      setError('Card editor not initialized');
      return;
    }
    
    console.log('🚀 SimpleCardCreator: Starting card creation');
    setIsCreating(true);
    setError(null);

    try {
      // Validate card data before saving
      if (!cardEditor.cardData.title || cardEditor.cardData.title.trim() === '' || cardEditor.cardData.title === 'My New Card') {
        throw new Error('Please enter a card title');
      }
      
      if (!cardEditor.cardData.image_url) {
        throw new Error('Please select an image for your card');
      }

      const success = await cardEditor.saveCard();
      
      if (success) {
        setCurrentStep('complete');
        
        if (onComplete) {
          try {
            onComplete(cardEditor.cardData);
          } catch (callbackError) {
            console.warn('⚠️ SimpleCardCreator: Callback error:', callbackError);
            // Don't fail the creation if callback fails
          }
        }
        
        console.log('✅ SimpleCardCreator: Card created successfully');
      } else {
        throw new Error('Failed to save card - please check your connection and try again');
      }
    } catch (err) {
      console.error('❌ SimpleCardCreator: Error creating card:', err);
      let errorMessage = 'Failed to create card';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Add more specific error handling
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Network error - please check your connection and try again';
      } else if (errorMessage.includes('auth')) {
        errorMessage = 'Authentication error - please sign in and try again';
      }
      
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [cardEditor, onComplete]);

  // Other handlers
  const handleStartOver = useCallback(() => {
    console.log('🔄 SimpleCardCreator: Starting over');
    if (cardEditor) {
      cardEditor.updateCardField('title', 'My New Card');
      cardEditor.updateCardField('description', '');
      cardEditor.updateCardField('image_url', undefined);
    }
    setCurrentMode(initialMode);
    setCurrentStep(skipIntent ? 'create' : 'intent');
    setError(null);
    setIsCreating(false);
  }, [cardEditor, initialMode, skipIntent]);

  const handleGoToGallery = useCallback(() => {
    console.log('🏠 SimpleCardCreator: Navigating to gallery');
    navigate('/gallery');
  }, [navigate]);

  const handleBulkUpload = useCallback(() => {
    console.log('📦 SimpleCardCreator: Bulk upload selected');
    navigate('/cards/bulk-upload');
  }, [navigate]);

  // Check validation state
  const canProceed = validateCurrentStep();
  const currentIdx = currentSteps.indexOf(currentStep);
  const minIndex = skipIntent ? 1 : 0;
  const canGoBack = currentIdx > minIndex;
  const showNavigation = currentStep !== 'intent' && currentStep !== 'complete';

  // Loading state
  if (!cardEditor) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-crd-white mb-2">Setting up Creator...</h2>
          <p className="text-crd-lightGray">Initializing {currentMode} mode</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-crd-white">Create Card</h1>
            {showNavigation && !skipIntent && (
              <CRDButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep('intent')}
                className="hidden sm:flex border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Switch Mode
              </CRDButton>
            )}
          </div>

          <CRDButton
            variant="outline"
            onClick={onCancel || (() => navigate('/gallery'))}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[44px]"
          >
            Cancel
          </CRDButton>
        </div>
      </div>

      {/* Progress Indicator */}
      {currentStep !== 'intent' && (
        <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <span className="text-sm font-medium text-crd-white">
                Step {currentIndex + 1} of {skipIntent ? currentSteps.length - 1 : currentSteps.length}
              </span>
              <span className="text-sm text-crd-lightGray">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-crd-mediumGray/20 rounded-full h-2">
              <div 
                className="bg-crd-green h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-4 py-3 mx-4 mt-4 rounded">
          <p className="text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        <StepContent
          step={currentStep}
          mode={currentMode}
          cardData={cardEditor.cardData}
          onModeSelect={handleModeSelect}
          onPhotoSelect={(photo) => cardEditor.updateCardField('image_url', photo)}
          onFieldUpdate={cardEditor.updateCardField}
          onBulkUpload={handleBulkUpload}
          onGoToGallery={handleGoToGallery}
          onStartOver={handleStartOver}
        />
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="fixed bottom-0 left-0 right-0 bg-crd-darker border-t border-crd-mediumGray/20 p-4 safe-area-bottom">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Layout */}
            <div className="flex sm:hidden w-full justify-between items-center">
              <CRDButton
                variant="outline"
                onClick={handlePreviousStep}
                disabled={!canGoBack}
                className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white disabled:opacity-50 min-h-[44px] flex-1 mr-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </CRDButton>

              <div className="text-crd-lightGray text-sm px-4">
                {currentIndex + 1}/{skipIntent ? currentSteps.length - 1 : currentSteps.length}
              </div>

              {currentStep === 'publish' ? (
                <CRDButton
                  variant="primary"
                  onClick={handleCompleteCreation}
                  disabled={!canProceed || isCreating}
                  className="bg-crd-green hover:bg-crd-green/80 text-black min-h-[44px] flex-1 ml-3"
                >
                  {isCreating ? 'Creating...' : 'Create Card'}
                </CRDButton>
              ) : (
                <CRDButton
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={!canProceed}
                  className="min-h-[44px] flex-1 ml-3"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </CRDButton>
              )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
              {/* Back Button */}
              <div className="col-span-2">
                <CRDButton
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={!canGoBack}
                  className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white disabled:opacity-50 min-h-[44px] w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </CRDButton>
              </div>

              {/* CRD Details - Centered */}
              <div className="col-span-6 flex justify-center">
                <CompactCRDDetails cardData={cardEditor.cardData} />
              </div>

              {/* Step Counter */}
              <div className="col-span-2 text-center">
                <div className="text-crd-lightGray text-sm">
                  Step {currentIndex + 1} of {skipIntent ? currentSteps.length - 1 : currentSteps.length}
                </div>
              </div>

              {/* Next/Create Button */}
              <div className="col-span-2">
                {currentStep === 'publish' ? (
                  <CRDButton
                    variant="primary"
                    onClick={handleCompleteCreation}
                    disabled={!canProceed || isCreating}
                    className="bg-crd-green hover:bg-crd-green/80 text-black min-h-[44px] w-full"
                  >
                    {isCreating ? 'Creating...' : 'Create Card'}
                  </CRDButton>
                ) : (
                  <CRDButton
                    variant="primary"
                    onClick={handleNextStep}
                    disabled={!canProceed}
                    className="min-h-[44px] w-full"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </CRDButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import type { CreationStep } from '../types';

interface CreatorNavigationProps {
  currentStep: CreationStep;
  canGoBack: boolean;
  canAdvance: boolean;
  validateStep: () => boolean;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  isCreating: boolean;
}

export const CreatorNavigation = ({
  currentStep,
  canGoBack,
  canAdvance,
  validateStep,
  onBack,
  onNext,
  onComplete,
  isCreating
}: CreatorNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-crd-darker border-t border-crd-mediumGray/20 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <CRDButton
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack}
          className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </CRDButton>

        {currentStep === 'publish' ? (
          <CRDButton
            variant="primary"
            onClick={onComplete}
            disabled={!validateStep() || isCreating}
            className="bg-crd-green hover:bg-crd-green/80 text-black"
          >
            {isCreating ? 'Creating...' : 'Create Card'}
          </CRDButton>
        ) : (
          <CRDButton
            variant="primary"
            onClick={onNext}
            disabled={!validateStep()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </CRDButton>
        )}
      </div>
    </div>
  );
};

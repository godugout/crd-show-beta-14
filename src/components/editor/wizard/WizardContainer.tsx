
import React from 'react';
import { WizardProvider } from './WizardContext';
import { WizardProgressIndicator } from './WizardProgressIndicator';
import { WizardStepRenderer } from './WizardStepRenderer';
import { WizardActionBar } from './WizardActionBar';

interface WizardContainerProps {
  onComplete?: (cardData: any) => void;
  onCancel?: () => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  onComplete,
  onCancel
}) => {
  console.log('🏗️ WizardContainer: Rendering');

  try {
    return (
      <WizardProvider>
        <div className="min-h-screen bg-crd-darkest flex flex-col">
          {/* Header */}
          <div className="bg-crd-darker border-b border-crd-mediumGray/20 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Create New Card</h1>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-crd-lightGray hover:text-white transition-colors px-4 py-2 rounded-md hover:bg-crd-mediumGray/20"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="relative z-10">
            <WizardProgressIndicator />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <WizardStepRenderer />
            </div>
          </div>

          {/* Action Bar */}
          <WizardActionBar onComplete={onComplete} />
        </div>
      </WizardProvider>
    );
  } catch (error) {
    console.error('❌ WizardContainer: Error rendering:', error);
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Loading Card Creator</h2>
          <div className="w-12 h-12 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }
};

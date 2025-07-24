
import React from 'react';
import type { CreationStep } from '../types';

interface CreatorProgressProps {
  steps: CreationStep[];
  currentStepIndex: number;
}

export const CreatorProgress = ({ steps, currentStepIndex }: CreatorProgressProps) => {
  return (
    <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-4">
          {steps.slice(1).map((step, index) => {
            const actualIndex = index + 1;
            const isActive = actualIndex === currentStepIndex;
            const isComplete = actualIndex < currentStepIndex;
            
            return (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isComplete
                    ? 'bg-crd-green text-black'
                    : isActive
                    ? 'bg-crd-blue text-white'
                    : 'bg-crd-mediumGray/20 text-crd-lightGray'
                }`}
              >
                {actualIndex}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

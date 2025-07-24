
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface WizardStep {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: string;
}

const stepMapping: Record<string, number> = {
  'intent': 1,
  'upload': 2,
  'details': 3,
  'design': 4,
  'publish': 5,
  'complete': 6
};

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  const currentStepNumber = stepMapping[currentStep] || 1;

  return (
    <div className="flex items-center justify-center space-x-8 mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStepNumber;
        const isCurrent = stepNumber === currentStepNumber;
        
        return (
          <div key={step.number} className="flex flex-col items-center">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors
              ${isCompleted 
                ? 'bg-crd-green text-black' 
                : isCurrent 
                  ? 'bg-crd-blue text-white border-2 border-crd-blue' 
                  : 'bg-crd-mediumGray text-crd-lightGray'
              }
            `}>
              {isCompleted ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                stepNumber
              )}
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${isCurrent ? 'text-crd-white' : 'text-crd-lightGray'}`}>
                {step.title}
              </div>
              <div className="text-xs text-crd-lightGray mt-1">
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

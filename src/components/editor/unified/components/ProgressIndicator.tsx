
import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { CreationStep } from '../types';

interface ProgressIndicatorProps {
  steps: CreationStep[];
  currentStep: CreationStep;
  progress: number;
}

const stepLabels: Record<CreationStep, string> = {
  intent: 'Intent',
  create: 'Create Card',
  templates: 'Browse Templates',
  studio: 'Studio Preview',
  publish: 'Publish',
  complete: 'Complete'
};

export const ProgressIndicator = ({ steps, currentStep, progress }: ProgressIndicatorProps) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${isCompleted 
                  ? 'bg-crd-green text-black' 
                  : isCurrent 
                    ? 'bg-crd-blue text-white border-2 border-crd-blue' 
                    : 'bg-crd-mediumGray text-crd-lightGray'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-crd-white text-sm font-medium mt-2">
                {stepLabels[step]}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-crd-mediumGray/30 rounded-full h-2">
        <div 
          className="bg-crd-green h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

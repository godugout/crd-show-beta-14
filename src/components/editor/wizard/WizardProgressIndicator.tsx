
import React from 'react';
import { Check, Layout, Upload, Edit, Sparkles } from 'lucide-react';
import { useWizardContext } from './WizardContext';
import { useWizardNavigation } from './hooks/useWizardNavigation';

const STEP_ICONS = {
  template: Layout,
  upload: Upload,
  details: Edit,
  effects: Sparkles,
  publish: Check
};

export const WizardProgressIndicator: React.FC = () => {
  const { state } = useWizardContext();
  const { navigateToStep, canNavigateToStep, currentStepIndex } = useWizardNavigation();

  return (
    <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Progress Indicator */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {state.steps.map((step, index) => {
              const Icon = STEP_ICONS[step.id as keyof typeof STEP_ICONS] || Edit;
              const isActive = state.currentStepId === step.id;
              const isCompleted = step.completed;
              const canNavigate = canNavigateToStep(step.id);
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => navigateToStep(step.id)}
                      disabled={!canNavigate}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-crd-green text-black ring-2 ring-crd-green/50' 
                          : isCompleted 
                            ? 'bg-crd-green text-black hover:bg-crd-green/90' 
                            : canNavigate
                              ? 'bg-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/80'
                              : 'bg-crd-mediumGray/50 text-crd-lightGray/50 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                    </button>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-crd-green' : 
                        isCompleted ? 'text-white' : 'text-crd-lightGray'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-crd-lightGray/70 mt-1">
                        Step {step.number}
                      </p>
                    </div>
                  </div>
                  {index < state.steps.length - 1 && (
                    <div className={`flex-1 h-px mx-6 transition-colors duration-200 ${
                      isCompleted ? 'bg-crd-green' : 'bg-crd-mediumGray'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Progress Indicator */}
        <div className="md:hidden">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {state.steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  state.currentStepId === step.id
                    ? 'bg-crd-green'
                    : step.completed
                      ? 'bg-crd-green/70'
                      : 'bg-crd-mediumGray'
                }`}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-crd-green text-sm font-medium">
              Step {currentStepIndex + 1} of {state.steps.length}
            </p>
            <p className="text-white text-lg font-semibold mt-1">
              {state.steps.find(s => s.id === state.currentStepId)?.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

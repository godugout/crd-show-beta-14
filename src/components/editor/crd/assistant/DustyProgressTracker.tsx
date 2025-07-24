import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  status: 'incomplete' | 'in-progress' | 'complete';
  required: boolean;
}

interface DustyProgressTrackerProps {
  progress: ProgressStep[];
}

export const DustyProgressTracker: React.FC<DustyProgressTrackerProps> = ({ progress }) => {
  const getStepIcon = (status: string, required: boolean) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-crd-green" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-crd-blue animate-pulse" />;
      default:
        return <Circle className={`w-4 h-4 ${required ? 'text-crd-orange' : 'text-crd-mediumGray'}`} />;
    }
  };

  const completedSteps = progress.filter(step => step.status === 'complete').length;
  const progressPercentage = (completedSteps / progress.length) * 100;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <span className="text-crd-lightGray text-xs font-medium">Progress</span>
        <div className="flex-1 bg-crd-mediumGray/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-crd-blue to-crd-green h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-crd-white text-xs font-medium">{completedSteps}/{progress.length}</span>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-2 gap-2">
        {progress.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-2 p-2 rounded transition-colors ${
              step.status === 'in-progress' 
                ? 'bg-crd-blue/10 border border-crd-blue/30' 
                : 'bg-crd-mediumGray/10'
            }`}
          >
            {getStepIcon(step.status, step.required)}
            <span className={`text-xs ${
              step.status === 'complete' ? 'text-crd-green' :
              step.status === 'in-progress' ? 'text-crd-blue' :
              step.required ? 'text-crd-orange' : 'text-crd-lightGray'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
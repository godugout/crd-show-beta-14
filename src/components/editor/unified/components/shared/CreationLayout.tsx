import React from 'react';

interface CreationLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
}

export const CreationLayout = ({ 
  children, 
  title, 
  subtitle, 
  currentStep, 
  totalSteps 
}: CreationLayoutProps) => {
  return (
    <div className="h-screen flex flex-col bg-crd-darkest">
      {/* Header with Title and Progress */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-crd-mediumGray/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-crd-white mb-2">{title}</h1>
            <p className="text-crd-lightGray text-base">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3 text-base text-crd-lightGray">
            <span className="bg-crd-green text-black px-3 py-2 rounded-lg text-sm font-medium">
              Step {currentStep}
            </span>
            <span>of {totalSteps}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};
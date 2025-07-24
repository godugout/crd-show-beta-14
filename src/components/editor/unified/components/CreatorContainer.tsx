
import React from 'react';
import type { CreationStep } from '../types';

interface CreatorContainerProps {
  children: React.ReactNode;
  currentStep: CreationStep;
}

export const CreatorContainer = ({ children, currentStep }: CreatorContainerProps) => {
  const showNavigation = currentStep !== 'intent' && currentStep !== 'complete';

  return (
    <div className="min-h-screen bg-crd-darkest">
      {children}
      {/* Add bottom padding when navigation is visible to prevent content overlap */}
      {showNavigation && <div className="h-20" />}
    </div>
  );
};

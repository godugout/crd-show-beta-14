import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Smartphone, Zap, Palette, Camera } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  position: 'center' | 'bottom' | 'top';
  highlight?: string; // CSS selector for element to highlight
}

interface MobileOnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Mobile Studio',
    description: 'Experience your cards in stunning 3D with intuitive touch controls designed for mobile.',
    icon: Smartphone,
    position: 'center'
  },
  {
    id: 'touch-controls',
    title: 'Touch & Gesture Controls',
    description: 'Swipe left/right to navigate cards, pan to rotate, pinch to zoom, and pull down to refresh.',
    icon: Zap,
    position: 'center'
  },
  {
    id: 'customization',
    title: 'Customization Hub',
    description: 'Tap the settings button to access display cases, effects, and sharing options.',
    icon: Palette,
    position: 'bottom',
    highlight: '[data-testid="mobile-fab"]'
  },
  {
    id: 'view-modes',
    title: 'Switch View Modes',
    description: 'Toggle between 3D Studio and 2D Viewer modes for different experiences.',
    icon: Camera,
    position: 'center'
  }
];

export const MobileOnboardingTour: React.FC<MobileOnboardingTourProps> = ({
  isVisible,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isMobile } = useResponsiveBreakpoints();
  const { light, medium } = useHapticFeedback();

  useEffect(() => {
    // Reset tour when it becomes visible
    if (isVisible) {
      setCurrentStep(0);
    }
  }, [isVisible]);

  if (!isVisible || !isMobile) {
    return null;
  }

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    medium();
    
    setTimeout(() => {
      if (isLastStep) {
        onComplete();
      } else {
        setCurrentStep(prev => prev + 1);
      }
      setIsAnimating(false);
    }, 200);
  };

  const handlePrevious = () => {
    if (isAnimating || isFirstStep) return;
    
    setIsAnimating(true);
    light();
    
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 200);
  };

  const handleSkip = () => {
    light();
    onSkip();
  };

  const getPositionClasses = () => {
    switch (currentStepData.position) {
      case 'top':
        return 'top-20 left-4 right-4';
      case 'bottom':
        return 'bottom-32 left-4 right-4';
      case 'center':
      default:
        return 'top-1/2 left-4 right-4 -translate-y-1/2';
    }
  };

  const IconComponent = currentStepData.icon;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in">
        
        {/* Highlight circle for specific elements */}
        {currentStepData.highlight && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute w-20 h-20 rounded-full border-4 border-themed-accent animate-pulse"
              style={{
                // Position would be calculated based on the highlighted element
                bottom: '6rem',
                right: '6rem',
                transform: 'translate(50%, 50%)'
              }}
            />
          </div>
        )}

        {/* Tour content */}
        <div className={`absolute ${getPositionClasses()} z-[101]`}>
          <div className="bg-themed-base border border-themed-accent/20 rounded-2xl p-6 shadow-2xl animate-scale-in">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-themed-accent/20 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-themed-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-themed-primary">
                    {currentStepData.title}
                  </h3>
                  <span className="text-xs text-themed-secondary">
                    Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                  </span>
                </div>
              </div>
              
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="w-8 h-8 p-0 text-themed-secondary hover:text-themed-primary"
              >
                <X className="w-4 h-4" />
              </CRDButton>
            </div>

            {/* Content */}
            <div className={`transition-all duration-200 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <p className="text-themed-secondary text-sm leading-relaxed mb-6">
                {currentStepData.description}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-6">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-themed-accent'
                      : index < currentStep
                      ? 'w-2 bg-themed-accent/60'
                      : 'w-2 bg-themed-light'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </CRDButton>

              <CRDButton
                variant="primary"
                size="sm"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {isLastStep ? 'Get Started' : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </CRDButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
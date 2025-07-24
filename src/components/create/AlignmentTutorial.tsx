import React, { useState, useEffect } from 'react';
import { X, MousePointer2, Hand, Zap } from 'lucide-react';

interface AlignmentTutorialProps {
  isVisible: boolean;
  onClose: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  animation: string;
  duration: number;
  requirement?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Zoom In",
    description: "Scroll to zoom the card to 160% or larger",
    icon: <MousePointer2 className="w-6 h-6" />,
    animation: "zoom-gesture",
    duration: 3000,
    requirement: "160%+"
  },
  {
    id: 2,
    title: "Tilt Forward",
    description: "Drag to tilt the card forward at least 45°",
    icon: <Hand className="w-6 h-6" />,
    animation: "tilt-gesture",
    duration: 3000,
    requirement: "45°+"
  },
  {
    id: 3,
    title: "Drag Up",
    description: "Perform an upward drag gesture to trigger alignment",
    icon: <Zap className="w-6 h-6" />,
    animation: "drag-up-gesture",
    duration: 2000,
    requirement: ""
  }
];

export const AlignmentTutorial: React.FC<AlignmentTutorialProps> = ({
  isVisible,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      setIsPlaying(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isPlaying || !isVisible) return;

    const timer = setTimeout(() => {
      if (currentStep < tutorialSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
        // Auto-restart after a pause
        setTimeout(() => {
          setCurrentStep(0);
          setIsPlaying(true);
        }, 1000);
      }
    }, tutorialSteps[currentStep]?.duration || 3000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, isVisible]);

  if (!isVisible) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 tutorial-overlay bg-black/95 backdrop-blur-lg">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-overlay-controls bg-crd-dark/90 hover:bg-crd-dark text-white p-2 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Tutorial Content */}
      <div className="relative w-full h-full flex items-center justify-center pt-20">
        {/* Animated Card Representation - moved higher */}
        <div className="relative -mt-20">
          {/* Card Mock with CRD gradient and logo */}
          <div className={`
            relative w-64 h-96 bg-gradient-to-br from-orange-500 via-green-500 to-blue-500 
            rounded-2xl shadow-2xl transition-transform duration-1000 
            ${currentStep === 0 ? 'animate-zoom-in scale-110' : ''}
            ${currentStep === 1 ? 'animate-tilt-forward transform rotate-x-45' : ''}
            ${currentStep === 2 ? 'animate-drag-up-prep' : ''}
          `}>
            <div className="absolute inset-4 bg-black/20 rounded-xl flex items-center justify-center">
              <div className="text-white text-center">
                {/* Logo from uploaded image */}
                <img 
                  src="/lovable-uploads/6d3d517b-e7c2-447a-a3ea-55093de203bb.png" 
                  alt="Logo"
                  className="w-20 h-auto mx-auto mb-4"
                />
              </div>
            </div>
          </div>

          {/* Animated Cursor/Hand */}
          <div className={`
            absolute transition-all duration-1000 pointer-events-none
            ${currentStep === 0 ? 'animate-scroll-zoom top-1/2 right-[-60px]' : ''}
            ${currentStep === 1 ? 'animate-drag-tilt top-1/4 left-1/2 transform -translate-x-1/2' : ''}
            ${currentStep === 2 ? 'animate-drag-up-gesture bottom-10 left-1/2 transform -translate-x-1/2' : ''}
          `}>
            {currentStep === 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-full p-3 shadow-lg animate-pulse border border-white/20">
                <MousePointer2 className="w-6 h-6 text-white" />
              </div>
            )}
            {(currentStep === 1 || currentStep === 2) && (
              <div className="bg-white/10 backdrop-blur-md rounded-full p-3 shadow-lg border border-white/20">
                <Hand className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Drag Up Arrow for Step 3 */}
          {currentStep === 2 && (
            <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 animate-drag-up-arrow">
              <div className="text-white text-3xl">↑</div>
            </div>
          )}

        </div>

        {/* Instructions Panel - Fixed width for consistency */}
        <div className="absolute bottom-72 left-1/2 transform -translate-x-1/2 w-80 mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-crd-accent/20 p-2 rounded-lg">
              {currentTutorialStep?.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Step {currentStep + 1}: {currentTutorialStep?.title}
                {currentTutorialStep?.requirement && (
                  <span className="text-crd-green ml-2 text-base">
                    {currentTutorialStep.requirement}
                  </span>
                )}
              </h3>
              <p className="text-crd-lightGray text-sm">
                {currentTutorialStep?.description}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 mt-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-orange-400 animate-pulse'
                    : index < currentStep
                    ? 'bg-green-400'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Glass Button */}
          <button
            onClick={onClose}
            className={`w-full mt-4 backdrop-blur-md border py-3 px-4 rounded-xl transition-all duration-300 text-base font-medium shadow-lg hover:shadow-xl ${
              currentStep >= 2 
                ? 'bg-green-500/20 hover:bg-green-400/30 text-green-100 border-green-400/30' 
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
          >
            Got it, let me try!
          </button>
        </div>
      </div>
    </div>
  );
};
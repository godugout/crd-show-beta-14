import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, RotateCcw, Save, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VisualJourneyMap } from './components/VisualJourneyMap';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { DestinyStep } from './steps/DestinyStep';
import { FrameSelectionStep } from './steps/FrameSelectionStep';
import { ImageMagicStep } from './steps/ImageMagicStep';
import { CustomizationPlayground } from './steps/CustomizationPlayground';
import { FinalTouchesStep } from './steps/FinalTouchesStep';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { audioCueService } from '@/components/audio/AudioCueService';
import { gamificationService } from '@/services/gamification/gamificationService';
import { smartTemplateService } from '@/services/ai/smartTemplateService';
import { CollaborationWidget } from './components/CollaborationWidget';

interface InteractiveWizardProps {
  onComplete?: (cardData: any) => void;
  onCancel?: () => void;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
}

export interface WizardData {
  category?: string;
  frame?: any;
  image?: string;
  customizations?: Record<string, any>;
  finalSettings?: Record<string, any>;
}

export const InteractiveWizard: React.FC<InteractiveWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [undoHistory, setUndoHistory] = useState<WizardData[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [currentVote, setCurrentVote] = useState<any>(null);
  const cardEditor = useCardEditor();
  const haptic = useHapticFeedback();

  // Initialize gamification tracking
  useEffect(() => {
    gamificationService.awardXP('feature_explored');
  }, []);

  const steps: WizardStep[] = [
    {
      id: 'destiny',
      title: 'Choose Your Destiny',
      description: 'Select your card category',
      icon: <Sparkles className="w-5 h-5" />,
      completed: !!wizardData.category,
      current: currentStepIndex === 0
    },
    {
      id: 'frame',
      title: 'Frame Selection',
      description: 'Pick your perfect frame',
      icon: <div className="w-5 h-5 border-2 border-current rounded" />,
      completed: !!wizardData.frame,
      current: currentStepIndex === 1
    },
    {
      id: 'image',
      title: 'Image Magic',
      description: 'Upload and enhance your image',
      icon: <Wand2 className="w-5 h-5" />,
      completed: !!wizardData.image,
      current: currentStepIndex === 2
    },
    {
      id: 'customize',
      title: 'Customization Playground',
      description: 'Design your card elements',
      icon: <div className="w-5 h-5 grid grid-cols-2 grid-rows-2 gap-0.5">
        <div className="bg-current rounded-sm"></div>
        <div className="bg-current rounded-sm"></div>
        <div className="bg-current rounded-sm"></div>
        <div className="bg-current rounded-sm"></div>
      </div>,
      completed: !!wizardData.customizations,
      current: currentStepIndex === 3
    },
    {
      id: 'final',
      title: 'Final Touches',
      description: 'Perfect your masterpiece',
      icon: <div className="w-5 h-5 relative">
        <div className="absolute inset-0 bg-current rounded"></div>
        <Sparkles className="w-3 h-3 absolute top-0 right-0 text-background" />
      </div>,
      completed: !!wizardData.finalSettings,
      current: currentStepIndex === 4
    }
  ];

  const updateWizardData = (stepData: Partial<WizardData>) => {
    setUndoHistory(prev => [...prev, wizardData]);
    setWizardData(prev => {
      const newData = { ...prev, ...stepData };
      
      // Learn from user choices for smart templates
      if (stepData.category) {
        smartTemplateService.learnFromChoice({ type: 'category', value: stepData.category });
      }
      if (stepData.frame) {
        smartTemplateService.learnFromChoice({ type: 'layout', value: stepData.frame.layout || 'default' });
      }
      
      return newData;
    });
    
    // Audio feedback for data updates
    audioCueService.playSuccess();
    haptic.success();
  };

  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const previousState = undoHistory[undoHistory.length - 1];
      setWizardData(previousState);
      setUndoHistory(prev => prev.slice(0, -1));
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      // Track time spent on step
      const timeSpent = Date.now() - stepStartTime;
      if (timeSpent > 600000) { // 10 minutes
        gamificationService.awardXP('perfectionist', 20);
      }
      
      // Step completion rewards
      gamificationService.awardXP('step_completed', 10);
      
      setCurrentStepIndex(prev => prev + 1);
      setStepStartTime(Date.now());
      
      // Enhanced feedback
      audioCueService.playStepTransition();
      haptic.studioEnter();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setStepStartTime(Date.now());
      
      audioCueService.playClick();
      haptic.swipeNavigation();
    }
  };

  const handleStepNavigation = (stepIndex: number) => {
    // Allow navigation to completed steps or current step
    if (stepIndex <= currentStepIndex || steps[stepIndex - 1]?.completed) {
      setCurrentStepIndex(stepIndex);
      setStepStartTime(Date.now());
      
      audioCueService.playClick();
      haptic.cardInteraction();
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      // Award completion bonuses
      gamificationService.awardXP('card_created');
      
      // Convert wizard data to card data format
      const cardData = {
        title: `${wizardData.category} Card`,
        description: 'Created with Interactive Wizard',
        image: wizardData.image,
        frameId: wizardData.frame?.id,
        customizations: wizardData.customizations,
        settings: wizardData.finalSettings
      };
      
      // Celebration feedback
      audioCueService.playLevelUp();
      haptic.premiumUnlock();
      
      onComplete(cardData);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <DestinyStep
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <FrameSelectionStep
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <ImageMagicStep
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <CustomizationPlayground
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <FinalTouchesStep
            data={wizardData}
            onUpdate={updateWizardData}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />
      
      {/* Visual Journey Map */}
      <VisualJourneyMap
        steps={steps}
        currentStepIndex={currentStepIndex}
        onStepClick={handleStepNavigation}
      />

      {/* Persistent Toolbar */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={undoHistory.length === 0}
          className="bg-background/80 backdrop-blur-sm border-white/10 hover:bg-background/90"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border-white/10 hover:bg-background/90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        {onCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="bg-background/80 backdrop-blur-sm border-white/10 hover:bg-background/90"
          >
            Exit
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeInOut",
              scale: { duration: 0.4 }
            }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant
        currentStep={steps[currentStepIndex]}
        visible={showAIAssistant}
        onToggle={() => setShowAIAssistant(!showAIAssistant)}
        wizardData={wizardData}
      />

      {/* Collaboration Widget */}
      <CollaborationWidget
        isCollaborating={isCollaborating}
        collaborators={collaborators}
        currentVote={currentVote}
        onToggleCollaboration={() => setIsCollaborating(!isCollaborating)}
        onStartVote={(type, options) => {
          setCurrentVote({
            id: Date.now().toString(),
            type,
            options,
            votes: {},
            createdBy: 'current-user',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
          });
        }}
        onVote={(voteId, option) => {
          setCurrentVote((prev: any) => prev ? {
            ...prev,
            votes: { ...prev.votes, 'current-user': option }
          } : null);
        }}
      />

      {/* Progress Indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <Card className="px-4 py-2 bg-background/80 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
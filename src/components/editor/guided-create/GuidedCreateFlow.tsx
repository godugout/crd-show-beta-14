import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCardEditor } from '@/hooks/useCardEditor';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Palette,
  Settings,
  Share,
  Sparkles,
  Upload,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

// Step Components
import { CustomizationStep } from './steps/CustomizationStep';
import { DetailsStep } from './steps/DetailsStep';
import { PhotoUploadStep } from './steps/PhotoUploadStep';
import { PreviewStep } from './steps/PreviewStep';
import { PublishStep } from './steps/PublishStep';
import { TemplateSelectionStep } from './steps/TemplateSelectionStep';

interface GuidedCreateFlowProps {
  onComplete?: (cardData: any) => void;
  onCancel?: () => void;
  initialTemplate?: {
    id: string;
    name: string;
    image_url: string;
    effects: string[];
    sport?: string;
  };
}

type StepType =
  | 'upload'
  | 'template'
  | 'customize'
  | 'details'
  | 'preview'
  | 'publish';

interface Step {
  id: StepType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 'upload',
    title: 'Upload Photo',
    description: 'Choose your card image',
    icon: <Upload className='w-5 h-5' />,
  },
  {
    id: 'template',
    title: 'Select Template',
    description: 'Pick a card design',
    icon: <Palette className='w-5 h-5' />,
  },
  {
    id: 'customize',
    title: 'Customize Design',
    description: 'Personalize your card',
    icon: <Settings className='w-5 h-5' />,
  },
  {
    id: 'details',
    title: 'Add Details',
    description: 'Card information',
    icon: <Sparkles className='w-5 h-5' />,
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Final review',
    icon: <Eye className='w-5 h-5' />,
  },
  {
    id: 'publish',
    title: 'Publish',
    description: 'Share your creation',
    icon: <Share className='w-5 h-5' />,
  },
];

export const GuidedCreateFlow: React.FC<GuidedCreateFlowProps> = ({
  onComplete,
  onCancel,
  initialTemplate,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({
    template: initialTemplate ? { selectedTemplate: initialTemplate } : {},
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const cardEditor = useCardEditor();

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const updateStepData = (stepId: string, data: any) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data },
    }));
  };

  const canProceed = () => {
    switch (currentStep.id) {
      case 'upload':
        return stepData.upload?.imageUrl;
      case 'template':
        return stepData.template?.selectedTemplate;
      case 'customize':
        return true; // Customization is optional
      case 'details':
        return stepData.details?.title?.trim();
      case 'preview':
        return true;
      case 'publish':
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!canProceed()) {
      toast.error('Please complete the current step');
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      await handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      // Compile all step data
      const cardData = {
        title: stepData.details?.title || 'Untitled Card',
        description: stepData.details?.description || '',
        image_url: stepData.upload?.imageUrl,
        template_id: stepData.template?.selectedTemplate?.id,
        rarity: stepData.details?.rarity || 'common',
        series: stepData.details?.series || '',
        tags: stepData.details?.tags || [],
        customization: stepData.customize,
        publishing_options: stepData.publish,
      };

      // Update card editor with final data
      Object.entries(cardData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          cardEditor.updateCardField(key as any, value);
        }
      });

      await cardEditor.saveCard();
      toast.success('Card created successfully!');
      onComplete?.(cardData);
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      data: stepData[currentStep.id] || {},
      onUpdate: (data: any) => updateStepData(currentStep.id, data),
      cardData: cardEditor.cardData,
      onFieldUpdate: cardEditor.updateCardField,
    };

    switch (currentStep.id) {
      case 'upload':
        return <PhotoUploadStep {...stepProps} />;
      case 'template':
        return <TemplateSelectionStep {...stepProps} />;
      case 'customize':
        return <CustomizationStep {...stepProps} />;
      case 'details':
        return <DetailsStep {...stepProps} />;
      case 'preview':
        return <PreviewStep {...stepProps} />;
      case 'publish':
        return <PublishStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5'>
      {/* Header */}
      <div className='border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button variant='ghost' size='sm' onClick={onCancel}>
                <ChevronLeft className='w-4 h-4 mr-2' />
                Back
              </Button>
              <div>
                <h1 className='text-xl font-semibold'>Guided Card Creator</h1>
                <p className='text-sm text-muted-foreground'>
                  Step {currentStepIndex + 1} of {steps.length}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='w-64'>
                <Progress value={progress} className='h-2' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigator */}
      <div className='border-b bg-background/50'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  index === currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : index < currentStepIndex
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground'
                }`}
              >
                {step.icon}
                <div className='hidden sm:block'>
                  <div className='font-medium text-sm'>{step.title}</div>
                  <div className='text-xs opacity-80'>{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <Card className='border-0 shadow-xl bg-background/80 backdrop-blur-sm'>
          <div className='p-8'>
            <div className='mb-8'>
              <div className='flex items-center gap-3 mb-2'>
                {currentStep.icon}
                <h2 className='text-2xl font-bold'>{currentStep.title}</h2>
              </div>
              <p className='text-muted-foreground'>{currentStep.description}</p>
            </div>

            <AnimatePresence mode='wait'>
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>

        {/* Navigation */}
        <div className='flex justify-between mt-8'>
          <Button
            variant='outline'
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className='w-4 h-4 mr-2' />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isProcessing}
            className='min-w-[120px]'
          >
            {isProcessing ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                Creating...
              </div>
            ) : currentStepIndex === steps.length - 1 ? (
              'Complete'
            ) : (
              <>
                Next
                <ChevronRight className='w-4 h-4 ml-2' />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};


import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import type { CreationMode, CreationStep } from '../types';

interface UseUniversalCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

// Simple static configs to prevent re-creation
const MODE_CONFIGS = {
  quick: {
    id: 'quick' as CreationMode,
    title: 'Quick Create',
    description: 'Simple form-based card creation',
    icon: 'Zap',
    steps: ['intent', 'create', 'templates', 'publish'] as CreationStep[],
    features: ['AI assistance', 'Smart defaults', 'One-click publish']
  },
  guided: {
    id: 'guided' as CreationMode,
    title: 'Guided Create',
    description: 'Step-by-step wizard with help',
    icon: 'Navigation',
    steps: ['intent', 'create', 'templates', 'studio', 'publish'] as CreationStep[],
    features: ['Progressive guidance', 'Templates', '3D preview']
  },
  advanced: {
    id: 'advanced' as CreationMode,
    title: 'Advanced Create',
    description: 'Full editor with all features',
    icon: 'Settings',
    steps: ['intent', 'create', 'templates', 'studio', 'publish'] as CreationStep[],
    features: ['Advanced cropping', 'Custom effects', '360° environments']
  },
  bulk: {
    id: 'bulk' as CreationMode,
    title: 'Bulk Create',
    description: 'Create multiple cards at once',
    icon: 'Copy',
    steps: ['intent', 'create', 'complete'] as CreationStep[],
    features: ['Batch processing', 'AI analysis', 'Template application']
  }
};

export const useUniversalCreator = ({
  initialMode = 'quick',
  onComplete,
  onCancel
}: UseUniversalCreatorProps = {}) => {
  console.log('🎯 useUniversalCreator: Initializing with mode:', initialMode);
  
  const navigate = useNavigate();
  
  // Stable refs for callbacks
  const onCompleteRef = useRef(onComplete);
  const onCancelRef = useRef(onCancel);
  onCompleteRef.current = onComplete;
  onCancelRef.current = onCancel;
  
  // Simple state - no complex nested objects
  const [mode, setMode] = useState<CreationMode>(initialMode);
  const [currentStep, setCurrentStep] = useState<CreationStep>('intent');
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize card editor with stable config
  const cardEditor = useCardEditor({
    autoSave: false,
    autoSaveInterval: 0
  });

  // Get current config
  const currentConfig = MODE_CONFIGS[mode];
  if (!currentConfig) {
    console.error('⚠️ useUniversalCreator: Invalid mode:', mode);
  }

  // Calculate progress
  const progress = currentConfig 
    ? (currentConfig.steps.indexOf(currentStep) / (currentConfig.steps.length - 1)) * 100 
    : 0;

  // Navigation state
  const currentIndex = currentConfig?.steps.indexOf(currentStep) ?? -1;
  const canGoBack = currentIndex > 0;
  const canAdvance = currentIndex < (currentConfig?.steps.length ?? 0) - 1;

  // Actions
  const handleSetMode = useCallback((newMode: CreationMode) => {
    console.log('🎯 useUniversalCreator: Setting mode to', newMode);
    const config = MODE_CONFIGS[newMode];
    if (config) {
      setMode(newMode);
      // Move to first step after intent
      const nextStep = config.steps.length > 1 ? config.steps[1] : 'create';
      setCurrentStep(nextStep);
      setErrors({});
      setCreationError(null);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (!currentConfig) return;
    
    const currentIndex = currentConfig.steps.indexOf(currentStep);
    if (currentIndex < currentConfig.steps.length - 1) {
      const nextStep = currentConfig.steps[currentIndex + 1];
      console.log('➡️ useUniversalCreator: Moving to next step:', nextStep);
      setCurrentStep(nextStep);
      setErrors({});
    }
  }, [currentConfig, currentStep]);

  const previousStep = useCallback(() => {
    if (!currentConfig) return;
    
    const currentIndex = currentConfig.steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = currentConfig.steps[currentIndex - 1];
      console.log('⬅️ useUniversalCreator: Moving to previous step:', prevStep);
      setCurrentStep(prevStep);
      setErrors({});
    }
  }, [currentConfig, currentStep]);

  const validateStep = useCallback(() => {
    if (!cardEditor?.cardData) {
      console.warn('⚠️ useUniversalCreator: No card data for validation');
      return false;
    }
    
    const { cardData } = cardEditor;
    
    switch (currentStep) {
      case 'intent':
        return true;
        
      case 'create':
        const hasImage = !!cardData.image_url;
        const hasTitle = cardData.title && cardData.title.trim().length > 0;
        const titleValid = hasTitle && cardData.title !== 'My New Card';
        
        if (!hasImage) {
          setErrors({ create: 'Please upload an image to continue' });
          return false;
        }
        if (!titleValid) {
          setErrors({ create: 'Please provide a meaningful title for your card' });
          return false;
        }
        setErrors({});
        return true;
        
      case 'templates':
      case 'studio':
      case 'publish':
      default:
        return true;
    }
  }, [currentStep, cardEditor?.cardData]);

  const completeCreation = useCallback(async () => {
    console.log('🚀 useUniversalCreator: Starting card creation');
    setIsCreating(true);
    setCreationError(null);

    try {
      if (!cardEditor?.cardData) {
        throw new Error('No card data available');
      }

      if (!cardEditor.cardData.image_url) {
        throw new Error('Card must have an image');
      }

      if (!cardEditor.cardData.title || cardEditor.cardData.title.trim() === '' || cardEditor.cardData.title === 'My New Card') {
        throw new Error('Card must have a meaningful title');
      }

      const success = await cardEditor.saveCard();
      
      if (success) {
        setCurrentStep('complete');
        toast.success('Card created successfully!');
        
        if (onCompleteRef.current) {
          onCompleteRef.current(cardEditor.cardData);
        }
        
        console.log('✅ useUniversalCreator: Card created successfully');
      } else {
        throw new Error('Failed to save card');
      }
    } catch (error) {
      console.error('❌ useUniversalCreator: Error creating card:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create card';
      setCreationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [cardEditor]);

  const goToGallery = useCallback(() => {
    console.log('🏠 useUniversalCreator: Navigating to gallery');
    navigate('/gallery');
  }, [navigate]);

  const startOver = useCallback(() => {
    console.log('🔄 useUniversalCreator: Starting over');
    if (!cardEditor) return;
    
    // Reset card data
    cardEditor.updateCardField('title', 'My New Card');
    cardEditor.updateCardField('description', '');
    cardEditor.updateCardField('image_url', undefined);
    cardEditor.updateCardField('thumbnail_url', undefined);
    
    // Reset UI state
    setMode(initialMode);
    setCurrentStep('intent');
    setCreationError(null);
    setErrors({});
    setIsCreating(false);
  }, [cardEditor, initialMode]);

  const updateState = useCallback((updates: Partial<{ currentStep: CreationStep; errors: Record<string, string> }>) => {
    console.log('🔄 useUniversalCreator: State update:', updates);
    if (updates.currentStep) setCurrentStep(updates.currentStep);
    if (updates.errors) setErrors(updates.errors);
  }, []);

  // Build stable state object
  const state = {
    mode,
    currentStep,
    intent: { mode },
    canAdvance,
    canGoBack,
    progress,
    errors,
    isCreating,
    creationError,
    isInitializing: false
  };

  console.log('✅ useUniversalCreator: Hook ready, current step:', currentStep);

  return {
    state,
    cardEditor,
    modeConfigs: Object.values(MODE_CONFIGS),
    currentConfig,
    actions: {
      setMode: handleSetMode,
      nextStep,
      previousStep,
      validateStep,
      completeCreation,
      updateState,
      goToGallery,
      startOver
    }
  };
};

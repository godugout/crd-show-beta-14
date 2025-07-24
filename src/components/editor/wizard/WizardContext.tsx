import React, { createContext, useContext, useState, ReactNode, useReducer } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import type { CardData, DesignTemplate, CardTemplate } from '@/hooks/useCardEditor';

interface WizardState {
  currentStep: number;
  selectedPhoto: string | null;
  selectedTemplate: CardTemplate | null;
  aiAnalysisComplete: boolean;
  isProcessing: boolean;
  cardData: CardData;
  steps: Array<{
    id: string;
    title: string;
    number: number;
    completed: boolean;
    valid: boolean;
  }>;
  currentStepId: string;
  isLoading: boolean;
  lastSaved?: string;
}

interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleTemplateSelect: (template: CardTemplate) => void;
  handleAiAnalysis: (analysisData: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleComplete: () => Promise<void>;
  updatePublishingOptions: (options: any) => void;
  updateCreatorAttribution: (attribution: any) => void;
  updateCardField: (field: keyof CardData, value: any) => void;
}

type WizardAction = 
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'SET_STEP_VALIDITY'; payload: { stepId: string; valid: boolean } }
  | { type: 'MARK_STEP_COMPLETED'; payload: string }
  | { type: 'MARK_SAVED' }
  | { type: 'UPDATE_CARD_DATA'; payload: Partial<CardData> }
  | { type: 'SET_LOADING'; payload: boolean };

interface WizardContextType {
  wizardState: WizardState;
  handlers: WizardHandlers;
  state: WizardState; // Add this for backward compatibility
  dispatch: React.Dispatch<WizardAction>; // Add this for backward compatibility
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a WizardProvider');
  }
  return context;
};

const initialSteps = [
  { id: 'upload', title: 'Upload & Frames', number: 1, completed: false, valid: false },
  { id: 'effects', title: 'Effects & Lighting', number: 2, completed: false, valid: true },
  { id: 'publish', title: 'Publish & Share', number: 3, completed: false, valid: false }
];

const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { 
        ...state, 
        currentStepId: action.payload,
        currentStep: state.steps.findIndex(s => s.id === action.payload) + 1
      };
    case 'SET_STEP_VALIDITY':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload.stepId
            ? { ...step, valid: action.payload.valid }
            : step
        )
      };
    case 'MARK_STEP_COMPLETED':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload
            ? { ...step, completed: true }
            : step
        )
      };
    case 'MARK_SAVED':
      return {
        ...state,
        lastSaved: new Date().toISOString()
      };
    case 'UPDATE_CARD_DATA':
      return {
        ...state,
        cardData: { ...state.cardData, ...action.payload }
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

interface WizardProviderProps {
  children: ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const cardEditor = useCardEditor();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const initialWizardState: WizardState = {
    currentStep: 1,
    selectedPhoto,
    selectedTemplate,
    aiAnalysisComplete,
    isProcessing,
    cardData: cardEditor.cardData,
    steps: initialSteps,
    currentStepId: 'upload',
    isLoading: false
  };

  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);

  const handlers: WizardHandlers = {
    handlePhotoSelect: (photo: string) => {
      console.log('📸 Photo selected:', photo);
      setSelectedPhoto(photo);
      cardEditor.updateCardField('image_url', photo);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { image_url: photo } });
    },

    handleTemplateSelect: (template: CardTemplate) => {
      console.log('🎨 Template selected:', template);
      setSelectedTemplate(template);
      cardEditor.updateCardField('template_id', template.id);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { template_id: template.id } });
    },

    handleAiAnalysis: (analysisData: any) => {
      console.log('🤖 AI analysis complete:', analysisData);
      
      const updates: Partial<CardData> = {};
      if (analysisData?.title) {
        updates.title = analysisData.title;
        cardEditor.updateCardField('title', analysisData.title);
      }
      if (analysisData?.description) {
        updates.description = analysisData.description;
        cardEditor.updateCardField('description', analysisData.description);
      }
      if (analysisData?.rarity) {
        updates.rarity = analysisData.rarity;
        cardEditor.updateCardField('rarity', analysisData.rarity);
      }
      if (analysisData?.tags) {
        updates.tags = analysisData.tags;
        cardEditor.updateCardField('tags', analysisData.tags);
      }
      
      dispatch({ type: 'UPDATE_CARD_DATA', payload: updates });
      setAiAnalysisComplete(true);
    },

    handleNext: () => {
      const nextStep = Math.min(state.currentStep + 1, 3);
      const nextStepId = initialSteps[nextStep - 1]?.id || 'upload';
      console.log('➡️ Moving to step:', nextStep);
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStepId });
    },

    handleBack: () => {
      const prevStep = Math.max(state.currentStep - 1, 1);
      const prevStepId = initialSteps[prevStep - 1]?.id || 'upload';
      console.log('⬅️ Moving to step:', prevStep);
      dispatch({ type: 'SET_CURRENT_STEP', payload: prevStepId });
    },

    handleComplete: async () => {
      console.log('✅ Completing wizard with card data:', state.cardData);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        await cardEditor.saveCard();
        console.log('✅ Card saved successfully');
      } catch (error) {
        console.error('❌ Error saving card:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    updatePublishingOptions: (options: any) => {
      console.log('📤 Publishing options updated:', options);
      cardEditor.updateCardField('publishing_options', options);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { publishing_options: options } });
    },

    updateCreatorAttribution: (attribution: any) => {
      console.log('👤 Creator attribution updated:', attribution);
      cardEditor.updateCardField('creator_attribution', attribution);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { creator_attribution: attribution } });
    },

    updateCardField: (field: keyof CardData, value: any) => {
      console.log(`🔄 Updating field ${String(field)}:`, value);
      cardEditor.updateCardField(field, value);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { [field]: value } });
    }
  };

  // Keep wizardState for backward compatibility
  const wizardState: WizardState = {
    ...state,
    selectedPhoto,
    selectedTemplate,
    aiAnalysisComplete,
    isProcessing,
    cardData: cardEditor.cardData
  };

  console.log('🧙 WizardProvider: Rendering with state:', wizardState);

  return (
    <WizardContext.Provider value={{ 
      wizardState, 
      handlers, 
      state: wizardState, // Add this for backward compatibility
      dispatch // Add this for backward compatibility
    }}>
      {children}
    </WizardContext.Provider>
  );
};


import type { UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';
import type { CardData, DesignTemplate, PublishingOptions, CreatorAttribution } from '@/hooks/useCardEditor';

export interface WizardStep {
  number: number;
  title: string;
  description: string;
}

export interface WizardState {
  currentStep: number;
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  aiAnalysisComplete: boolean;
}

export interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleAiAnalysis: (analysis: UnifiedAnalysisResult) => void;
  handleTemplateSelect: (template: DesignTemplate) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleComplete: () => Promise<void>;
  updatePublishingOptions: (key: keyof PublishingOptions, value: any) => void;
  updateCreatorAttribution: (key: keyof CreatorAttribution, value: any) => void;
  updateCardField: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
}

export interface EnhancedCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
}

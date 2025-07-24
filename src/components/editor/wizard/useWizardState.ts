
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { unifiedCardAnalyzer, UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';
import { useCardEditor, CardData, DesignTemplate } from '@/hooks/useCardEditor';
import { useWizardTemplates } from './hooks/useWizardTemplates';
import type { WizardState, WizardHandlers } from './types';

export const useWizardState = (onComplete: (cardData: CardData) => void) => {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    selectedPhoto: '',
    selectedTemplate: null,
    aiAnalysisComplete: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const { cardData, updateCardField, saveCard } = useCardEditor();
  const { templates } = useWizardTemplates();
  const cardEditor = useCardEditor();

  const handlePhotoSelect = useCallback((photo: string) => {
    setWizardState(prev => ({ ...prev, selectedPhoto: photo }));
    updateCardField('image_url', photo);
    updateCardField('thumbnail_url', photo);
  }, [updateCardField]);

  const handleAiAnalysis = useCallback((analysis: UnifiedAnalysisResult) => {
    console.log('📊 AI Analysis received:', analysis);
    
    // Map the unified analysis result to card data
    updateCardField('title', analysis.title);
    updateCardField('description', analysis.description);
    updateCardField('rarity', analysis.rarity);
    updateCardField('tags', analysis.tags);
    
    // Store additional metadata from analysis
    const designMetadata = {
      ...cardData.design_metadata,
      aiAnalysis: {
        confidence: analysis.confidence,
        playerName: analysis.playerName,
        teamName: analysis.teamName,
        year: analysis.year,
        manufacturer: analysis.manufacturer,
        condition: analysis.condition,
        estimatedValue: analysis.estimatedValue,
        specialFeatures: analysis.specialFeatures,
        sources: analysis.sources,
        category: analysis.category,
        type: analysis.type
      }
    };
    
    updateCardField('design_metadata', designMetadata);
    
    setWizardState(prev => ({ ...prev, aiAnalysisComplete: true }));
    toast.success('AI analysis complete! Card details populated.');
  }, [updateCardField, cardData.design_metadata]);

  const handleTemplateSelect = useCallback((template: DesignTemplate) => {
    setWizardState(prev => ({ ...prev, selectedTemplate: template }));
    updateCardField('template_id', template.id);
  }, [updateCardField]);

  const handleNext = useCallback(() => {
    setWizardState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4)
    }));
  }, []);

  const handleBack = useCallback(() => {
    setWizardState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  }, []);

  const handleComplete = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveCard();
      toast.success('Card saved successfully!');
      onComplete(cardData);
    } catch (error) {
      console.error('Failed to save card:', error);
      toast.error('Failed to save card. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [saveCard, onComplete, cardData]);

  const updatePublishingOptions = useCallback((key: keyof CardData['publishing_options'], value: any) => {
    const updatedOptions = {
      ...cardData.publishing_options,
      [key]: value
    };
    updateCardField('publishing_options', updatedOptions);
  }, [cardData.publishing_options, updateCardField]);

  const updateCreatorAttribution = useCallback((key: keyof CardData['creator_attribution'], value: any) => {
    const updatedAttribution = {
      ...cardData.creator_attribution,
      [key]: value
    };
    updateCardField('creator_attribution', updatedAttribution);
  }, [cardData.creator_attribution, updateCardField]);

  const updateCardFieldHandler = useCallback(<K extends keyof CardData>(field: K, value: CardData[K]) => {
    updateCardField(field, value);
  }, [updateCardField]);

  return {
    wizardState,
    cardData,
    handlers: {
      handlePhotoSelect,
      handleAiAnalysis,
      handleTemplateSelect,
      handleNext,
      handleBack,
      handleComplete,
      updatePublishingOptions,
      updateCreatorAttribution,
      updateCardField: updateCardFieldHandler
    } as WizardHandlers,
    isSaving,
    templates,
    cardEditor,
    updateCardField: updateCardFieldHandler
  };
};

import React from 'react';
import { IntentStep } from './steps/IntentStep';
import { CreateStep } from './steps/CreateStep';
import { TemplateGalleryStep } from './steps/TemplateGalleryStep';
import { StudioPreviewStep } from './steps/StudioPreviewStep';
import { PublishStep } from './steps/PublishStep';
import { CompleteStep } from './steps/CompleteStep';
import type { CreationMode, CreationStep } from '../types';
import type { CardData } from '@/hooks/useCardEditor';

interface StepContentProps {
  step: CreationStep;
  mode: CreationMode;
  cardData: CardData | null;
  onModeSelect: (mode: CreationMode) => void;
  onPhotoSelect: (photo: string) => void;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
  onBulkUpload: () => void;
  onGoToGallery: () => void;
  onStartOver: () => void;
}

export const StepContent = ({
  step,
  mode,
  cardData,
  onModeSelect,
  onPhotoSelect,
  onFieldUpdate,
  onBulkUpload,
  onGoToGallery,
  onStartOver
}: StepContentProps) => {
  const defaultCardData: Partial<CardData> = {
    title: 'My New Card',
    description: '',
    rarity: 'common',
    tags: [],
    image_url: undefined,
    thumbnail_url: undefined
  };

  const safeCardData = cardData || (defaultCardData as CardData);

  switch (step) {
    case 'intent':
      return (
        <IntentStep
          onModeSelect={onModeSelect}
          onBulkUpload={onBulkUpload}
        />
      );

    case 'create':
      return (
        <CreateStep
          mode={mode}
          cardData={safeCardData}
          onFieldUpdate={onFieldUpdate}
        />
      );

    case 'templates':
      return (
        <TemplateGalleryStep
          mode={mode}
          cardData={safeCardData}
          onFieldUpdate={onFieldUpdate}
        />
      );

    case 'studio':
      return (
        <StudioPreviewStep
          mode={mode}
          cardData={safeCardData}
          onFieldUpdate={onFieldUpdate}
        />
      );

    case 'publish':
      return (
        <PublishStep
          mode={mode}
          cardData={safeCardData}
          onFieldUpdate={onFieldUpdate}
        />
      );

    case 'complete':
      return (
        <CompleteStep
          mode={mode}
          cardData={safeCardData}
          onGoToGallery={onGoToGallery}
          onStartOver={onStartOver}
        />
      );

    default:
      return null;
  }
};
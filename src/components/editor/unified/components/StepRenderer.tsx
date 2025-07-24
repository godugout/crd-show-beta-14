
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreationMode, CreationStep } from '../types';
import type { CardData } from '@/hooks/useCardEditor';

// Import step components
import { IntentStep } from './steps/IntentStep';
import { CreateStep } from './steps/CreateStep';
import { TemplateGalleryStep } from './steps/TemplateGalleryStep';
import { StudioPreviewStep } from './steps/StudioPreviewStep';
import { PublishStep } from './steps/PublishStep';
import { CompleteStep } from './steps/CompleteStep';

interface StepRendererProps {
  currentStep: CreationStep;
  selectedMode: CreationMode;
  cardData: CardData;
  onModeSelect: (mode: CreationMode) => void;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
  onStartOver: () => void;
}

export const StepRenderer = ({
  currentStep,
  selectedMode,
  cardData,
  onModeSelect,
  onFieldUpdate,
  onStartOver
}: StepRendererProps) => {
  const navigate = useNavigate();

  switch (currentStep) {
    case 'intent':
      return (
        <IntentStep
          onModeSelect={onModeSelect}
          onBulkUpload={() => navigate('/cards/bulk-upload')}
        />
      );
    case 'create':
      return (
        <CreateStep
          mode={selectedMode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    case 'templates':
      return (
        <TemplateGalleryStep
          mode={selectedMode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    case 'studio':
      return (
        <StudioPreviewStep
          mode={selectedMode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    case 'publish':
      return (
        <PublishStep
          mode={selectedMode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    case 'complete':
      return (
        <CompleteStep
          mode={selectedMode}
          cardData={cardData}
          onGoToGallery={() => navigate('/gallery')}
          onStartOver={onStartOver}
        />
      );
    default:
      return <div>Unknown step</div>;
  }
};

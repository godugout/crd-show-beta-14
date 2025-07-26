import React from 'react';
import { useUnifiedCreator } from './hooks/useUnifiedCreator';
import { StepRenderer } from './components/StepRenderer';
import { CreationHeader } from './components/CreationHeader';
import type { CreationMode } from './types';
import type { CardData } from '@/hooks/useCardEditor';

interface UnifiedCreationInterfaceProps {
  initialMode?: CreationMode;
  initialCardData?: CardData | null;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
  showHeader?: boolean;
}

export const UnifiedCreationInterface: React.FC<UnifiedCreationInterfaceProps> = ({
  initialMode = 'quick',
  initialCardData = null,
  onComplete,
  onCancel,
  showHeader = true
}) => {
  const {
    state,
    cardEditor,
    modeConfigs,
    currentConfig,
    actions
  } = useUnifiedCreator({
    initialMode,
    onComplete,
    onCancel
  });

  // Initialize with provided card data if available
  const hasInitialized = React.useRef(false);
  
  React.useEffect(() => {
    if (initialCardData && cardEditor && !hasInitialized.current) {
      // Update the card editor with the initial data
      Object.entries(initialCardData).forEach(([key, value]) => {
        if (key !== 'id' && cardEditor.updateCardField) {
          cardEditor.updateCardField(key as keyof CardData, value);
        }
      });
      hasInitialized.current = true;
    }
  }, [initialCardData, cardEditor?.cardData?.id]); // Use stable ID instead of cardEditor object

  return (
    <div className="h-full w-full flex flex-col bg-crd-darkest">
      {/* Header */}
      {showHeader && (
        <CreationHeader
          currentStep={state.currentStep}
          mode={state.mode}
          modeConfigs={modeConfigs}
          onModeChange={actions.switchMode}
          canGoBack={state.canGoBack}
          onBack={actions.previousStep}
          onCancel={actions.cancelCreation}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <StepRenderer
          currentStep={state.currentStep}
          selectedMode={state.mode}
          cardData={cardEditor?.cardData}
          onModeSelect={actions.setMode}
          onFieldUpdate={cardEditor?.updateCardField}
          onStartOver={actions.startOver}
        />
      </div>
    </div>
  );
};
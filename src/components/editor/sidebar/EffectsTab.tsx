
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuickAdjustments } from './effects/QuickAdjustments';
import { EffectPresets } from './effects/EffectPresets';
import { EffectsPreview } from './effects/EffectsPreview';
import { AdvancedEffectsControls } from '../effects/AdvancedEffectsControls';
import { EnhancedEffectsList } from '@/components/viewer/components/EnhancedEffectsList';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useEnhancedCardEffects } from '@/components/viewer/hooks/useEnhancedCardEffects';

interface EffectsTabProps {
  searchQuery?: string;
  onEffectsComplete?: () => void;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const EffectsTab = ({ searchQuery = '', onEffectsComplete, cardEditor }: EffectsTabProps) => {
  const { effectValues, handleEffectChange } = useEnhancedCardEffects();

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Visual Effects</h3>
          <p className="text-crd-lightGray text-sm">
            Add stunning visual effects to your card
          </p>
        </div>

        {/* Advanced Effects Controls - only show if cardEditor is available */}
        {cardEditor && <AdvancedEffectsControls cardEditor={cardEditor} />}

        <QuickAdjustments />
        
        {/* Enhanced Effects List */}
        <EnhancedEffectsList
          effectValues={effectValues}
          onEffectChange={handleEffectChange}
          searchQuery={searchQuery}
        />
        
        <EffectPresets />
        <EffectsPreview />
      </div>
    </ScrollArea>
  );
};

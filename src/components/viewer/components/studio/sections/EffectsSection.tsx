import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { StableEffectsList } from '../../StableEffectsList';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';

interface EffectsSectionProps {
  effectValues: EffectValues;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
}

export const EffectsSection: React.FC<EffectsSectionProps> = ({
  effectValues,
  isOpen,
  onToggle,
  onEffectChange,
  selectedPresetId
}) => {
  // Count active effects
  const activeEffectCount = Object.entries(effectValues || {}).filter(([_, effect]) => 
    effect && typeof effect.intensity === 'number' && effect.intensity > 0
  ).length;
  
  const statusText = activeEffectCount > 0 
    ? `${activeEffectCount} Active Effect${activeEffectCount !== 1 ? 's' : ''}`
    : "No Active Effects";

  return (
    <CollapsibleSection
      title="Effects"
      emoji="✨"
      statusText={statusText}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <StableEffectsList
        effectValues={effectValues}
        onEffectChange={onEffectChange}
        selectedPresetId={selectedPresetId}
      />
    </CollapsibleSection>
  );
};
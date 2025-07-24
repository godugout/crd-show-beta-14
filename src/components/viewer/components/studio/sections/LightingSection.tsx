
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { LightingSection as LightingContent } from '../../LightingSection';
import type { LightingPreset } from '../../../types';

interface LightingSectionProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const LightingSection: React.FC<LightingSectionProps> = ({
  isOpen,
  onToggle,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
}) => {
  return (
    <CollapsibleSection
      title="Lighting"
      emoji="💡"
      statusText={selectedLighting.name}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <LightingContent
        selectedLighting={selectedLighting}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        onLightingChange={onLightingChange}
        onBrightnessChange={onBrightnessChange}
        onInteractiveLightingToggle={onInteractiveLightingToggle}
      />
    </CollapsibleSection>
  );
};

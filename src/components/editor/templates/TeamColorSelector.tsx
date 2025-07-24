
import React from 'react';
import { TeamColorPicker } from '@/components/shared/personalization/TeamColorPicker';
import type { TeamColorScheme } from '@/components/shared/personalization/TeamColorPicker/types';

interface TeamColorSelectorProps {
  selectedColorScheme?: TeamColorScheme;
  onColorSchemeSelect: (colorScheme: TeamColorScheme) => void;
  className?: string;
}

export const TeamColorSelector = ({ 
  selectedColorScheme, 
  onColorSchemeSelect, 
  className = "" 
}: TeamColorSelectorProps) => {
  return (
    <TeamColorPicker
      selectedColorScheme={selectedColorScheme}
      onSchemeSelect={onColorSchemeSelect}
      className={className}
      showHeader={true}
      showPreview={true}
      showSportTabs={true}
      allowRotation={true}
      size="default"
      outputFormat="scheme"
    />
  );
};

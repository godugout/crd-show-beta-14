
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { MaterialComboSection } from '../../MaterialComboSection';
import type { MaterialSettings } from '../../../types';

interface SurfaceSectionProps {
  materialSettings: MaterialSettings;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
}

export const SurfaceSection: React.FC<SurfaceSectionProps> = ({
  materialSettings,
  isOpen,
  onToggle,
  onMaterialSettingsChange
}) => {
  return (
    <CollapsibleSection
      title="Surface"
      emoji="💎"
      statusText="Material Properties"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <MaterialComboSection
        materialSettings={materialSettings}
        onMaterialSettingsChange={onMaterialSettingsChange}
      />
    </CollapsibleSection>
  );
};

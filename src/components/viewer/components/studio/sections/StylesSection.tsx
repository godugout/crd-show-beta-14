
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedQuickComboPresets } from '../../EnhancedQuickComboPresets';
import { PremiumStyleSelector } from '../../premium/PremiumStyleSelector';
import { usePremiumVisualStyles } from '@/hooks/usePremiumVisualStyles';
import { createComboFromPremiumStyle } from '../../../utils/premiumStyleConverter';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';

interface StylesSectionProps {
  effectValues: EffectValues;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const StylesSection: React.FC<StylesSectionProps> = ({
  effectValues,
  isOpen,
  onToggle,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  const { styles } = usePremiumVisualStyles();
  
  const statusText = selectedPresetId ? 
    selectedPresetId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
    "Select Style";

  const handlePremiumStyleSelect = (styleId: string) => {
    try {
      console.log('🎨 StylesSection: Premium style selected:', styleId);
      const style = styles.find(s => s.id === styleId);
      if (style) {
        console.log('🎨 StylesSection: Found style:', style);
        // Create combo from premium style and apply effects
        const combo = createComboFromPremiumStyle(style);
        console.log('🎨 StylesSection: Created combo:', combo);
        console.log('🎨 StylesSection: Combo effects:', combo.effects);
        
        if (!combo.effects || typeof combo.effects !== 'object') {
          console.error('❌ StylesSection: Invalid combo effects:', combo.effects);
          return;
        }
        
        // Apply both the preset selection and the effect combo
        onPresetSelect(styleId);
        console.log('🎨 StylesSection: About to call onApplyCombo with:', combo);
        onApplyCombo(combo);
      } else {
        console.error('❌ Premium style not found:', styleId);
      }
    } catch (error) {
      console.error('❌ Error applying premium style:', error);
    }
  };

  return (
    <CollapsibleSection
      title="Styles"
      emoji="🎨"
      statusText={statusText}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-6">
        {/* Premium Visual Styles */}
        <div>
          <h4 className="text-sm font-medium text-crd-lightGray mb-3">Premium Visual Styles</h4>
          <PremiumStyleSelector
            selectedStyleId={selectedPresetId}
            onStyleSelect={handlePremiumStyleSelect}
            onStyleUnlock={(styleId) => {
              console.log('🔓 Unlock style:', styleId);
              // TODO: Implement unlock flow
            }}
          />
        </div>

        {/* Legacy Styles */}
        <div>
          <h4 className="text-sm font-medium text-crd-lightGray mb-3">Legacy Style Library</h4>
          <EnhancedQuickComboPresets
            onApplyCombo={onApplyCombo}
            currentEffects={effectValues}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            isApplyingPreset={isApplyingPreset}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};

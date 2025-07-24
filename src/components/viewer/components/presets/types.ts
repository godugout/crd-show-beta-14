
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset } from '../../types';

export interface ComboPreset {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  emoji?: string;
  category?: string;
  description: string;
  materialHint: string;
  tags?: string[];
  effects: EffectValues;
  isCustom?: boolean;
  scene?: EnvironmentScene;
  lighting?: LightingPreset;
}

export interface PresetItemProps {
  preset: ComboPreset;
  isSelected: boolean;
  isApplying: boolean;
  detectionReason?: 'selected' | 'applying' | 'auto-detected';
  onClick: () => void;
}

export interface QuickComboPresetsProps {
  onApplyCombo: (combo: ComboPreset) => void;
  currentEffects: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  isApplyingPreset?: boolean;
}

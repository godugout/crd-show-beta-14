
import React from 'react';
import { EnhancedQuickComboPresets } from './EnhancedQuickComboPresets';
import type { QuickComboPresetsProps } from './presets/types';

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = (props) => {
  return <EnhancedQuickComboPresets {...props} />;
};

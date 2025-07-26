
import { useMemo } from 'react';
import type { CreationMode, ModeConfig } from '../types';

export const useModeConfig = () => {
  const modeConfigs = useMemo((): ModeConfig[] => [
    {
      id: 'quick',
      title: 'Quick',
      description: 'Simple form-based card creation',
      icon: 'Zap',
      steps: ['intent', 'create', 'templates', 'publish'],
      features: ['AI assistance', 'Smart defaults', 'One-click publish']
    },
    {
      id: 'guided',
      title: 'Guided',
      description: 'Step-by-step wizard with help',
      icon: 'Navigation',
      steps: ['intent', 'create', 'templates', 'studio', 'publish'],
      features: ['Progressive guidance', 'Templates', 'Live preview']
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Full editor with all features',
      icon: 'Settings',
      steps: ['intent', 'create', 'templates', 'studio', 'publish'],
      features: ['Advanced cropping', 'Custom effects', 'Collaboration']
    },
    {
      id: 'bulk',
      title: 'Bulk',
      description: 'Create multiple cards at once',
      icon: 'Copy',
      steps: ['intent', 'create', 'complete'],
      features: ['Batch processing', 'AI analysis', 'Template application']
    }
  ], []);

  const getConfigById = (mode: CreationMode): ModeConfig | undefined => {
    return modeConfigs.find(config => config.id === mode);
  };

  return { modeConfigs, getConfigById };
};

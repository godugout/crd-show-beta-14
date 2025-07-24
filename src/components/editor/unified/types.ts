
export type CreationMode = 'quick' | 'guided' | 'advanced' | 'bulk';

export type CreationStep = 'intent' | 'create' | 'templates' | 'studio' | 'publish' | 'complete';

export interface CreationIntent {
  mode: CreationMode;
  description?: string;
  goals?: string[];
}

export interface CreationState {
  mode: CreationMode;
  currentStep: CreationStep;
  intent: CreationIntent;
  canAdvance: boolean;
  canGoBack: boolean;
  progress: number;
  errors: Record<string, string>;
  isCreating?: boolean;
  creationError?: string | null;
}

export interface ModeConfig {
  id: CreationMode;
  title: string;
  description: string;
  icon: string;
  steps: CreationStep[];
  features: string[];
}

import { useState, useCallback } from 'react';
import { TemplateEngine } from '@/templates/engine';

export interface StudioManager {
  isStudioOpen: boolean;
  openStudio: () => void;
  closeStudio: () => void;
  toggleStudio: () => void;
  onTemplateComplete: (templateEngine?: TemplateEngine) => void;
  resetTemplateState: () => void;
}

export function useStudioManager(): StudioManager {
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const openStudio = useCallback(() => {
    setIsStudioOpen(true);
  }, []);

  const closeStudio = useCallback(() => {
    setIsStudioOpen(false);
  }, []);

  const toggleStudio = useCallback(() => {
    setIsStudioOpen(prev => !prev);
  }, []);

  const onTemplateComplete = useCallback((templateEngine?: TemplateEngine) => {
    if (templateEngine?.transitionToStudio) {
      openStudio();
    }
  }, [openStudio]);

  const resetTemplateState = useCallback(() => {
    // Reset all template-related states
    setIsStudioOpen(false);
  }, []);

  return {
    isStudioOpen,
    openStudio,
    closeStudio,
    toggleStudio,
    onTemplateComplete,
    resetTemplateState
  };
}
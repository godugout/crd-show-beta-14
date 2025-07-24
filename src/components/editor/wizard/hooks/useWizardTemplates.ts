
import { useState, useEffect } from 'react';
import { BASEBALL_CARD_TEMPLATES } from '@/components/editor/templates/BaseballCardTemplates';
import type { DesignTemplate } from '@/types/card';

export const useWizardTemplates = () => {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading baseball card templates
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would fetch from an API
        // For now, we'll use our static baseball templates
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        setTemplates(BASEBALL_CARD_TEMPLATES);
        setError(null);
      } catch (err) {
        console.error('Failed to load templates:', err);
        setError('Failed to load templates');
        // Fallback to baseball templates
        setTemplates(BASEBALL_CARD_TEMPLATES);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return {
    templates,
    isLoading,
    error,
    refetch: () => {
      setTemplates(BASEBALL_CARD_TEMPLATES);
      setIsLoading(false);
      setError(null);
    }
  };
};

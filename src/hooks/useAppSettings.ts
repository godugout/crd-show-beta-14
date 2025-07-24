
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface AppSettings {
  theme?: string;
  features?: string[];
  config?: Record<string, any>;
}

export const useAppSettings = () => {
  const queryClient = useQueryClient();
  
  const fetchSettings = async () => {
    // For now, return default settings from localStorage
    // Once database tables are set up, this will fetch from Supabase
    const stored = localStorage.getItem('app_settings');
    return stored ? JSON.parse(stored) : { theme: 'dark', features: [], config: {} };
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    // For now, save to localStorage
    // Once database tables are set up, this will save to Supabase
    const current = await fetchSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem('app_settings', JSON.stringify(updated));
    return updated;
  };

  const { data: settings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: fetchSettings
  });

  const { mutate: saveSettings } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      // Invalidate and refetch app settings
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    }
  });

  return {
    settings,
    isLoading,
    saveSettings
  };
};

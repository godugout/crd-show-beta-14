import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/use-user';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';

export type GridType = 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';

export interface GridSettings {
  gridType: GridType;
  showGrid: boolean;
}

const DEFAULT_GRID_SETTINGS: GridSettings = {
  gridType: 'print',
  showGrid: true
};

export const useGridPreferences = () => {
  const { user } = useUser();
  const { profile, updateProfile } = useProfile(user?.id);
  const [gridSettings, setGridSettings] = useState<GridSettings>(DEFAULT_GRID_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load grid preferences from profile on mount
  useEffect(() => {
    if (profile && !isLoaded) {
      const preferences = profile.preferences as Record<string, any> | null;
      const savedSettings = preferences?.gridSettings as GridSettings | undefined;
      if (savedSettings) {
        setGridSettings({
          gridType: savedSettings.gridType || DEFAULT_GRID_SETTINGS.gridType,
          showGrid: savedSettings.showGrid !== undefined ? savedSettings.showGrid : DEFAULT_GRID_SETTINGS.showGrid
        });
      }
      setIsLoaded(true);
    } else if (!profile && user && !isLoaded) {
      // User exists but no profile preferences yet - use defaults
      setIsLoaded(true);
    }
  }, [profile, user, isLoaded]);

  // Save grid preferences to profile
  const saveGridPreferences = useCallback(async (newSettings: GridSettings) => {
    if (!user || !profile) return;

    try {
      const currentPreferences = (profile.preferences as Record<string, any>) || {};
      const updatedPreferences = {
        ...currentPreferences,
        gridSettings: newSettings
      };

      await updateProfile({
        preferences: updatedPreferences
      });
    } catch (error) {
      console.error('Failed to save grid preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save grid preferences',
        variant: 'destructive'
      });
    }
  }, [user, profile, updateProfile]);

  // Update grid type
  const setGridType = useCallback((gridType: GridType) => {
    const newSettings = { ...gridSettings, gridType };
    setGridSettings(newSettings);
    saveGridPreferences(newSettings);
  }, [gridSettings, saveGridPreferences]);

  // Toggle grid visibility
  const setShowGrid = useCallback((showGrid: boolean) => {
    const newSettings = { ...gridSettings, showGrid };
    setGridSettings(newSettings);
    saveGridPreferences(newSettings);
  }, [gridSettings, saveGridPreferences]);

  // Update both settings at once
  const updateGridSettings = useCallback((newSettings: Partial<GridSettings>) => {
    const updatedSettings = { ...gridSettings, ...newSettings };
    setGridSettings(updatedSettings);
    saveGridPreferences(updatedSettings);
  }, [gridSettings, saveGridPreferences]);

  return {
    gridSettings,
    setGridType,
    setShowGrid,
    updateGridSettings,
    isLoaded,
    // Convenience accessors
    gridType: gridSettings.gridType,
    showGrid: gridSettings.showGrid
  };
};
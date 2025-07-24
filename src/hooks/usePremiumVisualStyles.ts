import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  CRDVisualStyle, 
  UserStyleUnlock, 
  UserStylePreferences,
  StyleUnlockResult,
  StyleApplicationState,
  UnlockMethod,
  MaterialPreset,
  EffectLayer,
  TextureProfile,
  ParticlePreset,
  LightingPreset,
  AnimationProfile,
  PerformanceBudget
} from '@/types/premiumVisualStyles';

export const usePremiumVisualStyles = () => {
  const [styles, setStyles] = useState<CRDVisualStyle[]>([]);
  const [userUnlocks, setUserUnlocks] = useState<UserStyleUnlock[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserStylePreferences[]>([]);
  const [applicationState, setApplicationState] = useState<StyleApplicationState>({
    isApplying: false,
    customParameters: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all available styles
  const fetchStyles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crd_visual_styles')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const transformedStyles: CRDVisualStyle[] = data.map(style => ({
        id: style.id,
        displayName: style.display_name,
        category: style.category,
        isLocked: style.is_locked,
        unlockMethod: style.unlock_method,
        unlockCost: style.unlock_cost,
        baseMaterial: (style.base_material as unknown) as MaterialPreset,
        secondaryFinish: style.secondary_finish ? (style.secondary_finish as unknown) as EffectLayer : undefined,
        textureProfile: (style.texture_profile as unknown) as TextureProfile,
        particleEffect: style.particle_effect ? (style.particle_effect as unknown) as ParticlePreset : undefined,
        lightingPreset: (style.lighting_preset as unknown) as LightingPreset,
        animationProfile: style.animation_profile ? (style.animation_profile as unknown) as AnimationProfile : undefined,
        uiPreviewGradient: style.ui_preview_gradient,
        visualVibe: style.visual_vibe,
        performanceBudget: (style.performance_budget as unknown) as PerformanceBudget,
        shaderConfig: (style.shader_config as unknown) as Record<string, any>,
        isActive: style.is_active,
        sortOrder: style.sort_order,
        createdAt: style.created_at,
        updatedAt: style.updated_at
      }));

      setStyles(transformedStyles);
    } catch (err) {
      console.error('Error fetching styles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch styles');
    }
  }, []);

  // Fetch user's unlocked styles
  const fetchUserUnlocks = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_style_unlocks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const transformedUnlocks: UserStyleUnlock[] = data.map(unlock => ({
        id: unlock.id,
        userId: unlock.user_id,
        styleId: unlock.style_id,
        unlockedAt: unlock.unlocked_at,
        unlockMethod: unlock.unlock_method,
        unlockMetadata: unlock.unlock_metadata as Record<string, any>
      }));

      setUserUnlocks(transformedUnlocks);
    } catch (err) {
      console.error('Error fetching user unlocks:', err);
    }
  }, []);

  // Fetch user's style preferences
  const fetchUserPreferences = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_style_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const transformedPreferences: UserStylePreferences[] = data.map(pref => ({
        id: pref.id,
        userId: pref.user_id,
        styleId: pref.style_id,
        customParameters: pref.custom_parameters as Record<string, any>,
        usageCount: pref.usage_count,
        lastUsedAt: pref.last_used_at,
        createdAt: pref.created_at,
        updatedAt: pref.updated_at
      }));

      setUserPreferences(transformedPreferences);
    } catch (err) {
      console.error('Error fetching user preferences:', err);
    }
  }, []);

  // Check if user has unlocked a specific style
  const isStyleUnlocked = useCallback((styleId: string): boolean => {
    const style = styles.find(s => s.id === styleId);
    if (!style) return false;
    
    // Free styles are always unlocked
    if (!style.isLocked) return true;
    
    // Check if user has an unlock record
    return userUnlocks.some(unlock => unlock.styleId === styleId);
  }, [styles, userUnlocks]);

  // Get available styles for the user (unlocked + free)
  const getAvailableStyles = useCallback((): CRDVisualStyle[] => {
    return styles.filter(style => isStyleUnlocked(style.id));
  }, [styles, isStyleUnlocked]);

  // Get locked styles for the user
  const getLockedStyles = useCallback((): CRDVisualStyle[] => {
    return styles.filter(style => !isStyleUnlocked(style.id));
  }, [styles, isStyleUnlocked]);

  // Unlock a style for the user
  const unlockStyle = useCallback(async (
    styleId: string, 
    unlockMethod: UnlockMethod, 
    metadata: Record<string, any> = {}
  ): Promise<StyleUnlockResult> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }

      const { data, error } = await supabase.rpc('unlock_style_for_user', {
        user_uuid: user.id,
        style_id_param: styleId,
        unlock_method_param: unlockMethod,
        metadata_param: metadata
      });

      if (error) throw error;

      if (data) {
        // Refresh user unlocks
        await fetchUserUnlocks();
        return { success: true, message: 'Style unlocked successfully', styleId };
      } else {
        return { success: false, message: 'Style already unlocked' };
      }
    } catch (err) {
      console.error('Error unlocking style:', err);
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Failed to unlock style' 
      };
    }
  }, [fetchUserUnlocks]);

  // Apply a style and track usage
  const applyStyle = useCallback(async (
    styleId: string, 
    customParameters: Record<string, any> = {}
  ) => {
    if (!isStyleUnlocked(styleId)) {
      throw new Error('Style is not unlocked');
    }

    setApplicationState(prev => ({ 
      ...prev, 
      isApplying: true, 
      appliedStyleId: styleId,
      customParameters 
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update usage tracking and preferences
      await supabase
        .from('user_style_preferences')
        .upsert({
          user_id: user.id,
          style_id: styleId,
          custom_parameters: customParameters,
          usage_count: (userPreferences.find(p => p.styleId === styleId)?.usageCount || 0) + 1,
          last_used_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,style_id'
        });

      // Refresh preferences
      await fetchUserPreferences();

    } catch (err) {
      console.error('Error tracking style usage:', err);
    } finally {
      setApplicationState(prev => ({ ...prev, isApplying: false }));
    }
  }, [isStyleUnlocked, userPreferences, fetchUserPreferences]);

  // Get style with user's custom parameters
  const getStyleWithUserPreferences = useCallback((styleId: string): CRDVisualStyle | null => {
    const style = styles.find(s => s.id === styleId);
    if (!style) return null;

    const userPref = userPreferences.find(p => p.styleId === styleId);
    if (!userPref) return style;

    // Merge user custom parameters with base style
    return {
      ...style,
      // Apply user customizations while respecting security boundaries
      baseMaterial: { ...style.baseMaterial, ...userPref.customParameters.baseMaterial },
      textureProfile: { ...style.textureProfile, ...userPref.customParameters.textureProfile }
    };
  }, [styles, userPreferences]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStyles(),
          fetchUserUnlocks(),
          fetchUserPreferences()
        ]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchStyles, fetchUserUnlocks, fetchUserPreferences]);

  return {
    // Data
    styles,
    userUnlocks,
    userPreferences,
    applicationState,
    
    // State
    loading,
    error,
    
    // Computed values
    availableStyles: getAvailableStyles(),
    lockedStyles: getLockedStyles(),
    
    // Actions
    isStyleUnlocked,
    unlockStyle,
    applyStyle,
    getStyleWithUserPreferences,
    
    // Data refresh
    refreshData: async () => {
      await Promise.all([
        fetchStyles(),
        fetchUserUnlocks(),
        fetchUserPreferences()
      ]);
    }
  };
};
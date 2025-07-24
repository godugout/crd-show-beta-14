import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users: any;
  metadata: any;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('*')
          .eq('is_enabled', true);

        if (error) {
          console.error('Error fetching feature flags:', error);
          return;
        }

        const flagsMap = data.reduce((acc, flag) => {
          acc[flag.name] = flag;
          return acc;
        }, {} as Record<string, FeatureFlag>);

        setFlags(flagsMap);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const isEnabled = (flagName: string): boolean => {
    const flag = flags[flagName];
    
    if (!flag) {
      return false;
    }
    
    return flag.is_enabled && flag.rollout_percentage >= 100;
  };

  const getFlag = (flagName: string): FeatureFlag | null => {
    return flags[flagName] || null;
  };

  return {
    flags,
    loading,
    isEnabled,
    getFlag
  };
};
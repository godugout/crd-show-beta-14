import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout_percentage: number;
  target_users: any;
  metadata: any;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>({
    // Default feature flags
    'advanced-editor': {
      id: 'advanced-editor',
      name: 'Advanced Editor',
      description: 'Enable advanced editing features',
      enabled: true,
      rollout_percentage: 100,
      target_users: null,
      metadata: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    },
    'ai-enhancement': {
      id: 'ai-enhancement',
      name: 'AI Enhancement',
      description: 'AI-powered card enhancement features',
      enabled: true,
      rollout_percentage: 80,
      target_users: null,
      metadata: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    },
    'beta-features': {
      id: 'beta-features',
      name: 'Beta Features',
      description: 'Access to experimental features',
      enabled: false,
      rollout_percentage: 10,
      target_users: null,
      metadata: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    },
    '3d-preview': {
      id: '3d-preview',
      name: '3D Preview',
      description: 'Enable 3D card preview functionality',
      enabled: true,
      rollout_percentage: 100,
      target_users: null,
      metadata: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    },
    'marketplace': {
      id: 'marketplace',
      name: 'Marketplace',
      description: 'Enable marketplace features',
      enabled: true,
      rollout_percentage: 100,
      target_users: null,
      metadata: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    },
    'real-time-collaboration': {
      id: 'real-time-collaboration',
      name: 'Real-time Collaboration',
      description: 'Enable collaborative editing features',
      enabled: false,
      rollout_percentage: 25,
      target_users: null,
      metadata: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    },
    'advanced-analytics': {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'Enable detailed analytics and reporting',
      enabled: false,
      rollout_percentage: 50,
      target_users: null,
      metadata: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    }
  });
  
  const [loading, setLoading] = useState(false);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*');

      if (data && !error) {
        const flagsMap = data.reduce((acc, flag) => {
          // Map database fields to our interface
          acc[flag.id] = {
            ...flag,
            enabled: flag.is_enabled || false
          };
          return acc;
        }, {} as Record<string, FeatureFlag>);
        
        // Merge with default flags
        setFlags(prev => ({ ...prev, ...flagsMap }));
      }
    } catch (error) {
      console.error('Error fetching feature flags:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const isEnabled = (flagName: string): boolean => {
    const flag = flags[flagName];
    
    if (!flag) {
      return false;
    }
    
    return flag.enabled && flag.rollout_percentage >= 100;
  };

  const getFlag = (flagName: string): FeatureFlag | null => {
    return flags[flagName] || null;
  };

  const toggleFlag = (flagId: string) => {
    setFlags(prev => ({
      ...prev,
      [flagId]: {
        ...prev[flagId],
        enabled: !prev[flagId]?.enabled
      }
    }));
  };

  return { 
    flags, 
    loading, 
    isEnabled, 
    getFlag, 
    toggleFlag, 
    refreshFlags: fetchFlags 
  };
};
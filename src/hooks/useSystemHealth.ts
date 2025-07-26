import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export type HealthStatus = 'healthy' | 'warning' | 'error';

export interface SystemHealthCheck {
  authSystem: HealthStatus;
  cardCreation: HealthStatus;
  database: HealthStatus;
  imageProcessing: HealthStatus;
  localStorage: HealthStatus;
  networkConnection: HealthStatus;
}

export interface JourneyMetrics {
  successRate: number;
  currentJourney: string;
  completedSteps: number;
  totalSteps: number;
  lastActivity: Date;
}

export const useSystemHealth = () => {
  const { user } = useAuth();
  
  const [health, setHealth] = useState<SystemHealthCheck>({
    authSystem: 'healthy',
    cardCreation: 'healthy',
    database: 'healthy',
    imageProcessing: 'healthy',
    localStorage: 'healthy',
    networkConnection: 'healthy'
  });

  const [journeyMetrics, setJourneyMetrics] = useState<JourneyMetrics>({
    successRate: 100.0,
    currentJourney: 'Not initialized',
    completedSteps: 0,
    totalSteps: 5,
    lastActivity: new Date()
  });

  const [isChecking, setIsChecking] = useState(false);

  const checkAuthSystem = (): HealthStatus => {
    try {
      if (!user) return 'error';
      if (!user.email) return 'warning';
      return 'healthy';
    } catch {
      return 'error';
    }
  };

  const checkDatabase = async (): Promise<HealthStatus> => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('id')
        .limit(1);
      
      if (error) return 'error';
      return 'healthy';
    } catch {
      return 'error';
    }
  };

  const checkLocalStorage = (): HealthStatus => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return 'healthy';
    } catch {
      return 'error';
    }
  };

  const checkNetworkConnection = (): HealthStatus => {
    if (!navigator.onLine) return 'error';
    // Additional checks could be added here
    return 'healthy';
  };

  const checkCardCreation = (): HealthStatus => {
    // Check if card editor components are available
    try {
      const editorElement = document.querySelector('[data-crd-editor]');
      if (editorElement) return 'healthy';
      
      // Check if we're on a page that should have the editor
      const isEditorPage = window.location.pathname.includes('/create');
      if (isEditorPage && !editorElement) return 'warning';
      
      return 'healthy';
    } catch {
      return 'warning';
    }
  };

  const checkImageProcessing = (): HealthStatus => {
    // Check if image processing capabilities are available
    try {
      if (typeof FileReader === 'undefined') return 'error';
      if (typeof HTMLCanvasElement === 'undefined') return 'error';
      return 'healthy';
    } catch {
      return 'error';
    }
  };

  const runHealthCheck = async (): Promise<SystemHealthCheck> => {
    setIsChecking(true);
    
    try {
      const [databaseHealth] = await Promise.all([
        checkDatabase()
      ]);

      const healthCheck: SystemHealthCheck = {
        authSystem: checkAuthSystem(),
        cardCreation: checkCardCreation(),
        database: databaseHealth,
        imageProcessing: checkImageProcessing(),
        localStorage: checkLocalStorage(),
        networkConnection: checkNetworkConnection()
      };

      setHealth(healthCheck);
      return healthCheck;
    } finally {
      setIsChecking(false);
    }
  };

  const updateJourneyMetrics = (updates: Partial<JourneyMetrics>) => {
    setJourneyMetrics(prev => ({
      ...prev,
      ...updates,
      lastActivity: new Date()
    }));
  };

  // Auto-check health periodically
  useEffect(() => {
    runHealthCheck();
    
    const interval = setInterval(runHealthCheck, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setHealth(prev => ({ ...prev, networkConnection: 'healthy' }));
    };
    
    const handleOffline = () => {
      setHealth(prev => ({ ...prev, networkConnection: 'error' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getOverallHealth = (): HealthStatus => {
    const statuses = Object.values(health);
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  };

  return {
    health,
    journeyMetrics,
    isChecking,
    runHealthCheck,
    updateJourneyMetrics,
    getOverallHealth
  };
};
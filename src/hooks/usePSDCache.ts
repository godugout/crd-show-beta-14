import { useState, useEffect, useCallback, useRef } from 'react';
import { psdCacheService, PSDSessionData, CachedPSDJob } from '@/services/psdCacheService';
import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { supabase } from '@/integrations/supabase/client';

export interface UsePSDCacheResult {
  // Processing state
  isProcessing: boolean;
  processingProgress: number;
  processingStep: string;
  
  // PSD jobs management
  cachedJobs: CachedPSDJob[];
  loadCachedJobs: () => Promise<void>;
  
  // Processing functions
  processPSD: (file: File) => Promise<{ layers: PSDLayer[]; jobId: string; thumbnail: string }>;
  loadPSDFromCache: (jobId: string) => Promise<PSDLayer[]>;
  
  // Session management
  currentSession: PSDSessionData | null;
  saveCurrentSession: (sessionData: PSDSessionData) => Promise<void>;
  loadSession: (jobId: string) => Promise<void>;
  
  // Auto-save
  enableAutoSave: (jobId: string, getSessionData: () => PSDSessionData) => void;
  disableAutoSave: () => void;
  isAutoSaveEnabled: boolean;
  lastAutoSave: Date | null;
  
  // Auth state
  user: any;
  authLoading: boolean;
}

export const usePSDCache = (): UsePSDCacheResult => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [cachedJobs, setCachedJobs] = useState<CachedPSDJob[]>([]);
  const [currentSession, setCurrentSession] = useState<PSDSessionData | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  
  const autoSaveCleanupRef = useRef<(() => void) | null>(null);

  // Get current user with proper auth loading state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // First check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setUser(session?.user ?? null);
          setAuthLoading(false);
        }
      } catch (error) {
        console.error('Error getting auth session:', error);
        if (mounted) {
          setUser(null);
          setAuthLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadCachedJobs = useCallback(async () => {
    try {
      const jobs = await psdCacheService.getCachedPSDJobs(user?.id || null);
      setCachedJobs(jobs);
    } catch (error) {
      console.error('Failed to load cached PSD jobs:', error);
    }
  }, [user?.id]);

  // Load cached jobs on mount - including anonymous jobs
  useEffect(() => {
    if (!authLoading) {
      loadCachedJobs();
    }
  }, [authLoading, loadCachedJobs]);

  const processPSD = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStep('Starting...');

    try {
      // Use PSD processing with authenticated user or anonymous
      const result = await psdCacheService.processPSDWithCaching(
        file,
        user?.id || null,
        (progress, step) => {
          setProcessingProgress(progress);
          setProcessingStep(step);
        }
      );
      
      return result;
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingStep('');
    }
  }, [user?.id]);

  const loadPSDFromCache = useCallback(async (jobId: string): Promise<PSDLayer[]> => {
    if (authLoading) {
      throw new Error('Authentication still loading, please wait...');
    }
    
    if (!user?.id) {
      throw new Error('Please sign in to use PSD processing features');
    }

    try {
      // Update last accessed time
      await supabase
        .from('crdmkr_processing_jobs')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('id', jobId)
        .eq('user_id', user.id);

      const layers = await psdCacheService.loadCachedLayers(jobId);
      
      // Refresh cached jobs to update last accessed
      await loadCachedJobs();
      
      return layers;
    } catch (error) {
      console.error('Failed to load PSD from cache:', error);
      throw error;
    }
  }, [user?.id, loadCachedJobs]);

  const saveCurrentSession = useCallback(async (sessionData: PSDSessionData) => {
    if (!user?.id || !currentSession) return;
    
    // We need a jobId to save session, should be provided in sessionData or context
    // For now, we'll store it in the sessionData itself
    const jobId = (sessionData as any).jobId;
    if (!jobId) {
      console.warn('No jobId provided for session save');
      return;
    }

    try {
      await psdCacheService.saveSession(user.id, jobId, sessionData);
      setCurrentSession(sessionData);
      setLastAutoSave(new Date());
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  }, [user?.id, currentSession]);

  const loadSession = useCallback(async (jobId: string) => {
    if (!user?.id) return;

    try {
      const session = await psdCacheService.loadSession(user.id, jobId);
      setCurrentSession(session);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  }, [user?.id]);

  const enableAutoSave = useCallback((jobId: string, getSessionData: () => PSDSessionData) => {
    if (!user?.id) return;

    // Clean up existing auto-save if any
    if (autoSaveCleanupRef.current) {
      autoSaveCleanupRef.current();
    }

    // Start new auto-save
    const cleanup = psdCacheService.startAutoSave(user.id, jobId, () => {
      const sessionData = getSessionData();
      setLastAutoSave(new Date());
      return sessionData;
    });

    autoSaveCleanupRef.current = cleanup;
    setIsAutoSaveEnabled(true);
  }, [user?.id]);

  const disableAutoSave = useCallback(() => {
    if (autoSaveCleanupRef.current) {
      autoSaveCleanupRef.current();
      autoSaveCleanupRef.current = null;
    }
    setIsAutoSaveEnabled(false);
    setLastAutoSave(null);
  }, []);

  // Cleanup auto-save on unmount
  useEffect(() => {
    return () => {
      if (autoSaveCleanupRef.current) {
        autoSaveCleanupRef.current();
      }
    };
  }, []);

  return {
    isProcessing,
    processingProgress,
    processingStep,
    cachedJobs,
    loadCachedJobs,
    processPSD,
    loadPSDFromCache,
    currentSession,
    saveCurrentSession,
    loadSession,
    enableAutoSave,
    disableAutoSave,
    isAutoSaveEnabled,
    lastAutoSave,
    // Auth state
    user,
    authLoading
  };
};
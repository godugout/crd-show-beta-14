import { useState, useEffect, useCallback, useRef } from 'react';

export type LoadingStage = 'skeleton' | 'preview' | 'full';

export interface LoadingStageConfig {
  showAfter: number; // ms
  timeout: number; // ms
}

export interface ProgressiveLoadingState {
  currentStage: LoadingStage;
  isLoading: boolean;
  hasError: boolean;
  loadedStages: Set<LoadingStage>;
  progress: number; // 0-100
}

const DEFAULT_STAGE_CONFIG: Record<LoadingStage, LoadingStageConfig> = {
  skeleton: {
    showAfter: 0,
    timeout: 100,
  },
  preview: {
    showAfter: 100,
    timeout: 300,
  },
  full: {
    showAfter: 300,
    timeout: 1000,
  }
};

export interface UseProgressiveLoadingOptions {
  stageConfig?: Partial<Record<LoadingStage, LoadingStageConfig>>;
  onStageChange?: (stage: LoadingStage) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  autoProgress?: boolean;
}

export const useProgressiveLoading = (options: UseProgressiveLoadingOptions = {}) => {
  const {
    stageConfig = {},
    onStageChange,
    onComplete,
    onError,
    autoProgress = true,
  } = options;

  const config = { ...DEFAULT_STAGE_CONFIG, ...stageConfig };
  
  const [state, setState] = useState<ProgressiveLoadingState>({
    currentStage: 'skeleton',
    isLoading: true,
    hasError: false,
    loadedStages: new Set(),
    progress: 0,
  });

  const timeoutsRef = useRef<Map<LoadingStage, NodeJS.Timeout>>(new Map());
  const startTimeRef = useRef<number>(Date.now());

  // Clear all timeouts
  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  // Calculate progress based on current stage and elapsed time
  const calculateProgress = useCallback((stage: LoadingStage, elapsedTime: number): number => {
    const stages: LoadingStage[] = ['skeleton', 'preview', 'full'];
    const stageIndex = stages.indexOf(stage);
    const baseProgress = (stageIndex / stages.length) * 100;
    
    if (stage === 'full') return 100;
    
    const stageConfig = config[stage];
    const stageProgress = Math.min(
      (elapsedTime - stageConfig.showAfter) / (stageConfig.timeout - stageConfig.showAfter),
      1
    );
    
    return Math.min(baseProgress + (stageProgress * (100 / stages.length)), 100);
  }, [config]);

  // Advance to next stage
  const advanceStage = useCallback((targetStage: LoadingStage) => {
    setState(prev => {
      const newLoadedStages = new Set(prev.loadedStages);
      newLoadedStages.add(targetStage);
      
      const elapsedTime = Date.now() - startTimeRef.current;
      const progress = calculateProgress(targetStage, elapsedTime);
      
      return {
        ...prev,
        currentStage: targetStage,
        loadedStages: newLoadedStages,
        progress,
        isLoading: targetStage !== 'full',
      };
    });

    onStageChange?.(targetStage);
    
    if (targetStage === 'full') {
      onComplete?.();
    }
  }, [calculateProgress, onStageChange, onComplete]);

  // Handle errors
  const setError = useCallback((error: Error) => {
    clearTimeouts();
    setState(prev => ({
      ...prev,
      hasError: true,
      isLoading: false,
    }));
    onError?.(error);
  }, [clearTimeouts, onError]);

  // Start progressive loading
  const startLoading = useCallback(() => {
    clearTimeouts();
    startTimeRef.current = Date.now();
    
    setState({
      currentStage: 'skeleton',
      isLoading: true,
      hasError: false,
      loadedStages: new Set(['skeleton']),
      progress: 0,
    });

    if (autoProgress) {
      // Set up automatic progression
      const previewTimeout = setTimeout(() => {
        advanceStage('preview');
      }, config.preview.showAfter);

      const fullTimeout = setTimeout(() => {
        advanceStage('full');
      }, config.full.showAfter);

      timeoutsRef.current.set('preview', previewTimeout);
      timeoutsRef.current.set('full', fullTimeout);
    }
  }, [config, autoProgress, advanceStage, clearTimeouts]);

  // Manual stage control
  const setStage = useCallback((stage: LoadingStage) => {
    clearTimeouts();
    advanceStage(stage);
  }, [advanceStage, clearTimeouts]);

  // Reset loading state
  const reset = useCallback(() => {
    clearTimeouts();
    setState({
      currentStage: 'skeleton',
      isLoading: false,
      hasError: false,
      loadedStages: new Set(),
      progress: 0,
    });
  }, [clearTimeouts]);

  // Update progress periodically
  useEffect(() => {
    if (!state.isLoading || state.hasError) return;

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const progress = calculateProgress(state.currentStage, elapsedTime);
      
      setState(prev => ({ ...prev, progress }));
    }, 16); // ~60fps updates

    return () => clearInterval(interval);
  }, [state.isLoading, state.hasError, state.currentStage, calculateProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  return {
    ...state,
    startLoading,
    setStage,
    setError,
    reset,
    config,
  };
};
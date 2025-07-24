import { useCallback } from 'react';
import { hapticService, type HapticFeedbackConfig, type HapticPattern } from '@/lib/hapticService';
export type { HapticPattern } from '@/lib/hapticService';
import { usePerformanceMonitor } from './usePerformanceMonitor';

export interface UseHapticFeedbackOptions {
  enabled?: boolean;
  respectPerformance?: boolean;
}

export const useHapticFeedback = (options: UseHapticFeedbackOptions = {}) => {
  const { enabled = true, respectPerformance = true } = options;
  const { metrics } = usePerformanceMonitor();

  // Main feedback function
  const feedback = useCallback((config: HapticFeedbackConfig) => {
    if (!enabled || !hapticService.isAvailable()) return;

    const performanceQuality = respectPerformance ? metrics.quality : undefined;
    hapticService.feedback(config, performanceQuality);
  }, [enabled, respectPerformance, metrics.quality]);

  // Convenience methods
  const light = useCallback(() => {
    feedback({ pattern: 'light' });
  }, [feedback]);

  const medium = useCallback(() => {
    feedback({ pattern: 'medium' });
  }, [feedback]);

  const heavy = useCallback(() => {
    feedback({ pattern: 'heavy' });
  }, [feedback]);

  const success = useCallback(() => {
    feedback({ pattern: 'success' });
  }, [feedback]);

  const error = useCallback(() => {
    feedback({ pattern: 'error' });
  }, [feedback]);

  const rarity = useCallback((rarityLevel: 'common' | 'uncommon' | 'rare' | 'legendary') => {
    feedback({ pattern: `rarity_${rarityLevel}` as HapticPattern });
  }, [feedback]);

  // Studio-specific interaction feedback with enhanced patterns
  const cardInteraction = useCallback(() => {
    hapticService.cardInteraction();
  }, []);

  const swipeNavigation = useCallback(() => {
    hapticService.swipeNavigation();
  }, []);

  const rotationMilestone = useCallback(() => {
    hapticService.rotationMilestone();
  }, []);

  const zoomFeedback = useCallback(() => {
    hapticService.zoomFeedback();
  }, []);

  const pullRefresh = useCallback(() => {
    hapticService.pullRefresh();
  }, []);

  const modeSwitch = useCallback(() => {
    hapticService.modeSwitch();
  }, []);

  const effectApply = useCallback(() => {
    hapticService.effectApply();
  }, []);

  const premiumUnlock = useCallback(() => {
    hapticService.premiumUnlock();
  }, []);

  const studioEnter = useCallback(() => {
    hapticService.studioEnter();
  }, []);

  const studioExit = useCallback(() => {
    hapticService.studioExit();
  }, []);

  // Legacy interaction-specific feedback (maintained for backward compatibility)
  const dragStart = useCallback(() => {
    feedback({ pattern: 'light', duration: 8 });
  }, [feedback]);

  const dragEnd = useCallback(() => {
    feedback({ pattern: 'medium', duration: 15 });
  }, [feedback]);

  const sliderAdjust = useCallback(() => {
    feedback({ pattern: 'light', duration: 3 });
  }, [feedback]);

  const cardFlip = useCallback(() => {
    feedback({ pattern: 'medium', duration: 25 });
  }, [feedback]);

  const loadingComplete = useCallback(() => {
    feedback({ pattern: 'success' });
  }, [feedback]);

  const loadingError = useCallback(() => {
    feedback({ pattern: 'error' });
  }, [feedback]);

  // Enhanced control methods
  const setEnabled = useCallback((isEnabled: boolean) => {
    hapticService.setEnabled(isEnabled);
  }, []);

  const setPerformanceLevel = useCallback((level: typeof metrics.quality) => {
    hapticService.setPerformanceLevel(level);
  }, []);

  const testPattern = useCallback((pattern: HapticPattern) => {
    hapticService.testPattern(pattern);
  }, []);

  const calibrateIntensity = useCallback((multiplier: number) => {
    hapticService.calibrateIntensity(multiplier);
  }, []);

  const getStatus = useCallback(() => {
    return hapticService.getStatus();
  }, []);

  const stop = useCallback(() => {
    hapticService.stop();
  }, []);

  return {
    // Core feedback
    feedback,
    
    // Basic patterns
    light,
    medium,
    heavy,
    success,
    error,
    rarity,
    
    // Studio-specific patterns
    cardInteraction,
    swipeNavigation,
    rotationMilestone,
    zoomFeedback,
    pullRefresh,
    modeSwitch,
    effectApply,
    premiumUnlock,
    studioEnter,
    studioExit,
    
    // Legacy interaction patterns (backward compatibility)
    dragStart,
    dragEnd,
    sliderAdjust,
    cardFlip,
    loadingComplete,
    loadingError,
    
    // Enhanced control
    setEnabled,
    setPerformanceLevel,
    testPattern,
    calibrateIntensity,
    getStatus,
    stop,
    
    // Status
    isAvailable: hapticService.isAvailable(),
    performanceQuality: metrics.quality,
  };
};
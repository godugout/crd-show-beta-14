import { useCallback, useRef, useState, useEffect } from 'react';
import { useHapticFeedback } from './useHapticFeedback';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
  enableHapticFeedback?: boolean;
}

interface PullState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
}

export const usePullToRefresh = (
  elementRef: React.RefObject<HTMLElement>,
  options: UsePullToRefreshOptions
) => {
  const {
    onRefresh,
    threshold = 80,
    resistance = 0.5,
    enabled = true,
    enableHapticFeedback = true
  } = options;

  const [pullState, setPullState] = useState<PullState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    canRefresh: false
  });

  const { light, medium, success, loadingComplete } = useHapticFeedback({ 
    enabled: enableHapticFeedback,
    respectPerformance: true 
  });

  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  const hasTriggeredThresholdHapticRef = useRef(false);
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  const canPull = useCallback(() => {
    if (!enabled || !elementRef.current) return false;
    
    // Only allow pull-to-refresh when scrolled to top
    const element = elementRef.current;
    const scrollTop = element.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
    
    return scrollTop <= 0;
  }, [enabled, elementRef]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!canPull() || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    touchStartRef.current = { 
      y: touch.clientY, 
      time: Date.now() 
    };
    hasTriggeredThresholdHapticRef.current = false;
  }, [canPull]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || !canPull() || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Only handle downward pulls
    if (deltaY <= 0) return;
    
    // Apply resistance to the pull distance
    const pullDistance = Math.min(deltaY * resistance, threshold + 40);
    const canRefresh = pullDistance >= threshold;
    
    // Trigger haptic feedback when crossing threshold
    if (canRefresh && !hasTriggeredThresholdHapticRef.current && enableHapticFeedback) {
      medium();
      hasTriggeredThresholdHapticRef.current = true;
    } else if (!canRefresh && pullDistance > threshold * 0.3 && enableHapticFeedback) {
      // Light haptic feedback during pull
      light();
    }
    
    setPullState(prev => ({
      ...prev,
      isPulling: true,
      pullDistance,
      canRefresh
    }));
    
    // Prevent default scroll behavior during pull
    if (pullDistance > 5) {
      e.preventDefault();
    }
  }, [canPull, resistance, threshold, enableHapticFeedback, medium, light]);

  const handleTouchEnd = useCallback(async () => {
    if (!touchStartRef.current) return;
    
    const { canRefresh, pullDistance } = pullState;
    
    if (canRefresh && pullDistance >= threshold) {
      // Trigger refresh
      setPullState(prev => ({
        ...prev,
        isRefreshing: true,
        isPulling: false
      }));
      
      if (enableHapticFeedback) {
        success(); // Haptic feedback for refresh trigger
      }
      
      try {
        // Execute refresh function
        const refreshPromise = Promise.resolve(onRefresh());
        refreshPromiseRef.current = refreshPromise;
        
        await refreshPromise;
        
        if (enableHapticFeedback) {
          loadingComplete(); // Success haptic feedback
        }
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        // Reset state after refresh
        setTimeout(() => {
          setPullState({
            isPulling: false,
            isRefreshing: false,
            pullDistance: 0,
            canRefresh: false
          });
          refreshPromiseRef.current = null;
        }, 300); // Small delay for visual feedback
      }
    } else {
      // Reset state if threshold not met
      setPullState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        canRefresh: false
      });
    }
    
    touchStartRef.current = null;
    hasTriggeredThresholdHapticRef.current = false;
  }, [pullState, threshold, onRefresh, enableHapticFeedback, success, loadingComplete]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...pullState,
    refreshProgress: Math.min(pullState.pullDistance / threshold, 1),
    isOverThreshold: pullState.pullDistance >= threshold
  };
};
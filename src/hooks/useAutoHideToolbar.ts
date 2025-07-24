import { useState, useEffect, useRef, useCallback } from 'react';

type VisibilityState = 'hidden' | 'visible' | 'light-transparent' | 'grayed-out';

interface UseAutoHideToolbarReturn {
  visibilityState: VisibilityState;
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  getToolbarClasses: () => string;
  getHotZoneProps: () => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

export const useAutoHideToolbar = (): UseAutoHideToolbarReturn => {
  const [visibilityState, setVisibilityState] = useState<VisibilityState>('hidden');
  const [isHoveringToolbar, setIsHoveringToolbar] = useState(false);
  const [isHoveringHotZone, setIsHoveringHotZone] = useState(false);
  
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const transparentTimer = useRef<NodeJS.Timeout | null>(null);
  const grayedTimer = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (transparentTimer.current) {
      clearTimeout(transparentTimer.current);
      transparentTimer.current = null;
    }
    if (grayedTimer.current) {
      clearTimeout(grayedTimer.current);
      grayedTimer.current = null;
    }
  }, []);

  const startHideSequence = useCallback(() => {
    clearAllTimers();
    
    // Stage 1: Wait 5 seconds before starting fade
    hideTimer.current = setTimeout(() => {
      setVisibilityState('light-transparent');
      
      // Stage 2: After 5 more seconds, go to grayed out
      grayedTimer.current = setTimeout(() => {
        setVisibilityState('hidden');
      }, 5000);
    }, 5000);
  }, [clearAllTimers]);

  const showToolbar = useCallback(() => {
    clearAllTimers();
    setVisibilityState('visible');
  }, [clearAllTimers]);

  // Effect to handle mouse leave behavior
  useEffect(() => {
    if (!isHoveringToolbar && !isHoveringHotZone && visibilityState === 'visible') {
      startHideSequence();
    } else if ((isHoveringToolbar || isHoveringHotZone) && visibilityState !== 'visible') {
      showToolbar();
    }
  }, [isHoveringToolbar, isHoveringHotZone, visibilityState, startHideSequence, showToolbar]);

  const handleToolbarMouseEnter = useCallback(() => {
    setIsHoveringToolbar(true);
  }, []);

  const handleToolbarMouseLeave = useCallback(() => {
    setIsHoveringToolbar(false);
  }, []);

  const handleHotZoneMouseEnter = useCallback(() => {
    setIsHoveringHotZone(true);
  }, []);

  const handleHotZoneMouseLeave = useCallback(() => {
    setIsHoveringHotZone(false);
  }, []);

  const getToolbarClasses = useCallback(() => {
    const baseClasses = "absolute top-16 left-1/2 transform -translate-x-1/2 z-30 bg-crd-darker/80 backdrop-blur-sm border border-crd-mediumGray/30 rounded-lg shadow-lg transition-all duration-500 ease-in-out";
    
    switch (visibilityState) {
      case 'hidden':
        return `${baseClasses} opacity-0 -translate-y-full pointer-events-none`;
      case 'visible':
        return `${baseClasses} opacity-100 translate-y-0`;
      case 'light-transparent':
        return `${baseClasses} opacity-40 translate-y-0`;
      case 'grayed-out':
        return `${baseClasses} opacity-20 translate-y-0 grayscale`;
      default:
        return baseClasses;
    }
  }, [visibilityState]);

  const getHotZoneProps = useCallback(() => ({
    onMouseEnter: handleHotZoneMouseEnter,
    onMouseLeave: handleHotZoneMouseLeave,
  }), [handleHotZoneMouseEnter, handleHotZoneMouseLeave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    visibilityState,
    isVisible: visibilityState !== 'hidden',
    onMouseEnter: handleToolbarMouseEnter,
    onMouseLeave: handleToolbarMouseLeave,
    getToolbarClasses,
    getHotZoneProps,
  };
};
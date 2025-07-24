import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CardData } from '@/types/card';

interface EnhancedMobileStudioInteractionsProps {
  cards: CardData[];
  currentCardIndex: number;
  onCardChange: (index: number) => void;
  onRefresh?: () => void;
  onRotationChange?: (rotation: { x: number; y: number }) => void;
  children: React.ReactNode;
  className?: string;
}

export const EnhancedMobileStudioInteractions: React.FC<EnhancedMobileStudioInteractionsProps> = ({
  cards,
  currentCardIndex,
  onCardChange,
  onRefresh,
  onRotationChange,
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDraggingForSwipe, setIsDraggingForSwipe] = useState(false);
  
  const { 
    light, 
    medium, 
    heavy, 
    cardFlip, 
    success,
    loadingComplete,
    swipeNavigation,
    rotationMilestone,
    zoomFeedback,
    pullRefresh
  } = useHapticFeedback({ respectPerformance: true });

  const SWIPE_THRESHOLD = 50;
  const PULL_THRESHOLD = 80;
  const ROTATION_SENSITIVITY = 0.3;

  // Enhanced touch gesture handlers
  const touchHandlers = {
    onPan: useCallback((deltaX: number, deltaY: number) => {
      // Handle pull-to-refresh
      if (deltaY > 0 && !isDraggingForSwipe) {
        const distance = Math.min(deltaY * 0.5, PULL_THRESHOLD + 20);
        setPullDistance(distance);
        
        if (distance > PULL_THRESHOLD && !isPullRefreshing) {
          pullRefresh(); // Enhanced haptic for pull refresh threshold
        }
      }
      
      // Handle card rotation on vertical pan
      if (!isPullRefreshing && Math.abs(deltaY) > Math.abs(deltaX)) {
        const newRotation = {
          x: rotation.x + deltaY * ROTATION_SENSITIVITY,
          y: rotation.y
        };
        setRotation(newRotation);
        onRotationChange?.(newRotation);
        
        // Haptic feedback on rotation milestones
        if (Math.abs(deltaY) > 20) {
          rotationMilestone();
        }
      }
      
      // Handle horizontal swipe for card navigation
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        setIsDraggingForSwipe(true);
        swipeNavigation(); // Enhanced swipe haptic feedback
      }
    }, [rotation, onRotationChange, isPullRefreshing, isDraggingForSwipe]),

    onTap: useCallback((x: number, y: number) => {
      light(); // Light haptic feedback on tap
    }, [light]),

    onDoubleTap: useCallback((x: number, y: number) => {
      // Reset rotation on double tap
      setRotation({ x: 0, y: 0 });
      onRotationChange?.({ x: 0, y: 0 });
      medium(); // Medium haptic feedback for reset
    }, [onRotationChange, medium]),

    onPinch: useCallback((scale: number, centerX: number, centerY: number) => {
      // Pinch to zoom/scale - handled by parent 3D controls
      if (Math.abs(scale - 1) > 0.1) {
        zoomFeedback(); // Enhanced zoom haptic feedback
      }
    }, [light]),

    onRotate: useCallback((angle: number, centerX: number, centerY: number) => {
      // Two-finger rotation
      const newRotation = {
        x: rotation.x,
        y: rotation.y + angle * 50
      };
      setRotation(newRotation);
      onRotationChange?.(newRotation);
      rotationMilestone(); // Enhanced rotation haptic feedback
    }, [rotation, onRotationChange, rotationMilestone])
  };

  // Initialize touch gestures
  useTouchGestures(containerRef, touchHandlers);

  // Handle touch end for swipe gestures
  useEffect(() => {
    const handleTouchEnd = (e: TouchEvent) => {
      // Handle pull-to-refresh completion
      if (pullDistance > PULL_THRESHOLD && onRefresh) {
        setIsPullRefreshing(true);
        medium(); // Enhanced haptic for refresh trigger
        
        onRefresh();
        
        // Simulate refresh completion
        setTimeout(() => {
          setIsPullRefreshing(false);
          setPullDistance(0);
          loadingComplete(); // Success haptic feedback
        }, 1500);
      } else {
        setPullDistance(0);
      }
      
      // Handle swipe navigation
      if (isDraggingForSwipe) {
        const touches = Array.from(e.changedTouches);
        if (touches.length > 0) {
          const touch = touches[0];
          const rect = containerRef.current?.getBoundingClientRect();
          
          if (rect) {
            const deltaX = touch.clientX - rect.left - rect.width / 2;
            
            if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
              if (deltaX > 0 && currentCardIndex > 0) {
                // Swipe right - previous card
                onCardChange(currentCardIndex - 1);
                cardFlip(); // Premium haptic feedback for card change
              } else if (deltaX < 0 && currentCardIndex < cards.length - 1) {
                // Swipe left - next card
                onCardChange(currentCardIndex + 1);
                cardFlip(); // Premium haptic feedback for card change
              } else {
                // Invalid swipe
                medium(); // Feedback for blocked action
              }
            }
          }
        }
        setIsDraggingForSwipe(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchend', handleTouchEnd, { passive: false });
      return () => container.removeEventListener('touchend', handleTouchEnd);
    }
  }, [pullDistance, isDraggingForSwipe, currentCardIndex, cards.length, onCardChange, onRefresh, medium, cardFlip, loadingComplete]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ 
        touchAction: 'none', // Disable default touch behaviors
        userSelect: 'none'
      }}
    >
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center bg-themed-accent/20 backdrop-blur-sm transition-all duration-200"
          style={{ 
            height: Math.min(pullDistance, PULL_THRESHOLD + 20),
            transform: `translateY(${Math.min(pullDistance - PULL_THRESHOLD - 20, 0)}px)`
          }}
        >
          <div className="flex items-center gap-2 text-themed-primary">
            <RefreshCw 
              className={`w-5 h-5 ${isPullRefreshing ? 'animate-spin' : ''} ${
                pullDistance > PULL_THRESHOLD ? 'text-themed-success' : 'text-themed-secondary'
              }`} 
            />
            <span className="text-sm font-medium">
              {isPullRefreshing ? 'Refreshing...' : 
               pullDistance > PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}

      {/* Swipe navigation indicators */}
      {isDraggingForSwipe && (
        <>
          {currentCardIndex > 0 && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-themed-accent/80 backdrop-blur-sm rounded-full p-3 text-themed-primary">
              <ChevronLeft className="w-6 h-6" />
            </div>
          )}
          {currentCardIndex < cards.length - 1 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-themed-accent/80 backdrop-blur-sm rounded-full p-3 text-themed-primary">
              <ChevronRight className="w-6 h-6" />
            </div>
          )}
        </>
      )}

      {/* Touch guidance overlay (shows briefly on first interaction) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 right-4 z-40 bg-themed-base/90 backdrop-blur-sm rounded-lg p-3 text-xs text-themed-secondary">
          <div className="grid grid-cols-2 gap-2">
            <div>• Swipe ← → to navigate cards</div>
            <div>• Pull ↓ to refresh</div>
            <div>• Pan to rotate card</div>
            <div>• Double tap to reset</div>
          </div>
        </div>
      )}

      {/* Main content with enhanced touch interactions */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
};
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseEnhancedNavbarProps {
  threshold?: number;
  hideOffset?: number;
  scrollVelocityThreshold?: number;
  showDelay?: number;
  hideDelay?: number;
}

interface ScrollMetrics {
  scrollY: number;
  velocity: number;
  direction: 'up' | 'down' | 'idle';
  isScrolling: boolean;
}

export const useEnhancedNavbar = ({
  threshold = 20,
  hideOffset = 100,
  scrollVelocityThreshold = 5,
  showDelay = 150,
  hideDelay = 300
}: UseEnhancedNavbarProps = {}) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    scrollY: 0,
    velocity: 0,
    direction: 'idle',
    isScrolling: false
  });

  // Refs for tracking
  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(Date.now());
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const visibilityTimeout = useRef<NodeJS.Timeout>();
  const velocityHistory = useRef<number[]>([]);

  // Route-specific behavior
  const isSpecialRoute = location.pathname.startsWith('/create/') || location.pathname.startsWith('/studio');
  const isHomePage = location.pathname === '/';

  const calculateVelocity = useCallback((currentScrollY: number, timestamp: number): number => {
    const deltaY = Math.abs(currentScrollY - lastScrollY.current);
    const deltaTime = timestamp - lastTimestamp.current;
    
    if (deltaTime === 0) return 0;
    
    const velocity = deltaY / deltaTime;
    
    // Keep velocity history for smoothing
    velocityHistory.current.push(velocity);
    if (velocityHistory.current.length > 5) {
      velocityHistory.current.shift();
    }
    
    // Return smoothed velocity
    return velocityHistory.current.reduce((sum, v) => sum + v, 0) / velocityHistory.current.length;
  }, []);

  const updateVisibility = useCallback((show: boolean, delay: number = 0) => {
    if (visibilityTimeout.current) {
      clearTimeout(visibilityTimeout.current);
    }

    if (delay > 0) {
      visibilityTimeout.current = setTimeout(() => {
        setIsVisible(show);
      }, delay);
    } else {
      setIsVisible(show);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const timestamp = Date.now();
    const velocity = calculateVelocity(currentScrollY, timestamp);
    
    const direction: 'up' | 'down' | 'idle' = 
      currentScrollY > lastScrollY.current ? 'down' :
      currentScrollY < lastScrollY.current ? 'up' : 'idle';

    // Update scroll metrics
    setScrollMetrics({
      scrollY: currentScrollY,
      velocity,
      direction,
      isScrolling: true
    });

    // Set scrolled state for styling
    setIsScrolled(currentScrollY > threshold);

    // Clear existing scroll timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Visibility logic
    if (currentScrollY <= threshold) {
      // Always show at the top
      updateVisibility(true);
    } else if (direction === 'up' && currentScrollY > threshold) {
      // Scrolling up - show with velocity-based delay
      const delay = velocity > scrollVelocityThreshold ? 0 : showDelay;
      updateVisibility(true, delay);
    } else if (direction === 'down' && currentScrollY > hideOffset) {
      // Scrolling down - hide with velocity-based sensitivity
      const shouldHideImmediately = velocity > scrollVelocityThreshold * 2;
      const delay = shouldHideImmediately ? 0 : hideDelay;
      
      // On special routes, be more conservative about hiding
      if (isSpecialRoute && velocity < scrollVelocityThreshold) {
        // Don't hide on gentle scrolling on special routes
        return;
      }
      
      updateVisibility(false, delay);
    }

    // Update refs
    lastScrollY.current = currentScrollY;
    lastTimestamp.current = timestamp;

    // Set scroll idle timeout
    scrollTimeout.current = setTimeout(() => {
      setScrollMetrics(prev => ({ ...prev, isScrolling: false }));
    }, 150);
  }, [threshold, hideOffset, scrollVelocityThreshold, showDelay, hideDelay, isSpecialRoute, calculateVelocity, updateVisibility]);

  useEffect(() => {
    // Throttled scroll handler using requestAnimationFrame
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial setup
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (visibilityTimeout.current) clearTimeout(visibilityTimeout.current);
    };
  }, [handleScroll]);

  // Reset visibility on route change
  useEffect(() => {
    // Show navbar immediately on route change
    setIsVisible(true);
    
    // Reset scroll position awareness
    lastScrollY.current = window.scrollY;
    lastTimestamp.current = Date.now();
    velocityHistory.current = [];
  }, [location.pathname]);

  // Reduced motion support
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    isVisible,
    isScrolled,
    scrollMetrics,
    isSpecialRoute,
    isHomePage,
    prefersReducedMotion
  };
};

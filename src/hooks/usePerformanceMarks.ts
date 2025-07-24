import { useEffect } from 'react';

/**
 * Performance monitoring hook for development
 * Adds performance marks and measures to track component render times
 */
export const usePerformanceMarks = (componentName: string, enabled = true) => {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    const startMark = `${componentName}-start`;
    const endMark = `${componentName}-end`;
    const measureName = `${componentName}-render`;

    // Mark the start of the component lifecycle
    performance.mark(startMark);

    return () => {
      // Mark the end and create a measure
      performance.mark(endMark);
      
      try {
        performance.measure(measureName, startMark, endMark);
        
        // Log the measure for debugging
        const measure = performance.getEntriesByName(measureName)[0];
        if (measure) {
          console.log(`${componentName} render time: ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.warn(`Performance measurement failed for ${componentName}:`, error);
      }

      // Clean up marks to prevent memory leaks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
    };
  }, [componentName, enabled]);
};

/**
 * Advanced performance monitoring with custom metrics
 */
export const useAdvancedPerformanceMarks = (
  componentName: string,
  options: {
    enabled?: boolean;
    trackInteractions?: boolean;
    trackAnimations?: boolean;
    logThreshold?: number; // Only log if duration exceeds this value (ms)
  } = {}
) => {
  const {
    enabled = true,
    trackInteractions = false,
    trackAnimations = false,
    logThreshold = 0
  } = options;

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    const startMark = `${componentName}-mount-start`;
    const endMark = `${componentName}-mount-end`;
    const measureName = `${componentName}-mount`;

    performance.mark(startMark);

    return () => {
      performance.mark(endMark);
      
      try {
        performance.measure(measureName, startMark, endMark);
        
        const measure = performance.getEntriesByName(measureName)[0];
        if (measure && measure.duration > logThreshold) {
          console.log(`📊 ${componentName} mount/unmount: ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.warn(`Performance measurement failed for ${componentName}:`, error);
      }

      // Cleanup
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
    };
  }, [componentName, enabled, logThreshold]);

  // Track specific interactions
  const markInteraction = (interactionName: string) => {
    if (!trackInteractions || process.env.NODE_ENV !== 'development') return;

    const markName = `${componentName}-${interactionName}`;
    performance.mark(markName);
    
    // Auto-cleanup after 5 seconds
    setTimeout(() => {
      performance.clearMarks(markName);
    }, 5000);
  };

  // Track animation performance
  const markAnimationStart = (animationName: string) => {
    if (!trackAnimations || process.env.NODE_ENV !== 'development') return;

    const startMark = `${componentName}-${animationName}-start`;
    performance.mark(startMark);
    
    return () => {
      const endMark = `${componentName}-${animationName}-end`;
      const measureName = `${componentName}-${animationName}`;
      
      performance.mark(endMark);
      
      try {
        performance.measure(measureName, startMark, endMark);
        
        const measure = performance.getEntriesByName(measureName)[0];
        if (measure && measure.duration > logThreshold) {
          console.log(`🎬 ${componentName} animation "${animationName}": ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.warn(`Animation measurement failed for ${componentName}.${animationName}:`, error);
      }

      // Cleanup
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
    };
  };

  return {
    markInteraction,
    markAnimationStart
  };
};
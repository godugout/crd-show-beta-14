import { useEffect } from 'react';

export const ProductionOptimizer = () => {
  useEffect(() => {
    // Core Web Vitals tracking
    const trackWebVitals = async () => {
      try {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
        
        const sendToAnalytics = (metric: any) => {
          // Only track if gtag is available
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', metric.name, {
              value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
              event_category: 'Web Vitals',
              event_label: metric.id,
              non_interaction: true,
            });
          }
          
          console.log('Web Vital:', metric);
        };

        onCLS(sendToAnalytics);
        onINP(sendToAnalytics); // Using INP instead of deprecated FID
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
      } catch (error) {
        console.warn('Web Vitals tracking failed:', error);
      }
    };

    // Performance monitoring
    const monitorPerformance = () => {
      if (!('performance' in window)) return;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            // Track page load performance using modern timing API
            const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
            
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'page_load_time', {
                value: Math.round(loadTime),
                event_category: 'Performance',
              });
            }
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('Performance monitoring failed:', error);
      }
    };

    // Error tracking
    const trackErrors = () => {
      window.addEventListener('error', (event) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exception', {
            description: event.error?.message || 'Unknown error',
            fatal: false,
          });
        }
        console.error('Global error:', event.error);
      });

      window.addEventListener('unhandledrejection', (event) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exception', {
            description: event.reason?.message || 'Unhandled promise rejection',
            fatal: false,
          });
        }
        console.error('Unhandled promise rejection:', event.reason);
      });
    };

    // Bundle size tracking
    const trackBundleSize = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        let totalJSSize = 0;
        let totalCSSSize = 0;

        resources.forEach((resource) => {
          if (resource.name.includes('.js')) {
            totalJSSize += resource.transferSize || 0;
          } else if (resource.name.includes('.css')) {
            totalCSSSize += resource.transferSize || 0;
          }
        });

        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'bundle_size', {
            js_size: Math.round(totalJSSize / 1024), // KB
            css_size: Math.round(totalCSSSize / 1024), // KB
            event_category: 'Performance',
          });
        }
      }
    };

    // Initialize all monitoring
    trackWebVitals();
    monitorPerformance();
    trackErrors();
    
    // Track bundle size after load
    setTimeout(trackBundleSize, 2000);

    // Memory usage monitoring (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo && typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'memory_usage', {
          used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024), // MB
          total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024), // MB
          event_category: 'Performance',
        });
      }
    }

    // Service Worker registration
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }

  }, []);

  return null;
};
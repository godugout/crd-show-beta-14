// Bundle optimization utilities

// Dynamic imports for code splitting
export const lazyImport = <T extends Record<string, any>>(
  importFunc: () => Promise<T>,
  exportName: keyof T
): (() => Promise<T[keyof T]>) => {
  return () => importFunc().then(module => module[exportName]);
};

// Component lazy loading with error boundaries
export const lazyLoadComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// Route-based code splitting
export const createLazyRoute = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    fallback?: React.ComponentType;
    preload?: boolean;
  }
) => {
  const LazyComponent = React.lazy(importFunc);
  
  if (options?.preload) {
    // Preload the component
    importFunc();
  }
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={options?.fallback ? <options.fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// Bundle size monitoring
export const trackBundleSize = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.name.includes('.js') || resourceEntry.name.includes('.css')) {
            console.log(`Bundle loaded: ${resourceEntry.name} (${Math.round(resourceEntry.transferSize / 1024)}KB)`);
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Image optimization utilities
export const optimizeImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}) => {
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.quality) params.append('q', options.quality.toString());
  if (options.format) params.append('f', options.format);
  
  return `${url}?${params.toString()}`;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/src/styles/card-hover-effects.css',
    '/src/components/common/EnhancedLoadingStates.tsx',
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
};

// Memory usage monitoring
export const trackMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memoryInfo = (performance as any).memory;
    
    setInterval(() => {
      const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024);
      
      if (usedMB > 100) {
        console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
      }
    }, 30000); // Check every 30 seconds
  }
};

// Component performance monitoring
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // Longer than one frame at 60fps
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    });
    
    return <Component {...props} />;
  });
};

// Debounced imports for better performance
export const debouncedImport = <T>(
  importFunc: () => Promise<T>,
  delay: number = 100
) => {
  let timeoutId: NodeJS.Timeout;
  let cachedResult: T | null = null;
  
  return () => {
    if (cachedResult) {
      return Promise.resolve(cachedResult);
    }
    
    return new Promise<T>((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const result = await importFunc();
          cachedResult = result;
          resolve(result);
        } catch (error) {
          console.error('Failed to load module:', error);
          throw error;
        }
      }, delay);
    });
  };
};

// Bundle analyzer helper
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    // This would integrate with webpack-bundle-analyzer or similar
    console.log('Bundle analysis available in development mode');
  }
};

// Export all utilities
export default {
  lazyImport,
  lazyLoadComponent,
  createLazyRoute,
  trackBundleSize,
  optimizeImageUrl,
  preloadCriticalResources,
  trackMemoryUsage,
  withPerformanceTracking,
  debouncedImport,
  analyzeBundle,
}; 
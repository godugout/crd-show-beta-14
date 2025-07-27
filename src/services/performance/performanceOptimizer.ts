interface PerformanceConfig {
  enablePredictiveLoading: boolean;
  enableLazyLoading: boolean;
  enableWebP: boolean;
  enableServiceWorker: boolean;
  reducedMotion: boolean;
  batterySaver: boolean;
  deviceTier: 'low' | 'medium' | 'high';
}

interface DeviceCapabilities {
  memory: number;
  cpuCores: number;
  connection: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  saveData: boolean;
  devicePixelRatio: number;
}

class PerformanceOptimizer {
  private config: PerformanceConfig;
  private deviceCapabilities: DeviceCapabilities;
  private observedElements: Map<Element, IntersectionObserver> = new Map();
  private preloadQueue: Set<string> = new Set();
  private resourceTimings: Map<string, number> = new Map();

  constructor() {
    this.config = this.getDefaultConfig();
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.initializeOptimizations();
  }

  private getDefaultConfig(): PerformanceConfig {
    return {
      enablePredictiveLoading: true,
      enableLazyLoading: true,
      enableWebP: this.supportsWebP(),
      enableServiceWorker: 'serviceWorker' in navigator,
      reducedMotion: this.prefersReducedMotion(),
      batterySaver: false,
      deviceTier: 'medium',
    };
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    const nav = navigator as any;

    return {
      memory: nav.deviceMemory || 4,
      cpuCores: nav.hardwareConcurrency || 4,
      connection: this.getConnectionType(),
      saveData: nav.connection?.saveData || false,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  }

  private getConnectionType(): DeviceCapabilities['connection'] {
    const connection = (navigator as any).connection;
    if (!connection) return 'unknown';

    const effectiveType = connection.effectiveType;
    if (['slow-2g', '2g', '3g', '4g'].includes(effectiveType)) {
      return effectiveType;
    }

    return 'unknown';
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const result = canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    return result;
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private initializeOptimizations() {
    // Determine device tier based on capabilities
    this.config.deviceTier = this.calculateDeviceTier();

    // Initialize lazy loading
    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }

    // Initialize predictive preloading
    if (this.config.enablePredictiveLoading) {
      this.setupPredictivePreloading();
    }

    // Monitor battery status
    this.monitorBatteryStatus();

    // Monitor network changes
    this.monitorNetworkChanges();
  }

  private calculateDeviceTier(): 'low' | 'medium' | 'high' {
    const { memory, cpuCores, connection, saveData } = this.deviceCapabilities;

    if (saveData || connection === 'slow-2g' || connection === '2g') {
      return 'low';
    }

    if (memory >= 8 && cpuCores >= 8 && connection === '4g') {
      return 'high';
    }

    if (memory < 4 || cpuCores < 4 || connection === '3g') {
      return 'low';
    }

    return 'medium';
  }

  // Lazy Loading Implementation
  private setupLazyLoading() {
    const lazyImageObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            lazyImageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    );

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      lazyImageObserver.observe(img);
      this.observedElements.set(img, lazyImageObserver);
    });
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (!src) return;

    // Use appropriate format based on support
    const finalSrc = this.getOptimizedImageUrl(src);

    // Preload image
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = finalSrc;
      img.classList.add('loaded');
      delete img.dataset.src;
    };
    tempImg.src = finalSrc;
  }

  private getOptimizedImageUrl(url: string): string {
    if (!this.config.enableWebP) return url;

    // Check if URL already has a format
    if (url.includes('.webp') || url.includes('.avif')) return url;

    // Convert to WebP if supported
    if (url.match(/\.(jpg|jpeg|png)$/i)) {
      return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    return url;
  }

  // Predictive Preloading
  private setupPredictivePreloading() {
    // Track user interactions to predict next actions
    document.addEventListener('mouseover', this.handleHover.bind(this), true);
    document.addEventListener('touchstart', this.handleTouch.bind(this), true);

    // Analyze navigation patterns
    this.analyzeNavigationPatterns();
  }

  private handleHover(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.href && !this.preloadQueue.has(link.href)) {
      this.predictivePreload(link.href);
    }
  }

  private handleTouch(event: TouchEvent) {
    const target = event.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.href && !this.preloadQueue.has(link.href)) {
      this.predictivePreload(link.href);
    }
  }

  private predictivePreload(url: string) {
    if (this.preloadQueue.size >= 5) return; // Limit preload queue

    this.preloadQueue.add(url);

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);

    // Clean up after some time
    setTimeout(() => {
      this.preloadQueue.delete(url);
      link.remove();
    }, 30000);
  }

  private analyzeNavigationPatterns() {
    // Simple pattern recognition based on user behavior
    const navigationHistory = this.getNavigationHistory();
    const patterns = this.findPatterns(navigationHistory);

    // Preload based on patterns
    patterns.forEach(pattern => {
      if (pattern.confidence > 0.7) {
        this.predictivePreload(pattern.nextUrl);
      }
    });
  }

  private getNavigationHistory(): string[] {
    // Get from localStorage or session
    const history = localStorage.getItem('nav-history');
    return history ? JSON.parse(history) : [];
  }

  private findPatterns(
    history: string[]
  ): Array<{ nextUrl: string; confidence: number }> {
    // Simple pattern matching (in production, use ML)
    const patterns: Array<{ nextUrl: string; confidence: number }> = [];

    // Find common sequences
    for (let i = 0; i < history.length - 2; i++) {
      const current = history[i];
      const next = history[i + 1];

      // Look for repeating patterns
      let count = 0;
      for (let j = i + 2; j < history.length - 1; j++) {
        if (history[j] === current && history[j + 1] === next) {
          count++;
        }
      }

      if (count > 2) {
        patterns.push({
          nextUrl: next,
          confidence: count / (history.length / 2),
        });
      }
    }

    return patterns;
  }

  // Real-time Performance Adjustments
  adjustQuality(element: HTMLElement, quality: 'low' | 'medium' | 'high') {
    const tier = this.config.deviceTier;

    if (tier === 'low' || this.config.batterySaver) {
      // Reduce particle effects
      element.style.setProperty('--particle-count', '10');

      // Simplify shaders
      element.classList.add('simple-shaders');

      // Reduce animation complexity
      element.style.setProperty('--animation-duration', '0.2s');
    } else if (tier === 'high' && !this.config.reducedMotion) {
      // Full quality
      element.style.setProperty('--particle-count', '100');
      element.classList.remove('simple-shaders');
      element.style.setProperty('--animation-duration', '0.6s');
    }
  }

  // Battery Monitoring
  private async monitorBatteryStatus() {
    if (!('getBattery' in navigator)) return;

    try {
      const battery = await (navigator as any).getBattery();

      battery.addEventListener('levelchange', () => {
        if (battery.level < 0.2 && !battery.charging) {
          this.enableBatterySaver();
        }
      });

      battery.addEventListener('chargingchange', () => {
        if (battery.charging && this.config.batterySaver) {
          this.disableBatterySaver();
        }
      });
    } catch (error) {
      console.error('Battery API not available');
    }
  }

  private enableBatterySaver() {
    this.config.batterySaver = true;
    document.documentElement.classList.add('battery-saver');

    // Reduce all quality settings
    document.querySelectorAll('[data-performance]').forEach(el => {
      this.adjustQuality(el as HTMLElement, 'low');
    });
  }

  private disableBatterySaver() {
    this.config.batterySaver = false;
    document.documentElement.classList.remove('battery-saver');

    // Restore quality based on device tier
    document.querySelectorAll('[data-performance]').forEach(el => {
      this.adjustQuality(el as HTMLElement, this.config.deviceTier);
    });
  }

  // Network Monitoring
  private monitorNetworkChanges() {
    const connection = (navigator as any).connection;
    if (!connection) return;

    connection.addEventListener('change', () => {
      this.deviceCapabilities.connection = this.getConnectionType();
      this.config.deviceTier = this.calculateDeviceTier();

      // Adjust loading strategy based on new connection
      if (
        this.deviceCapabilities.connection === 'slow-2g' ||
        this.deviceCapabilities.connection === '2g'
      ) {
        this.config.enablePredictiveLoading = false;
      } else {
        this.config.enablePredictiveLoading = true;
      }
    });
  }

  // Service Worker Integration
  registerServiceWorker() {
    if (!this.config.enableServiceWorker) return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  // New service worker activated
                  this.handleServiceWorkerUpdate();
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  private handleServiceWorkerUpdate() {
    // Notify user about update
    if (confirm('New version available! Refresh to update?')) {
      window.location.reload();
    }
  }

  // Performance Metrics
  measurePerformance() {
    if (!('PerformanceObserver' in window)) return;

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);

      // Adjust strategy if LCP is too high
      if (lastEntry.startTime > 2500) {
        this.config.enablePredictiveLoading = false;
      }
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });

    fidObserver.observe({ entryTypes: ['first-input'] });
  }

  // Cleanup
  destroy() {
    // Clean up observers
    this.observedElements.forEach(observer => {
      observer.disconnect();
    });
    this.observedElements.clear();

    // Clear preload queue
    this.preloadQueue.clear();
  }
}

export const performanceOptimizer = new PerformanceOptimizer();

import { useCallback, useEffect, useRef, useState } from 'react';

export interface PerformanceMetric {
  current: number;
  average: number;
  min: number;
  max: number;
  samples: number;
}

export interface PerformanceMetrics {
  [key: string]: PerformanceMetric;
}

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercentage: number;
}

export interface TextureInfo {
  width: number;
  height: number;
  format: string;
}

export interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
}

export interface PerformanceMonitorOptions {
  windowSize?: number;
  onThresholdBreach?: (alert: PerformanceAlert) => void;
}

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  frameRate: { min: 30, target: 60 },
  textureLoadTime: { max: 200 },
  memoryUsage: { max: 200 }, // MB
  materialUpdateTime: { max: 16 }, // ms
};

// Circular buffer for rolling averages
class CircularBuffer {
  private buffer: number[];
  private index: number = 0;
  private size: number;
  private filled: boolean = false;

  constructor(size: number) {
    this.size = size;
    this.buffer = new Array(size);
  }

  add(value: number): void {
    this.buffer[this.index] = value;
    this.index = (this.index + 1) % this.size;
    if (!this.filled && this.index === 0) {
      this.filled = true;
    }
  }

  getAverage(): number {
    const count = this.filled ? this.size : this.index;
    if (count === 0) return 0;

    const sum = this.buffer.slice(0, count).reduce((acc, val) => acc + val, 0);
    return sum / count;
  }

  getValues(): number[] {
    if (!this.filled) {
      return this.buffer.slice(0, this.index);
    }
    return [
      ...this.buffer.slice(this.index),
      ...this.buffer.slice(0, this.index),
    ];
  }

  clear(): void {
    this.index = 0;
    this.filled = false;
  }
}

export function usePerformanceMonitor(options: PerformanceMonitorOptions = {}) {
  const { windowSize = 100, onThresholdBreach } = options;

  // State
  const [isMonitoring, setIsMonitoring] = useState(false);
  const metrics = useRef<Record<string, CircularBuffer>>({});
  const timers = useRef<Record<string, number>>({});
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize metric buffers
  const initializeMetric = useCallback(
    (name: string) => {
      if (!metrics.current[name]) {
        metrics.current[name] = new CircularBuffer(windowSize);
      }
    },
    [windowSize]
  );

  // Timer management
  const startTimer = useCallback((name: string): string => {
    const timerId = `${name}-${Date.now()}-${Math.random()}`;
    const startTime = performance?.now?.() || Date.now();
    timers.current[timerId] = startTime;
    return timerId;
  }, []);

  const endTimer = useCallback((timerId: string): number => {
    const startTime = timers.current[timerId];
    if (!startTime) return 0;

    const endTime = performance?.now?.() || Date.now();
    const duration = endTime - startTime;

    delete timers.current[timerId];
    return duration;
  }, []);

  // Record metric value
  const recordMetric = useCallback(
    (name: string, value: number) => {
      initializeMetric(name);
      metrics.current[name].add(value);

      // Check thresholds
      if (onThresholdBreach) {
        checkThreshold(name, value);
      }
    },
    [initializeMetric, onThresholdBreach]
  );

  // Check performance thresholds
  const checkThreshold = useCallback(
    (metricName: string, value: number) => {
      const threshold =
        PERFORMANCE_THRESHOLDS[
          metricName as keyof typeof PERFORMANCE_THRESHOLDS
        ];
      if (!threshold) return;

      let alert: PerformanceAlert | null = null;

      if ('min' in threshold && value < threshold.min) {
        alert = {
          metric: metricName,
          value,
          threshold: threshold.min,
          severity: value < threshold.min * 0.5 ? 'high' : 'medium',
        };
      } else if ('max' in threshold && value > threshold.max) {
        alert = {
          metric: metricName,
          value,
          threshold: threshold.max,
          severity: value > threshold.max * 2 ? 'high' : 'medium',
        };
      }

      if (alert && onThresholdBreach) {
        onThresholdBreach(alert);
      }
    },
    [onThresholdBreach]
  );

  // Get current metrics
  const getMetrics = useCallback((): PerformanceMetrics => {
    const result: PerformanceMetrics = {};

    Object.entries(metrics.current).forEach(([name, buffer]) => {
      const values = buffer.getValues();
      if (values.length === 0) {
        result[name] = {
          current: 0,
          average: 0,
          min: 0,
          max: 0,
          samples: 0,
        };
      } else {
        result[name] = {
          current: values[values.length - 1],
          average: buffer.getAverage(),
          min: Math.min(...values),
          max: Math.max(...values),
          samples: values.length,
        };
      }
    });

    return result;
  }, []);

  // Memory information
  const getMemoryInfo = useCallback((): MemoryInfo => {
    if (performance?.memory) {
      const memory = performance.memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }

    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      usagePercentage: 0,
    };
  }, []);

  // Calculate texture memory usage
  const calculateTextureMemory = useCallback(
    (textures: TextureInfo[]): number => {
      return textures.reduce((total, texture) => {
        const { width, height, format } = texture;
        const bytesPerPixel = format === 'RGBA' ? 4 : 3;
        return total + width * height * bytesPerPixel;
      }, 0);
    },
    []
  );

  // Performance analysis
  const isMemoryPressureHigh = useCallback((): boolean => {
    const memoryInfo = getMemoryInfo();
    return memoryInfo.usagePercentage > 90;
  }, [getMemoryInfo]);

  const isPerformanceDegraded = useCallback((): boolean => {
    const currentMetrics = getMetrics();
    const frameRate = currentMetrics.frameRate;

    if (frameRate && frameRate.current < PERFORMANCE_THRESHOLDS.frameRate.min) {
      return true;
    }

    return false;
  }, [getMetrics]);

  const getPerformanceAlerts = useCallback((): string[] => {
    const alerts: string[] = [];
    const currentMetrics = getMetrics();

    // Check frame rate
    if (
      currentMetrics.frameRate?.current < PERFORMANCE_THRESHOLDS.frameRate.min
    ) {
      alerts.push('Low frame rate detected');
    }

    // Check texture loading time
    if (
      currentMetrics.textureLoadTime?.current >
      PERFORMANCE_THRESHOLDS.textureLoadTime.max
    ) {
      alerts.push('Slow texture loading detected');
    }

    // Check memory usage
    const memoryInfo = getMemoryInfo();
    if (memoryInfo.usagePercentage > 85) {
      alerts.push('High memory usage detected');
    }

    return alerts;
  }, [getMetrics, getMemoryInfo]);

  const getPerformanceRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    const currentMetrics = getMetrics();
    const memoryInfo = getMemoryInfo();

    // Frame rate recommendations
    if (
      currentMetrics.frameRate?.current <
      PERFORMANCE_THRESHOLDS.frameRate.target
    ) {
      recommendations.push('Consider reducing material complexity');
      recommendations.push('Enable LOD (Level of Detail) for distant objects');
    }

    // Texture loading recommendations
    if (currentMetrics.textureLoadTime?.average > 100) {
      recommendations.push('Enable texture compression');
      recommendations.push('Implement texture streaming');
    }

    // Memory recommendations
    if (memoryInfo.usagePercentage > 70) {
      recommendations.push('Clear unused texture cache');
      recommendations.push('Reduce texture resolution');
    }

    return recommendations;
  }, [getMetrics, getMemoryInfo]);

  // Metric trends
  const getMetricTrend = useCallback(
    (metricName: string): 'improving' | 'stable' | 'declining' => {
      const buffer = metrics.current[metricName];
      if (!buffer) return 'stable';

      const values = buffer.getValues();
      if (values.length < 3) return 'stable';

      const recent = values.slice(-3);
      const earlier = values.slice(-6, -3);

      if (earlier.length === 0) return 'stable';

      const recentAvg =
        recent.reduce((sum, val) => sum + val, 0) / recent.length;
      const earlierAvg =
        earlier.reduce((sum, val) => sum + val, 0) / earlier.length;

      const threshold = earlierAvg * 0.05; // 5% threshold

      if (recentAvg > earlierAvg + threshold) {
        return 'improving';
      } else if (recentAvg < earlierAvg - threshold) {
        return 'declining';
      } else {
        return 'stable';
      }
    },
    []
  );

  // Continuous monitoring
  const startContinuousMonitoring = useCallback(
    (interval: number = 1000) => {
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current);
      }

      setIsMonitoring(true);
      monitoringInterval.current = setInterval(() => {
        const memoryInfo = getMemoryInfo();
        recordMetric('memoryUsage', memoryInfo.usedJSHeapSize / (1024 * 1024)); // MB

        // Record frame rate (simplified - in real app would use requestAnimationFrame)
        const now = performance?.now?.() || Date.now();
        recordMetric('frameRate', 1000 / 16.67); // Assume 60fps for demo
      }, interval);
    },
    [getMemoryInfo, recordMetric]
  );

  const stopContinuousMonitoring = useCallback(() => {
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
    setIsMonitoring(false);
  }, []);

  // Export metrics for analysis
  const exportMetrics = useCallback(() => {
    return {
      timestamp: Date.now(),
      metrics: getMetrics(),
      system: {
        memory: getMemoryInfo(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      },
    };
  }, [getMetrics, getMemoryInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopContinuousMonitoring();
    };
  }, [stopContinuousMonitoring]);

  return {
    // Timer functions
    startTimer,
    endTimer,

    // Metric recording
    recordMetric,
    getMetrics,

    // Memory monitoring
    getMemoryInfo,
    calculateTextureMemory,

    // Performance analysis
    isMemoryPressureHigh,
    isPerformanceDegraded,
    getPerformanceAlerts,
    getPerformanceRecommendations,
    getMetricTrend,

    // Continuous monitoring
    startContinuousMonitoring,
    stopContinuousMonitoring,
    isMonitoring: () => isMonitoring,

    // Data export
    exportMetrics,
  };
}

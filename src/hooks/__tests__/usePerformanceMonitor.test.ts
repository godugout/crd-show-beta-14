import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePerformanceMonitor } from '../usePerformanceMonitor';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
};

// Mock memory API
const mockMemory = {
  usedJSHeapSize: 50 * 1024 * 1024, // 50MB
  totalJSHeapSize: 100 * 1024 * 1024, // 100MB
  jsHeapSizeLimit: 2 * 1024 * 1024 * 1024, // 2GB
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

Object.defineProperty(global.performance, 'memory', {
  value: mockMemory,
  writable: true,
});

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformance.now.mockReturnValue(1000);
  });

  describe('Timer Management', () => {
    it('should start and end timers correctly', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      let timerId: string;
      act(() => {
        timerId = result.current.startTimer('material-update');
      });

      expect(timerId).toBeDefined();
      expect(typeof timerId).toBe('string');

      // Simulate time passage
      mockPerformance.now.mockReturnValue(1050);

      act(() => {
        const duration = result.current.endTimer(timerId);
        expect(duration).toBe(50);
      });
    });

    it('should handle multiple concurrent timers', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      let timer1: string, timer2: string;
      act(() => {
        timer1 = result.current.startTimer('operation-1');
        mockPerformance.now.mockReturnValue(1025);
        timer2 = result.current.startTimer('operation-2');
      });

      mockPerformance.now.mockReturnValue(1075);

      act(() => {
        const duration1 = result.current.endTimer(timer1);
        const duration2 = result.current.endTimer(timer2);

        expect(duration1).toBe(75); // 1075 - 1000
        expect(duration2).toBe(50); // 1075 - 1025
      });
    });

    it('should handle invalid timer IDs gracefully', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        const duration = result.current.endTimer('invalid-timer-id');
        expect(duration).toBe(0);
      });
    });
  });

  describe('Metrics Recording', () => {
    it('should record frame rate metrics', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordMetric('frameRate', 60);
        result.current.recordMetric('frameRate', 58);
        result.current.recordMetric('frameRate', 62);
      });

      const metrics = result.current.getMetrics();
      expect(metrics.frameRate).toEqual({
        current: 62,
        average: 60,
        min: 58,
        max: 62,
        samples: 3,
      });
    });

    it('should record memory usage metrics', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordMetric('memoryUsage', 64);
        result.current.recordMetric('memoryUsage', 72);
      });

      const metrics = result.current.getMetrics();
      expect(metrics.memoryUsage).toEqual({
        current: 72,
        average: 68,
        min: 64,
        max: 72,
        samples: 2,
      });
    });

    it('should record texture loading times', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordMetric('textureLoadTime', 150);
        result.current.recordMetric('textureLoadTime', 200);
        result.current.recordMetric('textureLoadTime', 100);
      });

      const metrics = result.current.getMetrics();
      expect(metrics.textureLoadTime).toEqual({
        current: 100,
        average: 150,
        min: 100,
        max: 200,
        samples: 3,
      });
    });
  });

  describe('Memory Monitoring', () => {
    it('should track JavaScript heap usage', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      const memoryInfo = result.current.getMemoryInfo();

      expect(memoryInfo).toEqual({
        usedJSHeapSize: 50 * 1024 * 1024,
        totalJSHeapSize: 100 * 1024 * 1024,
        jsHeapSizeLimit: 2 * 1024 * 1024 * 1024,
        usagePercentage: 50,
      });
    });

    it('should detect memory pressure', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      // Normal memory usage
      expect(result.current.isMemoryPressureHigh()).toBe(false);

      // High memory usage
      mockMemory.usedJSHeapSize = 180 * 1024 * 1024; // 180MB out of 200MB
      mockMemory.totalJSHeapSize = 200 * 1024 * 1024;

      expect(result.current.isMemoryPressureHigh()).toBe(true);
    });

    it('should calculate texture memory usage', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      const textureMemory = result.current.calculateTextureMemory([
        { width: 1024, height: 1024, format: 'RGBA' },
        { width: 512, height: 512, format: 'RGB' },
      ]);

      // RGBA: 1024 * 1024 * 4 = 4MB
      // RGB: 512 * 512 * 3 = 768KB
      expect(textureMemory).toBe(4 * 1024 * 1024 + 768 * 1024);
    });
  });

  describe('Performance Thresholds', () => {
    it('should detect frame rate drops', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordMetric('frameRate', 60);
        result.current.recordMetric('frameRate', 45); // Below 60fps threshold
      });

      expect(result.current.isPerformanceDegraded()).toBe(true);
    });

    it('should detect slow texture loading', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordMetric('textureLoadTime', 500); // Above 200ms threshold
      });

      const alerts = result.current.getPerformanceAlerts();
      expect(alerts).toContain('Slow texture loading detected');
    });

    it('should provide performance recommendations', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordMetric('frameRate', 25); // Poor frame rate
        result.current.recordMetric('textureLoadTime', 600); // Slow loading
      });

      const recommendations = result.current.getPerformanceRecommendations();
      expect(recommendations).toContain(
        'Consider reducing material complexity'
      );
      expect(recommendations).toContain('Enable texture compression');
    });
  });

  describe('Metrics Aggregation', () => {
    it('should calculate rolling averages', () => {
      const { result } = renderHook(() =>
        usePerformanceMonitor({ windowSize: 3 })
      );

      act(() => {
        result.current.recordMetric('frameRate', 60);
        result.current.recordMetric('frameRate', 55);
        result.current.recordMetric('frameRate', 50);
        result.current.recordMetric('frameRate', 45); // Should push out first value
      });

      const metrics = result.current.getMetrics();
      expect(metrics.frameRate.average).toBe(50); // (55 + 50 + 45) / 3
    });

    it('should track metric trends', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordMetric('frameRate', 60);
        result.current.recordMetric('frameRate', 55);
        result.current.recordMetric('frameRate', 50);
      });

      const trend = result.current.getMetricTrend('frameRate');
      expect(trend).toBe('declining');
    });

    it('should export metrics for analysis', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordMetric('frameRate', 60);
        result.current.recordMetric('memoryUsage', 128);
      });

      const exportData = result.current.exportMetrics();
      expect(exportData).toEqual({
        timestamp: expect.any(Number),
        metrics: expect.any(Object),
        system: expect.any(Object),
      });
    });
  });

  describe('Real-time Monitoring', () => {
    it('should start continuous monitoring', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.startContinuousMonitoring(100); // 100ms interval
      });

      expect(result.current.isMonitoring()).toBe(true);
    });

    it('should stop continuous monitoring', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.startContinuousMonitoring(100);
        result.current.stopContinuousMonitoring();
      });

      expect(result.current.isMonitoring()).toBe(false);
    });

    it('should trigger callbacks on threshold breaches', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        usePerformanceMonitor({
          onThresholdBreach: callback,
        })
      );

      act(() => {
        result.current.recordMetric('frameRate', 20); // Below threshold
      });

      expect(callback).toHaveBeenCalledWith({
        metric: 'frameRate',
        value: 20,
        threshold: 30,
        severity: 'high',
      });
    });
  });

  describe('Browser Compatibility', () => {
    it('should handle missing performance.memory gracefully', () => {
      const originalMemory = global.performance.memory;
      delete (global.performance as any).memory;

      const { result } = renderHook(() => usePerformanceMonitor());

      const memoryInfo = result.current.getMemoryInfo();
      expect(memoryInfo.usedJSHeapSize).toBe(0);

      // Restore
      global.performance.memory = originalMemory;
    });

    it('should fallback when performance API is unavailable', () => {
      const originalPerformance = global.performance;
      delete (global as any).performance;

      const { result } = renderHook(() => usePerformanceMonitor());

      const timerId = result.current.startTimer('test');
      const duration = result.current.endTimer(timerId);

      expect(duration).toBeGreaterThanOrEqual(0);

      // Restore
      global.performance = originalPerformance;
    });
  });
});

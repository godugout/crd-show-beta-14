import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderCalls: number;
  lastUpdate: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showOverlay?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = false,
  showOverlay = false,
  onMetricsUpdate
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderCalls: 0,
    lastUpdate: Date.now()
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!enabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const updateMetrics = () => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      
      frameCountRef.current++;
      
      // Calculate FPS every second
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
        const frameTime = deltaTime / frameCountRef.current;
        
        // Update FPS history for smoothing
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }
        
        const avgFps = Math.round(
          fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
        );

        // Get memory usage if available
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo ? 
          Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 0;

        const newMetrics: PerformanceMetrics = {
          fps: avgFps,
          frameTime: Math.round(frameTime * 100) / 100,
          memoryUsage,
          renderCalls: frameCountRef.current,
          lastUpdate: Date.now()
        };

        setMetrics(newMetrics);
        onMetricsUpdate?.(newMetrics);

        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(updateMetrics);
    };

    animationFrameRef.current = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, onMetricsUpdate]);

  if (!enabled || !showOverlay) {
    return null;
  }

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-emerald-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="fixed top-4 right-4 z-50 p-3 bg-black/80 text-white text-xs font-mono min-w-[180px]">
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={getPerformanceColor(metrics.fps)}>
            {metrics.fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span className="text-blue-400">{metrics.frameTime}ms</span>
        </div>
        {metrics.memoryUsage > 0 && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="text-purple-400">{metrics.memoryUsage}MB</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Renders:</span>
          <span className="text-gray-400">{metrics.renderCalls}</span>
        </div>
      </div>
    </Card>
  );
};
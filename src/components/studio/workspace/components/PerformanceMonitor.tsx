import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { PerformanceMetrics } from '../types';
import { 
  Monitor, 
  Zap, 
  HardDrive, 
  Triangle, 
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const getPositionClasses = (position: string) => {
  switch (position) {
    case 'top-left': return 'top-4 left-4';
    case 'top-right': return 'top-4 right-4';
    case 'bottom-left': return 'bottom-4 left-4';
    case 'bottom-right': return 'bottom-4 right-4';
    default: return 'top-4 right-4';
  }
};

const getPerformanceColor = (fps: number) => {
  if (fps >= 55) return 'text-green-500';
  if (fps >= 30) return 'text-yellow-500';
  return 'text-red-500';
};

const getMemoryColor = (usage: number) => {
  if (usage < 200) return 'text-green-500';
  if (usage < 400) return 'text-yellow-500';
  return 'text-red-500';
};

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  metrics,
  position,
  className
}) => {
  const fpsColor = getPerformanceColor(metrics.fps);
  const memoryColor = getMemoryColor(metrics.memoryUsage);
  const isPerformanceGood = metrics.fps >= 30;

  return (
    <Card className={cn(
      "absolute z-20 w-64 bg-background/90 backdrop-blur-sm border-border shadow-lg",
      getPositionClasses(position),
      className
    )}>
      <CardContent className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Performance</span>
          </div>
          {isPerformanceGood ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>

        {/* FPS */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Frame Rate</span>
            </div>
            <Badge variant="outline" className={cn("text-xs", fpsColor)}>
              {metrics.fps} FPS
            </Badge>
          </div>
          <Progress 
            value={Math.min((metrics.fps / 60) * 100, 100)} 
            className="h-1"
          />
        </div>

        {/* Frame Time */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Frame Time</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {metrics.frameTime}ms
            </span>
          </div>
          <Progress 
            value={Math.max(0, 100 - (metrics.frameTime / 33.3) * 100)} 
            className="h-1"
          />
        </div>

        {/* Memory Usage */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Memory</span>
            </div>
            <Badge variant="outline" className={cn("text-xs", memoryColor)}>
              {metrics.memoryUsage}MB
            </Badge>
          </div>
          <Progress 
            value={Math.min((metrics.memoryUsage / 500) * 100, 100)} 
            className="h-1"
          />
        </div>

        {/* Render Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Triangle className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Triangles</span>
            </div>
            <span className="text-xs font-mono">
              {(metrics.triangleCount / 1000).toFixed(0)}K
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Draw Calls</span>
            </div>
            <span className="text-xs font-mono">
              {metrics.drawCalls}
            </span>
          </div>
        </div>

        {/* Performance Status */}
        <div className="pt-2 border-t border-border">
          {isPerformanceGood ? (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs">Optimal Performance</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs">Performance Warning</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
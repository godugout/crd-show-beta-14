import { useEffect, useRef, useCallback } from 'react';

type AnimationCallback = (timestamp: number) => void;

interface AnimationTask {
  id: string;
  callback: AnimationCallback;
  priority: number;
}

class AnimationController {
  private static instance: AnimationController;
  private tasks: Map<string, AnimationTask> = new Map();
  private rafId: number | null = null;
  private isRunning = false;
  private lastTimestamp = 0;

  static getInstance(): AnimationController {
    if (!AnimationController.instance) {
      AnimationController.instance = new AnimationController();
    }
    return AnimationController.instance;
  }

  private animate = (timestamp: number) => {
    this.lastTimestamp = timestamp;
    
    // Sort tasks by priority (higher priority first)
    const sortedTasks = Array.from(this.tasks.values())
      .sort((a, b) => b.priority - a.priority);

    // Execute all animation callbacks
    sortedTasks.forEach(task => {
      try {
        task.callback(timestamp);
      } catch (error) {
        console.error(`Animation task ${task.id} failed:`, error);
      }
    });

    // Continue the loop if we have tasks
    if (this.tasks.size > 0) {
      this.rafId = requestAnimationFrame(this.animate);
    } else {
      this.isRunning = false;
      this.rafId = null;
    }
  };

  addTask(id: string, callback: AnimationCallback, priority = 0): void {
    this.tasks.set(id, { id, callback, priority });
    
    // Start the animation loop if not already running
    if (!this.isRunning) {
      this.isRunning = true;
      this.rafId = requestAnimationFrame(this.animate);
    }
  }

  removeTask(id: string): void {
    this.tasks.delete(id);
    
    // Stop the loop if no tasks remain
    if (this.tasks.size === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.isRunning = false;
    }
  }

  hasTask(id: string): boolean {
    return this.tasks.has(id);
  }

  getTaskCount(): number {
    return this.tasks.size;
  }

  destroy(): void {
    this.tasks.clear();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.isRunning = false;
    }
  }
}

/**
 * Central animation controller hook that manages all animations through a single RAF loop
 * This eliminates animation duplication and improves performance
 */
export const useAnimationController = () => {
  const controllerRef = useRef<AnimationController>();
  
  // Initialize controller on first use
  if (!controllerRef.current) {
    controllerRef.current = AnimationController.getInstance();
  }

  const addAnimation = useCallback((
    id: string, 
    callback: AnimationCallback, 
    priority = 0
  ) => {
    controllerRef.current?.addTask(id, callback, priority);
  }, []);

  const removeAnimation = useCallback((id: string) => {
    controllerRef.current?.removeTask(id);
  }, []);

  const hasAnimation = useCallback((id: string) => {
    return controllerRef.current?.hasTask(id) ?? false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Note: Don't destroy the controller here as it's shared
      // Individual components should remove their own tasks
    };
  }, []);

  return {
    addAnimation,
    removeAnimation,
    hasAnimation,
    getTaskCount: () => controllerRef.current?.getTaskCount() ?? 0
  };
};

/**
 * Hook for components that need a single animation task
 * Automatically handles cleanup on unmount
 */
export const useAnimationTask = (
  id: string,
  callback: AnimationCallback,
  priority = 0,
  enabled = true
) => {
  const { addAnimation, removeAnimation } = useAnimationController();
  const callbackRef = useRef(callback);
  
  // Keep callback reference current
  callbackRef.current = callback;
  
  useEffect(() => {
    if (enabled) {
      addAnimation(id, callbackRef.current, priority);
    } else {
      removeAnimation(id);
    }
    
    return () => {
      removeAnimation(id);
    };
  }, [id, priority, enabled, addAnimation, removeAnimation]);
};

/**
 * Hook for throttled animations that only update when needed
 */
export const useThrottledAnimationTask = (
  id: string,
  callback: AnimationCallback,
  throttleMs = 16, // ~60fps
  priority = 0,
  enabled = true
) => {
  const lastUpdateRef = useRef(0);
  
  const throttledCallback = useCallback((timestamp: number) => {
    if (timestamp - lastUpdateRef.current >= throttleMs) {
      callback(timestamp);
      lastUpdateRef.current = timestamp;
    }
  }, [callback, throttleMs]);
  
  useAnimationTask(id, throttledCallback, priority, enabled);
};

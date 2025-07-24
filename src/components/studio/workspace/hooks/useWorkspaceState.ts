import { useState, useCallback, useEffect } from 'react';
import type { WorkspaceState, WorkspaceLayout, WorkspaceMode, WorkspacePreset } from '../types';

const DEFAULT_LAYOUT: WorkspaceLayout = {
  mode: 'pro',
  preset: 'animation-studio',
  panels: {
    assets: {
      isVisible: true,
      position: 'left',
      width: 280,
      height: 400,
      isCollapsed: false,
      order: 0
    },
    hierarchy: {
      isVisible: true,
      position: 'left',
      width: 260,
      height: 300,
      isCollapsed: false,
      order: 1
    },
    properties: {
      isVisible: true,
      position: 'right',
      width: 320,
      height: 500,
      isCollapsed: false,
      order: 0
    },
    timeline: {
      isVisible: true,
      position: 'bottom',
      width: 800,
      height: 240,
      isCollapsed: false,
      order: 0
    },
    export: {
      isVisible: false,
      position: 'right',
      width: 300,
      height: 400,
      isCollapsed: false,
      order: 1
    }
  },
  viewport: {
    width: '60%',
    height: '70%',
    position: { x: 0, y: 0 }
  }
};

const DEFAULT_STATE: WorkspaceState = {
  layout: DEFAULT_LAYOUT,
  performanceMetrics: {
    fps: 60,
    frameTime: 16.7,
    memoryUsage: 128,
    triangleCount: 50000,
    drawCalls: 25,
    renderTime: 12.5
  },
  selectedCameraPreset: 'default',
  isPerformanceMonitorVisible: false,
  collaborativeCursors: []
};

export const useWorkspaceState = () => {
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>(() => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem('crd-workspace-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load workspace state from localStorage:', error);
    }
    return DEFAULT_STATE;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('crd-workspace-state', JSON.stringify(workspaceState));
    } catch (error) {
      console.warn('Failed to save workspace state to localStorage:', error);
    }
  }, [workspaceState]);

  // Update layout
  const updateLayout = useCallback((newLayout: Partial<WorkspaceLayout>) => {
    setWorkspaceState(prev => ({
      ...prev,
      layout: { ...prev.layout, ...newLayout }
    }));
  }, []);

  // Set workspace mode
  const setWorkspaceMode = useCallback((mode: WorkspaceMode) => {
    setWorkspaceState(prev => ({
      ...prev,
      layout: { ...prev.layout, mode }
    }));
  }, []);

  // Set workspace preset
  const setWorkspacePreset = useCallback((preset: WorkspacePreset) => {
    setWorkspaceState(prev => ({
      ...prev,
      layout: { ...prev.layout, preset }
    }));
  }, []);

  // Toggle panel visibility
  const togglePanel = useCallback((panelId: string) => {
    setWorkspaceState(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        panels: {
          ...prev.layout.panels,
          [panelId]: {
            ...prev.layout.panels[panelId],
            isVisible: !prev.layout.panels[panelId]?.isVisible
          }
        }
      }
    }));
  }, []);

  // Toggle panel collapse state
  const togglePanelCollapse = useCallback((panelId: string) => {
    setWorkspaceState(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        panels: {
          ...prev.layout.panels,
          [panelId]: {
            ...prev.layout.panels[panelId],
            isCollapsed: !prev.layout.panels[panelId]?.isCollapsed
          }
        }
      }
    }));
  }, []);

  // Update panel size
  const updatePanelSize = useCallback((panelId: string, width?: number, height?: number) => {
    setWorkspaceState(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        panels: {
          ...prev.layout.panels,
          [panelId]: {
            ...prev.layout.panels[panelId],
            ...(width !== undefined && { width }),
            ...(height !== undefined && { height })
          }
        }
      }
    }));
  }, []);

  // Reset layout to default
  const resetLayout = useCallback(() => {
    setWorkspaceState(prev => ({
      ...prev,
      layout: DEFAULT_LAYOUT
    }));
  }, []);

  // Update performance metrics
  const updatePerformanceMetrics = useCallback((metrics: Partial<WorkspaceState['performanceMetrics']>) => {
    setWorkspaceState(prev => ({
      ...prev,
      performanceMetrics: { ...prev.performanceMetrics, ...metrics }
    }));
  }, []);

  // Set camera preset
  const setSelectedCameraPreset = useCallback((preset: string) => {
    setWorkspaceState(prev => ({
      ...prev,
      selectedCameraPreset: preset
    }));
  }, []);

  // Toggle performance monitor
  const togglePerformanceMonitor = useCallback(() => {
    setWorkspaceState(prev => ({
      ...prev,
      isPerformanceMonitorVisible: !prev.isPerformanceMonitorVisible
    }));
  }, []);

  // Update collaborative cursors
  const updateCollaborativeCursors = useCallback((cursors: WorkspaceState['collaborativeCursors']) => {
    setWorkspaceState(prev => ({
      ...prev,
      collaborativeCursors: cursors
    }));
  }, []);

  return {
    workspaceState,
    updateLayout,
    setWorkspaceMode,
    setWorkspacePreset,
    togglePanel,
    togglePanelCollapse,
    updatePanelSize,
    resetLayout,
    updatePerformanceMetrics,
    setSelectedCameraPreset,
    togglePerformanceMonitor,
    updateCollaborativeCursors
  };
};
// Professional Studio Workspace Types

export type WorkspaceMode = 'beginner' | 'pro' | 'director';
export type WorkspacePreset = 'quick-edit' | 'animation-studio' | 'cinematic-mode' | 'custom';
export type PanelPosition = 'left' | 'right' | 'bottom' | 'floating';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface WorkspacePanel {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  defaultPosition: PanelPosition;
  isCollapsible: boolean;
  isResizable: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  icon: React.ComponentType<any>;
  hotkey?: string;
}

export interface WorkspaceLayout {
  mode: WorkspaceMode;
  preset: WorkspacePreset;
  panels: {
    [panelId: string]: {
      isVisible: boolean;
      position: PanelPosition;
      width: number;
      height: number;
      isCollapsed: boolean;
      order: number;
    };
  };
  viewport: {
    width: string;
    height: string;
    position: { x: number; y: number };
  };
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  triangleCount: number;
  drawCalls: number;
  renderTime: number;
}

export interface CameraPreset {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
  description: string;
  hotkey?: string;
}

export interface WorkspaceState {
  layout: WorkspaceLayout;
  performanceMetrics: PerformanceMetrics;
  selectedCameraPreset: string;
  isPerformanceMonitorVisible: boolean;
  collaborativeCursors: Array<{
    userId: string;
    userName: string;
    position: { x: number; y: number };
    color: string;
  }>;
}

export interface HotkeyConfig {
  [key: string]: {
    action: string;
    description: string;
    category: string;
  };
}
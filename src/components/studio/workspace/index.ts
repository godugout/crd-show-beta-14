// Professional Studio Workspace System
export { ProfessionalWorkspace } from './ProfessionalWorkspace';

// Core Components
export { WorkspaceHeader } from './components/WorkspaceHeader';
export { ViewportContainer } from './components/ViewportContainer';
export { PerformanceMonitor } from './components/PerformanceMonitor';
export { CameraControls } from './components/CameraControls';
export { CollaborativeCursors } from './components/CollaborativeCursors';

// Panels
export { AssetLibraryPanel } from './panels/AssetLibraryPanel';
export { TimelinePanel } from './panels/TimelinePanel';
export { PropertiesPanel } from './panels/PropertiesPanel';
export { SceneHierarchyPanel } from './panels/SceneHierarchyPanel';
export { ExportHubPanel } from './panels/ExportHubPanel';

// Hooks
export { useWorkspaceState } from './hooks/useWorkspaceState';
export { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
export { useResponsiveWorkspace } from './hooks/useResponsiveWorkspace';

// Types
export type {
  WorkspaceMode,
  WorkspacePreset,
  WorkspacePanel,
  WorkspaceLayout,
  WorkspaceState,
  PerformanceMetrics,
  CameraPreset,
  DeviceType,
  HotkeyConfig
} from './types';
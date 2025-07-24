import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PanelGroup as ResizablePanelGroup, 
  Panel as ResizablePanel, 
  PanelResizeHandle as ResizableHandle 
} from 'react-resizable-panels';
import { useHotkeys } from 'react-hotkeys-hook';
import { cn } from '@/lib/utils';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { ViewportContainer } from './components/ViewportContainer';
import { AssetLibraryPanel } from './panels/AssetLibraryPanel';
import { TimelinePanel } from './panels/TimelinePanel';
import { PropertiesPanel } from './panels/PropertiesPanel';
import { SceneHierarchyPanel } from './panels/SceneHierarchyPanel';
import { ExportHubPanel } from './panels/ExportHubPanel';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { CameraControls } from './components/CameraControls';
import { CollaborativeCursors } from './components/CollaborativeCursors';
import { useWorkspaceState } from './hooks/useWorkspaceState';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { useResponsiveWorkspace } from './hooks/useResponsiveWorkspace';
import type { WorkspaceMode, WorkspacePreset, WorkspacePanel } from './types';
import { 
  FolderOpen, 
  Timer, 
  Settings, 
  Layers, 
  Share,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Grid3x3,
  Monitor
} from 'lucide-react';

interface ProfessionalWorkspaceProps {
  card: any;
  cards: any[];
  currentCardIndex: number;
  onCardChange: (index: number) => void;
  onShare: (card: any) => void;
  onDownload: (card: any) => void;
  className?: string;
}

// Define available panels with their configurations
const WORKSPACE_PANELS: WorkspacePanel[] = [
  {
    id: 'assets',
    title: 'Asset Library',
    component: AssetLibraryPanel,
    defaultPosition: 'left',
    isCollapsible: true,
    isResizable: true,
    defaultWidth: 280,
    minWidth: 200,
    maxWidth: 400,
    icon: FolderOpen,
    hotkey: 'a'
  },
  {
    id: 'timeline',
    title: 'Timeline & Animation',
    component: TimelinePanel,
    defaultPosition: 'bottom',
    isCollapsible: true,
    isResizable: true,
    defaultHeight: 240,
    minHeight: 180,
    maxHeight: 400,
    icon: Timer,
    hotkey: 't'
  },
  {
    id: 'properties',
    title: 'Properties',
    component: PropertiesPanel,
    defaultPosition: 'right',
    isCollapsible: true,
    isResizable: true,
    defaultWidth: 320,
    minWidth: 240,
    maxWidth: 480,
    icon: Settings,
    hotkey: 'p'
  },
  {
    id: 'hierarchy',
    title: 'Scene Hierarchy',
    component: SceneHierarchyPanel,
    defaultPosition: 'left',
    isCollapsible: true,
    isResizable: true,
    defaultWidth: 260,
    minWidth: 200,
    maxWidth: 360,
    icon: Layers,
    hotkey: 'h'
  },
  {
    id: 'export',
    title: 'Export & Sharing',
    component: ExportHubPanel,
    defaultPosition: 'right',
    isCollapsible: true,
    isResizable: true,
    defaultWidth: 300,
    minWidth: 240,
    maxWidth: 400,
    icon: Share,
    hotkey: 'e'
  }
];

export const ProfessionalWorkspace: React.FC<ProfessionalWorkspaceProps> = ({
  card,
  cards,
  currentCardIndex,
  onCardChange,
  onShare,
  onDownload,
  className
}) => {
  // Workspace state management
  const {
    workspaceState,
    updateLayout,
    setWorkspaceMode,
    setWorkspacePreset,
    togglePanel,
    togglePanelCollapse,
    resetLayout
  } = useWorkspaceState();

  // Performance monitoring
  const { performanceMetrics, isMonitoring, toggleMonitoring } = usePerformanceMonitor();

  // Responsive behavior
  const { deviceType, getOptimalLayout, getPanelVisibility } = useResponsiveWorkspace();

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Setup hotkeys for professional workflow
  useHotkeys('space', () => setIsPlaying(!isPlaying), { preventDefault: true });
  useHotkeys('f', () => setIsFullscreen(!isFullscreen), { preventDefault: true });
  useHotkeys('r', () => resetLayout(), { preventDefault: true });
  useHotkeys('m', () => toggleMonitoring(), { preventDefault: true });
  useHotkeys('escape', () => setIsFullscreen(false), { preventDefault: true });

  // Panel hotkeys
  WORKSPACE_PANELS.forEach(panel => {
    if (panel.hotkey) {
      useHotkeys(panel.hotkey, () => togglePanel(panel.id), { preventDefault: true });
    }
  });

  // Get visible panels based on current mode and device
  const visiblePanels = useMemo(() => {
    return WORKSPACE_PANELS.filter(panel => 
      getPanelVisibility(panel.id, workspaceState.layout.mode, deviceType)
    );
  }, [workspaceState.layout.mode, deviceType, getPanelVisibility]);

  // Group panels by position
  const panelsByPosition = useMemo(() => {
    const groups = { left: [], right: [], bottom: [], floating: [] };
    
    visiblePanels.forEach(panel => {
      const panelState = workspaceState.layout.panels[panel.id];
      if (panelState?.isVisible) {
        groups[panelState.position].push({ ...panel, state: panelState });
      }
    });
    
    return groups;
  }, [visiblePanels, workspaceState.layout.panels]);

  // Handle mode changes with appropriate layout adjustments
  const handleModeChange = useCallback((mode: WorkspaceMode) => {
    setWorkspaceMode(mode);
    const optimalLayout = getOptimalLayout(mode, deviceType);
    updateLayout(optimalLayout);
  }, [setWorkspaceMode, getOptimalLayout, deviceType, updateLayout]);

  // Handle preset changes
  const handlePresetChange = useCallback((preset: WorkspacePreset) => {
    setWorkspacePreset(preset);
    const optimalLayout = getOptimalLayout(workspaceState.layout.mode, deviceType, preset);
    updateLayout(optimalLayout);
  }, [setWorkspacePreset, workspaceState.layout.mode, deviceType, getOptimalLayout, updateLayout]);

  // Render panel component
  const renderPanel = useCallback((panel: WorkspacePanel & { state: any }) => {
    const PanelComponent = panel.component;
    return (
      <div 
        key={panel.id}
        className={cn(
          "h-full bg-background border-border transition-all duration-200",
          panel.state.isCollapsed && "w-12"
        )}
        style={{
          width: !panel.state.isCollapsed ? panel.state.width : undefined,
          height: panel.defaultPosition === 'bottom' ? panel.state.height : undefined
        }}
      >
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2">
              <panel.icon className="w-4 h-4" />
              {!panel.state.isCollapsed && (
                <span className="text-sm font-medium">{panel.title}</span>
              )}
            </div>
            {panel.isCollapsible && (
              <button
                onClick={() => togglePanelCollapse(panel.id)}
                className="p-1 hover:bg-muted rounded"
              >
                {panel.state.isCollapsed ? <Maximize className="w-3 h-3" /> : <Minimize className="w-3 h-3" />}
              </button>
            )}
          </div>
          
          {/* Panel Content */}
          {!panel.state.isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <PanelComponent
                card={card}
                cards={cards}
                currentCardIndex={currentCardIndex}
                onCardChange={onCardChange}
                workspaceMode={workspaceState.layout.mode}
                deviceType={deviceType}
              />
            </div>
          )}
        </div>
      </div>
    );
  }, [card, cards, currentCardIndex, onCardChange, workspaceState.layout.mode, deviceType, togglePanelCollapse]);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <ViewportContainer
          card={card}
          cards={cards}
          currentCardIndex={currentCardIndex}
          onCardChange={onCardChange}
          isPlaying={isPlaying}
          onPlayToggle={() => setIsPlaying(!isPlaying)}
          performanceMetrics={performanceMetrics}
          isFullscreen={true}
          onExitFullscreen={() => setIsFullscreen(false)}
          workspaceMode={workspaceState.layout.mode}
        />
        {isMonitoring && (
          <PerformanceMonitor 
            metrics={performanceMetrics}
            position="top-right"
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("h-screen bg-background flex flex-col", className)}>
      {/* Workspace Header */}
      <WorkspaceHeader
        mode={workspaceState.layout.mode}
        preset={workspaceState.layout.preset}
        onModeChange={handleModeChange}
        onPresetChange={handlePresetChange}
        onTogglePanel={togglePanel}
        visiblePanels={visiblePanels}
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onFullscreen={() => setIsFullscreen(true)}
        onResetLayout={resetLayout}
        isMonitoring={isMonitoring}
        onToggleMonitoring={toggleMonitoring}
        deviceType={deviceType}
      />

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panels */}
          {panelsByPosition.left.length > 0 && (
            <>
              <ResizablePanel
                defaultSize={20} 
                minSize={15} 
                maxSize={35}
                className="border-r border-border"
              >
                <div className="h-full flex flex-col">
                  {panelsByPosition.left.map(renderPanel)}
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Center Viewport */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Main Viewport */}
              <ResizablePanel 
                defaultSize={panelsByPosition.bottom.length > 0 ? 70 : 100} 
                minSize={50}
                className="relative"
              >
                <ViewportContainer
                  card={card}
                  cards={cards}
                  currentCardIndex={currentCardIndex}
                  onCardChange={onCardChange}
                  isPlaying={isPlaying}
                  onPlayToggle={() => setIsPlaying(!isPlaying)}
                  performanceMetrics={performanceMetrics}
                  isFullscreen={false}
                  onEnterFullscreen={() => setIsFullscreen(true)}
                  workspaceMode={workspaceState.layout.mode}
                />
                
                {/* Camera Controls Overlay */}
                <CameraControls
                  position="bottom-left"
                  workspaceMode={workspaceState.layout.mode}
                  selectedPreset={workspaceState.selectedCameraPreset}
                />

                {/* Performance Monitor Overlay */}
                {isMonitoring && (
                  <PerformanceMonitor 
                    metrics={performanceMetrics}
                    position="top-left"
                  />
                )}

                {/* Collaborative Cursors */}
                <CollaborativeCursors 
                  cursors={workspaceState.collaborativeCursors}
                />
              </ResizablePanel>

              {/* Bottom Panels */}
              {panelsByPosition.bottom.length > 0 && (
                <>
                  <ResizableHandle />
                  <ResizablePanel 
                    defaultSize={30} 
                    minSize={20} 
                    maxSize={50}
                    className="border-t border-border"
                  >
                    <div className="h-full">
                      {panelsByPosition.bottom.map(renderPanel)}
                    </div>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Right Panels */}
          {panelsByPosition.right.length > 0 && (
            <>
              <ResizableHandle />
              <ResizablePanel 
                defaultSize={20} 
                minSize={15} 
                maxSize={35}
                className="border-l border-border"
              >
                <div className="h-full flex flex-col">
                  {panelsByPosition.right.map(renderPanel)}
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
import { useState, useEffect, useCallback } from 'react';
import type { WorkspaceLayout, WorkspaceMode, WorkspacePreset, DeviceType } from '../types';

export const useResponsiveWorkspace = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  // Detect device type based on screen size
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1200) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // Get optimal layout for device and mode
  const getOptimalLayout = useCallback((
    mode: WorkspaceMode, 
    device: DeviceType, 
    preset?: WorkspacePreset
  ): Partial<WorkspaceLayout> => {
    const baseLayout: Partial<WorkspaceLayout> = { mode, preset: preset || 'custom' };

    switch (device) {
      case 'mobile':
        return {
          ...baseLayout,
          panels: {
            assets: { isVisible: false, position: 'left', width: 280, height: 400, isCollapsed: false, order: 0 },
            hierarchy: { isVisible: false, position: 'left', width: 260, height: 300, isCollapsed: false, order: 1 },
            properties: { isVisible: mode !== 'beginner', position: 'bottom', width: 320, height: 200, isCollapsed: false, order: 0 },
            timeline: { isVisible: mode === 'director', position: 'bottom', width: 800, height: 180, isCollapsed: false, order: 1 },
            export: { isVisible: false, position: 'bottom', width: 300, height: 160, isCollapsed: false, order: 2 }
          }
        };

      case 'tablet':
        return {
          ...baseLayout,
          panels: {
            assets: { isVisible: mode !== 'beginner', position: 'left', width: 240, height: 400, isCollapsed: true, order: 0 },
            hierarchy: { isVisible: mode === 'director', position: 'left', width: 220, height: 300, isCollapsed: true, order: 1 },
            properties: { isVisible: true, position: 'right', width: 280, height: 500, isCollapsed: false, order: 0 },
            timeline: { isVisible: mode !== 'beginner', position: 'bottom', width: 800, height: 200, isCollapsed: false, order: 0 },
            export: { isVisible: mode === 'director', position: 'right', width: 260, height: 300, isCollapsed: true, order: 1 }
          }
        };

      case 'desktop':
      default:
        // Full desktop layout based on mode and preset
        const desktopPanels = getDesktopPanelLayout(mode, preset);
        return {
          ...baseLayout,
          panels: desktopPanels
        };
    }
  }, []);

  // Get desktop panel layout based on mode and preset
  const getDesktopPanelLayout = useCallback((mode: WorkspaceMode, preset?: WorkspacePreset) => {
    const basePanels = {
      assets: { isVisible: true, position: 'left' as const, width: 280, height: 400, isCollapsed: false, order: 0 },
      hierarchy: { isVisible: true, position: 'left' as const, width: 260, height: 300, isCollapsed: false, order: 1 },
      properties: { isVisible: true, position: 'right' as const, width: 320, height: 500, isCollapsed: false, order: 0 },
      timeline: { isVisible: true, position: 'bottom' as const, width: 800, height: 240, isCollapsed: false, order: 0 },
      export: { isVisible: false, position: 'right' as const, width: 300, height: 400, isCollapsed: false, order: 1 }
    };

    // Adjust based on mode
    switch (mode) {
      case 'beginner':
        return {
          ...basePanels,
          assets: { ...basePanels.assets, isVisible: true },
          hierarchy: { ...basePanels.hierarchy, isVisible: false },
          properties: { ...basePanels.properties, width: 280 },
          timeline: { ...basePanels.timeline, isVisible: false },
          export: { ...basePanels.export, isVisible: true }
        };

      case 'director':
        return {
          ...basePanels,
          assets: { ...basePanels.assets, width: 320 },
          hierarchy: { ...basePanels.hierarchy, isVisible: true },
          properties: { ...basePanels.properties, width: 360 },
          timeline: { ...basePanels.timeline, height: 280, isVisible: true },
          export: { ...basePanels.export, isVisible: true }
        };

      case 'pro':
      default:
        // Adjust based on preset
        switch (preset) {
          case 'quick-edit':
            return {
              ...basePanels,
              timeline: { ...basePanels.timeline, isVisible: false },
              export: { ...basePanels.export, isVisible: true }
            };

          case 'animation-studio':
            return {
              ...basePanels,
              timeline: { ...basePanels.timeline, height: 300, isVisible: true },
              hierarchy: { ...basePanels.hierarchy, isVisible: true }
            };

          case 'cinematic-mode':
            return {
              ...basePanels,
              assets: { ...basePanels.assets, width: 320 },
              properties: { ...basePanels.properties, width: 380 },
              timeline: { ...basePanels.timeline, height: 320, isVisible: true },
              hierarchy: { ...basePanels.hierarchy, isVisible: true },
              export: { ...basePanels.export, isVisible: true }
            };

          default:
            return basePanels;
        }
    }
  }, []);

  // Get panel visibility for current device and mode
  const getPanelVisibility = useCallback((
    panelId: string, 
    mode: WorkspaceMode, 
    device: DeviceType
  ): boolean => {
    // Mobile: Very limited panels
    if (device === 'mobile') {
      switch (panelId) {
        case 'properties': return mode !== 'beginner';
        case 'timeline': return mode === 'director';
        default: return false;
      }
    }

    // Tablet: More panels but some collapsed
    if (device === 'tablet') {
      switch (panelId) {
        case 'assets': return mode !== 'beginner';
        case 'hierarchy': return mode === 'director';
        case 'properties': return true;
        case 'timeline': return mode !== 'beginner';
        case 'export': return mode === 'director';
        default: return false;
      }
    }

    // Desktop: Most panels available
    switch (mode) {
      case 'beginner':
        return ['assets', 'properties', 'export'].includes(panelId);
      case 'pro':
        return ['assets', 'hierarchy', 'properties', 'timeline'].includes(panelId);
      case 'director':
        return true; // All panels available
      default:
        return true;
    }
  }, []);

  // Get responsive breakpoints
  const getBreakpoints = useCallback(() => {
    return {
      mobile: 768,
      tablet: 1200,
      desktop: Infinity
    };
  }, []);

  return {
    deviceType,
    getOptimalLayout,
    getPanelVisibility,
    getBreakpoints
  };
};

import { useCallback } from 'react';

interface SafeZoneConfig {
  panelWidth: number;
  showPanel: boolean;
  showStats: boolean;
  hasNavigation: boolean;
}

export const useSafeZones = (config: SafeZoneConfig) => {
  const { panelWidth, showPanel, showStats, hasNavigation } = config;

  const isInSafeZone = useCallback((clientX: number, clientY: number, containerRect: DOMRect) => {
    const relativeX = clientX - containerRect.left;
    const relativeY = clientY - containerRect.top;
    
    // Panel area (right side)
    if (showPanel && relativeX > containerRect.width - panelWidth) {
      return true;
    }
    
    // Bottom info area (bottom 100px when stats are shown)
    if (showStats && relativeY > containerRect.height - 100) {
      return true;
    }
    
    // Card details area (bottom left)
    if (relativeX < 280 && relativeY > containerRect.height - 120) {
      return true;
    }
    
    // Navigation controls area (bottom right)
    if (hasNavigation && relativeX > containerRect.width - 180 && relativeY > containerRect.height - 80) {
      return true;
    }
    
    return false;
  }, [panelWidth, showPanel, showStats, hasNavigation]);

  return { isInSafeZone };
};

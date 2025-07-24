import React, { useEffect, useState, useCallback } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Zap, Battery, Cpu, Wifi, AlertTriangle } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface PerformanceSettings {
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  particleEffects: boolean;
  shadows: boolean;
  reflections: boolean;
  antialiasing: boolean;
  frameRateTarget: 30 | 60 | 120;
}

interface MobilePerformanceOptimizerProps {
  onSettingsChange: (settings: PerformanceSettings) => void;
  autoOptimize?: boolean;
}

export const MobilePerformanceOptimizer: React.FC<MobilePerformanceOptimizerProps> = ({
  onSettingsChange,
  autoOptimize = true
}) => {
  const { metrics } = usePerformanceMonitor();
  const [settings, setSettings] = useState<PerformanceSettings>({
    renderQuality: 'high',
    particleEffects: true,
    shadows: true,
    reflections: true,
    antialiasing: true,
    frameRateTarget: 60
  });
  
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEndDevice: false,
    batteryLevel: 1,
    isLowPowerMode: false,
    connectionType: 'unknown'
  });

  const [showOptimizationSuggestion, setShowOptimizationSuggestion] = useState(false);

  // Detect device capabilities
  useEffect(() => {
    const detectDeviceCapabilities = async () => {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      let isLowEndDevice = false;
      let batteryLevel = 1;
      let isLowPowerMode = false;
      let connectionType = 'unknown';

      // Check for low-end device indicators
      if ('hardwareConcurrency' in navigator) {
        isLowEndDevice = navigator.hardwareConcurrency <= 2;
      }

      // Check memory if available
      if ('memory' in (navigator as any)) {
        const memory = (navigator as any).memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
        isLowEndDevice = isLowEndDevice || memory < 2; // Less than 2GB
      }

      // Check battery status
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          batteryLevel = battery.level;
          // Assume low power mode if battery is low
          isLowPowerMode = batteryLevel < 0.2;
        } catch (error) {
          console.warn('Battery API not available');
        }
      }

      // Check connection type
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connectionType = connection.effectiveType || connection.type || 'unknown';
      }

      setDeviceInfo({
        isMobile,
        isLowEndDevice,
        batteryLevel,
        isLowPowerMode,
        connectionType
      });
    };

    detectDeviceCapabilities();
  }, []);

  // Auto-optimize based on performance metrics and device info
  const autoOptimizeSettings = useCallback(() => {
    if (!autoOptimize) return;

    const { fps, quality } = metrics;
    const { isLowEndDevice, isLowPowerMode, batteryLevel } = deviceInfo;

    let newSettings = { ...settings };
    let shouldOptimize = false;

    // Optimize for low FPS
    if (fps < 30) {
      newSettings.renderQuality = 'low';
      newSettings.particleEffects = false;
      newSettings.shadows = false;
      newSettings.reflections = false;
      newSettings.frameRateTarget = 30;
      shouldOptimize = true;
    } else if (fps < 45) {
      newSettings.renderQuality = 'medium';
      newSettings.particleEffects = false;
      newSettings.shadows = true;
      newSettings.reflections = false;
      shouldOptimize = true;
    }

    // Optimize for low-end devices
    if (isLowEndDevice) {
      newSettings.renderQuality = 'medium';
      newSettings.antialiasing = false;
      newSettings.frameRateTarget = 30;
      shouldOptimize = true;
    }

    // Optimize for battery saving
    if (isLowPowerMode || batteryLevel < 0.3) {
      newSettings.renderQuality = 'low';
      newSettings.particleEffects = false;
      newSettings.shadows = false;
      newSettings.reflections = false;
      newSettings.frameRateTarget = 30;
      shouldOptimize = true;
    }

    if (shouldOptimize) {
      setSettings(newSettings);
      onSettingsChange(newSettings);
      setShowOptimizationSuggestion(true);
    }
  }, [metrics, deviceInfo, settings, autoOptimize, onSettingsChange]);

  // Run auto-optimization when metrics change
  useEffect(() => {
    const optimizationTimeout = setTimeout(autoOptimizeSettings, 2000); // Delay to avoid constant updates
    return () => clearTimeout(optimizationTimeout);
  }, [metrics.fps, metrics.quality]);

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return 'text-green-400';
    if (value >= thresholds[0]) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConnectionIcon = () => {
    switch (deviceInfo.connectionType) {
      case '4g':
      case '5g':
        return <Wifi className="w-4 h-4 text-green-400" />;
      case '3g':
        return <Wifi className="w-4 h-4 text-yellow-400" />;
      case '2g':
      case 'slow-2g':
        return <Wifi className="w-4 h-4 text-red-400" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleManualOptimize = () => {
    const optimizedSettings: PerformanceSettings = {
      renderQuality: deviceInfo.isLowEndDevice ? 'medium' : 'high',
      particleEffects: !deviceInfo.isLowPowerMode,
      shadows: metrics.fps > 45,
      reflections: metrics.fps > 45 && !deviceInfo.isLowEndDevice,
      antialiasing: !deviceInfo.isLowEndDevice,
      frameRateTarget: deviceInfo.isLowEndDevice || deviceInfo.isLowPowerMode ? 30 : 60
    };

    setSettings(optimizedSettings);
    onSettingsChange(optimizedSettings);
    setShowOptimizationSuggestion(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Performance Status */}
      <div className="bg-themed-light/30 rounded-lg p-4 border border-themed-accent/10">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-themed-accent" />
          <span className="text-sm font-medium text-themed-primary">Performance Status</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-themed-secondary">FPS</span>
            <span className={getPerformanceColor(metrics.fps, [30, 50])}>
              {Math.round(metrics.fps)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-themed-secondary">Quality</span>
            <span className={`text-themed-primary capitalize`}>
              {metrics.quality}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-themed-secondary">Battery</span>
            <div className="flex items-center gap-1">
              <Battery className={`w-3 h-3 ${deviceInfo.batteryLevel < 0.3 ? 'text-red-400' : 'text-green-400'}`} />
              <span className="text-themed-primary">
                {Math.round(deviceInfo.batteryLevel * 100)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-themed-secondary">Network</span>
            <div className="flex items-center gap-1">
              {getConnectionIcon()}
              <span className="text-themed-primary uppercase">
                {deviceInfo.connectionType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-optimization suggestion */}
      {showOptimizationSuggestion && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-orange-400 mb-1">
                Performance Optimization Applied
              </h4>
              <p className="text-xs text-themed-secondary mb-3">
                Settings have been automatically adjusted to maintain smooth performance 
                based on your device capabilities and current conditions.
              </p>
              <div className="flex gap-2">
                <CRDButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptimizationSuggestion(false)}
                  className="text-xs h-8"
                >
                  Dismiss
                </CRDButton>
                <CRDButton
                  variant="primary"
                  size="sm"
                  onClick={handleManualOptimize}
                  className="text-xs h-8"
                >
                  Re-optimize
                </CRDButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Settings */}
      <div className="bg-themed-light/30 rounded-lg p-4 border border-themed-accent/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-themed-accent" />
            <span className="text-sm font-medium text-themed-primary">Render Settings</span>
          </div>
          <CRDButton
            variant="outline"
            size="sm"
            onClick={handleManualOptimize}
            className="text-xs h-8"
          >
            Auto-Optimize
          </CRDButton>
        </div>
        
        <div className="space-y-3">
          
          {/* Render Quality */}
          <div>
            <label className="text-xs text-themed-secondary mb-2 block">
              Render Quality
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
                <CRDButton
                  key={quality}
                  variant={settings.renderQuality === quality ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const newSettings = { ...settings, renderQuality: quality };
                    setSettings(newSettings);
                    onSettingsChange(newSettings);
                  }}
                  className="text-xs py-1 capitalize"
                >
                  {quality}
                </CRDButton>
              ))}
            </div>
          </div>

          {/* Frame Rate Target */}
          <div>
            <label className="text-xs text-themed-secondary mb-2 block">
              Target FPS
            </label>
            <div className="grid grid-cols-3 gap-1">
              {([30, 60, 120] as const).map((fps) => (
                <CRDButton
                  key={fps}
                  variant={settings.frameRateTarget === fps ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const newSettings = { ...settings, frameRateTarget: fps };
                    setSettings(newSettings);
                    onSettingsChange(newSettings);
                  }}
                  className="text-xs py-1"
                >
                  {fps}
                </CRDButton>
              ))}
            </div>
          </div>

          {/* Feature toggles */}
          <div className="space-y-2">
            {[
              { key: 'shadows', label: 'Shadows' },
              { key: 'reflections', label: 'Reflections' },
              { key: 'particleEffects', label: 'Particle Effects' },
              { key: 'antialiasing', label: 'Anti-aliasing' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-themed-secondary">{label}</span>
                <CRDButton
                  variant={settings[key as keyof PerformanceSettings] ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const newSettings = { 
                      ...settings, 
                      [key]: !settings[key as keyof PerformanceSettings] 
                    };
                    setSettings(newSettings);
                    onSettingsChange(newSettings);
                  }}
                  className="text-xs h-7 w-16"
                >
                  {settings[key as keyof PerformanceSettings] ? 'On' : 'Off'}
                </CRDButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
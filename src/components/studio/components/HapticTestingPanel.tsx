import React, { useState, useEffect } from 'react';
import { Vibrate, Battery, Cpu, TestTube, Settings, Zap, Volume2 } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useHapticFeedback, type HapticPattern } from '@/hooks/useHapticFeedback';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { Slider } from '@/components/ui/slider';

interface HapticTestingPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const HAPTIC_TEST_PATTERNS: Array<{
  pattern: HapticPattern;
  name: string;
  description: string;
  category: 'basic' | 'studio' | 'premium';
}> = [
  // Basic patterns
  { pattern: 'light', name: 'Light', description: 'Subtle tap feedback', category: 'basic' },
  { pattern: 'medium', name: 'Medium', description: 'Standard interaction', category: 'basic' },
  { pattern: 'heavy', name: 'Heavy', description: 'Strong confirmation', category: 'basic' },
  { pattern: 'success', name: 'Success', description: 'Action completed', category: 'basic' },
  { pattern: 'error', name: 'Error', description: 'Something went wrong', category: 'basic' },
  
  // Studio patterns
  { pattern: 'card_interaction', name: 'Card Touch', description: 'Card interaction feedback', category: 'studio' },
  { pattern: 'swipe_navigation', name: 'Swipe', description: 'Navigation between cards', category: 'studio' },
  { pattern: 'rotation_milestone', name: 'Rotation', description: 'Card rotation checkpoint', category: 'studio' },
  { pattern: 'zoom_feedback', name: 'Zoom', description: 'Pinch zoom response', category: 'studio' },
  { pattern: 'pull_refresh', name: 'Pull Refresh', description: 'Data refresh trigger', category: 'studio' },
  { pattern: 'mode_switch', name: 'Mode Switch', description: '3D/2D view toggle', category: 'studio' },
  { pattern: 'effect_apply', name: 'Effect Apply', description: 'Visual effect activation', category: 'studio' },
  
  // Premium patterns
  { pattern: 'rarity_common', name: 'Common Rarity', description: 'Common card feedback', category: 'premium' },
  { pattern: 'rarity_uncommon', name: 'Uncommon Rarity', description: 'Uncommon card feedback', category: 'premium' },
  { pattern: 'rarity_rare', name: 'Rare Rarity', description: 'Rare card feedback', category: 'premium' },
  { pattern: 'rarity_legendary', name: 'Legendary Rarity', description: 'Legendary card feedback', category: 'premium' },
  { pattern: 'premium_unlock', name: 'Premium Unlock', description: 'Feature unlock celebration', category: 'premium' },
  { pattern: 'studio_enter', name: 'Studio Enter', description: 'Entering studio mode', category: 'premium' },
  { pattern: 'studio_exit', name: 'Studio Exit', description: 'Leaving studio mode', category: 'premium' },
];

export const HapticTestingPanel: React.FC<HapticTestingPanelProps> = ({
  isVisible,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'studio' | 'premium'>('basic');
  const [intensityMultiplier, setIntensityMultiplier] = useState(1);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [hapticStatus, setHapticStatus] = useState<any>(null);
  
  const {
    testPattern,
    calibrateIntensity,
    getStatus,
    setEnabled,
    isAvailable,
    light,
    medium,
    heavy
  } = useHapticFeedback();
  
  const { isMobile } = useResponsiveBreakpoints();

  useEffect(() => {
    if (isVisible) {
      setHapticStatus(getStatus());
    }
  }, [isVisible, getStatus]);

  useEffect(() => {
    calibrateIntensity(intensityMultiplier);
  }, [intensityMultiplier, calibrateIntensity]);

  if (!isVisible || !isMobile) {
    return null;
  }

  const handlePatternTest = (pattern: HapticPattern) => {
    light(); // Immediate feedback for button press
    setTimeout(() => testPattern(pattern), 100); // Slight delay to distinguish patterns
  };

  const handleCalibrationTest = () => {
    setIsCalibrating(true);
    
    // Test sequence: light -> medium -> heavy
    setTimeout(() => light(), 100);
    setTimeout(() => medium(), 800);
    setTimeout(() => heavy(), 1500);
    setTimeout(() => setIsCalibrating(false), 2200);
  };

  const filteredPatterns = HAPTIC_TEST_PATTERNS.filter(
    item => item.category === selectedCategory
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-500/20 text-blue-400';
      case 'studio': return 'bg-purple-500/20 text-purple-400';
      case 'premium': return 'bg-gold-500/20 text-gold-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 0.6) return 'text-green-400';
    if (level > 0.3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-themed-base border border-themed-accent/20 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-themed-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-themed-accent/20 flex items-center justify-center">
              <Vibrate className="w-5 h-5 text-themed-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-themed-primary">
                Haptic Testing
              </h2>
              <p className="text-xs text-themed-secondary">
                Test and calibrate haptic feedback
              </p>
            </div>
          </div>
          <CRDButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0"
          >
            ×
          </CRDButton>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* Status */}
          {hapticStatus && (
            <div className="bg-themed-light/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4 text-themed-accent" />
                <span className="text-sm font-medium text-themed-primary">System Status</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-themed-secondary">Available</span>
                  <span className={isAvailable ? 'text-green-400' : 'text-red-400'}>
                    {isAvailable ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-themed-secondary">Performance</span>
                  <span className="text-themed-primary capitalize">
                    {hapticStatus.devicePerformance}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-themed-secondary">Battery</span>
                  <div className="flex items-center gap-1">
                    <Battery className={`w-3 h-3 ${getBatteryColor(hapticStatus.batteryLevel)}`} />
                    <span className={getBatteryColor(hapticStatus.batteryLevel)}>
                      {Math.round(hapticStatus.batteryLevel * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-themed-secondary">Power Mode</span>
                  <span className={hapticStatus.isLowPowerMode ? 'text-yellow-400' : 'text-green-400'}>
                    {hapticStatus.isLowPowerMode ? 'Low Power' : 'Normal'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Intensity Calibration */}
          <div className="bg-themed-light/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-4 h-4 text-themed-accent" />
              <span className="text-sm font-medium text-themed-primary">
                Intensity Calibration
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-themed-secondary">Strength</span>
                  <span className="text-xs text-themed-primary">
                    {Math.round(intensityMultiplier * 100)}%
                  </span>
                </div>
                <Slider
                  value={[intensityMultiplier]}
                  onValueChange={([value]) => setIntensityMultiplier(value)}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <CRDButton
                variant="outline"
                size="sm"
                onClick={handleCalibrationTest}
                disabled={isCalibrating}
                className="w-full"
              >
                {isCalibrating ? 'Testing...' : 'Test Calibration'}
              </CRDButton>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <h3 className="text-sm font-medium text-themed-primary mb-3">Pattern Categories</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['basic', 'studio', 'premium'] as const).map((category) => (
                <CRDButton
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs capitalize"
                >
                  {category}
                </CRDButton>
              ))}
            </div>
          </div>

          {/* Pattern Testing */}
          <div>
            <h3 className="text-sm font-medium text-themed-primary mb-3">
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Patterns
            </h3>
            <div className="space-y-2">
              {filteredPatterns.map((item) => (
                <div
                  key={item.pattern}
                  className="bg-themed-light/20 rounded-lg p-3 border border-themed-accent/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-sm font-medium text-themed-primary">
                        {item.name}
                      </span>
                    </div>
                    <CRDButton
                      variant="outline"
                      size="sm"
                      onClick={() => handlePatternTest(item.pattern)}
                      className="text-xs h-8"
                    >
                      <TestTube className="w-3 h-3 mr-1" />
                      Test
                    </CRDButton>
                  </div>
                  <p className="text-xs text-themed-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import type { QualityLevel } from '@/hooks/usePerformanceMonitor';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'rarity_common' | 'rarity_uncommon' | 'rarity_rare' | 'rarity_legendary' | 'card_interaction' | 'swipe_navigation' | 'rotation_milestone' | 'zoom_feedback' | 'pull_refresh' | 'mode_switch' | 'effect_apply' | 'premium_unlock' | 'studio_enter' | 'studio_exit';

export interface HapticFeedbackConfig {
  pattern: HapticPattern;
  duration?: number;
  intensity?: number;
  delay?: number;
}

interface HapticPatternDefinition {
  duration: number;
  intensity: number;
  pattern?: number[];
}

const HAPTIC_PATTERNS: Record<HapticPattern, HapticPatternDefinition> = {
  // Basic patterns
  light: { duration: 10, intensity: 0.3 },
  medium: { duration: 25, intensity: 0.6 },
  heavy: { duration: 50, intensity: 1.0 },
  
  // Feedback patterns
  success: { duration: 30, intensity: 0.7, pattern: [10, 5, 15] },
  error: { duration: 40, intensity: 0.8, pattern: [20, 10, 20] },
  
  // Rarity-based premium patterns
  rarity_common: { duration: 15, intensity: 0.4 },
  rarity_uncommon: { duration: 25, intensity: 0.6, pattern: [15, 5, 10] },
  rarity_rare: { duration: 35, intensity: 0.8, pattern: [20, 5, 15, 5, 10] },
  rarity_legendary: { duration: 60, intensity: 1.0, pattern: [30, 10, 20, 10, 30] },
  
  // Studio-specific interaction patterns
  card_interaction: { duration: 12, intensity: 0.4 },
  swipe_navigation: { duration: 18, intensity: 0.5, pattern: [8, 2, 8] },
  rotation_milestone: { duration: 8, intensity: 0.3 },
  zoom_feedback: { duration: 6, intensity: 0.25 },
  pull_refresh: { duration: 22, intensity: 0.65, pattern: [12, 5, 5] },
  mode_switch: { duration: 28, intensity: 0.7, pattern: [15, 8, 5] },
  effect_apply: { duration: 35, intensity: 0.8, pattern: [20, 5, 10] },
  premium_unlock: { duration: 50, intensity: 0.9, pattern: [25, 10, 15, 10, 25] },
  studio_enter: { duration: 45, intensity: 0.8, pattern: [20, 5, 20] },
  studio_exit: { duration: 20, intensity: 0.5, pattern: [10, 5, 5] },
};

class HapticService {
  private isSupported: boolean;
  private isEnabled: boolean = true;
  private lastFeedbackTime: number = 0;
  private feedbackQueue: Array<{ config: HapticFeedbackConfig; timestamp: number }> = [];
  private readonly THROTTLE_MS = 16; // ~60fps throttling
  private batteryLevel: number = 1;
  private isLowPowerMode: boolean = false;
  private devicePerformance: QualityLevel = 'high';
  private hapticIntensityMultiplier: number = 1;
  private adaptiveThrottling: boolean = true;

  constructor() {
    this.isSupported = 'vibrate' in navigator;
    this.initializeBatteryMonitoring();
    this.initializePerformanceAdaptation();
  }

  /**
   * Initialize battery monitoring for power-conscious haptic feedback
   */
  private async initializeBatteryMonitoring(): Promise<void> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.batteryLevel = battery.level;
        this.isLowPowerMode = battery.level < 0.2;
        
        // Listen for battery changes
        battery.addEventListener('levelchange', () => {
          this.batteryLevel = battery.level;
          this.isLowPowerMode = battery.level < 0.2;
          this.updateHapticSettings();
        });

        battery.addEventListener('chargingchange', () => {
          this.updateHapticSettings();
        });
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    }
  }

  /**
   * Initialize performance-based haptic adaptation
   */
  private initializePerformanceAdaptation(): void {
    // Check device capabilities
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    
    if (deviceMemory < 2 || hardwareConcurrency <= 2) {
      this.devicePerformance = 'low';
      this.hapticIntensityMultiplier = 0.7;
    } else if (deviceMemory < 4 || hardwareConcurrency <= 4) {
      this.devicePerformance = 'medium';
      this.hapticIntensityMultiplier = 0.85;
    } else {
      this.devicePerformance = 'high';
      this.hapticIntensityMultiplier = 1.0;
    }
  }

  /**
   * Update haptic settings based on battery and performance
   */
  private updateHapticSettings(): void {
    if (this.isLowPowerMode) {
      this.hapticIntensityMultiplier = 0.5;
      this.adaptiveThrottling = true;
    } else if (this.batteryLevel < 0.4) {
      this.hapticIntensityMultiplier = 0.7;
      this.adaptiveThrottling = true;
    } else {
      this.hapticIntensityMultiplier = this.devicePerformance === 'low' ? 0.7 : 1.0;
      this.adaptiveThrottling = false;
    }
  }

  /**
   * Check if haptic feedback is available and enabled
   */
  isAvailable(): boolean {
    return this.isSupported && this.isEnabled;
  }

  /**
   * Enable or disable haptic feedback
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Set device performance level for adaptive haptics
   */
  setPerformanceLevel(level: QualityLevel): void {
    this.devicePerformance = level;
    this.updateHapticSettings();
  }

  /**
   * Execute haptic feedback with enhanced performance and battery considerations
   */
  feedback(config: HapticFeedbackConfig, performanceQuality?: QualityLevel): void {
    if (!this.isAvailable()) return;

    const now = Date.now();
    const throttleMs = this.adaptiveThrottling ? this.THROTTLE_MS * 2 : this.THROTTLE_MS;
    
    // Enhanced throttling based on battery and performance
    if (now - this.lastFeedbackTime < throttleMs) {
      if (this.shouldQueueFeedback(config)) {
        this.queueFeedback(config, now);
      }
      return;
    }

    this.executeFeedback(config, performanceQuality);
    this.lastFeedbackTime = now;
  }

  /**
   * Determine if feedback should be queued based on priority
   */
  private shouldQueueFeedback(config: HapticFeedbackConfig): boolean {
    const highPriorityPatterns = ['error', 'success', 'rarity_legendary', 'premium_unlock'];
    return highPriorityPatterns.includes(config.pattern);
  }

  /**
   * Queue feedback for throttled execution
   */
  private queueFeedback(config: HapticFeedbackConfig, timestamp: number): void {
    this.feedbackQueue.push({ config, timestamp });
    
    // Limit queue size
    if (this.feedbackQueue.length > 3) {
      this.feedbackQueue.shift();
    }

    // Process queue after throttle period
    setTimeout(() => {
      this.processQueue();
    }, this.THROTTLE_MS);
  }

  /**
   * Process queued feedback
   */
  private processQueue(): void {
    if (this.feedbackQueue.length === 0) return;

    const { config } = this.feedbackQueue.shift()!;
    this.executeFeedback(config);
    this.lastFeedbackTime = Date.now();
  }

  /**
   * Execute the actual haptic feedback with enhanced adaptation
   */
  private executeFeedback(config: HapticFeedbackConfig, performanceQuality?: QualityLevel): void {
    const pattern = HAPTIC_PATTERNS[config.pattern];
    if (!pattern) return;

    // Multi-layer intensity adjustment
    let adjustedIntensity = pattern.intensity;
    
    // Apply device-specific multiplier
    adjustedIntensity *= this.hapticIntensityMultiplier;
    
    // Apply performance-based adjustment
    if (performanceQuality === 'low' || this.devicePerformance === 'low') {
      adjustedIntensity *= 0.6;
    } else if (performanceQuality === 'ultra' && this.devicePerformance === 'high') {
      adjustedIntensity = Math.min(1.0, adjustedIntensity * 1.1);
    }
    
    // Battery-conscious adjustment
    if (this.isLowPowerMode) {
      adjustedIntensity *= 0.4;
    } else if (this.batteryLevel < 0.4) {
      adjustedIntensity *= 0.7;
    }

    // Override with custom values if provided
    const duration = config.duration ?? pattern.duration;
    const intensity = config.intensity ?? adjustedIntensity;

    try {
      if (pattern.pattern) {
        // Complex pattern with adaptive scaling
        const scaledPattern = pattern.pattern.map(p => {
          const scaledValue = Math.round(p * intensity);
          return Math.max(1, scaledValue); // Ensure minimum vibration time
        });
        navigator.vibrate(scaledPattern);
      } else {
        // Simple single vibration with minimum threshold
        const scaledDuration = Math.max(1, Math.round(duration * intensity));
        navigator.vibrate(scaledDuration);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Enhanced quick access methods for studio interactions
   */
  light(): void {
    this.feedback({ pattern: 'light' });
  }

  medium(): void {
    this.feedback({ pattern: 'medium' });
  }

  heavy(): void {
    this.feedback({ pattern: 'heavy' });
  }

  success(): void {
    this.feedback({ pattern: 'success' });
  }

  error(): void {
    this.feedback({ pattern: 'error' });
  }

  rarity(rarity: 'common' | 'uncommon' | 'rare' | 'legendary'): void {
    this.feedback({ pattern: `rarity_${rarity}` as HapticPattern });
  }

  // Studio-specific haptic methods
  cardInteraction(): void {
    this.feedback({ pattern: 'card_interaction' });
  }

  swipeNavigation(): void {
    this.feedback({ pattern: 'swipe_navigation' });
  }

  rotationMilestone(): void {
    this.feedback({ pattern: 'rotation_milestone' });
  }

  zoomFeedback(): void {
    this.feedback({ pattern: 'zoom_feedback' });
  }

  pullRefresh(): void {
    this.feedback({ pattern: 'pull_refresh' });
  }

  modeSwitch(): void {
    this.feedback({ pattern: 'mode_switch' });
  }

  effectApply(): void {
    this.feedback({ pattern: 'effect_apply' });
  }

  premiumUnlock(): void {
    this.feedback({ pattern: 'premium_unlock' });
  }

  studioEnter(): void {
    this.feedback({ pattern: 'studio_enter' });
  }

  studioExit(): void {
    this.feedback({ pattern: 'studio_exit' });
  }

  /**
   * Stop all haptic feedback
   */
  stop(): void {
    if (this.isSupported) {
      navigator.vibrate(0);
    }
    this.feedbackQueue = [];
  }

  /**
   * Get current haptic service status for debugging
   */
  getStatus() {
    return {
      isSupported: this.isSupported,
      isEnabled: this.isEnabled,
      batteryLevel: this.batteryLevel,
      isLowPowerMode: this.isLowPowerMode,
      devicePerformance: this.devicePerformance,
      intensityMultiplier: this.hapticIntensityMultiplier,
      adaptiveThrottling: this.adaptiveThrottling,
      queueLength: this.feedbackQueue.length
    };
  }

  /**
   * Test haptic pattern for debugging and user preferences
   */
  testPattern(pattern: HapticPattern): void {
    console.log(`Testing haptic pattern: ${pattern}`);
    this.feedback({ pattern });
  }

  /**
   * Calibrate haptic intensity based on user preference
   */
  calibrateIntensity(multiplier: number): void {
    this.hapticIntensityMultiplier = Math.max(0.1, Math.min(2.0, multiplier));
  }
}

// Export singleton instance
export const hapticService = new HapticService();
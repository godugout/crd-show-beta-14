import { useState, useEffect, useCallback } from 'react';

interface UseGlowStateOptions {
  duration?: number;
  pulseSpeed?: number;
  autoReset?: boolean;
}

interface UseGlowStateReturn {
  isGlowing: boolean;
  glowIntensity: number;
  triggerGlow: () => void;
  stopGlow: () => void;
  resetGlow: () => void;
}

export const useGlowState = (options: UseGlowStateOptions = {}): UseGlowStateReturn => {
  const {
    duration = 3000,
    pulseSpeed = 1000,
    autoReset = true
  } = options;

  const [isGlowing, setIsGlowing] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [glowTimer, setGlowTimer] = useState<NodeJS.Timeout | null>(null);

  const triggerGlow = useCallback(() => {
    console.log('✨ Glow effect triggered');
    setIsGlowing(true);
    setGlowIntensity(1);

    // Clear existing timer
    if (glowTimer) {
      clearTimeout(glowTimer);
    }

    // Auto-stop glow after duration
    if (autoReset) {
      const timer = setTimeout(() => {
        setIsGlowing(false);
        setGlowIntensity(0);
        setGlowTimer(null);
      }, duration);
      setGlowTimer(timer);
    }
  }, [duration, autoReset, glowTimer]);

  const stopGlow = useCallback(() => {
    setIsGlowing(false);
    setGlowIntensity(0);
    if (glowTimer) {
      clearTimeout(glowTimer);
      setGlowTimer(null);
    }
  }, [glowTimer]);

  const resetGlow = useCallback(() => {
    stopGlow();
  }, [stopGlow]);

  // Pulse effect when glowing
  useEffect(() => {
    if (!isGlowing) return;

    const pulseInterval = setInterval(() => {
      setGlowIntensity(prev => {
        // Pulse between 0.6 and 1.0
        return prev > 0.8 ? 0.6 : 1.0;
      });
    }, pulseSpeed);

    return () => clearInterval(pulseInterval);
  }, [isGlowing, pulseSpeed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (glowTimer) {
        clearTimeout(glowTimer);
      }
    };
  }, [glowTimer]);

  return {
    isGlowing,
    glowIntensity,
    triggerGlow,
    stopGlow,
    resetGlow
  };
};
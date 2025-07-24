import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  calculateViewingConditions, 
  shouldTriggerSequence,
  type ViewingConditions,
  type Transform3D,
  type ScreenDimensions
} from '@/utils/monolithViewingCalculations';

interface UseMonolithViewingDetectorProps {
  cardDimensions: { width: number; height: number };
  currentTransform: Transform3D;
  onSequenceTrigger: () => void;
  isEnabled?: boolean;
}

export const useMonolithViewingDetector = ({
  cardDimensions,
  currentTransform,
  onSequenceTrigger,
  isEnabled = true
}: UseMonolithViewingDetectorProps) => {
  const [viewingConditions, setViewingConditions] = useState<ViewingConditions>({
    cardScale: 0,
    monolithScreenCoverage: 0,
    viewingAngle: 0,
    stabilityDuration: 0,
    overallProgress: 0
  });

  const [isTriggered, setIsTriggered] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const lastUpdateTime = useRef<number>(Date.now());
  const animationFrameId = useRef<number>();

  // Get screen dimensions
  const getScreenDimensions = useCallback((): ScreenDimensions => ({
    width: window.innerWidth,
    height: window.innerHeight
  }), []);

  // Update viewing conditions
  const updateConditions = useCallback(() => {
    if (!isEnabled || isTriggered) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime.current;
    lastUpdateTime.current = currentTime;

    const screenDimensions = getScreenDimensions();
    const newConditions = calculateViewingConditions(
      cardDimensions,
      currentTransform,
      screenDimensions,
      viewingConditions,
      deltaTime
    );

    setViewingConditions(newConditions);

    // Show indicator when user starts getting close (44% threshold)
    const shouldShowIndicator = newConditions.overallProgress > 0.44;
    setShowIndicator(shouldShowIndicator);

    // Check if we should trigger the sequence
    if (shouldTriggerSequence(newConditions)) {
      console.log('🎬 Optimal viewing position achieved! Triggering Kubrick sequence...');
      console.log('Conditions:', {
        cardScale: newConditions.cardScale.toFixed(2),
        monolithCoverage: newConditions.monolithScreenCoverage.toFixed(2),
        viewingAngle: newConditions.viewingAngle.toFixed(2),
        stabilityDuration: `${newConditions.stabilityDuration}ms`,
        overallProgress: `${(newConditions.overallProgress * 100).toFixed(1)}%`
      });
      
      setIsTriggered(true);
      setShowIndicator(false);
      onSequenceTrigger();
    }
  }, [
    isEnabled,
    isTriggered,
    cardDimensions,
    currentTransform,
    viewingConditions,
    getScreenDimensions,
    onSequenceTrigger
  ]);

  // Animation loop for continuous monitoring
  useEffect(() => {
    if (!isEnabled || isTriggered) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const animate = () => {
      updateConditions();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateConditions, isEnabled, isTriggered]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isEnabled || isTriggered) return;
      updateConditions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateConditions, isEnabled, isTriggered]);

  // Reset when conditions change
  const reset = useCallback(() => {
    setIsTriggered(false);
    setShowIndicator(false);
    setViewingConditions({
      cardScale: 0,
      monolithScreenCoverage: 0,
      viewingAngle: 0,
      stabilityDuration: 0,
      overallProgress: 0
    });
    lastUpdateTime.current = Date.now();
  }, []);

  return {
    viewingConditions,
    isTriggered,
    showIndicator,
    reset
  };
};
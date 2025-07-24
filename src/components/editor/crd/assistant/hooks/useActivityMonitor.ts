import { useState, useEffect, useMemo } from 'react';

interface ActivityState {
  cardTitle: string;
  playerImage: string | null;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
  lastActivity: Date;
  currentStep: 'template' | 'design' | 'content' | 'export';
  timeOnStep: number;
  isIdle: boolean;
  shouldShowTutorialGlow: boolean;
  alignmentProgress: number;
}

interface UseActivityMonitorProps {
  cardTitle: string;
  playerImage: string | null;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
  cardAngle?: number;
  cameraDistance?: number;
  isOptimalPosition?: boolean;
}

export const useActivityMonitor = (props: UseActivityMonitorProps): ActivityState => {
  const [stepStartTime, setStepStartTime] = useState(new Date());
  const [lastActivity, setLastActivity] = useState(new Date());
  const [isIdle, setIsIdle] = useState(false);

  // Calculate current step based on completion (memoized to prevent recalculation)
  const currentStep = useMemo((): ActivityState['currentStep'] => {
    if (props.previewMode === 'print' || props.previewMode === 'preview') {
      return 'export';
    }
    if (props.cardTitle || props.playerImage) {
      return 'content';
    }
    if (props.selectedTemplate && props.colorPalette) {
      return 'design';
    }
    return 'template';
  }, [props.selectedTemplate, props.colorPalette, props.cardTitle, props.playerImage, props.previewMode]);

  // Reset step start time when step changes
  const [prevStep, setPrevStep] = useState(currentStep);
  useEffect(() => {
    if (currentStep !== prevStep) {
      setStepStartTime(new Date());
      setPrevStep(currentStep);
    }
  }, [currentStep, prevStep]);

  // Update last activity when any props change
  useEffect(() => {
    setLastActivity(new Date());
    setIsIdle(false);
  }, [props.cardTitle, props.playerImage, props.selectedTemplate, props.colorPalette, props.effects, props.previewMode]);

  // Idle detection
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      setIsIdle(true);
    }, 30000); // 30 seconds idle threshold

    return () => clearTimeout(idleTimer);
  }, [lastActivity]);

  // Calculate time on step
  const timeOnStep = useMemo(() => {
    return Date.now() - stepStartTime.getTime();
  }, [stepStartTime]);

  // Calculate tutorial glow trigger conditions
  const shouldShowTutorialGlow = useMemo(() => {
    // Show glow when user reaches alignment trigger conditions
    const is400PercentZoom = (props.cameraDistance || 10) <= 2.5;
    const isTilted35Plus = (props.cardAngle || 0) >= 35;
    const hasOptimalPosition = props.isOptimalPosition || false;
    
    // Trigger when approaching alignment (80% of the way there)
    const zoomProgress = Math.max(0, Math.min(1, (5 - (props.cameraDistance || 10)) / 3));
    const tiltProgress = Math.max(0, Math.min(1, (props.cardAngle || 0) / 45));
    const positionProgress = hasOptimalPosition ? 1 : 0;
    const overallProgress = (zoomProgress + tiltProgress + positionProgress) / 3;
    
    return overallProgress >= 0.6; // Show glow when 60% towards alignment
  }, [props.cardAngle, props.cameraDistance, props.isOptimalPosition]);

  const alignmentProgress = useMemo(() => {
    const zoomProgress = Math.max(0, Math.min(1, (5 - (props.cameraDistance || 10)) / 3));
    const tiltProgress = Math.max(0, Math.min(1, (props.cardAngle || 0) / 45));
    const positionProgress = props.isOptimalPosition ? 1 : 0;
    return (zoomProgress + tiltProgress + positionProgress) / 3;
  }, [props.cardAngle, props.cameraDistance, props.isOptimalPosition]);

  // Return stable activity state
  return useMemo((): ActivityState => ({
    cardTitle: props.cardTitle,
    playerImage: props.playerImage,
    selectedTemplate: props.selectedTemplate,
    colorPalette: props.colorPalette,
    effects: props.effects,
    previewMode: props.previewMode,
    lastActivity,
    currentStep,
    timeOnStep,
    isIdle,
    shouldShowTutorialGlow,
    alignmentProgress
  }), [
    props.cardTitle,
    props.playerImage, 
    props.selectedTemplate,
    props.colorPalette,
    props.effects,
    props.previewMode,
    lastActivity,
    currentStep,
    timeOnStep,
    isIdle,
    shouldShowTutorialGlow,
    alignmentProgress
  ]);
};
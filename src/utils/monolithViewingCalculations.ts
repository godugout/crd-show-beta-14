/**
 * Calculations for detecting optimal monolith viewing conditions
 * Based on 3D card transforms and screen positioning
 */

export interface ViewingConditions {
  cardScale: number; // 0-1, represents how large the card appears
  monolithScreenCoverage: number; // 0-1+, how much monolith extends beyond screen
  viewingAngle: number; // 0-1, optimal angle for monolith face visibility
  stabilityDuration: number; // milliseconds conditions have been held
  overallProgress: number; // 0-1, combined progress towards trigger
}

export interface Transform3D {
  rotation: { x: number; y: number; z: number };
  scale: number;
  position: { x: number; y: number; z: number };
}

export interface ScreenDimensions {
  width: number;
  height: number;
}

/**
 * Calculate how much screen space the card occupies
 */
export const calculateCardScreenCoverage = (
  cardDimensions: { width: number; height: number },
  transform: Transform3D,
  screenDimensions: ScreenDimensions
): number => {
  const scaledWidth = cardDimensions.width * Math.max(transform.scale, 0.1);
  // Simplified calculation - just use scale directly for now
  return scaledWidth / screenDimensions.width;
};

/**
 * Calculate monolith coverage - how much it extends beyond screen bounds
 */
export const calculateMonolithCoverage = (
  cardDimensions: { width: number; height: number },
  transform: Transform3D,
  screenDimensions: ScreenDimensions
): number => {
  const cardCoverage = calculateCardScreenCoverage(cardDimensions, transform, screenDimensions);
  
  // Monolith is central portion of card, roughly 40% of card width
  const monolithWidthRatio = 0.4;
  const monolithScreenWidth = cardCoverage * monolithWidthRatio;
  
  // When monolith extends beyond screen (>1.0), we're in optimal range
  return Math.min(monolithScreenWidth * 2.5, 2.0); // Cap at 2x for calculation
};

/**
 * Calculate optimal viewing angle score
 * Best when card is tilted to show monolith face-on at 180 degrees
 */
export const calculateViewingAngle = (transform: Transform3D): number => {
  const { x: rotX, y: rotY } = transform.rotation;
  
  // Much easier criteria - just need to be in the general direction
  const optimalRotX = 20; // degrees
  const optimalRotY = 180; // degrees - the other swing direction
  
  // Very generous tolerances to make it easier to trigger
  const xScore = Math.max(0, 1 - Math.abs(rotX - optimalRotX) / 60); // ±60° tolerance
  // Handle 180° target with wraparound - very generous ±45° tolerance
  const yDiff = Math.min(Math.abs(rotY - optimalRotY), Math.abs(rotY - (optimalRotY - 360)));
  const yScore = Math.max(0, 1 - yDiff / 45); // Allow ±45° tolerance
  
  return (xScore + yScore) / 2;
};

/**
 * Calculate overall viewing conditions
 */
export const calculateViewingConditions = (
  cardDimensions: { width: number; height: number },
  transform: Transform3D,
  screenDimensions: ScreenDimensions,
  previousConditions?: ViewingConditions,
  deltaTime: number = 16 // milliseconds since last check
): ViewingConditions => {
  const cardScale = calculateCardScreenCoverage(cardDimensions, transform, screenDimensions);
  const monolithScreenCoverage = calculateMonolithCoverage(cardDimensions, transform, screenDimensions);
  const viewingAngle = calculateViewingAngle(transform);
  
  // Calculate if we're in the target zone
  const scaleTarget = cardScale >= 0.5 ? 1.0 : cardScale / 0.5;
  const coverageTarget = monolithScreenCoverage >= 1.0 ? 1.0 : monolithScreenCoverage;
  const angleTarget = viewingAngle;
  
  // Combined progress (all conditions must be met)
  const overallProgress = Math.min(scaleTarget, coverageTarget, angleTarget);
  
  // Track stability - how long conditions have been optimal
  const isOptimal = overallProgress >= 0.85; // 85% threshold for "optimal"
  const previousStability = previousConditions?.stabilityDuration || 0;
  
  const stabilityDuration = isOptimal 
    ? previousStability + deltaTime 
    : Math.max(0, previousStability - deltaTime * 2); // Decay faster than growth
  
  return {
    cardScale,
    monolithScreenCoverage,
    viewingAngle,
    stabilityDuration,
    overallProgress
  };
};

/**
 * Determine if conditions are met for triggering the sequence
 */
export const shouldTriggerSequence = (conditions: ViewingConditions): boolean => {
  return (
    conditions.overallProgress >= 0.4 && // Much easier - only need 40%
    conditions.stabilityDuration >= 500 // Only half a second
  );
};

/**
 * Get descriptive feedback for current viewing state
 */
export const getViewingFeedback = (conditions: ViewingConditions): {
  message: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
} => {
  const { cardScale, monolithScreenCoverage, viewingAngle, overallProgress } = conditions;
  
  if (overallProgress < 0.3) {
    if (cardScale < 0.3) {
      return { message: "Zoom in closer to the monolith", urgency: 'low' };
    }
    if (viewingAngle < 0.3) {
      return { message: "Adjust angle to face the monolith", urgency: 'low' };
    }
    return { message: "Find the perfect viewing position", urgency: 'low' };
  }
  
  if (overallProgress < 0.6) {
    return { message: "Getting closer... adjust your view", urgency: 'medium' };
  }
  
  if (overallProgress < 0.85) {
    return { message: "Almost there... hold steady", urgency: 'high' };
  }
  
  const stabilityProgress = Math.min(conditions.stabilityDuration / 2000, 1);
  return { 
    message: `Hold position... ${Math.round(stabilityProgress * 100)}%`, 
    urgency: 'critical' 
  };
};
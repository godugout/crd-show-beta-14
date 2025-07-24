import React from 'react';
import { getViewingFeedback, type ViewingConditions } from '@/utils/monolithViewingCalculations';

interface ViewingConditionsIndicatorProps {
  conditions: ViewingConditions;
  isVisible: boolean;
  isAnimationActive?: boolean;
}

export const ViewingConditionsIndicator: React.FC<ViewingConditionsIndicatorProps> = ({
  conditions,
  isVisible,
  isAnimationActive = false
}) => {
  if (!isVisible) return null;

  const { message, urgency } = getViewingFeedback(conditions);
  const { overallProgress, stabilityDuration } = conditions;

  // Determine indicator style and positioning
  const getIndicatorStyle = () => {
    // When animation is active, move to bottom right area and slide down
    const basePosition = isAnimationActive 
      ? "fixed bottom-32 right-6 transform transition-all duration-500 translate-y-full" 
      : "fixed top-24 left-1/2 transform -translate-x-1/2 transition-all duration-300";
    
    const baseStyle = `${basePosition} viewing-conditions-indicator`;
    
    switch (urgency) {
      case 'critical':
        return `${baseStyle} bg-crd-blue/90 border-crd-blue/50 text-white`;
      case 'high':
        return `${baseStyle} bg-orange-500/90 border-orange-400/50 text-white`;
      case 'medium':
        return `${baseStyle} bg-yellow-500/90 border-yellow-400/50 text-black`;
      default:
        return `${baseStyle} bg-gray-600/90 border-gray-500/50 text-white`;
    }
  };

  // Calculate stability progress for critical phase
  const stabilityProgress = urgency === 'critical' ? Math.min(stabilityDuration / 2000, 1) : 0;

  return (
    <div className={`${getIndicatorStyle()} backdrop-blur-sm border rounded-lg px-6 py-3 shadow-lg`}>
      <div className="flex items-center gap-4">
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-200 rounded-full"
              style={{ width: `${overallProgress * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono opacity-75">
            {Math.round(overallProgress * 100)}%
          </span>
        </div>

        {/* Message */}
        <span className="text-sm font-medium">
          {message}
        </span>

        {/* Stability progress for critical phase */}
        {urgency === 'critical' && (
          <div className="flex items-center gap-2">
            <div className="w-12 h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 rounded-full"
                style={{ width: `${stabilityProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Pulsing dot for critical phase */}
        {urgency === 'critical' && (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        )}
      </div>

      {/* Detailed breakdown for debugging (only in development) */}
      {process.env.NODE_ENV === 'development' && urgency === 'critical' && (
        <div className="mt-2 pt-2 border-t border-white/20 text-xs opacity-75 font-mono">
          <div className="grid grid-cols-3 gap-2">
            <span>Scale: {Math.round(conditions.cardScale * 100)}%</span>
            <span>Coverage: {Math.round(conditions.monolithScreenCoverage * 100)}%</span>
            <span>Angle: {Math.round(conditions.viewingAngle * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
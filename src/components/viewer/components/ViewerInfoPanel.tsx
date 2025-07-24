
import React from 'react';

interface ViewerInfoPanelProps {
  showStats: boolean;
  isFlipped: boolean;
  shouldShowPanel: boolean;
  hasMultipleCards: boolean;
  isVisible: boolean;
}

export const ViewerInfoPanel: React.FC<ViewerInfoPanelProps> = ({
  showStats,
  isFlipped,
  shouldShowPanel,
  hasMultipleCards,
  isVisible
}) => {
  if (!showStats) return null;

  return (
    <div 
      className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 select-none transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`} 
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur border border-white/20 rounded-lg px-4 py-2 text-white text-sm hover:bg-opacity-30 transition-all duration-200">
        <div className="flex items-center space-x-4">
          <span>
            {isFlipped ? 'Back' : 'Front'} side
          </span>
          <span className="text-gray-300">•</span>
          <span>
            Click to flip
          </span>
          {hasMultipleCards && (
            <>
              <span className="text-gray-300">•</span>
              <span>
                Use ← → to navigate
              </span>
            </>
          )}
          {shouldShowPanel && (
            <>
              <span className="text-gray-300">•</span>
              <span>
                Studio panel open
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

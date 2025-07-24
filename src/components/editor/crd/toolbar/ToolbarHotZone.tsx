import React from 'react';

interface ToolbarHotZoneProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ToolbarHotZone: React.FC<ToolbarHotZoneProps> = ({
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        // Invisible but functional hot zone
        backgroundColor: 'transparent',
      }}
    />
  );
};

import React, { useState } from 'react';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StarsBackground } from '@/components/ui/stars';
import { StudioPauseButton } from '@/components/studio/StudioPauseButton';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

export const Create3DSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const { deviceType } = useResponsiveBreakpoints();

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };


  return (
    <div className="relative w-full h-screen bg-crd-darkest overflow-hidden">
      {/* Full-Screen 3D Background */}
      <div className="absolute inset-0 z-0">
        <StarsBackground>
          <FloatingCard3D 
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            showPauseButton={false}
          />
        </StarsBackground>
      </div>

      {/* Control Button */}
      <div className="absolute bottom-6 right-6 z-50 flex gap-3">
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={handleTogglePause} 
        />
      </div>

      {/* Device-specific UI hints */}
      {deviceType === 'desktop' && (
        <div className="absolute bottom-6 left-6 z-50 text-crd-lightGray text-sm">
          <p>Interactive 3D Experience</p>
          <p className="text-xs">Drag to rotate • Scroll to zoom</p>
        </div>
      )}
    </div>
  );
};

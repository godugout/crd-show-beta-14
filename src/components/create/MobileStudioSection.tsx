
import React, { useState, useEffect } from 'react';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StarsBackground } from '@/components/ui/stars';
import { MobileStudioTaskbar } from './MobileStudioTaskbar';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

export const MobileStudioSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { hapticLight } = useMobileFeatures();

  const handleTogglePause = () => {
    hapticLight();
    setIsPaused(prev => !prev);
  };

  const handleReset = () => {
    // Proper reset without page reload
    setIsPaused(false);
    hapticLight();
  };

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('mobile-studio-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      id="mobile-studio-section" 
      className="relative w-full h-screen bg-crd-darkest snap-start overflow-hidden"
    >
      {/* Scroll Progress Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${scrollProgress > 0.3 ? 'bg-crd-blue' : 'bg-crd-mediumGray'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${scrollProgress > 0.7 ? 'bg-crd-blue' : 'bg-crd-mediumGray'}`} />
        </div>
      </div>

      {/* 3D Background covering entire section */}
      <div className="absolute inset-0 z-0 h-full">
        <StarsBackground>
          <FloatingCard3D 
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            showPauseButton={false}
          />
        </StarsBackground>
      </div>

      {/* Mobile Studio Taskbar */}
      <MobileStudioTaskbar
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        onReset={handleReset}
      />

      {/* Scroll Hint */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center z-20">
        <p className="text-crd-lightGray text-sm">Swipe up to continue</p>
      </div>
    </div>
  );
};

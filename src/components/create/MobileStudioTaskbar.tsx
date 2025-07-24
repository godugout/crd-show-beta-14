
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Share2, Download } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

interface MobileStudioTaskbarProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
}

export const MobileStudioTaskbar: React.FC<MobileStudioTaskbarProps> = ({
  isPaused,
  onTogglePause,
  onReset
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { hapticLight, hapticMedium } = useMobileFeatures();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      
      // Show taskbar when in studio section
      const studioSection = document.getElementById('mobile-studio-section');
      if (studioSection) {
        const rect = studioSection.getBoundingClientRect();
        const inStudioSection = rect.top <= 100 && rect.bottom >= 100;
        setIsVisible(inStudioSection && (!isScrollingDown || currentScrollY < 100));
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handlePauseToggle = () => {
    hapticLight();
    onTogglePause();
  };

  const handleReset = () => {
    hapticMedium();
    onReset();
  };

  const handleAction = (action: string) => {
    hapticLight();
    console.log(`Mobile action: ${action}`);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-crd-darker/95 backdrop-blur-sm border-t border-crd-mediumGray/20 transition-transform duration-300 z-50 safe-area-bottom ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      {/* Main Controls Row */}
      <div className="flex items-center justify-between p-3">
        {/* Primary Controls */}
        <div className="flex items-center gap-2">
          <CRDButton
            variant="outline"
            size="sm"
            onClick={handlePauseToggle}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[40px] min-w-[40px] p-0"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </CRDButton>
          
          <CRDButton
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[40px] min-w-[40px] p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </CRDButton>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-2">
          <CRDButton
            variant="outline"
            size="sm"
            onClick={() => handleAction('settings')}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[40px] min-w-[40px] p-0"
          >
            <Settings className="w-4 h-4" />
          </CRDButton>
          
          <CRDButton
            variant="outline"
            size="sm"
            onClick={() => handleAction('share')}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[40px] min-w-[40px] p-0"
          >
            <Share2 className="w-4 h-4" />
          </CRDButton>
          
          <CRDButton
            variant="outline"
            size="sm"
            onClick={() => handleAction('download')}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[40px] min-w-[40px] p-0"
          >
            <Download className="w-4 h-4" />
          </CRDButton>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="px-3 pb-2">
        <div className="text-center text-xs text-crd-lightGray">
          {isPaused ? 'Animation Paused' : 'Animation Playing'}
        </div>
      </div>
    </div>
  );
};

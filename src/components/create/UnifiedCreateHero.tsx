import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { ResponsiveCreate3DLayout } from './ResponsiveCreate3DLayout';
import { CRDButton, Typography } from '@/components/ui/design-system';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { ScrollIndicator } from './ScrollIndicator';

interface UnifiedCreateHeroProps {
  onAnimationComplete?: () => void;
}

export const UnifiedCreateHero: React.FC<UnifiedCreateHeroProps> = ({ onAnimationComplete }) => {
  const { isShortScreen, isMobile, isTablet } = useResponsiveBreakpoints();
  const [isPaused, setIsPaused] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 0.3; // Hide after scrolling 30% of viewport
      
      setShowScrollIndicator(scrollY < scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };


  // Render tablet-specific hero text with line breaks
  const renderTabletHeroText = () => (
    <div className="text-center max-w-4xl mx-auto">
      {/* Intro Label */}
       <div className="mb-6 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase animate-fade-in">
         CUT, CRAFT & CREATE DIGITALLY
       </div>
      
      <h1 className="leading-tight mb-8 font-light">
        <div className="text-xl md:text-2xl lg:text-3xl text-gray-400 mb-2 whitespace-nowrap">
          From <span className="paper-scraps">paper scraps</span> and <span className="cardboard-text">cardboard</span> to
        </div>
         <div className="text-3xl md:text-5xl lg:text-6xl font-bold">
           <span className="text-white">CRD</span>
           <span className="mx-2">
             <span className="text-white">art</span>
           </span>
           <span className="animate-gradient-flow bg-clip-text text-transparent">that comes alive!</span>
         </div>
      </h1>
    </div>
  );

  // Render standard hero text (desktop and mobile)
  const renderStandardHeroText = () => (
    <div className="text-center max-w-4xl mx-auto">
      {/* Intro Label */}
       <div className="mb-6 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase animate-fade-in">
         CUT, CRAFT & CREATE DIGITALLY
       </div>
      
      <h1 className="leading-tight mb-8 font-light">
        <div className="text-xl md:text-2xl lg:text-3xl text-gray-400 mb-2 whitespace-nowrap">
          From <span className="paper-scraps">paper scraps</span> and <span className="cardboard-text">cardboard</span> to
        </div>
         <div className="text-3xl md:text-5xl lg:text-6xl font-bold">
           <span className="text-white">CRD</span>
           <span className="mx-2">
             <span className="text-white">art</span>
           </span>
           <span className="animate-gradient-flow bg-clip-text text-transparent">that comes alive!</span>
         </div>
      </h1>
    </div>
  );

  return (
    <>
      {isShortScreen ? (
        // Short screen layout - Compact design for limited vertical space
        <div id="animation-section" className="relative w-full h-screen overflow-hidden">
          {/* Full Screen 3D Background Layer */}
          <ResponsiveCreate3DLayout
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            className="fixed inset-0 z-0"
            onAnimationComplete={onAnimationComplete}
          />

          {/* Overlay Content Layer - Positioned for short screens */}
          <div className="relative z-10 h-full flex flex-col pointer-events-none">
            {/* Top Section - Hero Content - Slide up and fade out on very short screens */}
            <div className="flex-1 flex items-start justify-center px-6 pt-32 hero-text-responsive transition-all duration-500">
              <div className="text-center space-y-4 max-w-4xl mx-auto">
                {/* Hero Text */}
                {isTablet ? renderTabletHeroText() : renderStandardHeroText()}
              </div>
            </div>

            {/* Middle Section - Action Buttons */}
            <div className="flex-shrink-0 pb-16 pointer-events-auto relative z-[100]">
              <div className="mt-10 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6">
                  {/* Primary CTA - Updated to use create variant */}
                  <Link to="/create/crd" className="w-full sm:w-auto">
                    <CRDButton 
                      variant="create" 
                      size="lg"
                      className="w-full sm:w-auto min-w-[200px]"
                    >
                      Start Creating
                    </CRDButton>
                  </Link>

                  {/* Secondary CTA - Updated to use glass variant */}
                  <Link to="/frames" className="w-full sm:w-auto">
                    <CRDButton 
                      variant="glass" 
                      size="lg"
                      className="w-full sm:w-auto min-w-[200px]"
                    >
                      Browse Frames
                    </CRDButton>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Section - Combined Tagline and Scroll Indicator */}
            <div className="flex-shrink-0 pb-2 pointer-events-none relative z-[100]">
              <div className="text-center px-6">
                {/* Inspirational tagline */}
                <div className="mb-6">
                  <Typography 
                    variant="body" 
                    className="text-crd-lightGray max-w-3xl mx-auto mobile-body animate-fade-in"
                  >
                     From basketball legends to anime heroes, fantasy realms to family memories — craft CRDs that captivate audiences and bring your art, photography, and custom trading cards to life!
                  </Typography>
                </div>
                
                {/* Animated Tagline */}
                <p className="text-xs text-gray-400 animate-pulse mb-4">
                  ✨ Where imagination meets technology. <span className="font-caveat text-base text-crd-orange">What will you make?</span>
                </p>
                
                {/* Scroll Indicator */}
                <ScrollIndicator isVisible={showScrollIndicator} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal tall screen layout - Updated with new button variants
        <div id="animation-section" className="relative w-full min-h-screen">
          {/* Full Screen 3D Background Layer */}
          <ResponsiveCreate3DLayout
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            className="fixed inset-0 z-0"
            onAnimationComplete={onAnimationComplete}
          />

          {/* Overlay Content Layer - Positioned higher for normal screens */}
          <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
            {/* Top Section - Hero Content */}
            <div className="flex-1 flex items-start justify-center px-6 pt-40">
              <div className="text-center space-y-8 max-w-6xl mx-auto">
                {/* Hero Text */}
                {isTablet ? renderTabletHeroText() : renderStandardHeroText()}
                
                 {/* Action Buttons */}
                <div className="mt-10 space-y-4 pointer-events-auto relative z-[100]">
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    {/* Primary CTA - Updated to use create variant */}
                    <Link to="/create/crd">
                      <CRDButton 
                        variant="create" 
                        size="lg"
                        className="min-w-[200px]"
                      >
                        Start Creating
                      </CRDButton>
                    </Link>

                    {/* Secondary CTA - Updated to use glass variant */}
                    <Link to="/frames">
                      <CRDButton 
                        variant="glass" 
                        size="lg"
                        className="min-w-[200px]"
                      >
                        Browse Frames
                      </CRDButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Combined Tagline and Scroll Indicator */}
            <div className="flex-shrink-0 pb-2 pointer-events-none relative z-[100]">
              <div className="text-center px-6">
                {/* Inspirational tagline */}
                <div className="mb-6">
                  <Typography 
                    variant="body" 
                    className="text-crd-lightGray max-w-3xl mx-auto mobile-body animate-fade-in"
                  >
                    From basketball legends to anime heroes, fantasy realms to family memories — craft CRDs that captivate audiences and bring your art, photography, and custom trading cards to life!
                  </Typography>
                </div>
                
                {/* Animated Tagline */}
                <p className="text-base text-gray-400 animate-pulse mb-4">
                  ✨ Where imagination meets technology. <span className="font-caveat text-2xl text-crd-orange">What will you make?</span>
                </p>
                
                {/* Scroll Indicator */}
                <ScrollIndicator isVisible={showScrollIndicator} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
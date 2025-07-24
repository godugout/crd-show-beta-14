
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StudioPauseButton } from '@/components/studio/StudioPauseButton';
import { StarsBackground } from '@/components/ui/stars';

const DesktopAnimatedTagline: React.FC = () => {
  return (
    <div className="mt-12 mb-8">
      <p className="font-caveat text-4xl md:text-5xl italic text-center text-crd-orange animate-fade-in">
        "No glue needed."
      </p>
    </div>
  );
};

export const DesktopCreateHero: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };


  return (
    <div className="relative w-full overflow-hidden h-screen bg-crd-darkest">
      {/* Full-Screen 3D Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <StarsBackground>
          <FloatingCard3D 
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            showPauseButton={false}
          />
        </StarsBackground>
      </div>

      {/* Control Button - Lower Right */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-3">
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={handleTogglePause} 
        />
      </div>
      
      {/* Hero Content Overlay */}
      <div className="relative z-10 text-center pb-4 pt-[calc(var(--navbar-height)+100px)] pointer-events-none">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Label */}
          <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase">
            CUT, CRAFT & CREATE DIGITALLY
          </div>
          
          {/* Main Heading */}
          <div className="mb-4">
            <h1 className="leading-tight text-crd-white drop-shadow-lg">
              <div className="flex justify-center items-center mb-2 text-5xl md:text-6xl lg:text-7xl">
                <span className="text-gray-400 font-light">From <span className="paper-scraps">paper scraps</span> and <span className="cardboard-text">cardboard</span> to</span>
              </div>
              <div className="flex justify-center items-center text-6xl md:text-7xl lg:text-8xl">
                <span className="font-bold">
                  <PixelDigital className="inline">digital</PixelDigital>
                  <span className="text-white"> art that comes alive!</span>
                </span>
              </div>
            </h1>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center my-12 pointer-events-auto">
            <Link to="/create/crd">
              <CRDButton 
                size="lg" 
                variant="create"
                className="min-w-[200px]"
              >
                Start Creating
              </CRDButton>
            </Link>
            <Link to="/frames">
              <CRDButton 
                variant="outline" 
                size="lg" 
                className="min-w-[200px]"
              >
                Browse Frames
              </CRDButton>
            </Link>
          </div>
          
          {/* Animated Tagline */}
          <DesktopAnimatedTagline />
        </div>
      </div>
    </div>
  );
};

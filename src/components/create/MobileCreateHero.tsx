
import React from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { ChevronDown } from 'lucide-react';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

const MobileAnimatedTagline: React.FC = () => {
  return (
    <div className="mt-4 mb-6">
      <p className="font-caveat text-lg italic text-center text-crd-orange animate-fade-in leading-tight">
        "No glue needed."
      </p>
    </div>
  );
};

export const MobileCreateHero: React.FC = () => {
  const { hapticLight } = useMobileFeatures();

  const scrollToStudio = () => {
    hapticLight();
    const studioSection = document.getElementById('mobile-studio-section');
    studioSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-screen bg-crd-darkest flex flex-col snap-start">
      {/* Mobile Hero Content - Optimized Typography */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 pt-[calc(var(--navbar-height)+20px)] pb-20">
        {/* Label */}
        <div className="mb-2 gradient-text-green-blue-purple font-bold tracking-wider text-xs uppercase">
          CUT, CRAFT & CREATE DIGITALLY
        </div>
        
        {/* Main Heading - Mobile Optimized with Better Line Breaks */}
        <div className="mb-4 text-center max-w-sm">
          <h1 className="leading-tight text-crd-white drop-shadow-lg">
            <div className="flex justify-center items-center mb-1 text-base">
              <span className="text-gray-400 font-light text-center">
                From <span className="paper-scraps">paper scraps</span><br />
                and <span className="cardboard-text">cardboard</span> to
              </span>
            </div>
            <div className="flex justify-center items-center text-xl mt-2">
              <span className="font-bold text-center">
                <PixelDigital className="inline">digital</PixelDigital><br />
                <span className="text-white">art that comes alive!</span>
              </span>
            </div>
          </h1>
        </div>
        
        {/* CTA Buttons - Reduced Spacing */}
        <div className="flex flex-col gap-2 justify-center my-4">
          <Link to="/create/crd">
            <CRDButton 
              size="default" 
              variant="create"
              className="min-w-[180px] text-base"
            >
              Start Creating
            </CRDButton>
          </Link>
          <Link to="/frames">
            <CRDButton 
              variant="outline" 
              size="default" 
              className="min-w-[180px] text-base"
            >
              Browse Frames
            </CRDButton>
          </Link>
        </div>
        
        {/* Animated Tagline */}
        <MobileAnimatedTagline />
      </div>

      {/* 3D Card Teaser at Bottom - Smaller */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-crd-darkest/80 to-transparent flex items-end justify-center pb-4">
        <div className="w-16 h-22 bg-crd-mediumGray/20 rounded-lg shadow-2xl transform rotate-12 animate-pulse">
          <div className="w-full h-full bg-gradient-to-br from-crd-blue/30 to-crd-green/30 rounded-lg flex items-center justify-center">
            <span className="text-crd-white text-xs font-bold">3D</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToStudio}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 text-crd-lightGray hover:text-crd-white transition-colors animate-bounce"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
};

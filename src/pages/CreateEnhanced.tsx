import React, { useState } from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';
import { KobeReward } from '@/components/create/KobeReward';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

const CreateEnhanced: React.FC = () => {
  const { isMobile, isShortScreen } = useResponsiveBreakpoints();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const handleAnimationFinished = () => {
    console.log('🎬 CreateEnhanced: Animation finished callback triggered');
    setAnimationFinished(true);
  };

  const handleAnimationComplete = () => {
    console.log('🏆 CreateEnhanced: Animation complete callback triggered');
    setAnimationComplete(true);
  };

  return (
    <div className="min-h-screen bg-space-odyssey overflow-x-hidden">
      <div className="h-full w-full">
        {/* Unified Responsive Hero Section */}
        <CreatePageHero onAnimationComplete={handleAnimationFinished} />
        
        {/* Creation Options Section - Only show on desktop with sufficient height */}
        {!isMobile && !isShortScreen && (
          <div className="hidden lg:block">
            <CreateOptionsSection />
          </div>
        )}
        
        {/* Kobe Reward System */}
        <KobeReward 
          onAnimationComplete={handleAnimationComplete} 
          animationFinished={animationFinished}
        />
      </div>
    </div>
  );
};

export default CreateEnhanced;

import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';
// Removed useScrollResistance completely - no interference

const CreateChoice: React.FC = () => {
  // No scroll resistance - let native scrolling work

  return (
    <div className="min-h-screen bg-crd-darkest overflow-x-hidden">
      <div className="w-full">
        {/* Unified Hero Section with Responsive 3D Positioning */}
        <CreatePageHero />
        
        {/* Creation Options Section - Always visible for scroll testing */}
        <div className="block">
          <CreateOptionsSection />
        </div>
      </div>
    </div>
  );
};

export default CreateChoice;

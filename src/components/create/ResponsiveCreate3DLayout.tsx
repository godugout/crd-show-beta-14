import React, { useState } from 'react';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StarsBackground } from '@/components/ui/stars';
import { StudioPauseButton } from '@/components/studio/StudioPauseButton';
import { RefreshCw } from 'lucide-react';
import { AlignmentTutorial } from './AlignmentTutorial';
import { AlignmentTutorialButton } from './AlignmentTutorialButton';
import { type SpaceEnvironment } from '@/components/studio/EnvironmentSwitcher';

interface ResponsiveCreate3DLayoutProps {
  isPaused: boolean;
  onTogglePause: () => void;
  className?: string;
  onAnimationComplete?: () => void;
}

export const ResponsiveCreate3DLayout: React.FC<ResponsiveCreate3DLayoutProps> = ({
  isPaused,
  onTogglePause,
  className = '',
  onAnimationComplete
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [spaceEnvironment, setSpaceEnvironment] = useState<SpaceEnvironment>('starfield');

  const handleAnimationComplete = () => {
    console.log('🚀 ResponsiveCreate3DLayout: Animation complete, forwarding to parent');
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-0 ${className}`}
      style={{ cursor: 'grab' }}
      onMouseDown={(e) => {
        // Don't capture events in the bottom scroll zone (starting from scroll indicator)
        const bottomZone = window.innerHeight - 180; // 180px from bottom to include scroll indicator
        if (e.clientY > bottomZone) return;
        
        e.currentTarget.style.cursor = 'grabbing';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'grab';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.cursor = 'grab';
      }}
    >
      {/* Full Screen Starry Background with 3D Animation */}
      <div className="absolute inset-0">
        <StarsBackground>
          <FloatingCard3D 
            isPaused={isPaused}
            onTogglePause={onTogglePause}
            showPauseButton={false}
            onShowTutorial={() => setShowTutorial(true)}
            spaceEnvironment={spaceEnvironment}
            onSpaceEnvironmentChange={setSpaceEnvironment}
            onAnimationComplete={handleAnimationComplete}
          />
        </StarsBackground>
      </div>

      {/* Seamless Bottom Blend Overlay - Creates glow effect where hero meets footer */}
      <div 
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent 60%,
            rgba(0, 0, 0, 0.1) 70%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0.5) 90%,
            rgba(0, 0, 0, 0.8) 100%
          )`
        }}
      />

      {/* Bottom Glow Enhancement */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-40"
        style={{
          background: `radial-gradient(
            ellipse at center bottom,
            hsla(var(--theme-primary) / 0.15) 0%,
            hsla(var(--theme-primary) / 0.08) 30%,
            transparent 70%
          )`
        }}
      />

      {/* SCROLL PRIORITY ZONE - Complete bottom area for page scrolling only */}
      <div 
        id="scroll-priority-zone"
        className="absolute right-0 w-full z-50 pointer-events-auto"
        style={{ 
          bottom: 0,
          left: '200px', // Leave space for buttons on the left
          height: '180px', // Cover from scroll indicator to bottom
          background: 'transparent',
          cursor: 'default'
        }}
        onMouseEnter={() => {
          document.body.style.cursor = 'default';
        }}
        onMouseLeave={() => {
          document.body.style.cursor = '';
        }}
        onWheel={(e) => {
          // Simply allow native scrolling - no interference at all
          e.stopPropagation();
          // Don't preventDefault - let browser handle scroll naturally
        }}
        onMouseDown={(e) => {
          // Block 3D controls but don't prevent default scroll behavior
          e.stopPropagation();
        }}
        onMouseMove={(e) => {
          // Block 3D controls but don't prevent scroll
          e.stopPropagation();
        }}
        onMouseUp={(e) => {
          // Block 3D controls
          e.stopPropagation();
        }}
        onClick={(e) => {
          // Block clicks to 3D
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          // Block touch controls for 3D
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          // Allow touch scrolling
          e.stopPropagation();
        }}
      />

      {/* Alignment Tutorial Overlay */}
      <AlignmentTutorial 
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  );
};

import React from 'react';
import { HelpCircle, Play } from 'lucide-react';
import { useGlowState } from '@/hooks/useGlowState';

interface AlignmentTutorialButtonProps {
  onShowTutorial: () => void;
  shouldGlow?: boolean;
  onGlowTrigger?: () => void;
}

export const AlignmentTutorialButton: React.FC<AlignmentTutorialButtonProps> = ({
  onShowTutorial,
  shouldGlow = false,
  onGlowTrigger
}) => {
  const { isGlowing, triggerGlow } = useGlowState({
    duration: 5000,
    pulseSpeed: 800
  });

  // Trigger glow when shouldGlow becomes true
  React.useEffect(() => {
    if (shouldGlow && !isGlowing) {
      triggerGlow();
      onGlowTrigger?.();
    }
  }, [shouldGlow, isGlowing, triggerGlow, onGlowTrigger]);
  return (
    <button
      onClick={onShowTutorial}
      className={`group bg-crd-dark/90 hover:bg-crd-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 border border-crd-lightGray/20 hover:border-crd-accent/50 ${
        isGlowing ? 'glow-tutorial glow-pulse' : ''
      }`}
      title="Show Alignment Tutorial"
    >
      <div className="relative">
        <HelpCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-2 h-2 text-white m-0.5" />
        </div>
      </div>
    </button>
  );
};
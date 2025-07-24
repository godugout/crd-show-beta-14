
import React from 'react';
import { UnifiedCreateHero } from './UnifiedCreateHero';

interface ResponsiveCreatePageHeroProps {
  onAnimationComplete?: () => void;
}

export const ResponsiveCreatePageHero: React.FC<ResponsiveCreatePageHeroProps> = ({ onAnimationComplete }) => {
  return <UnifiedCreateHero onAnimationComplete={onAnimationComplete} />;
};

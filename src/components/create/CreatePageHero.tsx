
import React from 'react';
import { ResponsiveCreatePageHero } from './ResponsiveCreatePageHero';

interface CreatePageHeroProps {
  onAnimationComplete?: () => void;
}

export const CreatePageHero: React.FC<CreatePageHeroProps> = ({ onAnimationComplete }) => {
  return <ResponsiveCreatePageHero onAnimationComplete={onAnimationComplete} />;
};

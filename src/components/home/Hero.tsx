
import React from "react";
import { HeroSection } from '@/components/sections/HeroSection';
import { HeroCarousel } from './HeroCarousel';

export const Hero: React.FC = () => {
  return (
    <div className="bg-crd-darkest">
      <HeroSection
        subtitle="THE FIRST PRINT & MINT DIGITAL CARD MARKET"
        title="Create, collect, and trade card art and digital collectibles."
        ctaText="Get started"
        ctaLink="/create"
        className="bg-crd-darkest"
      />
      <HeroCarousel />
    </div>
  );
};

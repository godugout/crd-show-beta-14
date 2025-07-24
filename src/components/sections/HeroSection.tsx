import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Typography } from '@/components/ui/design-system/Typography';
import { CRDContainer, CRDSection } from '@/components/layout/CRDContainer';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  className
}) => {
  return (
    <CRDSection 
      spacing="large" 
      className={cn("text-center max-h-[90vh] min-h-[60vh] flex items-center", className)}
    >
      <CRDContainer size="narrow" className="w-full">
        <div className="flex flex-col items-center space-y-4 lg:space-y-6">
          {/* Small Label */}
          {subtitle && (
            <Typography 
              variant="label" 
              className="mobile-text animate-fade-in"
            >
              {subtitle}
            </Typography>
          )}
          
          {/* Main Heading - Responsive typography */}
          <Typography 
            as="h1" 
            variant="display"
            className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-black leading-tight tracking-[-0.4px] text-center max-w-full animate-fade-in"
          >
            {title}
          </Typography>
          
          {/* CTA Button - Responsive sizing */}
          <Link to={ctaLink} className="animate-fade-in">
            <CRDButton 
              variant="primary"
              size="lg"
              className="mobile-btn gap-3 touch-target"
            >
              {ctaText}
            </CRDButton>
          </Link>
        </div>
      </CRDContainer>
    </CRDSection>
  );
};
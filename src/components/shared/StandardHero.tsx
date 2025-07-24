
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Typography, CRDButton } from '@/components/ui/design-system';
import { ThemedPage } from '@/components/ui/design-system/ThemedLayout';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

interface CTAConfig {
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'create' | 'collective' | 'collect';
  className?: string;
}

interface StandardHeroProps {
  label?: string;
  labelRef?: React.RefObject<HTMLDivElement>;
  title: React.ReactNode;
  tagline?: string;
  titleEffects?: React.ReactNode;
  description: string;
  primaryCta: CTAConfig;
  secondaryCta?: CTAConfig;
  showDecorations?: boolean;
  className?: string;
  children?: React.ReactNode;
  heroVariant?: 'hero' | 'display';
  fullWidth?: boolean;
}

export const StandardHero: React.FC<StandardHeroProps> = ({
  label,
  labelRef,
  title,
  tagline,
  titleEffects,
  description,
  primaryCta,
  secondaryCta,
  showDecorations = false,
  className = '',
  children,
  heroVariant = 'display',
  fullWidth = false
}) => {
  const { isMobile } = useResponsiveBreakpoints();

  return (
    <div className={`relative ${fullWidth ? 'w-screen -mx-[50vw] left-1/2' : ''} overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-crd-darkest"></div>
      
      {/* Decorative elements - only show if requested */}
      {showDecorations && (
        <>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-crd-green/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-crd-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Sparkly Stars */}
          <div className="absolute top-20 left-10 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_6px_#fbbf24,0_0_12px_#fbbf24] animate-pulse"></div>
          <div className="absolute top-32 right-20 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#ffffff,0_0_16px_#ffffff] animate-pulse delay-500"></div>
          <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_10px_#fde047,0_0_20px_#fde047] animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 right-10 w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#ffffff,0_0_12px_#ffffff] animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-1/5 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_12px_#fbbf24,0_0_24px_#fbbf24] animate-pulse delay-700"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_8px_#fefce8,0_0_16px_#fefce8] animate-pulse delay-200"></div>
          <div className="absolute bottom-60 left-20 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#ffffff,0_0_20px_#ffffff] animate-pulse delay-900"></div>
          <div className="absolute top-40 right-1/3 w-2 h-2 bg-yellow-300 rounded-full shadow-[0_0_8px_#fde047,0_0_16px_#fde047] animate-pulse delay-1200"></div>
        </>
      )}
      
      {/* Hero Content */}
      <div className="relative z-10 min-h-[60vh] max-h-[90vh] flex flex-col justify-center text-center py-16">
        <div className="mobile-container max-w-6xl mx-auto">
          {/* Label */}
          {label && (
            <div 
              ref={labelRef}
              className="mb-6 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase animate-fade-in"
            >
              {label}
            </div>
          )}
          
          {/* Main Heading - Responsive with proper spacing */}
          <div className="mb-6">
            {titleEffects ? (
              <div className="animate-fade-in">{titleEffects}</div>
            ) : (
              <Typography 
                as="h1" 
                variant={heroVariant}
                className="leading-tight text-crd-white drop-shadow-lg mobile-heading-1 animate-fade-in"
              >
                {title}
              </Typography>
            )}
          </div>

          {/* Tagline - responsive styling */}
          {tagline && (
            <div className="mb-8 animate-fade-in">
              <p className="mobile-body italic text-center font-fredoka text-crd-orange">
                "{tagline}"
              </p>
            </div>
          )}
          
          {/* Description - responsive */}
          <Typography 
            variant="large-body" 
            className="mb-10 text-crd-lightGray max-w-3xl mx-auto mobile-body animate-fade-in"
          >
            {description}
          </Typography>

          {/* CTA Buttons - mobile-first */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Link to={primaryCta.link} className="w-full sm:w-auto">
              <CRDButton 
                size="lg" 
                variant={primaryCta.variant || 'primary'}
                className={`w-full sm:w-auto min-w-[200px] ${primaryCta.className || ''}`}
              >
                {primaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </CRDButton>
            </Link>
            {secondaryCta && (
              <Link to={secondaryCta.link} className="w-full sm:w-auto">
                <CRDButton 
                  variant={secondaryCta.variant || 'outline'} 
                  size="lg" 
                  className={`w-full sm:w-auto min-w-[200px] ${secondaryCta.className || ''}`}
                >
                  {secondaryCta.text}
                </CRDButton>
              </Link>
            )}
          </div>
        </div>
        
        {/* Additional content like carousels */}
        {children && (
          <div className="mt-16">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

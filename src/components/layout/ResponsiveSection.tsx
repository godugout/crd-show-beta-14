
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveSectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  backgroundType?: 'default' | 'stars' | 'gradient';
  snapScroll?: boolean;
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  id,
  children,
  className,
  fullHeight = true,
  backgroundType = 'default',
  snapScroll = false,
}) => {
  const baseClasses = cn(
    'relative w-full',
    fullHeight && 'min-h-screen',
    snapScroll && 'snap-start',
    backgroundType === 'default' && 'bg-crd-darkest',
    backgroundType === 'gradient' && 'bg-space-odyssey',
    className
  );

  return (
    <section id={id} className={baseClasses}>
      {children}
    </section>
  );
};

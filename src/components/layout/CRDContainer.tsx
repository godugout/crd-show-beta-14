import React from 'react';
import { cn } from '@/lib/utils';

interface CRDContainerProps {
  children: React.ReactNode;
  size?: 'full' | 'content' | 'narrow';
  className?: string;
}

export const CRDContainer: React.FC<CRDContainerProps> = ({ 
  children, 
  size = 'content',
  className 
}) => {
  const sizeClasses = {
    full: 'w-full',
    content: 'max-w-[1120px] px-4 md:px-40', // 160px desktop, 16px mobile
    narrow: 'max-w-[736px] px-5 md:px-0', // Hero section width
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

interface CRDSectionProps {
  children: React.ReactNode;
  spacing?: 'none' | 'default' | 'large';
  className?: string;
}

export const CRDSection: React.FC<CRDSectionProps> = ({ 
  children, 
  spacing = 'default',
  className 
}) => {
  const spacingClasses = {
    none: '',
    default: 'py-16 md:py-32', // 64px mobile, 128px desktop
    large: 'py-20 md:py-40', // 80px mobile, 160px desktop
  };

  return (
    <section className={cn(
      spacingClasses[spacing],
      className
    )}>
      {children}
    </section>
  );
};
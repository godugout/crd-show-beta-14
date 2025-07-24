import React from 'react';
import { cn } from '@/lib/utils';

interface ThemedLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'page' | 'section' | 'card';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const layoutVariants = {
  page: 'min-h-screen bg-crd-darkest',
  section: 'card-themed rounded-xl',
  card: 'card-themed rounded-lg'
};

const paddingVariants = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12'
};

export const ThemedLayout: React.FC<ThemedLayoutProps> = ({
  children,
  className,
  variant = 'page',
  padding = 'lg'
}) => {
  return (
    <div className={cn(
      layoutVariants[variant],
      paddingVariants[padding],
      className
    )}>
      {children}
    </div>
  );
};

interface ThemedPageProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthVariants = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full'
};

export const ThemedPage: React.FC<ThemedPageProps> = ({
  children,
  title,
  subtitle,
  className,
  maxWidth = 'xl'
}) => {
  return (
    <ThemedLayout variant="page" className={className}>
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8 pb-8', maxWidthVariants[maxWidth])}>
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h1 className="text-4xl font-bold text-themed-primary mb-4">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-themed-secondary text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </ThemedLayout>
  );
};

interface ThemedSectionProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const ThemedSection: React.FC<ThemedSectionProps> = ({
  children,
  title,
  icon,
  className,
  headerAction
}) => {
  return (
    <ThemedLayout variant="section" padding="none" className={className}>
      {(title || icon || headerAction) && (
        <div className="p-6 border-b border-themed-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <span className="text-themed-primary">{icon}</span>}
            {title && (
              <h3 className="text-themed-primary text-lg font-semibold">
                {title}
              </h3>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </ThemedLayout>
  );
};
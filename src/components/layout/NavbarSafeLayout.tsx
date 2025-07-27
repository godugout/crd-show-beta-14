import React from 'react';

interface NavbarSafeLayoutProps {
  children: React.ReactNode;
  className?: string;
  hero?: boolean; // For full-height hero sections
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NavbarSafeLayout: React.FC<NavbarSafeLayoutProps> = ({
  children,
  className = '',
  hero = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'pt-2',
    md: 'pt-4',
    lg: 'pt-6',
    xl: 'pt-8'
  };

  const baseClasses = hero 
    ? 'hero-section' 
    : `page-container ${paddingClasses[padding]}`;

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

// Utility component for sections that need to be navbar-safe
export const NavbarSafeSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <section className={`absolute-navbar-safe ${className}`}>
      {children}
    </section>
  );
}; 
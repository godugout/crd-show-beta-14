import React from 'react';
import { useLocation } from 'react-router-dom';

interface NavbarAwareContainerProps {
  children: React.ReactNode;
  className?: string;
  ignoreNavbar?: boolean;
}

export const NavbarAwareContainer: React.FC<NavbarAwareContainerProps> = ({ 
  children, 
  className = '',
  ignoreNavbar = false 
}) => {
  const location = useLocation();
  
  // Determine if we're on a route that needs navbar spacing
  const isStudioRoute = location.pathname.startsWith('/studio');
  const isCRDEditorRoute = location.pathname === '/create/crd';
  
  // Apply navbar spacing only if:
  // 1. Not explicitly ignoring navbar
  // 2. Not on studio route or CRD editor route (they handle their own spacing)
  // 3. Has potential for navbar to be visible
  const shouldApplyNavbarSpacing = !ignoreNavbar && !isStudioRoute && !isCRDEditorRoute;
  
  const navbarSpacingClass = shouldApplyNavbarSpacing 
    ? 'pt-[var(--navbar-height)] transition-all duration-300 ease-in-out' 
    : '';
  
  return (
    <div className={`${navbarSpacingClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/collections') {
      return location.pathname === path || location.pathname.startsWith('/collections');
    }
    return location.pathname === path;
  };
  
  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-6">
      <Link 
        to="/" 
        className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center nav-hover-enhanced ${
          isActive('/') 
            ? 'text-themed-active bg-crd-mediumGray/20 border-l-3 border-crd-blue pl-3' 
            : 'text-themed-secondary'
        }`}
      >
        <span className="hidden lg:inline">Home</span>
        <span className="lg:hidden">H</span>
      </Link>
      <Link 
        to="/studio/demo" 
        className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center nav-hover-enhanced ${
          location.pathname.startsWith('/studio') 
            ? 'text-themed-active bg-crd-mediumGray/20 border-l-3 border-crd-blue pl-3' 
            : 'text-themed-secondary'
        }`}
      >
        <span className="hidden lg:inline">Studio</span>
        <span className="lg:hidden">S</span>
      </Link>
      <Link 
        to="/collections" 
        className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center nav-hover-enhanced ${
          isActive('/collections') 
            ? 'text-themed-active bg-crd-mediumGray/20 border-l-3 border-crd-blue pl-3' 
            : 'text-themed-secondary'
        }`}
      >
        <span className="hidden lg:inline">Collections</span>
        <span className="lg:hidden">C</span>
      </Link>
      <Link 
        to="/creators" 
        className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center nav-hover-enhanced ${
          isActive('/creators') 
            ? 'text-themed-active bg-crd-mediumGray/20 border-l-3 border-crd-blue pl-3' 
            : 'text-themed-secondary'
        }`}
      >
        <span className="hidden xl:inline">Creators</span>
        <span className="xl:hidden">Cr</span>
      </Link>
    </div>
  );
};

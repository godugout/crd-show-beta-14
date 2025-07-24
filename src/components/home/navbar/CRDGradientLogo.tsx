import React from 'react';

interface CRDGradientLogoProps {
  className?: string;
}

export const CRDGradientLogo: React.FC<CRDGradientLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center relative ${className}`}>
      <img 
        src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
        alt="CRD"
        className="h-20 w-auto"
      />
      <span className="text-lg font-orbitron font-semibold text-themed-active-subdued tracking-wider relative z-10 -ml-2 translate-y-0.5 transition-colors duration-300 drop-shadow-sm">
        MKR
      </span>
    </div>
  );
};
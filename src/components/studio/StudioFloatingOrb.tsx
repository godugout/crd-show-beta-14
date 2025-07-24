import React from 'react';
import { Sparkles } from 'lucide-react';

interface StudioFloatingOrbProps {
  onClick: () => void;
}

export const StudioFloatingOrb: React.FC<StudioFloatingOrbProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-crd-blue to-crd-purple shadow-lg shadow-crd-blue/25 hover:shadow-xl hover:shadow-crd-purple/35 transition-all duration-300 flex items-center justify-center group hover:scale-105"
    >
      {/* Main orb content */}
      <div className="relative z-10 flex items-center justify-center">
        <Sparkles 
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" 
        />
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Open 3D Studio
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black/80 rotate-45" />
      </div>
    </button>
  );
};
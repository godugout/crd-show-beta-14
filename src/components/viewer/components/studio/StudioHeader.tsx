
import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface StudioHeaderProps {
  onClose: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({ onClose }) => {
  return (
    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between min-h-[3.5rem]">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-crd-green flex-shrink-0" />
        <h2 className="text-lg font-semibold text-white leading-none">Studio</h2>
      </div>
      <button 
        onClick={onClose}
        className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors flex-shrink-0"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

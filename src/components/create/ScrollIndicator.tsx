
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  isVisible?: boolean;
  className?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ 
  isVisible = true, 
  className = '' 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`flex justify-center pointer-events-none ${className}`}>
      <div className="flex flex-col items-center relative">
        {/* Static arrows - darkest to lightest */}
        <ChevronDown 
          className="w-6 h-6 text-gray-600 -mb-3" 
          strokeWidth={2}
        />
        <ChevronDown 
          className="w-6 h-6 text-gray-500 -mb-3" 
          strokeWidth={2}
        />
        <ChevronDown 
          className="w-6 h-6 text-gray-400 -mb-3" 
          strokeWidth={2}
        />
        <ChevronDown 
          className="w-6 h-6 text-gray-300" 
          strokeWidth={2}
        />
        
        {/* Animated orange arrow */}
        <ChevronDown 
          className="w-6 h-6 text-crd-orange absolute top-2 animate-[slideDown_1.5s_ease-in-out_infinite]" 
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

import React from 'react';

interface CRDBottomInfoBarProps {
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
}

export const CRDBottomInfoBar: React.FC<CRDBottomInfoBarProps> = ({
  selectedTemplate,
  colorPalette,
  effects
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 bg-crd-darker/80 backdrop-blur-sm border border-crd-mediumGray/30 rounded-lg shadow-lg">
      <div className="px-6 py-3 flex items-center gap-3">
        {/* Template Tag */}
        <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium">
          Template: {selectedTemplate || 'None'}
        </div>
        
        {/* Colors Tag */}
        <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium">
          Colors: {colorPalette || 'Default'}
        </div>
        
        {/* Effects Tag */}
        <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium">
          Effects: {effects.length > 0 ? effects.join(', ') : 'None'}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-crd-mediumGray/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300 text-xs font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
};
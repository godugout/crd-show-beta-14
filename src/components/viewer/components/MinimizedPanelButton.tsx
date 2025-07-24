
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MinimizedPanelButtonProps {
  currentLayout: 'original' | 'minimalist';
  onRestore: () => void;
}

export const MinimizedPanelButton: React.FC<MinimizedPanelButtonProps> = ({
  currentLayout,
  onRestore
}) => {
  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
      <Button
        onClick={onRestore}
        className="bg-black bg-opacity-90 hover:bg-opacity-100 backdrop-blur-lg border border-white/20 px-3 py-6 rounded-l-lg rounded-r-none shadow-lg transition-all duration-200 hover:scale-105"
        title={`Restore Studio (${currentLayout === 'original' ? 'Tabbed' : 'Scrolling'} layout)`}
      >
        <div className="flex flex-col items-center space-y-1">
          <Sparkles className="w-5 h-5 text-crd-green" />
          <div className="text-xs text-white font-medium writing-mode-vertical transform -rotate-90 whitespace-nowrap">
            Studio
          </div>
        </div>
      </Button>
    </div>
  );
};

import React from 'react';
import { Layers } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface PSDModeIndicatorProps {
  psdFileName?: string;
  layerCount: number;
  onExit: () => void;
}

export const PSDModeIndicator: React.FC<PSDModeIndicatorProps> = ({
  psdFileName,
  layerCount,
  onExit
}) => {
  return (
    <div className="bg-crd-blue/90 backdrop-blur-sm border border-crd-blue/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
      <Layers className="w-4 h-4 text-white" />
      <div className="text-white text-sm">
        <span className="font-medium">PSD Mode</span>
        {psdFileName && (
          <span className="ml-2 opacity-80">
            {psdFileName} • {layerCount} layers
          </span>
        )}
      </div>
      <CRDButton
        variant="outline"
        size="sm"
        onClick={onExit}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-2 py-1 h-6 ml-2"
      >
        Exit
      </CRDButton>
    </div>
  );
};
import React from 'react';
import { PSDLayerController } from '../psd/PSDLayerController';
import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';

interface PSDModeRightSidebarProps {
  layers: PSDLayer[];
  visibleLayers: Set<string>;
  selectedLayer?: string | null;
  layerOpacity: Map<string, number>;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerSelect: (layerId: string | null) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onLayerDelete?: (layerId: string) => void;
  onLayerDuplicate?: (layerId: string) => void;
  onApplyToCanvas: () => void;
  onGenerateCard: () => void;
}

export const PSDModeRightSidebar: React.FC<PSDModeRightSidebarProps> = (props) => {
  return (
    <div className="h-full">
      <PSDLayerController {...props} />
    </div>
  );
};
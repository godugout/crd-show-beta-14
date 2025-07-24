
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { PresetSelector } from './slab/config/PresetSelector';
import { TrophyPlaqueConfig } from './slab/config/TrophyPlaqueConfig';
import { MuseumDisplayConfig } from './slab/config/MuseumDisplayConfig';
import { GradedSlabConfig } from './slab/config/GradedSlabConfig';

export interface SlabPresetConfig {
  type: 'none' | 'toploader' | 'onestouch' | 'graded' | 'trophy' | 'museum';
  
  // Basic config
  thickness?: number;
  material?: string;
  color?: string;
  opacity?: number;
  texture?: string;
  hasCase?: boolean;
  caseColor?: string;
  embedStyle?: 'flush' | 'raised' | 'recessed';

  // Additional properties for ProtectiveCase
  tint?: string;
  tintOpacity?: number;
  certNumber?: string;

  // Custom layers
  layers?: any[];
  
  // Trophy Plaque specific options
  woodType?: 'oak' | 'walnut' | 'cherry' | 'mahogany';
  engraving?: string;
  
  // Museum Display specific options
  standMaterial?: 'metal' | 'acrylic';
  autoRotate?: boolean;
}

interface SlabPresetsProps {
  config: SlabPresetConfig;
  onConfigChange: (config: SlabPresetConfig) => void;
  className?: string;
}

export const SlabPresets: React.FC<SlabPresetsProps> = ({ 
  config, 
  onConfigChange, 
  className 
}) => {
  const handlePresetSelect = (type: SlabPresetConfig['type']) => {
    let newConfig: SlabPresetConfig = { type };

    switch (type) {
      case 'toploader':
        newConfig = { type: 'toploader' };
        break;
      case 'onestouch':
        newConfig = { type: 'onestouch' };
        break;
      case 'graded':
        newConfig = {
          type: 'graded',
          thickness: 0.2,
          material: 'acrylic',
          color: '#ffffff',
          opacity: 0.2,
          hasCase: true,
          caseColor: '#000000',
          embedStyle: 'flush',
          layers: []
        };
        break;
      case 'trophy':
        newConfig = {
          type: 'trophy',
          woodType: 'walnut',
          engraving: 'PREMIUM COLLECTION'
        };
        break;
      case 'museum':
        newConfig = {
          type: 'museum',
          standMaterial: 'metal',
          autoRotate: true
        };
        break;
      default:
        break;
    }

    onConfigChange(newConfig);
  };

  return (
    <Card className={`bg-gray-900 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-100">
          <Package className="w-5 h-5" />
          Card Protection & Display
        </CardTitle>
        <CardDescription className="text-gray-300">
          Choose how to showcase your card - from basic protection to premium displays
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PresetSelector config={config} onPresetSelect={handlePresetSelect} />

        {config.type === 'trophy' && (
          <TrophyPlaqueConfig config={config} onConfigChange={onConfigChange} />
        )}

        {config.type === 'museum' && (
          <MuseumDisplayConfig config={config} onConfigChange={onConfigChange} />
        )}

        {config.type === 'graded' && (
          <GradedSlabConfig config={config} onConfigChange={onConfigChange} />
        )}
      </CardContent>
    </Card>
  );
};

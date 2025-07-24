
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import type { TeamColorScheme } from './TeamColors';

interface SelectedColorInfoProps {
  selectedColorScheme: TeamColorScheme;
}

export const SelectedColorInfo = ({ selectedColorScheme }: SelectedColorInfoProps) => {
  return (
    <div className="mt-3 pt-3 border-t border-crd-mediumGray/20 bg-crd-mediumGray/10 rounded-lg p-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-crd-white text-xs font-medium">Selected: {selectedColorScheme.name}</span>
          <Info className="w-3 h-3 text-crd-lightGray" />
        </div>
        <div className="flex gap-2">
          <Badge 
            variant="outline" 
            className="text-crd-lightGray border-crd-mediumGray/30"
            style={{ borderColor: selectedColorScheme.primary, color: selectedColorScheme.primary }}
          >
            Primary
          </Badge>
          <Badge 
            variant="outline" 
            className="text-crd-lightGray border-crd-mediumGray/30"
            style={{ borderColor: selectedColorScheme.secondary, color: selectedColorScheme.secondary }}
          >
            Secondary
          </Badge>
          <Badge 
            variant="outline" 
            className="text-crd-lightGray border-crd-mediumGray/30"
            style={{ borderColor: selectedColorScheme.accent, color: selectedColorScheme.accent }}
          >
            Accent
          </Badge>
        </div>
      </div>
    </div>
  );
};

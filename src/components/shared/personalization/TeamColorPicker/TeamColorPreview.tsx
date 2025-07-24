import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import type { TeamColorScheme } from './types';

interface TeamColorPreviewProps {
  selectedColorScheme: TeamColorScheme;
  showBadges?: boolean;
  size?: 'compact' | 'default' | 'large';
  className?: string;
}

export const TeamColorPreview = ({ 
  selectedColorScheme, 
  showBadges = true, 
  size = 'default',
  className = ""
}: TeamColorPreviewProps) => {
  const sizeClasses = {
    compact: 'p-2 text-xs',
    default: 'p-3 text-xs',
    large: 'p-4 text-sm'
  };

  const badgeSize = {
    compact: 'text-xs px-1 py-0.5',
    default: 'text-xs px-2 py-1',
    large: 'text-sm px-3 py-1.5'
  };

  return (
    <div className={`mt-3 pt-3 border-t border-themed-secondary/20 bg-themed-primary/5 rounded-lg ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-themed-primary font-medium">
            Selected: {selectedColorScheme.name}
          </span>
          <Info className="w-3 h-3 text-themed-secondary" />
        </div>
        {showBadges && (
          <div className="flex gap-2">
            <Badge 
              variant="outline" 
              className={`text-themed-secondary border-themed-secondary/30 ${badgeSize[size]}`}
              style={{ borderColor: selectedColorScheme.primary, color: selectedColorScheme.primary }}
            >
              Primary
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-themed-secondary border-themed-secondary/30 ${badgeSize[size]}`}
              style={{ borderColor: selectedColorScheme.secondary, color: selectedColorScheme.secondary }}
            >
              Secondary
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-themed-secondary border-themed-secondary/30 ${badgeSize[size]}`}
              style={{ borderColor: selectedColorScheme.accent, color: selectedColorScheme.accent }}
            >
              Accent
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
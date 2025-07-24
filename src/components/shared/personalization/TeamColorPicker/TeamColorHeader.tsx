import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import type { TeamColorScheme } from './types';

interface TeamColorHeaderProps {
  selectedColorScheme?: TeamColorScheme;
  title?: string;
  showIcon?: boolean;
  className?: string;
}

export const TeamColorHeader = ({ 
  selectedColorScheme, 
  title = "Team Colors",
  showIcon = true,
  className = ""
}: TeamColorHeaderProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Palette className="w-4 h-4 text-themed-primary" />}
      <CardTitle className="text-themed-primary text-sm">{title}</CardTitle>
      {selectedColorScheme && (
        <span className="text-themed-secondary text-xs ml-2">
          ({selectedColorScheme.name})
        </span>
      )}
    </div>
  );
};
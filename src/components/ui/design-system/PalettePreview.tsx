import React from 'react';
import { type TeamPalette } from '@/lib/teamPalettes';

interface PalettePreviewProps {
  palette: TeamPalette | null;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export const PalettePreview = ({ 
  palette, 
  size = 'md',
  showLabels = false,
  className = ''
}: PalettePreviewProps) => {
  // Early return if palette is null
  if (!palette) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
        <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
        <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
        <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const containerClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  return (
    <div className={`flex items-center ${containerClasses[size]} ${className}`}>
      {/* Primary Color */}
      <div 
        className={`${sizeClasses[size]} rounded-full border border-white/20 shadow-sm`}
        style={{ backgroundColor: palette.colors.primary }}
        title={showLabels ? `Primary: ${palette.colors.primary}` : undefined}
      />
      
      {/* Secondary Color */}
      <div 
        className={`${sizeClasses[size]} rounded-full border border-white/20 shadow-sm`}
        style={{ backgroundColor: palette.colors.secondary }}
        title={showLabels ? `Secondary: ${palette.colors.secondary}` : undefined}
      />
      
      {/* Accent Color */}
      <div 
        className={`${sizeClasses[size]} rounded-full border border-white/20 shadow-sm`}
        style={{ backgroundColor: palette.colors.accent }}
        title={showLabels ? `Accent: ${palette.colors.accent}` : undefined}
      />
      
      {/* Neutral Color */}
      <div 
        className={`${sizeClasses[size]} rounded-full border border-white/20 shadow-sm`}
        style={{ backgroundColor: palette.colors.neutral }}
        title={showLabels ? `Neutral: ${palette.colors.neutral}` : undefined}
      />
      
      {showLabels && size === 'lg' && (
        <div className="ml-2 text-xs space-y-1">
          <div className="text-themed-primary font-medium">{palette.name}</div>
          <div className="text-themed-secondary">{palette.description}</div>
        </div>
      )}
    </div>
  );
};
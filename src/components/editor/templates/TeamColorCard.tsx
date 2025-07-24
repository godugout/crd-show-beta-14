
import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ColorTheme } from '@/hooks/useColorThemes';

interface TeamColorCardProps {
  theme: ColorTheme;
  isSelected: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
  onColorsChange?: (rotatedTheme: ColorTheme) => void;
}

export const TeamColorCard = ({
  theme,
  isSelected,
  isHovered,
  onHover,
  onLeave,
  onSelect,
  onColorsChange
}: TeamColorCardProps) => {
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const firstTeam = theme.teams?.[0];
  const displayName = firstTeam?.abbreviation?.toUpperCase() || theme.primary_example_team;

  // Create rotated color array
  const colors = [theme.primary_color, theme.secondary_color, theme.accent_color];
  const rotateColors = () => {
    setIsRotating(true);
    
    setTimeout(() => {
      const newRotationIndex = (rotationIndex + 1) % colors.length;
      setRotationIndex(newRotationIndex);
      
      // Create rotated theme and notify parent
      if (onColorsChange) {
        const rotatedColors = [...colors];
        for (let i = 0; i < newRotationIndex; i++) {
          rotatedColors.push(rotatedColors.shift()!);
        }
        
        const rotatedTheme = {
          ...theme,
          primary_color: rotatedColors[0],
          secondary_color: rotatedColors[1],
          accent_color: rotatedColors[2]
        };
        
        onColorsChange(rotatedTheme);
      }
      
      setIsRotating(false);
    }, 150);
  };

  // Get colors in current rotation order
  const getRotatedColors = () => {
    const rotated = [...colors];
    for (let i = 0; i < rotationIndex; i++) {
      rotated.push(rotated.shift()!);
    }
    return rotated;
  };

  const [primary, secondary, accent] = getRotatedColors();

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 relative team-spirit-glow ${
        isSelected
          ? 'border-themed-strong bg-themed-light shadow-lg'
          : 'border-themed-light hover:border-themed-strong hover:bg-themed-subtle'
      }`}
    >
      {/* Team Name and Rotation Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-themed-primary text-sm font-medium truncate">
          {displayName}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            rotateColors();
          }}
          className={`p-1 rounded-full bg-themed-medium hover:bg-themed-strong transition-all duration-200 flex-shrink-0 ml-2 team-spirit-glow ${
            isRotating ? 'animate-spin' : ''
          }`}
          title="Rotate colors"
          disabled={isRotating}
        >
          <RotateCcw className="w-4 h-4 text-themed-primary hover:text-themed-text-primary transition-colors" />
        </button>
      </div>

      {/* Color Pills with rotation animation */}
      <div className={`flex items-center justify-center gap-2 transition-all duration-300 ${
        isRotating ? 'scale-110 rotate-12' : ''
      }`}>
        <div 
          className="w-4 h-4 rounded-full border border-white/20 transition-all duration-300" 
          style={{ backgroundColor: primary }}
        />
        <div 
          className="w-4 h-4 rounded-full border border-white/20 transition-all duration-300" 
          style={{ backgroundColor: secondary }}
        />
        <div 
          className="w-4 h-4 rounded-full border border-white/20 transition-all duration-300" 
          style={{ backgroundColor: accent }}
        />
      </div>
      
      {/* Enhanced hover tooltip with team spirit theming */}
      {isHovered && theme.teams && theme.teams.length > 0 && (
        <div className="absolute z-10 bottom-full left-0 mb-2 p-3 card-themed rounded-lg shadow-2xl min-w-48 hover-glow">
          <div className="text-themed-primary text-xs font-medium mb-2">
            {theme.name}
          </div>
          <div className="flex flex-wrap gap-1">
            {theme.teams.map((team) => (
              <span
                key={team.id}
                className="badge-themed-secondary text-xs px-2 py-1 rounded-md"
              >
                {team.abbreviation}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

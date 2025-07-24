
import React from 'react';
import { TeamColorCard } from './TeamColorCard';
import type { ColorTheme } from '@/hooks/useColorThemes';
import type { TeamColorScheme } from './TeamColors';

interface TeamColorGridProps {
  themes: ColorTheme[];
  selectedColorScheme?: TeamColorScheme;
  hoveredTheme: string | null;
  onThemeHover: (themeId: string | null) => void;
  onThemeSelect: (theme: ColorTheme) => void;
  onColorsChange?: (rotatedTheme: ColorTheme) => void;
}

export const TeamColorGrid = ({
  themes,
  selectedColorScheme,
  hoveredTheme,
  onThemeHover,
  onThemeSelect,
  onColorsChange
}: TeamColorGridProps) => {
  if (themes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-crd-lightGray text-sm">
          No teams available for this sport
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {themes.map((theme) => (
        <TeamColorCard
          key={theme.id}
          theme={theme}
          isSelected={selectedColorScheme?.id === theme.id}
          isHovered={hoveredTheme === theme.id}
          onHover={() => onThemeHover(theme.id)}
          onLeave={() => onThemeHover(null)}
          onSelect={() => onThemeSelect(theme)}
          onColorsChange={onColorsChange}
        />
      ))}
    </div>
  );
};

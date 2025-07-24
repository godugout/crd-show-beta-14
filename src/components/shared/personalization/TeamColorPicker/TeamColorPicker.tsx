import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useColorThemes } from '@/hooks/useColorThemes';
import { TeamColorHeader } from './TeamColorHeader';
import { TeamColorTabs } from '@/components/editor/templates/TeamColorTabs';
import { TeamColorPreview } from './TeamColorPreview';
import { convertColorThemeToScheme } from './types';
import type { 
  ColorTheme, 
  TeamColorScheme, 
  TeamColorPickerConfig, 
  TeamColorPickerEvents 
} from './types';

interface TeamColorPickerProps extends TeamColorPickerConfig, TeamColorPickerEvents {
  selectedColorScheme?: TeamColorScheme;
  headerTitle?: string;
}

export const TeamColorPicker = ({ 
  selectedColorScheme,
  headerTitle,
  showHeader = true,
  showPreview = true,
  showSportTabs = true,
  allowRotation = true,
  size = 'default',
  outputFormat = 'scheme',
  defaultSport = 'baseball',
  className = "",
  onThemeSelect,
  onSchemeSelect,
  onColorsChange,
  onSportChange
}: TeamColorPickerProps) => {
  const { colorThemes, loading, error } = useColorThemes();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(defaultSport);

  // Group themes by sport, excluding cricket
  const themesBySport = useMemo(() => {
    const grouped = colorThemes.reduce((acc, theme) => {
      const teams = theme.teams || [];
      
      if (teams.length === 0) {
        // Default to baseball for themes without teams
        if (!acc.baseball) acc.baseball = [];
        acc.baseball.push(theme);
      } else {
        teams.forEach(team => {
          const sport = team.sport.toLowerCase();
          // Skip cricket teams
          if (sport === 'cricket') return;
          
          if (!acc[sport]) acc[sport] = [];
          // Only add theme once per sport to avoid duplicates
          if (!acc[sport].find(t => t.id === theme.id)) {
            acc[sport].push(theme);
          }
        });
      }
      
      return acc;
    }, {} as Record<string, ColorTheme[]>);
    
    // Ensure we have the expected sports
    const expectedSports = ['baseball', 'basketball', 'football', 'hockey', 'soccer'];
    expectedSports.forEach(sport => {
      if (!grouped[sport]) grouped[sport] = [];
    });
    
    return grouped;
  }, [colorThemes]);

  // Set default active tab to first sport with themes
  React.useEffect(() => {
    const sportsWithThemes = Object.keys(themesBySport).filter(sport => 
      themesBySport[sport].length > 0
    );
    if (sportsWithThemes.length > 0 && !sportsWithThemes.includes(activeTab)) {
      setActiveTab(sportsWithThemes[0]);
    }
  }, [themesBySport, activeTab]);

  const handleThemeSelect = (theme: ColorTheme) => {
    const scheme = convertColorThemeToScheme(theme);
    
    // Call appropriate callbacks based on output format
    if (outputFormat === 'theme' && onThemeSelect) {
      onThemeSelect(theme);
    } else if (outputFormat === 'scheme' && onSchemeSelect) {
      onSchemeSelect(scheme);
    } else if (outputFormat === 'both') {
      onThemeSelect?.(theme);
      onSchemeSelect?.(scheme);
    }

    // Emit color change event
    if (onColorsChange) {
      onColorsChange({
        primary: theme.primary_color,
        secondary: theme.secondary_color,
        accent: theme.accent_color,
        text: theme.text_color
      });
    }
  };

  const handleColorsChange = (rotatedTheme: ColorTheme) => {
    // If this is the currently selected theme, update it
    if (selectedColorScheme && selectedColorScheme.id === rotatedTheme.id) {
      handleThemeSelect(rotatedTheme);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onSportChange?.(tab);
  };

  const containerSizeClasses = {
    compact: 'text-xs',
    default: 'text-sm',
    large: 'text-base'
  };

  if (loading) {
    return (
      <Card className={`bg-themed-primary/5 border-themed-secondary/20 ${containerSizeClasses[size]} ${className}`}>
        {showHeader && (
          <CardHeader className="pb-3">
            <TeamColorHeader title={headerTitle} />
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-themed-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-themed-primary/5 border-themed-secondary/20 ${containerSizeClasses[size]} ${className}`}>
        {showHeader && (
          <CardHeader className="pb-3">
            <TeamColorHeader title={headerTitle} />
          </CardHeader>
        )}
        <CardContent>
          <div className="text-themed-secondary">
            Failed to load color themes. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-themed-primary/5 border-themed-secondary/20 ${containerSizeClasses[size]} ${className}`}>
      {showHeader && (
        <CardHeader className="pb-3">
          <TeamColorHeader 
            selectedColorScheme={selectedColorScheme} 
            title={headerTitle}
          />
          <p className="text-themed-secondary text-xs">
            Choose from professional sports team color schemes
          </p>
        </CardHeader>
      )}
      <CardContent>
        {showSportTabs ? (
          <TeamColorTabs
            themesBySport={themesBySport}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedColorScheme={selectedColorScheme}
            hoveredTheme={hoveredTheme}
            onThemeHover={setHoveredTheme}
            onThemeSelect={handleThemeSelect}
            onColorsChange={allowRotation ? handleColorsChange : undefined}
          />
        ) : (
          // If no tabs, show all themes in a single grid
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {colorThemes.map((theme) => (
              <div key={theme.id} onClick={() => handleThemeSelect(theme)}>
                {/* Basic theme card would go here */}
              </div>
            ))}
          </div>
        )}
        
        {showPreview && selectedColorScheme && (
          <TeamColorPreview 
            selectedColorScheme={selectedColorScheme} 
            size={size}
          />
        )}
      </CardContent>
    </Card>
  );
};
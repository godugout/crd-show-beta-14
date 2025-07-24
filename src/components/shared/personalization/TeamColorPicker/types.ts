export interface ColorTheme {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  quaternary_color?: string; // 4th complementary color
  primary_example_team: string;
  teams?: Team[];
}

export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  league: string;
  sport: string;
}

// Legacy interface for backward compatibility
export interface TeamColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  quaternary?: string; // 4th complementary color
}

// Configuration interface for the picker
export interface TeamColorPickerConfig {
  showHeader?: boolean;
  showPreview?: boolean;
  showSportTabs?: boolean;
  allowRotation?: boolean;
  size?: 'compact' | 'default' | 'large';
  outputFormat?: 'theme' | 'scheme' | 'both';
  defaultSport?: string;
  maxSelection?: number;
  className?: string;
}

// Event interfaces
export interface TeamColorPickerEvents {
  onThemeSelect?: (theme: ColorTheme) => void;
  onSchemeSelect?: (scheme: TeamColorScheme) => void;
  onColorsChange?: (colors: { primary: string; secondary: string; accent: string; text: string; quaternary?: string }) => void;
  onSportChange?: (sport: string) => void;
}

// Convert database color theme to legacy format
export const convertColorThemeToScheme = (theme: ColorTheme): TeamColorScheme => ({
  id: theme.id,
  name: theme.name,
  primary: theme.primary_color,
  secondary: theme.secondary_color,
  accent: theme.accent_color,
  text: theme.text_color,
  quaternary: theme.quaternary_color
});

// Convert scheme back to theme format
export const convertSchemeToColorTheme = (scheme: TeamColorScheme): Partial<ColorTheme> => ({
  id: scheme.id,
  name: scheme.name,
  primary_color: scheme.primary,
  secondary_color: scheme.secondary,
  accent_color: scheme.accent,
  text_color: scheme.text,
  quaternary_color: scheme.quaternary
});
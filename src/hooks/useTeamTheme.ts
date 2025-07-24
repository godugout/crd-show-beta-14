import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  allPalettes, 
  getPaletteById, 
  generatePaletteCSSVars, 
  createPaletteFromTeamColors,
  type TeamPalette 
} from '@/lib/teamPalettes';
import { allProfessionalSportsTeams } from '@/lib/professionalSportsThemes';
import { generateLogoThemes, getThemeByDNA } from '@/lib/logoThemes';

interface ColorTheme {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  primary_example_team: string;
}

export const useTeamTheme = () => {
  const [currentPalette, setCurrentPalette] = useState<TeamPalette | null>(null);
  const [availablePalettes, setAvailablePalettes] = useState<TeamPalette[]>(allPalettes);
  const [databaseThemes, setDatabaseThemes] = useState<ColorTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLogoCode, setCurrentLogoCode] = useState<string | null>(null);
  const [customHeaderColor, setCustomHeaderColor] = useState<string | null>(null);
  const [customHeaderColorType, setCustomHeaderColorType] = useState<string | null>(null);
  const [isHomeTeamMode, setIsHomeTeamMode] = useState<boolean>(false);

  // Load database color themes and logo themes
  const loadDatabaseThemes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('color_themes')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading color themes:', error);
        return;
      }

      // Generate logo-based themes
      const logoThemes = generateLogoThemes();

      if (data) {
        setDatabaseThemes(data);
        
        // Convert database themes to TeamPalette format
        const dbPalettes = data.map(theme => 
          createPaletteFromTeamColors(
            theme.name,
            theme.primary_color,
            theme.secondary_color,
            theme.accent_color
          )
        );
        
        // Combine with static palettes, logo themes, and sports teams
        setAvailablePalettes([...allPalettes, ...dbPalettes, ...logoThemes, ...allProfessionalSportsTeams]);
      } else {
      // Just use static, logo themes, and sports teams if no database themes
      setAvailablePalettes([...allPalettes, ...logoThemes, ...allProfessionalSportsTeams]);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      // Fallback to static, logo themes, and sports teams
      const logoThemes = generateLogoThemes();
      setAvailablePalettes([...allPalettes, ...logoThemes, ...allProfessionalSportsTeams]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply theme CSS variables to document
  const applyTheme = useCallback((palette: TeamPalette) => {
    const cssVars = generatePaletteCSSVars(palette);
    const root = document.documentElement;
    
    // Apply all CSS variables
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Also update Shadcn CSS variables for proper UI theming
    const primary = palette.colors.primary;
    const secondary = palette.colors.secondary;
    const accent = palette.colors.accent;
    
    // Helper function to convert hex to HSL string
    const hexToHsl = (hex: string): string => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    
    // Convert colors to HSL and update Shadcn variables
    root.style.setProperty('--primary', hexToHsl(primary));
    root.style.setProperty('--accent', hexToHsl(accent));
    root.style.setProperty('--ring', hexToHsl(accent));
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', palette.id);
    
    setCurrentPalette(palette);
    console.log(`Theme applied: ${palette.name} (${palette.id})`);
  }, []);

  // Set theme by ID with enhanced fallback
  const setTheme = useCallback((themeId: string) => {
    const palette = getPaletteById(themeId) || 
                   availablePalettes.find(p => p.id === themeId);
    
    if (palette) {
      applyTheme(palette);
      // Save to localStorage for persistence
      localStorage.setItem('crd-theme', themeId);
      console.log(`Applied theme: ${themeId}`);
    } else {
      console.warn(`Theme not found: ${themeId}. Available themes:`, availablePalettes.map(p => p.id));
      // Fallback to default theme
      const fallbackPalette = allPalettes.find(p => p.id === 'cardshow-basic') || allPalettes[0];
      if (fallbackPalette) {
        console.log(`Using fallback theme: ${fallbackPalette.id}`);
        applyTheme(fallbackPalette);
        localStorage.setItem('crd-theme', fallbackPalette.id);
      }
    }
  }, [availablePalettes, applyTheme]);

  // Reset to default theme
  const resetToDefault = useCallback(() => {
    const defaultPalette = allPalettes[0]; // SF Orange
    applyTheme(defaultPalette);
    localStorage.removeItem('crd-theme');
  }, [applyTheme]);

  // Get theme preview (without applying)
  const getThemePreview = useCallback((themeId: string) => {
    return getPaletteById(themeId) || 
           availablePalettes.find(p => p.id === themeId);
  }, [availablePalettes]);

  // Generate CSS variables for a specific theme (for preview)
  const getThemeCSSVars = useCallback((themeId: string) => {
    const palette = getThemePreview(themeId);
    return palette ? generatePaletteCSSVars(palette) : {};
  }, [getThemePreview]);

  // Initialize theme on mount
  useEffect(() => {
    loadDatabaseThemes();
  }, [loadDatabaseThemes]);

  // Logo-specific theme functions
  const setLogoTheme = useCallback((dnaCode: string) => {
    const logoTheme = getThemeByDNA(dnaCode);
    if (logoTheme) {
      applyTheme(logoTheme);
      setCurrentLogoCode(dnaCode);
      localStorage.setItem('crd-theme', logoTheme.id);
      localStorage.setItem('crd-logo-code', dnaCode);
      console.log(`Applied logo theme: ${dnaCode} -> ${logoTheme.id}`);
    } else {
      console.warn(`Logo theme not found for DNA code: ${dnaCode}`);
    }
  }, [applyTheme]);

  // Load saved theme after palettes are available
  useEffect(() => {
    if (availablePalettes.length > 0 && !isLoading) {
      const savedTheme = localStorage.getItem('crd-theme');
      const savedLogoCode = localStorage.getItem('crd-logo-code');
      const savedHeaderColor = localStorage.getItem('crd-custom-header-color');
      const savedHeaderColorType = localStorage.getItem('crd-custom-header-color-type');
      const savedHomeTeamMode = localStorage.getItem('crd-home-team-mode') === 'true';
      
      // Restore custom header color first (before applying theme)
      if (savedHeaderColor && savedHeaderColorType) {
        setCustomHeaderColor(savedHeaderColor);
        setCustomHeaderColorType(savedHeaderColorType);
      }
      
      // Restore home team mode
      setIsHomeTeamMode(savedHomeTeamMode);
      
      // Apply theme based on priority: logo theme > saved theme > default
      if (savedLogoCode) {
        const logoTheme = getThemeByDNA(savedLogoCode);
        if (logoTheme) {
          applyTheme(logoTheme);
          setCurrentLogoCode(savedLogoCode);
        }
      } else if (savedTheme) {
        const palette = getPaletteById(savedTheme) || availablePalettes.find(p => p.id === savedTheme);
        if (palette) {
          applyTheme(palette);
        }
      } else {
        // Apply default theme
        const defaultPalette = allPalettes.find(p => p.id === 'cardshow-basic') || allPalettes[0];
        if (defaultPalette) {
          applyTheme(defaultPalette);
        }
      }
    }
  }, [availablePalettes, isLoading, applyTheme]);

  // Get current logo information
  const getCurrentLogo = useCallback(() => {
    if (!currentLogoCode) return null;
    return getThemeByDNA(currentLogoCode);
  }, [currentLogoCode]);

  // Custom header color functions - simplified to just store the color
  const setCustomHeaderBgColor = useCallback((color: string, colorType: string) => {
    setCustomHeaderColor(color);
    setCustomHeaderColorType(colorType);
    
    // Save to localStorage
    localStorage.setItem('crd-custom-header-color', color);
    localStorage.setItem('crd-custom-header-color-type', colorType);
    
    console.log(`Custom header color set: ${colorType} - ${color}`);
  }, []);
  
  const clearCustomHeaderColor = useCallback(() => {
    setCustomHeaderColor(null);
    setCustomHeaderColorType(null);
    localStorage.removeItem('crd-custom-header-color');
    localStorage.removeItem('crd-custom-header-color-type');
    console.log('Custom header color cleared');
  }, []);

  // Home team mode functions
  const toggleHomeTeamMode = useCallback(() => {
    const newMode = !isHomeTeamMode;
    setIsHomeTeamMode(newMode);
    localStorage.setItem('crd-home-team-mode', newMode.toString());
    console.log(`Home team mode ${newMode ? 'enabled' : 'disabled'}`);
  }, [isHomeTeamMode]);

  // Set theme and clear logo tracking for non-logo themes
  const setThemeEnhanced = useCallback((themeId: string) => {
    // Check if this is a logo-based theme
    const isLogoTheme = themeId.startsWith('logo-');
    if (!isLogoTheme) {
      setCurrentLogoCode(null);
      localStorage.removeItem('crd-logo-code');
      // Also clear custom header color when switching themes
      clearCustomHeaderColor();
    }
    setTheme(themeId);
  }, [setTheme, clearCustomHeaderColor]);

  return {
    // Current state
    currentPalette,
    availablePalettes,
    databaseThemes,
    isLoading,
    currentLogoCode,
    customHeaderColor,
    customHeaderColorType,
    isHomeTeamMode,
    
    // Actions
    setTheme: setThemeEnhanced,
    setLogoTheme,
    resetToDefault,
    applyTheme,
    setCustomHeaderBgColor,
    clearCustomHeaderColor,
    toggleHomeTeamMode,
    
    // Utilities
    getThemePreview,
    getThemeCSSVars,
    loadDatabaseThemes,
    getCurrentLogo,
    
    // Logo-specific utilities
    getThemeByDNA,
    
    // Computed values
    currentThemeId: currentPalette?.id || null,
    isDefaultTheme: currentPalette?.id === 'cardshow-basic'
  };
};

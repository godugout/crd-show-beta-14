// Helper script to apply complete logo themes to all logos
import { completeLogoThemes } from './completeLogoThemes';

// Function to get theme data for a DNA code
export const getThemeForDNA = (dnaCode: string) => {
  return completeLogoThemes[dnaCode] || {
    logoTheme: {
      primary: '#333333',
      secondary: '#FFFFFF', 
      accent: '#0066CC',
      neutral: '#F5F5F5'
    },
    themeUsage: {
      navbar: 'Standard theme with neutral colors',
      cards: 'Clean card layouts with default styling',
      buttons: 'Standard button styles with accent colors',
      text: 'Default text styling with good contrast'
    }
  };
};
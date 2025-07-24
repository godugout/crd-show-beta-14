
// Centralized color system for type safety and consistency
export const colors = {
  // Primary colors (CRD Design System)
  primary: {
    blue: '#3772FF', // Main CTAs, links, focus states
    lightBlue: '#2D9CDB', // Secondary actions
    orange: '#F97316', // Cards, warnings, highlights
    orangeDark: '#EA6E48', // Hover states
    green: '#45B26B', // Success states
    greenDark: '#27AE60', // Success hover
    purple: '#9757D7', // Premium features
    purpleLight: '#8B5CF6', // Purple variations
    gold: '#FFD700',
  },
  // Background colors
  background: {
    primary: '#141416', // Main app background
    secondary: '#1A1D24', // Card backgrounds
    tertiary: '#23262F', // Elevated cards, modals
    borderAccent: '#353945', // Borders, dividers
  },
  // Text colors
  text: {
    primary: '#FCFCFD', // Headings, main text
    secondary: '#E6E8EC', // Body content
    muted: '#777E90', // Placeholders, labels
    disabled: '#4B505C', // Inactive elements
  },
  // Gradients (for CSS-in-JS if needed)
  gradients: {
    darkHero: 'linear-gradient(135deg, #0F0F23, #1A1D3A, #141416)',
    darkCard: 'linear-gradient(135deg, #141416, #23262F, #1A1D24)',
    blue: 'linear-gradient(135deg, #3772FF, #2D9CDB)',
    orange: 'linear-gradient(135deg, #F97316, #EA6E48)',
  },
  // Legacy colors (for backward compatibility)
  brand: {
    orange: '#EA6E48',
    blue: '#3772FF', 
    green: '#45B26B',
    purple: '#9757D7',
    gold: '#FFD700',
  },
  neutral: {
    darkest: '#121212',
    dark: '#1A1A1A', 
    darkGray: '#23262F',
    mediumGray: '#353945',
    lightGray: '#777E90',
    white: '#FCFCFD',
  },
  editor: {
    dark: '#1a1a1a',
    darker: '#121212', 
    tool: '#2a2a2a',
    border: '#333333',
    canvas: '#2c2c2c',
  }
} as const;

export type ColorKey = keyof typeof colors;
export type BrandColor = keyof typeof colors.brand;
export type NeutralColor = keyof typeof colors.neutral;

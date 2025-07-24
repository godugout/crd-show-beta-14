
// Centralized theme configuration for consistent styling
export const theme = {
  colors: {
    // Brand colors
    primary: {
      green: '#45B26B',
      blue: '#3772FF',
      orange: '#EA6E48',
      purple: '#9757D7',
    },
    
    // Neutral colors
    neutral: {
      darkest: '#121212',
      darker: '#1A1A1A', 
      darkGray: '#23262F',
      mediumGray: '#353945',
      lightGray: '#777E90',
      white: '#FCFCFD',
    },
    
    // Status colors
    status: {
      success: '#45B26B',
      warning: '#EA6E48',
      error: '#ff4444',
      info: '#3772FF',
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  typography: {
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  }
} as const;

// Button variants for consistent styling
export const buttonVariants = {
  primary: 'bg-crd-green hover:bg-crd-green/90 text-black font-semibold',
  secondary: 'bg-crd-blue hover:bg-crd-blue/90 text-white font-semibold',
  outline: 'bg-transparent border border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black',
  ghost: 'bg-transparent text-crd-lightGray hover:bg-crd-mediumGray/20 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold',
} as const;

// Card variants for consistent styling
export const cardVariants = {
  default: 'bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg',
  elevated: 'bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg shadow-lg',
  interactive: 'bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg hover:border-crd-blue/50 transition-all cursor-pointer',
} as const;


// Standardized layout constants for consistent UI design

export const LAYOUT_CONSTANTS = {
  // Container padding
  CONTAINER_PADDING: {
    mobile: 'px-4',
    tablet: 'px-5', 
    desktop: 'px-6',
    wide: 'px-8'
  },
  
  // Standard spacing tokens
  SPACING: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    xxl: '3rem'    // 48px
  },
  
  // Button sizes
  BUTTON_SIZES: {
    compact: 'h-8 px-2 py-1',
    small: 'h-9 px-3 py-2', 
    medium: 'h-10 px-4 py-2',
    large: 'h-12 px-6 py-3'
  },
  
  // Z-index layers
  Z_INDEX: {
    navbar: 40,
    overlay: 50,
    modal: 100,
    tooltip: 200
  }
};

// Utility function to get responsive container padding
export const getContainerPadding = () => {
  return `${LAYOUT_CONSTANTS.CONTAINER_PADDING.mobile} ${LAYOUT_CONSTANTS.CONTAINER_PADDING.tablet} md:${LAYOUT_CONSTANTS.CONTAINER_PADDING.desktop}`;
};

// Utility function for consistent button styling
export const getButtonClasses = (size: keyof typeof LAYOUT_CONSTANTS.BUTTON_SIZES = 'medium') => {
  return LAYOUT_CONSTANTS.BUTTON_SIZES[size];
};

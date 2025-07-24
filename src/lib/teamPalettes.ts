// Comprehensive 4-color palettes for team theming
// Each palette contains: primary, secondary, accent, and neutral colors

export interface TeamPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;    // Main brand color
    secondary: string;  // Complementary color
    accent: string;     // Highlight/action color
    neutral: string;    // Background/text support
  };
  hsl: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  usage: {
    navbar: string;
    cards: string;
    buttons: string;
    text: string;
  };
}

// Logo-based 4-color palettes (matching existing logos)
export const logoPalettes: TeamPalette[] = [
  {
    id: 'sf-orange',
    name: 'SF Orange',
    description: 'Bold orange with classic black and cream accents',
    colors: {
      primary: '#FD5A1E',   // SF Orange
      secondary: '#000000',  // Black
      accent: '#AE8F6F',     // Cream/Tan
      neutral: '#FFFFFF'     // White
    },
    hsl: {
      primary: '17 98 55',   // Orange
      secondary: '0 0 0',    // Black
      accent: '33 22 56',    // Cream
      neutral: '0 0 100'     // White
    },
    usage: {
      navbar: 'Dark orange background with orange accents',
      cards: 'Orange borders with cream highlights',
      buttons: 'Orange primary, black secondary',
      text: 'White on dark, orange for accents'
    }
  },
  {
    id: 'washington',
    name: 'Washington',
    description: 'Patriotic red, navy, and white with silver accents',
    colors: {
      primary: '#C8102E',   // Washington Red
      secondary: '#041E42',  // Navy Blue
      accent: '#87CEEB',     // Light Blue
      neutral: '#A5ACAF'     // Silver
    },
    hsl: {
      primary: '350 87 43',  // Red
      secondary: '222 84 13', // Navy
      accent: '197 71 73',   // Light Blue
      neutral: '200 8 68'    // Silver
    },
    usage: {
      navbar: 'White background with red accents',
      cards: 'Red borders with navy highlights',
      buttons: 'Red primary, navy secondary',
      text: 'Navy on white, red for highlights'
    }
  },
  {
    id: 'oakland',
    name: 'Oakland',
    description: 'Forest green and gold with natural earth tones',
    colors: {
      primary: '#003831',   // Forest Green
      secondary: '#EFB21E',  // Gold
      accent: '#45B26B',     // Bright Green
      neutral: '#2C5530'     // Dark Green
    },
    hsl: {
      primary: '163 100 11', // Forest Green
      secondary: '44 88 53', // Gold
      accent: '142 42 55',   // Bright Green
      neutral: '126 30 25'   // Dark Green
    },
    usage: {
      navbar: 'Forest green background with gold accents',
      cards: 'Green borders with gold highlights',
      buttons: 'Gold primary, green secondary',
      text: 'White on green, gold for accents'
    }
  },
  {
    id: 'pittsburgh',
    name: 'Pittsburgh',
    description: 'Classic black and gold with gray support tones',
    colors: {
      primary: '#000000',   // Black
      secondary: '#FFB612',  // Gold
      accent: '#FFC72C',     // Bright Gold
      neutral: '#869397'     // Gray
    },
    hsl: {
      primary: '0 0 0',      // Black
      secondary: '44 100 53', // Gold
      accent: '47 100 58',   // Bright Gold
      neutral: '200 8 57'    // Gray
    },
    usage: {
      navbar: 'Black background with gold accents',
      cards: 'Gold borders with gray highlights',
      buttons: 'Gold primary, black secondary',
      text: 'Gold on black, white for readability'
    }
  },
  {
    id: 'toronto',
    name: 'Toronto',
    description: 'Royal blue with white and light blue accents',
    colors: {
      primary: '#003E7E',   // Royal Blue
      secondary: '#FFFFFF',  // White
      accent: '#41B6E6',     // Light Blue
      neutral: '#C4CED4'     // Light Gray
    },
    hsl: {
      primary: '217 100 25', // Royal Blue
      secondary: '0 0 100',  // White
      accent: '198 72 58',   // Light Blue
      neutral: '210 17 81'   // Light Gray
    },
    usage: {
      navbar: 'Royal blue background with light blue accents',
      cards: 'Blue borders with white highlights',
      buttons: 'Blue primary, light blue secondary',
      text: 'White on blue, light blue for accents'
    }
  }
];

// Cardshow branded palettes
export const cardshowPalettes: TeamPalette[] = [
  {
    id: 'cardshow-basic',
    name: 'Cardshow Basic',
    description: 'Clean minimal grayscale with subtle accents',
    colors: {
      primary: '#1A1A1A',   // Dark Gray
      secondary: '#FFFFFF',  // White
      accent: '#45B26B',     // CRD Green
      neutral: '#F5F5F5'     // Light Gray
    },
    hsl: {
      primary: '0 0 10',     // Dark Gray
      secondary: '0 0 100',  // White
      accent: '142 42 55',   // CRD Green
      neutral: '0 0 96'      // Light Gray
    },
    usage: {
      navbar: 'Light gray background with green accents',
      cards: 'White background with green borders',
      buttons: 'Green primary, gray secondary',
      text: 'Dark gray with green highlights'
    }
  },
  {
    id: 'cardshow-green',
    name: 'Cardshow Green',
    description: 'Forest green and gold script elegance with natural sophistication',
    colors: {
      primary: '#003831',   // Forest Green
      secondary: '#EFB21E',  // Gold
      accent: '#45B26B',     // CRD Green
      neutral: '#2C5530'     // Dark Green
    },
    hsl: {
      primary: '163 100 11', // Forest Green
      secondary: '44 88 53', // Gold
      accent: '142 42 55',   // CRD Green
      neutral: '126 30 25'   // Dark Green
    },
    usage: {
      navbar: 'Forest green background with gold accents',
      cards: 'Green borders with gold highlights',
      buttons: 'Gold primary, forest green secondary',
      text: 'White on green, gold for script elements'
    }
  },
  {
    id: 'cardshow-blue',
    name: 'Cardshow Blue', 
    description: 'Professional blue with clean white navbar design',
    colors: {
      primary: '#3772FF',   // CRD Blue
      secondary: '#FFFFFF',  // White
      accent: '#5B8FFF',     // Light Blue
      neutral: '#F8FAFC'     // Very Light Gray
    },
    hsl: {
      primary: '225 100 61', // CRD Blue
      secondary: '0 0 100',  // White
      accent: '225 100 69',  // Light Blue
      neutral: '210 20 98'   // Very Light Gray
    },
    usage: {
      navbar: 'White background with blue accents for logo visibility',
      cards: 'Blue borders with white backgrounds',
      buttons: 'Blue primary, light blue secondary', 
      text: 'Blue on white, darker blue for highlights'
    }
  },
  {
    id: 'cardshow-orange',
    name: 'Cardshow Orange',
    description: 'Vibrant orange with warm earth tones',
    colors: {
      primary: '#EA6E48',   // CRD Orange
      secondary: '#2A1A0F',  // Dark Brown
      accent: '#FFB87A',     // Light Orange
      neutral: '#FFF4E6'     // Cream
    },
    hsl: {
      primary: '17 79 58',   // CRD Orange
      secondary: '33 42 12', // Dark Brown
      accent: '33 100 73',   // Light Orange
      neutral: '33 100 95'   // Cream
    },
    usage: {
      navbar: 'Orange background with cream accents',
      cards: 'Orange borders with cream backgrounds',
      buttons: 'Orange primary, brown secondary',
      text: 'Dark brown with orange highlights'
    }
  },
  {
    id: 'cardshow-block',
    name: 'Cardshow Block',
    description: 'Industrial monospace with strong geometric elements',
    colors: {
      primary: '#2D3748',   // Dark Slate
      secondary: '#F7FAFC',  // Light Gray
      accent: '#A0AEC0',     // Medium Gray
      neutral: '#1A202C'     // Very Dark
    },
    hsl: {
      primary: '214 25 17',  // Dark Slate
      secondary: '210 20 98', // Light Gray
      accent: '214 14 65',   // Medium Gray
      neutral: '214 32 11'   // Very Dark
    },
    usage: {
      navbar: 'Dark slate background with light accents',
      cards: 'Strong borders with high contrast',
      buttons: 'Geometric styling with sharp edges',
      text: 'High contrast for readability'
    }
  },
  {
    id: 'cardshow-vintage',
    name: 'Cardshow Vintage',
    description: 'Warm sepia tones with nostalgic brown palette',
    colors: {
      primary: '#8B4513',   // Saddle Brown
      secondary: '#F5DEB3',  // Wheat
      accent: '#DAA520',     // Goldenrod
      neutral: '#FDF5E6'     // Old Lace
    },
    hsl: {
      primary: '25 60 31',   // Saddle Brown
      secondary: '39 77 83', // Wheat
      accent: '43 74 49',    // Goldenrod
      neutral: '36 67 95'    // Old Lace
    },
    usage: {
      navbar: 'Warm brown background with wheat accents',
      cards: 'Vintage paper styling with aged effects',
      buttons: 'Classic styling with golden highlights',
      text: 'Sepia tones for nostalgic feel'
    }
  },
  {
    id: 'cardshow-retro',
    name: 'Cardshow Retro',
    description: 'Neon synthwave with cyberpunk cyan and magenta',
    colors: {
      primary: '#0D1B2A',   // Dark Navy
      secondary: '#00F5FF',  // Cyan
      accent: '#FF1493',     // Deep Pink
      neutral: '#1B263B'     // Medium Navy
    },
    hsl: {
      primary: '207 65 11',  // Dark Navy
      secondary: '186 100 50', // Cyan
      accent: '328 100 54',  // Deep Pink
      neutral: '207 50 17'   // Medium Navy
    },
    usage: {
      navbar: 'Dark navy with neon cyan accents',
      cards: 'Glowing borders with retro effects',
      buttons: 'Neon styling with hover glows',
      text: 'Bright colors on dark backgrounds'
    }
  },
  {
    id: 'cardshow-modern',
    name: 'Cardshow Modern',
    description: 'Contemporary minimalist with sophisticated purple-blue',
    colors: {
      primary: '#4C1D95',   // Purple
      secondary: '#F8FAFC',  // Slate White
      accent: '#8B5CF6',     // Violet
      neutral: '#E2E8F0'     // Light Slate
    },
    hsl: {
      primary: '256 70 35',  // Purple
      secondary: '210 20 98', // Slate White
      accent: '258 90 66',   // Violet
      neutral: '214 32 91'   // Light Slate
    },
    usage: {
      navbar: 'Clean purple background with violet accents',
      cards: 'Minimal borders with subtle shadows',
      buttons: 'Contemporary styling with smooth animations',
      text: 'High contrast with purple highlights'
    }
  },
  {
    id: 'crdmkr',
    name: 'CRDMKR',
    description: 'Professional tech gradient with emerald and cyan fusion',
    colors: {
      primary: '#047857',   // Emerald
      secondary: '#00D9FF',  // Bright Cyan
      accent: '#10B981',     // Light Emerald
      neutral: '#F0FDF4'     // Light Green
    },
    hsl: {
      primary: '162 82 26',  // Emerald
      secondary: '186 100 50', // Bright Cyan
      accent: '158 64 51',   // Light Emerald
      neutral: '138 76 97'   // Light Green
    },
    usage: {
      navbar: 'Emerald gradient with cyan highlights',
      cards: 'Tech-inspired borders with gradient effects',
      buttons: 'Modern gradients with smooth transitions',
      text: 'Tech color scheme with high readability'
    }
  }
];

// Utility function to convert team colors from database to 4-color palette
export const createPaletteFromTeamColors = (
  name: string,
  primaryColor: string,
  secondaryColor: string,
  accentColor: string
): TeamPalette => {
  const neutral = generateNeutral(primaryColor);

  return {
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name,
    description: `${name} team colors with smart neutral tones`,
    colors: {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      neutral: neutral
    },
    hsl: {
      primary: hexToHsl(primaryColor),
      secondary: hexToHsl(secondaryColor),
      accent: hexToHsl(accentColor),
      neutral: hexToHsl(neutral)
    },
    usage: {
      navbar: `${name} themed navigation with team colors`,
      cards: `${name} card styling with accent highlights`,
      buttons: `${name} branded buttons and interactions`,
      text: `${name} optimized text contrast and readability`
    }
  };
};

import { CRD_DNA_ENTRIES } from './cardshowDNA';

// Utility function for hex to HSL conversion
export const hexToHsl = (hex: string): string => {
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

  return `${Math.round(h * 360)} ${Math.round(s * 100)} ${Math.round(l * 100)}`;
};

// Generate neutral color based on primary brightness
export const generateNeutral = (primaryHex: string): string => {
  const r = parseInt(primaryHex.slice(1, 3), 16);
  const g = parseInt(primaryHex.slice(3, 5), 16);
  const b = parseInt(primaryHex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 128 ? '#2A2A2A' : '#F5F5F5';
};

// Generate palettes from CRD:DNA entries
export const generateCRDPalettes = (): TeamPalette[] => {
  return CRD_DNA_ENTRIES.map(entry => ({
    id: entry.fileName.replace('.png', '').toLowerCase(),
    name: entry.teamName || entry.styleCode,
    description: `${entry.group} ${entry.styleTag || 'Standard'} style${entry.decade ? ` - ${entry.decade}` : ''}`,
    colors: {
      primary: entry.primaryColor,
      secondary: entry.secondaryColor,
      accent: entry.tertiaryColor || entry.secondaryColor,
      neutral: generateNeutral(entry.primaryColor)
    },
    hsl: {
      primary: hexToHsl(entry.primaryColor),
      secondary: hexToHsl(entry.secondaryColor),
      accent: hexToHsl(entry.tertiaryColor || entry.secondaryColor),
      neutral: hexToHsl(generateNeutral(entry.primaryColor))
    },
    usage: {
      navbar: 'Team primary color',
      cards: 'Team secondary color', 
      buttons: 'Accent and highlights',
      text: 'Text and backgrounds'
    }
  }));
};

export const createTeamPalette = (
  id: string,
  name: string,
  description: string,
  primary: string,
  secondary: string,
  accent: string,
  neutral: string
): TeamPalette => ({
  id,
  name,
  description,
  colors: {
    primary,
    secondary,
    accent,
    neutral
  },
  hsl: {
    primary: hexToHsl(primary),
    secondary: hexToHsl(secondary),
    accent: hexToHsl(accent),
    neutral: hexToHsl(neutral)
  },
  usage: {
    navbar: `${name} themed navigation`,
    cards: `${name} themed cards`,
    buttons: `${name} themed buttons`,
    text: `${name} themed text`
  }
});

export const crdPalettes = generateCRDPalettes();
export const allPalettes = [...logoPalettes, ...cardshowPalettes, ...crdPalettes];

export const getPaletteById = (id: string): TeamPalette | undefined => {
  return allPalettes.find(palette => palette.id === id);
};

export const getPaletteByFileName = (fileName: string): TeamPalette | undefined => {
  const id = fileName.replace('.png', '').toLowerCase();
  return getPaletteById(id);
};

// Generate CSS variables for a palette
export const generatePaletteCSSVars = (palette: TeamPalette): Record<string, string> => {
  return {
    '--theme-primary': palette.hsl.primary,
    '--theme-secondary': palette.hsl.secondary,
    '--theme-accent': palette.hsl.accent,
    '--theme-neutral': palette.hsl.neutral,
    
    // Derived variables for specific use cases
    '--theme-navbar-bg': palette.hsl.primary,
    '--theme-navbar-border': palette.hsl.accent,
    '--theme-text-primary': palette.hsl.secondary,
    '--theme-text-secondary': palette.hsl.neutral,
    '--theme-text-active': palette.hsl.accent,
    '--theme-cta-bg': palette.hsl.accent,
    '--theme-cta-text': palette.hsl.primary,
    '--theme-accent-hover': palette.hsl.accent,
    
    // Card theming
    '--theme-card-bg': palette.hsl.neutral,
    '--theme-card-border': palette.hsl.accent,
    '--theme-card-hover': palette.hsl.accent,
    
    // Extended theming
    '--theme-badge-primary': palette.hsl.accent,
    '--theme-badge-secondary': palette.hsl.secondary,
    '--theme-highlight': palette.hsl.accent,
    '--theme-success-text': palette.hsl.accent
  };
};
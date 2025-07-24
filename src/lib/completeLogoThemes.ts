
// Complete all logo theme definitions based on official team colors and design analysis
import { LogoTheme } from './cardshowDNA';

export const completeLogoThemes: Record<string, { logoTheme: LogoTheme; themeUsage: any; officialTeam?: any }> = {
  CS_ORANGE_SCRIPT: {
    logoTheme: {
      primary: '#FF6347',   // Tomato Red (script dominant color)
      secondary: '#2C3E50',  // Dark Navy (elegant contrast)
      accent: '#FFB347',     // Light Orange (highlights)
      neutral: '#FFF8F0'     // Cream White (readable backgrounds)
    },
    themeUsage: {
      navbar: 'Elegant orange script with navy support backgrounds',
      cards: 'Cream backgrounds with orange script borders and navy text',
      buttons: 'Orange primary script style with navy outline secondary',
      text: 'Navy headings with orange script highlights and cream backgrounds'
    }
  },

  CS_REDBLUE_BLOCK: {
    logoTheme: {
      primary: '#DC143C',   // Crimson Red (logo accent)
      secondary: '#0047AB',  // Royal Blue (navbar background)
      accent: '#FFFFFF',     // Pure White (interactions)
      neutral: '#F0F4F8'     // Light Blue-Gray (cards/text)
    },
    officialTeam: {
      league: 'Inspired by Washington Capitals / USA Hockey',
      city: 'Washington',
      name: 'Capitals',
      founded: '1974'
    },
    themeUsage: {
      navbar: 'Royal blue background with red logo accents and white highlights',
      cards: 'Light blue-gray backgrounds with red borders and white highlights',
      buttons: 'White primary CTAs with red accent secondary actions',
      text: 'Red headings on light backgrounds with blue support text'
    }
  },

  CS_GREEN_SCRIPT_YELLOW: {
    logoTheme: {
      primary: '#228B22',   // Forest Green (like Green Bay Packers)
      secondary: '#FFD700',  // Gold Yellow (classic Packers combo)
      accent: '#32CD32',     // Lime Green (vibrant highlights)
      neutral: '#F5F5DC'     // Beige (warm neutral)
    },
    officialTeam: {
      league: 'Inspired by Green Bay Packers',
      city: 'Green Bay',
      name: 'Packers',
      founded: '1919'
    },
    themeUsage: {
      navbar: 'Deep forest green with gold script accents',
      cards: 'Beige backgrounds with green script borders and gold highlights',
      buttons: 'Gold primary script with green secondary outline',
      text: 'Green script headings with gold accents on beige backgrounds'
    }
  },

  CS_BROWN_ORANGE_RETRO: {
    logoTheme: {
      primary: '#8B4513',   // Saddle Brown (70s retro)
      secondary: '#FF8C00',  // Dark Orange (like Cleveland Browns)
      accent: '#DEB887',     // Burlywood (warm earth tone)
      neutral: '#FDF5E6'     // Old Lace (vintage paper)
    },
    officialTeam: {
      league: 'Inspired by 1970s Cleveland Browns',
      city: 'Cleveland',
      name: 'Browns',
      founded: '1946'
    },
    themeUsage: {
      navbar: 'Retro brown background with orange groovy accents',
      cards: 'Vintage paper backgrounds with brown borders and orange highlights',
      buttons: 'Orange primary retro with brown secondary earth tones',
      text: 'Brown vintage headings with orange highlights on aged paper'
    }
  },

  CS_BLUE_ORANGE_OUTLINE: {
    logoTheme: {
      primary: '#0047AB',   // Royal Blue (like New York Knicks)
      secondary: '#FF7F00',  // Orange (classic Knicks combo)
      accent: '#87CEEB',     // Sky Blue (light accent)
      neutral: '#F8F8FF'     // Ghost White (clean backgrounds)
    },
    officialTeam: {
      league: 'Inspired by New York Knicks',
      city: 'New York',
      name: 'Knicks',
      founded: '1946'
    },
    themeUsage: {
      navbar: 'Royal blue background with bold orange outline accents',
      cards: 'Clean white backgrounds with blue borders and orange highlights',
      buttons: 'Orange primary bold with blue outline secondary',
      text: 'Blue headings with orange accents and sky blue highlights'
    }
  },

  CS_RED_SCRIPT_BLUE: {
    logoTheme: {
      primary: '#C8102E',   // Red (script accent)
      secondary: '#0C2340',  // Navy Blue (navbar background)
      accent: '#BD3039',     // Darker Red (interactions)
      neutral: '#FFFFFF'     // Pure White (cards/text)
    },
    officialTeam: {
      league: 'Inspired by Boston Red Sox',
      city: 'Boston',
      name: 'Red Sox',
      founded: '1901'
    },
    themeUsage: {
      navbar: 'Navy blue background with red script accents and white highlights',
      cards: 'White backgrounds with navy borders and red script highlights',
      buttons: 'Red script primary CTAs with navy blue secondary actions',
      text: 'Navy headings with red script accents on white backgrounds'
    }
  },

  CS_BLUE_SCRIPT: {
    logoTheme: {
      primary: '#005A9C',   // Dodger Blue (like LA Dodgers)
      secondary: '#FFFFFF',  // Pure White (classic Dodger combo)
      accent: '#87CEEB',     // Sky Blue (light accent)
      neutral: '#F0F8FF'     // Alice Blue (very light blue)
    },
    officialTeam: {
      league: 'Inspired by Los Angeles Dodgers',
      city: 'Los Angeles',
      name: 'Dodgers',
      founded: '1883'
    },
    themeUsage: {
      navbar: 'Professional blue script with clean white backgrounds',
      cards: 'Alice blue backgrounds with blue script borders and white highlights',
      buttons: 'Blue script primary with white secondary clean style',
      text: 'Blue script headings with sky blue accents on white'
    }
  },

  CS_BLACK_TEAL_SPARKLE: {
    logoTheme: {
      primary: '#2C3E50',   // Dark Slate (logo accent)
      secondary: '#17A2B8',  // Teal (navbar background)
      accent: '#FFD700',     // Gold (interactions/sparkle)
      neutral: '#F8F9FA'     // Very Light Gray (cards/text)
    },
    officialTeam: {
      league: 'Inspired by San Jose Sharks',
      city: 'San Jose',
      name: 'Sharks',
      founded: '1991'
    },
    themeUsage: {
      navbar: 'Teal background with dark slate logo and gold sparkle accents',
      cards: 'Light gray backgrounds with teal borders and gold sparkle highlights',
      buttons: 'Gold primary sparkle CTAs with teal secondary actions',
      text: 'Dark slate headings with teal support and gold highlights'
    }
  },

  CS_GREEN_SPARKLE_SCRIPT: {
    logoTheme: {
      primary: '#006A4E',   // British Racing Green (elegant)
      secondary: '#FFD700',  // Gold (sparkle script)
      accent: '#32CD32',     // Lime Green (vibrant sparkles)
      neutral: '#F0FFF0'     // Honeydew (light green tint)
    },
    themeUsage: {
      navbar: 'Elegant British racing green with gold script sparkles',
      cards: 'Honeydew backgrounds with green script borders and gold sparkle highlights',
      buttons: 'Gold sparkle script primary with green secondary elegant',
      text: 'Green script headings with gold sparkle accents and lime highlights'
    }
  },

  CS_ORANGE_BLACK_OUTLINE: {
    logoTheme: {
      primary: '#FF7F00',   // Orange (like Cincinnati Bengals)
      secondary: '#000000',  // Black (bold contrast)
      accent: '#FFB347',     // Light Orange (highlights)
      neutral: '#FFF8DC'     // Cornsilk (warm neutral)
    },
    officialTeam: {
      league: 'Inspired by Cincinnati Bengals',
      city: 'Cincinnati',
      name: 'Bengals',
      founded: '1968'
    },
    themeUsage: {
      navbar: 'Bold orange background with black outline accents',
      cards: 'Cornsilk backgrounds with orange borders and black highlights',
      buttons: 'Orange primary bold with black outline secondary',
      text: 'Black headings with orange accents and light orange highlights'
    }
  },

  CS_RED_BLOCK: {
    logoTheme: {
      primary: '#DC143C',   // Crimson Red (clean modern)
      secondary: '#2C3E50',  // Dark Slate (navbar background - changed from white to avoid red navbar)
      accent: '#FF6B6B',     // Light Red (soft accent)
      neutral: '#FFF5F5'     // Misty Rose (light red tint)
    },
    themeUsage: {
      navbar: 'Dark slate background with crimson red block accents and light highlights',
      cards: 'Misty rose backgrounds with red block borders and slate highlights',
      buttons: 'Red block primary with slate secondary clean design',
      text: 'Red block headings with light red accents on neutral backgrounds'
    }
  },

  CS_RED_SCRIPT_CORAL: {
    logoTheme: {
      primary: '#FF7F7F',   // Light Coral (coral-orange theme)
      secondary: '#FFFFFF',  // Pure White (clean)
      accent: '#FF6347',     // Tomato (deeper coral accent)
      neutral: '#FFF0F5'     // Lavender Blush (soft background)
    },
    themeUsage: {
      navbar: 'Coral-orange gradient with white flowing backgrounds',
      cards: 'Lavender blush backgrounds with coral borders and white highlights',
      buttons: 'Coral gradient primary with white secondary flowing design',
      text: 'Coral headings with tomato accents and white text'
    }
  },

  CS_RED_MODERN: {
    logoTheme: {
      primary: '#E74C3C',   // Modern Red (logo complement/accents)
      secondary: '#1E3A8A',  // Spider-Man Blue (navbar background)
      accent: '#2C3E50',     // Dark Charcoal (sophisticated text)
      neutral: '#ECF0F1'     // Clouds (cards/text)
    },
    themeUsage: {
      navbar: 'Spider-Man blue background with modern red accents and charcoal highlights',
      cards: 'Cloud gray backgrounds with charcoal borders and red highlights',
      buttons: 'Red accent primary CTAs with blue secondary actions',
      text: 'Charcoal headings with modern red accents on light backgrounds'
    }
  },

  CS_RED_SCRIPT_CLASSIC: {
    logoTheme: {
      primary: '#722F37',   // Deep Burgundy (wine-gold classic theme)
      secondary: '#DAA520',  // Goldenrod (elegant gold)
      accent: '#B22222',     // Fire Brick (classic red accent)
      neutral: '#FFFAF0'     // Floral White (classic background)
    },
    themeUsage: {
      navbar: 'Deep burgundy with goldenrod elegant accents',
      cards: 'Floral white backgrounds with burgundy borders and gold highlights',
      buttons: 'Goldenrod primary with burgundy secondary classic design',
      text: 'Burgundy headings with gold script accents and traditional styling'
    }
  },

  CS_BLACK_BOLD: {
    logoTheme: {
      primary: '#1C1C1C',   // Almost Black (strong)
      secondary: '#FFFFFF',  // Pure White (maximum contrast)
      accent: '#808080',     // Gray (bold accent)
      neutral: '#F5F5F5'     // White Smoke (clean background)
    },
    themeUsage: {
      navbar: 'Bold almost black with white high-contrast accents',
      cards: 'White smoke backgrounds with black bold borders and white highlights',
      buttons: 'Black bold primary with white secondary strong contrast',
      text: 'Black bold headings with gray accents and maximum contrast design'
    }
  },

  CS_PURPLE_OUTLINE: {
    logoTheme: {
      primary: '#663399',   // Rebecca Purple (distinctive)
      secondary: '#FFFFFF',  // Pure White (contrast)
      accent: '#9966CC',     // Amethyst (purple accent)
      neutral: '#F8F4FF'     // Very Light Purple (subtle background)
    },
    themeUsage: {
      navbar: 'Distinctive purple outline with white contrast backgrounds',
      cards: 'Light purple backgrounds with purple outline borders and white highlights',
      buttons: 'Purple outline primary with white secondary distinctive design',
      text: 'Purple headings with amethyst accents and light purple highlights'
    }
  },

  CS_ORANGE_BLACK_BLOCK: {
    logoTheme: {
      primary: '#FF8C00',   // Dark Orange (like Chicago Bears alternate)
      secondary: '#000000',  // Black (bold contrast)
      accent: '#FFA500',     // Orange (bright accent)
      neutral: '#FFF8DC'     // Cornsilk (warm background)
    },
    officialTeam: {
      league: 'Inspired by Chicago Bears Alternate',
      city: 'Chicago',
      name: 'Bears',
      founded: '1919'
    },
    themeUsage: {
      navbar: 'Bold dark orange and black dual-tone block styling',
      cards: 'Cornsilk backgrounds with orange-black borders and bright highlights',
      buttons: 'Orange-black block primary with bright orange secondary',
      text: 'Black headings with dark orange accents and bright orange highlights'
    }
  }
};

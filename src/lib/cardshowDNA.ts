// CRD:DNA System - Cardshow Brand & Logo Management
import { completeLogoThemes } from './completeLogoThemes';

export type RarityLevel = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type UnlockMethod = 'starter' | 'achievement' | 'premium' | 'seasonal' | 'special' | 'legacy';

export interface CRDEntry {
  fileName: string;
  group: 'MLB' | 'NCAA' | 'UNI' | 'SK' | 'OLD' | 'ORIG' | '3D' | 'CRD';
  teamCode?: string;
  teamName?: string;
  teamCity?: string;
  styleCode: string;
  fontStyle: 'Script' | 'Block' | 'Unknown';
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  quaternaryColor?: string;
  decade?: '70s' | '80s' | '00s';
  styleTag?: 'Classic' | 'Standard' | 'Vintage' | 'Throwback' | 'Sketch' | '3D' | 'Gradient' | 'Jersey';
  mascot?: string;
  notes?: string;
  imagePath: string;
  
  // Computed properties for components
  id?: string;
  displayName?: string;
  style?: string;
  
  // Phase 1: Core Gaming Attributes
  rarity: RarityLevel;
  powerLevel: number; // 1-100
  unlockMethod: UnlockMethod;
  collectibility: number; // 1-100, affects trading value
  isBlendable: boolean;
  isRemixable: boolean;
  
  // Scarcity System
  totalSupply?: number; // null = unlimited
  currentSupply: number;
  dropRate: number; // 0-1 probability
  mintingRules?: {
    requiresAchievement?: string;
    seasonalOnly?: boolean;
    requiresPurchase?: boolean;
    packExclusive?: boolean;
  };
}

export interface LogoTheme {
  primary: string;    // Main brand/team color (dominant logo color)
  secondary: string;  // Supporting brand color (complementary logo color)
  accent: string;     // Action/highlight color (for buttons, CTAs, interactive elements)
  neutral: string;    // Background/text support color (for readable backgrounds)
}

export interface CardshowLogoDNA {
  dnaCode: string;
  displayName: string;
  description: string;
  imageUrl: string;
  category: string;
  colorPalette: string[];
  designElements: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  
  // Enhanced theming system
  logoTheme: LogoTheme;
  officialTeam?: {
    league: string;
    city: string;
    name: string;
    founded?: string;
  };
  themeUsage: {
    navbar: string;
    cards: string;
    buttons: string;
    text: string;
  };
}

export const cardshowLogoDatabase: CardshowLogoDNA[] = [
  {
    dnaCode: 'CRD_GRADIENT_MULTI',
    displayName: 'CRD Gradient Multi',
    description: 'Colorful gradient CRD logo with modern styling',
    imageUrl: '/lovable-uploads/880467b1-c3b1-4d5b-833f-43051fe529a0.png',
    category: 'Retro / Modern',
    colorPalette: ['#FF6B35', '#7FB069', '#4ECDC4', '#45B7D1'],
    designElements: ['Gradient', 'Modern', 'Colorful'],
    rarity: 'legendary',
    logoTheme: {
      primary: '#45B7D1',   // Tech Blue (main CRD color)
      secondary: '#7FB069',  // Success Green (secondary highlight)
      accent: '#FF6B35',     // Orange Accent (CTAs and interactions)
      neutral: '#F8FAFC'     // Clean White-Gray (backgrounds)
    },
    themeUsage: {
      navbar: 'Tech blue gradient background with orange highlights',
      cards: 'Clean white backgrounds with blue borders and green accents',
      buttons: 'Orange primary CTAs with blue secondary actions',
      text: 'Dark blue headings with green success states'
    }
  },
  {
    dnaCode: 'CS_GREEN_SPARKLE',
    displayName: 'Green Sparkle',
    description: 'Bold green Cardshow with sparkle effects',
    imageUrl: '/lovable-uploads/806837e5-8a67-487c-82ac-dd63b147b161.png',
    category: 'Fantasy / SciFi',
    colorPalette: ['#7FB069', '#FFFFFF', '#FFD700'],
    designElements: ['Bold', 'Sparkles', 'Fantasy'],
    rarity: 'rare',
    logoTheme: {
      primary: '#27AE60',   // Forest Green (like Seattle Seahawks)
      secondary: '#FFFFFF',  // Pure White (clean contrast)
      accent: '#FFD700',     // Gold (sparkle effects)
      neutral: '#F0FDF4'     // Light Green Tint (backgrounds)
    },
    officialTeam: {
      league: 'Inspired by Seattle Seahawks',
      city: 'Seattle',
      name: 'Seahawks',
      founded: '1976'
    },
    themeUsage: {
      navbar: 'Deep forest green background with gold sparkle accents',
      cards: 'Light green backgrounds with white borders and gold highlights',
      buttons: 'Gold primary CTAs with green secondary actions',
      text: 'White on green with gold for special effects and highlights'
    }
  },
  {
    dnaCode: 'CS_ORANGE_SCRIPT',
    displayName: 'Orange Script',
    description: 'Classic orange script Cardshow design',
    imageUrl: '/lovable-uploads/f582a941-4244-42ae-a443-5a445bcaac81.png',
    category: 'Script',
    colorPalette: ['#FF6B35', '#2C3E50'],
    designElements: ['Script', 'Classic', 'Elegant'],
    rarity: 'common',
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
  {
    dnaCode: 'CS_REDBLUE_BLOCK',
    displayName: 'Red Blue Block',
    description: 'Bold red and blue block letter design',
    imageUrl: '/lovable-uploads/a00092a2-18fc-47c7-b7a9-f7b2ba05a0d4.png',
    category: 'Bold',
    colorPalette: ['#DC143C', '#0047AB'],
    designElements: ['Block', 'Bold', 'Sports'],
    rarity: 'uncommon',
    ...completeLogoThemes.CS_REDBLUE_BLOCK
  },
  {
    dnaCode: 'CS_GREEN_SCRIPT_YELLOW',
    displayName: 'Green Script Yellow',
    description: 'Green script with yellow outline styling',
    imageUrl: '/lovable-uploads/9904e7e9-d236-4921-aa91-5c0a1d697b0c.png',
    category: 'Script',
    colorPalette: ['#7FB069', '#FFD700'],
    designElements: ['Script', 'Outlined', 'Vibrant'],
    rarity: 'rare',
    ...completeLogoThemes.CS_GREEN_SCRIPT_YELLOW
  },
  {
    dnaCode: 'CS_BROWN_ORANGE_RETRO',
    displayName: 'Brown Orange Retro',
    description: 'Retro brown and orange styling',
    imageUrl: '/lovable-uploads/2b1197e8-9501-4fe3-b915-3fcedda9a4a5.png',
    category: 'Retro / Modern',
    colorPalette: ['#8B4513', '#FF6B35'],
    designElements: ['Retro', '70s', 'Groovy'],
    rarity: 'uncommon',
    ...completeLogoThemes.CS_BROWN_ORANGE_RETRO
  },
  {
    dnaCode: 'CS_BLUE_ORANGE_OUTLINE',
    displayName: 'Blue Orange Outline',
    description: 'Blue with orange outline design',
    imageUrl: '/lovable-uploads/c2a045cc-b1d5-4d98-81ac-b53e2475feee.png',
    category: 'Bold',
    colorPalette: ['#0047AB', '#FF6B35'],
    designElements: ['Outlined', 'Bold', 'Modern'],
    rarity: 'common',
    ...completeLogoThemes.CS_BLUE_ORANGE_OUTLINE
  },
  {
    dnaCode: 'CS_RED_SCRIPT_BLUE',
    displayName: 'Red Script Blue',
    description: 'Red script on blue background',
    imageUrl: '/lovable-uploads/a1e97cec-f763-4616-b8f9-563d15a9b060.png',
    category: 'Script',
    colorPalette: ['#DC143C', '#0047AB'],
    designElements: ['Script', 'Sports', 'Classic'],
    rarity: 'common',
    ...completeLogoThemes.CS_RED_SCRIPT_BLUE
  },
  {
    dnaCode: 'CS_BLUE_SCRIPT',
    displayName: 'Blue Script',
    description: 'Clean blue script design',
    imageUrl: '/lovable-uploads/bd1b2459-1140-408e-99c4-b7153c6fb449.png',
    category: 'Script',
    colorPalette: ['#0047AB', '#FFFFFF'],
    designElements: ['Script', 'Clean', 'Professional'],
    rarity: 'common',
    ...completeLogoThemes.CS_BLUE_SCRIPT
  },
  {
    dnaCode: 'CS_BLACK_TEAL_SPARKLE',
    displayName: 'Black Teal Sparkle',
    description: 'Black with teal outline and sparkle effects',
    imageUrl: '/lovable-uploads/5e6b3501-9224-4ae3-8b52-c47251daf54d.png',
    category: 'Fantasy / SciFi',
    colorPalette: ['#2C3E50', '#4ECDC4', '#FFD700'],
    designElements: ['Outlined', 'Sparkles', 'Premium'],
    rarity: 'legendary',
    ...completeLogoThemes.CS_BLACK_TEAL_SPARKLE
  },
  // Additional new logos
  {
    dnaCode: 'CS_GREEN_SPARKLE_SCRIPT',
    displayName: 'Green Sparkle Script',
    description: 'Green script with elegant sparkle effects',
    imageUrl: '/lovable-uploads/91195cfe-6ee0-4beb-b21a-e1fea911102f.png',
    category: 'Script',
    colorPalette: ['#7FB069', '#FFD700'],
    designElements: ['Script', 'Sparkles', 'Elegant'],
    rarity: 'rare',
    ...completeLogoThemes.CS_GREEN_SPARKLE_SCRIPT
  },
  {
    dnaCode: 'CS_ORANGE_BLACK_OUTLINE',
    displayName: 'Orange Black Outline',
    description: 'Bold orange with black outline design',
    imageUrl: '/lovable-uploads/ca4eda9a-cfc7-4a8e-b70c-5371f1d59648.png',
    category: 'Bold',
    colorPalette: ['#FF8C00', '#000000'],
    designElements: ['Outlined', 'Bold', 'Strong'],
    rarity: 'uncommon',
    ...completeLogoThemes.CS_ORANGE_BLACK_OUTLINE
  },
  {
    dnaCode: 'CS_RED_BLOCK',
    displayName: 'Red Block',
    description: 'Clean red block letter design',
    imageUrl: '/lovable-uploads/e5b577eb-03fb-40d2-a604-df055f6f717a.png',
    category: 'Bold',
    colorPalette: ['#DC143C'],
    designElements: ['Block', 'Clean', 'Modern'],
    rarity: 'common',
    ...completeLogoThemes.CS_RED_BLOCK
  },
  {
    dnaCode: 'CS_RED_SCRIPT_CORAL',
    displayName: 'Red Script Coral',
    description: 'Coral red script with flowing design',
    imageUrl: '/lovable-uploads/578604df-0d4b-48dc-b012-1d19acaf3f26.png',
    category: 'Script',
    colorPalette: ['#FF6347'],
    designElements: ['Script', 'Flowing', 'Elegant'],
    rarity: 'common',
    ...completeLogoThemes.CS_RED_SCRIPT_CORAL
  },
  {
    dnaCode: 'CS_RED_MODERN',
    displayName: 'Red Modern',
    description: 'Modern red geometric design',
    imageUrl: '/lovable-uploads/5c36c1ce-0b93-49ca-b3e8-0815e3bdb34f.png',
    category: 'Retro / Modern',
    colorPalette: ['#DC143C'],
    designElements: ['Modern', 'Geometric', 'Clean'],
    rarity: 'uncommon',
    ...completeLogoThemes.CS_RED_MODERN
  },
  {
    dnaCode: 'CS_RED_SCRIPT_CLASSIC',
    displayName: 'Red Script Classic',
    description: 'Classic red script design',
    imageUrl: '/lovable-uploads/1a6184b9-f84b-4902-b5c1-fd28d34e2950.png',
    category: 'Script',
    colorPalette: ['#DC143C'],
    designElements: ['Script', 'Classic', 'Traditional'],
    rarity: 'common',
    ...completeLogoThemes.CS_RED_SCRIPT_CLASSIC
  },
  {
    dnaCode: 'CS_BLACK_BOLD',
    displayName: 'Black Bold',
    description: 'Bold black block letters',
    imageUrl: '/lovable-uploads/1d15822c-0384-40d5-ac14-82b55f17726f.png',
    category: 'Bold',
    colorPalette: ['#000000'],
    designElements: ['Bold', 'Strong', 'Impactful'],
    rarity: 'uncommon',
    ...completeLogoThemes.CS_BLACK_BOLD
  },
  {
    dnaCode: 'CS_PURPLE_OUTLINE',
    displayName: 'Purple Outline',
    description: 'Purple outline block design',
    imageUrl: '/lovable-uploads/52db4722-29c2-4ced-9d7e-2c62d2dd79f4.png',
    category: 'Bold',
    colorPalette: ['#8B008B'],
    designElements: ['Outlined', 'Bold', 'Distinctive'],
    rarity: 'rare',
    ...completeLogoThemes.CS_PURPLE_OUTLINE
  },
  {
    dnaCode: 'CS_ORANGE_BLACK_BLOCK',
    displayName: 'Orange Black Block',
    description: 'Orange and black block letter combo',
    imageUrl: '/lovable-uploads/7672b57f-6944-4e56-91af-053016fcb05b.png',
    category: 'Bold',
    colorPalette: ['#FF8C00', '#000000'],
    designElements: ['Block', 'Dual-tone', 'Bold'],
    rarity: 'legendary',
    ...completeLogoThemes.CS_ORANGE_BLACK_BLOCK
  }
];

// Core CRD:DNA Database
export const CRD_DNA_ENTRIES: CRDEntry[] = [
  // MLB Teams
  {
    fileName: "CS_MLB_BAL_OBS.png",
    group: "MLB",
    teamCode: "BAL",
    teamName: "Orioles",
    teamCity: "Baltimore",
    styleCode: "OBS",
    fontStyle: "Script",
    primaryColor: "#DF4601",
    secondaryColor: "#000000",
    tertiaryColor: "#FFFFFF",
    styleTag: "Standard",
    mascot: "The Oriole Bird",
    imagePath: "/lovable-uploads/d5697dd6-0271-4be5-b93c-0a12297883c0.png",
    id: "bal_obs",
    displayName: "Orioles Classic",
    style: "Classic",
    rarity: "Common",
    powerLevel: 65,
    unlockMethod: "starter",
    collectibility: 70,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1000,
    dropRate: 0.15
  },
  {
    fileName: "CS_MLB_CL_BOS_RBB.png",
    group: "MLB",
    teamCode: "BOS",
    teamName: "Red Sox",
    teamCity: "Boston", 
    styleCode: "RBB",
    fontStyle: "Block",
    primaryColor: "#BD3039",
    secondaryColor: "#0C2340",
    tertiaryColor: "#FFFFFF",
    styleTag: "Classic",
    mascot: "Wally the Green Monster",
    imagePath: "/lovable-uploads/b66ab3a9-3e69-4c81-a1b7-8ea8c1c5e5f2.png",
    rarity: "Rare",
    powerLevel: 85,
    unlockMethod: "achievement",
    collectibility: 90,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 5000,
    currentSupply: 3200,
    dropRate: 0.05,
    mintingRules: {
      requiresAchievement: "MLB Classic Collector"
    }
  },
  {
    fileName: "CS_MLB_CL_MIL_BYB.png",
    group: "MLB",
    teamCode: "MIL", 
    teamName: "Brewers",
    teamCity: "Milwaukee",
    styleCode: "BYB",
    fontStyle: "Block",
    primaryColor: "#12284B",
    secondaryColor: "#FFC52F",
    tertiaryColor: "#FFFFFF",
    styleTag: "Classic",
    mascot: "Bernie Brewer",
    imagePath: "/lovable-uploads/placeholder-mil-byb.png", // Need actual UUID path
    rarity: "Uncommon",
    powerLevel: 75,
    unlockMethod: "achievement",
    collectibility: 80,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 8000,
    currentSupply: 6500,
    dropRate: 0.08
  },
  {
    fileName: "CS_MLB_CL_OAK_00s.png",
    group: "MLB",
    teamCode: "OAK",
    teamName: "Athletics",
    teamCity: "Oakland",
    styleCode: "00s",
    fontStyle: "Unknown",
    primaryColor: "#003831",
    secondaryColor: "#EFB21E", 
    tertiaryColor: "#FFFFFF",
    decade: "00s",
    styleTag: "Classic",
    mascot: "Stomper",
    imagePath: "/lovable-uploads/CS_MLB_CL_OAK_00s.png",
    rarity: "Epic",
    powerLevel: 90,
    unlockMethod: "seasonal",
    collectibility: 95,
    isBlendable: true,
    isRemixable: false,
    totalSupply: 2000,
    currentSupply: 1200,
    dropRate: 0.02,
    mintingRules: {
      seasonalOnly: true,
      requiresAchievement: "00s Decade Master"
    }
  },
  {
    fileName: "CS_MLB_CL_SDP_70s.png",
    group: "MLB",
    teamCode: "SDP",
    teamName: "Padres",
    teamCity: "San Diego",
    styleCode: "70s", 
    fontStyle: "Block",
    primaryColor: "#2F241D",
    secondaryColor: "#FFC425",
    tertiaryColor: "#FFFFFF",
    decade: "70s",
    styleTag: "Classic",
    mascot: "Swinging Friar",
    imagePath: "/lovable-uploads/CS_MLB_CL_SDP_70s.png",
    rarity: "Legendary",
    powerLevel: 95,
    unlockMethod: "special",
    collectibility: 98,
    isBlendable: false,
    isRemixable: true,
    totalSupply: 1000,
    currentSupply: 342,
    dropRate: 0.01,
    mintingRules: {
      seasonalOnly: true,
      requiresAchievement: "70s Vintage Collector",
      packExclusive: true
    }
  },
  {
    fileName: "CS_MLB_CL_SEA_80s.png",
    group: "MLB",
    teamCode: "SEA",
    teamName: "Mariners", 
    teamCity: "Seattle",
    styleCode: "80s",
    fontStyle: "Script",
    primaryColor: "#0C2C56",
    secondaryColor: "#005C5C",
    tertiaryColor: "#C4CED4",
    decade: "80s",
    styleTag: "Classic",
    mascot: "Mariner Moose",
    imagePath: "/lovable-uploads/a8b7c6d5-e4f3-4e2d-9c1b-8a7b6c5d4e3f.png",
    rarity: "Epic",
    powerLevel: 88,
    unlockMethod: "achievement",
    collectibility: 92,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 3000,
    currentSupply: 2100,
    dropRate: 0.03,
    mintingRules: {
      requiresAchievement: "80s Era Champion"
    }
  },
  // Add ALL missing entries from reference image
  {
    fileName: "CS_MLB_CLE_RBS.png",
    group: "MLB",
    teamCode: "CLE",
    teamName: "Guardians",
    teamCity: "Cleveland",
    styleCode: "RBS",
    fontStyle: "Block",
    primaryColor: "#E31937",
    secondaryColor: "#FFFFFF",
    tertiaryColor: "#000000",
    styleTag: "Standard",
    imagePath: "/lovable-uploads/CS_MLB_CLE_RBS.png",
    rarity: "Uncommon",
    powerLevel: 70,
    unlockMethod: "achievement",
    collectibility: 75,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1500,
    dropRate: 0.12
  },
  {
    fileName: "CS_MLB_LAD_BS.png",
    group: "MLB",
    teamCode: "LAD",
    teamName: "Dodgers",
    teamCity: "Los Angeles",
    styleCode: "BS",
    fontStyle: "Script",
    primaryColor: "#005A9C",
    secondaryColor: "#FFFFFF",
    styleTag: "Standard",
    imagePath: "/lovable-uploads/CS_MLB_LAD_BS.png",
    rarity: "Rare",
    powerLevel: 82,
    unlockMethod: "achievement",
    collectibility: 88,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 3500,
    currentSupply: 2800,
    dropRate: 0.04
  },
  {
    fileName: "CS_MLB_MIA.png",
    group: "MLB",
    teamCode: "MIA",
    teamName: "Marlins",
    teamCity: "Miami",
    styleCode: "MIA",
    fontStyle: "Block",
    primaryColor: "#00A3E0",
    secondaryColor: "#000000",
    tertiaryColor: "#FFFFFF",
    styleTag: "Standard",
    imagePath: "/lovable-uploads/CS_MLB_MIA.png",
    rarity: "Common",
    powerLevel: 68,
    unlockMethod: "starter",
    collectibility: 72,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1200,
    dropRate: 0.14
  },
  {
    fileName: "CS_MLB_OAK.png",
    group: "MLB",
    teamCode: "OAK",
    teamName: "Athletics",
    teamCity: "Oakland",
    styleCode: "OAK",
    fontStyle: "Block",
    primaryColor: "#003831",
    secondaryColor: "#EFB21E",
    styleTag: "Standard",
    imagePath: "/lovable-uploads/CS_MLB_OAK.png",
    rarity: "Uncommon",
    powerLevel: 74,
    unlockMethod: "achievement",
    collectibility: 77,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1300,
    dropRate: 0.11
  },
  {
    fileName: "CS_MLB_PIT_BBY.png",
    group: "MLB",
    teamCode: "PIT",
    teamName: "Pirates",
    teamCity: "Pittsburgh", 
    styleCode: "BBY",
    fontStyle: "Block",
    primaryColor: "#FDB827",
    secondaryColor: "#000000",
    tertiaryColor: "#FFFFFF",
    styleTag: "Standard",
    mascot: "Pirate Parrot",
    imagePath: "/lovable-uploads/CS_MLB_PIT_BBY.png",
    rarity: "Uncommon",
    powerLevel: 73,
    unlockMethod: "achievement",
    collectibility: 78,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 900,
    dropRate: 0.10
  },

  // Other Styles
  {
    fileName: "CS_3D_WGB.png",
    group: "3D",
    styleCode: "WGB",
    fontStyle: "Block",
    primaryColor: "#FFFFFF",
    secondaryColor: "#45B26B",
    tertiaryColor: "#000000",
    styleTag: "3D",
    notes: "Abstract team card layout",
    imagePath: "/lovable-uploads/e1f2a3b4-c5d6-4e7f-8a9b-2c3d4e5f6a7b.png",
    rarity: "Epic",
    powerLevel: 92,
    unlockMethod: "special",
    collectibility: 96,
    isBlendable: true,
    isRemixable: false,
    totalSupply: 1500,
    currentSupply: 890,
    dropRate: 0.015,
    mintingRules: {
      requiresAchievement: "3D Master",
      packExclusive: true
    }
  },
  {
    fileName: "CRD_GRADIENT.png",
    group: "CRD",
    styleCode: "GRADIENT",
    fontStyle: "Unknown",
    primaryColor: "#45B26B",
    secondaryColor: "#3772FF",
    styleTag: "Gradient",
    notes: "For backgrounds or CRD Tokens",
    imagePath: "/lovable-uploads/CRD_GRADIENT.png",
    rarity: "Mythic",
    powerLevel: 100,
    unlockMethod: "legacy",
    collectibility: 100,
    isBlendable: false,
    isRemixable: false,
    totalSupply: 100,
    currentSupply: 23,
    dropRate: 0.001,
    mintingRules: {
      requiresAchievement: "CRD Founder",
      seasonalOnly: false,
      requiresPurchase: true,
      packExclusive: true
    }
  },
  {
    fileName: "CS_UNI_YBB.png",
    group: "UNI",
    styleCode: "YBB",
    fontStyle: "Block",
    primaryColor: "#FFB100",
    secondaryColor: "#1F1F1F",
    tertiaryColor: "#0000FF",
    styleTag: "Jersey",
    notes: "For school/college lettering",
    imagePath: "/lovable-uploads/CS_UNI_YBB.png",
    rarity: "Common",
    powerLevel: 55,
    unlockMethod: "starter",
    collectibility: 60,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 2000,
    dropRate: 0.20
  },
  {
    fileName: "CS_UNI_WRB.png",
    group: "UNI",
    styleCode: "WRB",
    fontStyle: "Block",
    primaryColor: "#FFFFFF",
    secondaryColor: "#FF0000",
    tertiaryColor: "#0000FF",
    styleTag: "Jersey",
    notes: "3-color option",
    imagePath: "/lovable-uploads/CS_UNI_WRB.png",
    rarity: "Uncommon",
    powerLevel: 58,
    unlockMethod: "starter",
    collectibility: 65,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1800,
    dropRate: 0.18
  },
  {
    fileName: "CS_UNI_BB.png",
    group: "UNI",
    styleCode: "BB",
    fontStyle: "Block",
    primaryColor: "#0000FF",
    secondaryColor: "#000000",
    styleTag: "Jersey",
    imagePath: "/lovable-uploads/CS_UNI_BB.png",
    rarity: "Common",
    powerLevel: 52,
    unlockMethod: "starter",
    collectibility: 58,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 2200,
    dropRate: 0.22
  },
  {
    fileName: "CS_NCAA_BIG10.png",
    group: "NCAA",
    teamCode: "BIG10",
    teamName: "Big Ten",
    styleCode: "BIG10",
    fontStyle: "Unknown",
    primaryColor: "#000080",
    secondaryColor: "#FFFFFF",
    styleTag: "Standard",
    notes: "Big Ten NCAA branding",
    imagePath: "/lovable-uploads/f3e4d5c6-b7a8-4f9e-8d1c-3b4a5c6d7e8f.png",
    rarity: "Rare",
    powerLevel: 80,
    unlockMethod: "achievement",
    collectibility: 85,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 5000,
    currentSupply: 3800,
    dropRate: 0.07,
    mintingRules: {
      requiresAchievement: "NCAA Conference Champion"
    }
  },
  {
    fileName: "CS_OLD_RS.png",
    group: "OLD",
    teamCode: "BOS",
    teamName: "Red Sox",
    styleCode: "RS",
    fontStyle: "Script",
    primaryColor: "#BD3039",
    secondaryColor: "#0C2340",
    styleTag: "Vintage",
    mascot: "Wally",
    notes: "Retro serif script",
    imagePath: "/lovable-uploads/CS_OLD_RS.png",
    rarity: "Legendary",
    powerLevel: 94,
    unlockMethod: "legacy",
    collectibility: 97,
    isBlendable: false,
    isRemixable: true,
    totalSupply: 800,
    currentSupply: 456,
    dropRate: 0.005,
    mintingRules: {
      requiresAchievement: "Vintage Collector",
      seasonalOnly: true
    }
  },
  {
    fileName: "CS_ORIG_WS.png",
    group: "ORIG",
    teamCode: "WSH",
    teamName: "Senators",
    teamCity: "Washington",
    styleCode: "WS",
    fontStyle: "Script",
    primaryColor: "#FFFFFF",
    secondaryColor: "#FF0000",
    styleTag: "Throwback",
    notes: "Original style for Washington",
    imagePath: "/lovable-uploads/CS_ORIG_WS.png",
    rarity: "Epic",
    powerLevel: 89,
    unlockMethod: "special",
    collectibility: 93,
    isBlendable: true,
    isRemixable: false,
    totalSupply: 1200,
    currentSupply: 734,
    dropRate: 0.02,
    mintingRules: {
      requiresAchievement: "Original Teams Historian"
    }
  },
  {
    fileName: "CS_SK_RB.png",
    group: "SK",
    styleCode: "RB",
    fontStyle: "Block",
    primaryColor: "#FF0000",
    secondaryColor: "#0000FF",
    styleTag: "Sketch",
    notes: "Artistic/alternate",
    imagePath: "/lovable-uploads/CS_SK_RB.png",
    rarity: "Rare",
    powerLevel: 78,
    unlockMethod: "achievement",
    collectibility: 82,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 4000,
    currentSupply: 2890,
    dropRate: 0.06,
    mintingRules: {
      requiresAchievement: "Artist Apprentice"
    }
  },
  {
    fileName: "CS_SK_RS.png",
    group: "SK",
    styleCode: "RS",
    fontStyle: "Script",
    primaryColor: "#FF0000",
    secondaryColor: "#C0C0C0",
    styleTag: "Sketch",
    notes: "Artistic/alternate",
    imagePath: "/lovable-uploads/CS_SK_RS.png",
    rarity: "Rare",
    powerLevel: 76,
    unlockMethod: "achievement",
    collectibility: 80,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 4500,
    currentSupply: 3200,
    dropRate: 0.055,
    mintingRules: {
      requiresAchievement: "Sketch Master"
    }
  }
];

// Utility functions
export const getCRDEntryByFileName = (fileName: string): CRDEntry | undefined => {
  return CRD_DNA_ENTRIES.find(entry => entry.fileName === fileName);
};

export const getCRDEntriesByGroup = (group: CRDEntry['group']): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.group === group);
};

export const getCRDEntriesByTeam = (teamCode: string): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.teamCode === teamCode);
};

export const getCRDEntriesByStyle = (styleTag: string): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.styleTag === styleTag);
};

export const getMLBTeams = (): CRDEntry[] => {
  return getCRDEntriesByGroup('MLB');
};

export const getClassicDecades = (): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.decade);
};

// Phase 1: Gaming Utility Functions
export const getCRDEntriesByRarity = (rarity: RarityLevel): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.rarity === rarity);
};

export const getCRDEntriesByUnlockMethod = (method: UnlockMethod): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.unlockMethod === method);
};

export const getBlendableEntries = (): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.isBlendable);
};

export const getRemixableEntries = (): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.isRemixable);
};

export const getRarityDistribution = () => {
  const distribution: Record<RarityLevel, number> = {
    Common: 0,
    Uncommon: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
    Mythic: 0
  };
  
  CRD_DNA_ENTRIES.forEach(entry => {
    distribution[entry.rarity]++;
  });
  
  return distribution;
};

// Advanced Gaming Analytics
export const getSupplyMetrics = () => {
  const totalSupply = CRD_DNA_ENTRIES.reduce((acc, entry) => acc + entry.currentSupply, 0);
  const limitedSupplyItems = CRD_DNA_ENTRIES.filter(entry => entry.totalSupply);
  const unlimitedSupplyItems = CRD_DNA_ENTRIES.filter(entry => !entry.totalSupply);
  
  return {
    totalSupply,
    limitedSupplyItems: limitedSupplyItems.length,
    unlimitedSupplyItems: unlimitedSupplyItems.length,
    averageDropRate: CRD_DNA_ENTRIES.reduce((acc, entry) => acc + entry.dropRate, 0) / CRD_DNA_ENTRIES.length
  };
};

export const getPowerLevelStats = () => {
  const powerLevels = CRD_DNA_ENTRIES.map(entry => entry.powerLevel);
  const minPower = Math.min(...powerLevels);
  const maxPower = Math.max(...powerLevels);
  const avgPower = powerLevels.reduce((a, b) => a + b, 0) / powerLevels.length;
  
  return { minPower, maxPower, avgPower: Math.round(avgPower) };
};

export const getUnlockMethodDistribution = () => {
  const distribution: Record<UnlockMethod, number> = {
    starter: 0,
    achievement: 0,
    premium: 0,
    seasonal: 0,
    special: 0,
    legacy: 0
  };
  
  CRD_DNA_ENTRIES.forEach(entry => {
    distribution[entry.unlockMethod]++;
  });
  
  return distribution;
};

// Gaming utility functions for card creation
export const getCardRarityFromDNA = (dnaSegments: CRDEntry[]): string => {
  const rarityWeights = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5, Mythic: 6 };
  const avgWeight = dnaSegments.reduce((sum, dna) => sum + rarityWeights[dna.rarity], 0) / dnaSegments.length;
  
  if (avgWeight >= 5.5) return 'Mythic';
  if (avgWeight >= 4.5) return 'Legendary';
  if (avgWeight >= 3.5) return 'Epic';
  if (avgWeight >= 2.5) return 'Rare';
  if (avgWeight >= 1.5) return 'Uncommon';
  return 'Common';
};

export const checkBlendCompatibility = (dna1: CRDEntry, dna2: CRDEntry): boolean => {
  if (!dna1.isBlendable || !dna2.isBlendable) return false;
  if (dna1.group === dna2.group) return true;
  return Math.random() > 0.3; // 70% compatibility for demo
};

export const generateBlendResult = (dnaSegments: CRDEntry[]) => {
  const primaryDNA = dnaSegments[0];
  const blendName = `${primaryDNA.group} Fusion`;
  const rarity = getCardRarityFromDNA(dnaSegments);
  return { name: blendName, rarity };
};

export const generateCardMetadata = (dnaSegments: CRDEntry[]) => {
  const totalPower = dnaSegments.reduce((sum, dna) => sum + dna.powerLevel, 0);
  const avgCollectibility = dnaSegments.reduce((sum, dna) => sum + dna.collectibility, 0) / dnaSegments.length;
  const rarity = getCardRarityFromDNA(dnaSegments);
  
  return {
    powerLevel: Math.floor(totalPower / dnaSegments.length),
    collectibility: Math.floor(avgCollectibility),
    rarity,
    appliedDNA: dnaSegments.map(dna => dna.fileName),
    blendable: dnaSegments.every(dna => dna.isBlendable),
    remixable: dnaSegments.every(dna => dna.isRemixable)
  };
};

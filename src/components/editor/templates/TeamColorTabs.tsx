
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TeamColorGrid } from './TeamColorGrid';
import type { ColorTheme } from '@/hooks/useColorThemes';
import type { TeamColorScheme } from './TeamColors';

// Import sports icons from lucide-react
import { 
  Target as SoccerIcon,
  Shield as FootballIcon,
  Zap as HockeyIcon
} from 'lucide-react';

// Custom Baseball and Basketball icons as SVGs since lucide doesn't have them
const BaseballIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4"/>
    <path d="M8 12c0 2.21 1.79 4 4 4s4-1.79 4-4"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
  </svg>
);

const BasketballIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    <path d="M2 12h20"/>
  </svg>
);

interface TeamColorTabsProps {
  themesBySport: Record<string, ColorTheme[]>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedColorScheme?: TeamColorScheme;
  hoveredTheme: string | null;
  onThemeHover: (themeId: string | null) => void;
  onThemeSelect: (theme: ColorTheme) => void;
  onColorsChange?: (rotatedTheme: ColorTheme) => void;
}

// Define sport order and icons
const SPORTS_CONFIG = [
  { key: 'baseball', name: 'Baseball', icon: BaseballIcon },
  { key: 'basketball', name: 'Basketball', icon: BasketballIcon },
  { key: 'football', name: 'Football', icon: FootballIcon },
  { key: 'hockey', name: 'Hockey', icon: HockeyIcon },
  { key: 'soccer', name: 'Soccer', icon: SoccerIcon }
];

export const TeamColorTabs = ({
  themesBySport,
  activeTab,
  onTabChange,
  selectedColorScheme,
  hoveredTheme,
  onThemeHover,
  onThemeSelect,
  onColorsChange
}: TeamColorTabsProps) => {
  // Filter sports that have themes and maintain order
  const availableSports = SPORTS_CONFIG.filter(sport => 
    themesBySport[sport.key] && themesBySport[sport.key].length > 0
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-crd-mediumGray/20 mb-4">
        {availableSports.map((sport) => {
          const IconComponent = sport.icon;
          return (
            <TabsTrigger 
              key={sport.key} 
              value={sport.key}
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-crd-lightGray text-xs flex items-center gap-1"
            >
              <IconComponent />
              <span className="hidden sm:inline">{sport.name}</span>
              <span className="ml-1 text-xs opacity-70">
                ({themesBySport[sport.key]?.length || 0})
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {availableSports.map((sport) => (
        <TabsContent key={sport.key} value={sport.key} className="mt-0">
          <TeamColorGrid
            themes={themesBySport[sport.key] || []}
            selectedColorScheme={selectedColorScheme}
            hoveredTheme={hoveredTheme}
            onThemeHover={onThemeHover}
            onThemeSelect={onThemeSelect}
            onColorsChange={onColorsChange}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

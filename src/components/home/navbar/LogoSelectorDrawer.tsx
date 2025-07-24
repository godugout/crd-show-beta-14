import React, { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { PalettePreview } from '@/components/ui/design-system';
import { cardshowLogoDatabase } from '@/lib/cardshowDNA';
import { getImagePath } from '@/lib/imagePathUtil';
import { CRDGradientLogo } from './CRDGradientLogo';
import { ChevronDown } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

// Create logo groups from cardshowLogoDatabase
const createLogoGroups = () => {
  const groups = new Map();
  
  cardshowLogoDatabase.forEach(logo => {
    const category = logo.category;
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    
    groups.get(category).push({
      name: logo.displayName,
      dnaCode: logo.dnaCode,
      imageUrl: logo.imageUrl,
      hoverColor: logo.logoTheme.primary,
      themeId: `logo-${logo.dnaCode.toLowerCase()}`,
      rarity: logo.rarity,
      colorPalette: logo.colorPalette,
      description: logo.description
    });
  });
  
  return Array.from(groups.entries()).map(([category, logos]) => ({
    label: category,
    logos
  }));
};

const logoGroups = createLogoGroups();

const getHoverColorClasses = (color: string) => {
  const colorMap = {
    orange: 'hover:bg-orange-500/10 hover:border-orange-500/20',
    red: 'hover:bg-red-500/10 hover:border-red-500/20',
    green: 'hover:bg-green-500/10 hover:border-green-500/20',
    yellow: 'hover:bg-yellow-500/10 hover:border-yellow-500/20',
    blue: 'hover:bg-blue-500/10 hover:border-blue-500/20',
    gray: 'hover:bg-gray-500/10 hover:border-gray-500/20',
    emerald: 'hover:bg-emerald-500/10 hover:border-emerald-500/20',
    purple: 'hover:bg-purple-500/10 hover:border-purple-500/20',
    slate: 'hover:bg-slate-500/10 hover:border-slate-500/20',
    amber: 'hover:bg-amber-500/10 hover:border-amber-500/20',
    cyan: 'hover:bg-cyan-500/10 hover:border-cyan-500/20',
    indigo: 'hover:bg-indigo-500/10 hover:border-indigo-500/20',
  };
  return colorMap[color] || 'hover:bg-gray-500/10 hover:border-gray-500/20';
};

// Logo component using imageUrl from cardshowLogoDatabase
const LogoWithFallback = ({ imageUrl, logoName, className, dnaCode }: { 
  imageUrl: string, 
  logoName: string, 
  className?: string,
  dnaCode: string
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Quick initialization check
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Error state with CRD:DNA styling
  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted/50 border border-dashed border-muted-foreground/30 rounded-md text-xs text-muted-foreground transition-all duration-200 hover:bg-muted/70`}>
        <span className="font-mono text-center px-1">{logoName}</span>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted/30 rounded-md animate-pulse`}>
        <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <img 
        src={imageUrl}
        alt={logoName}
        className={className}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
      {/* CRD:DNA code tooltip on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border rounded-md px-2 py-1 text-xs text-popover-foreground shadow-lg whitespace-nowrap z-50">
          {dnaCode}
        </div>
      </div>
    </div>
  );
};

interface LogoSelectorDrawerProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelectorDrawer = ({ onThemeChange }: LogoSelectorDrawerProps) => {
  const { settings, saveSettings } = useAppSettings();
  const { setLogoTheme, currentPalette, availablePalettes, setTheme, currentLogoCode } = useTeamTheme();
  const [open, setOpen] = useState(false);

  // Find logo by theme ID with fallback
  const findLogoByThemeId = (themeId: string) => {
    for (const group of logoGroups) {
      const found = group.logos.find(logo => logo.themeId === themeId);
      if (found) return found;
    }
    return logoGroups[0].logos[0]; // Fallback to first logo
  };

  // Initialize selected logo from current logo code or settings
  const [selectedLogo, setSelectedLogo] = useState(() => {
    if (currentLogoCode) {
      // Find logo by DNA code
      for (const group of logoGroups) {
        const found = group.logos.find(logo => logo.dnaCode === currentLogoCode);
        if (found) return found;
      }
    }
    const savedTheme = settings?.theme;
    return savedTheme ? findLogoByThemeId(savedTheme) : logoGroups[0].logos[0];
  });

  // Update selected logo when current logo code changes from useTeamTheme
  useEffect(() => {
    if (currentLogoCode) {
      for (const group of logoGroups) {
        const found = group.logos.find(logo => logo.dnaCode === currentLogoCode);
        if (found) {
          console.log(`🔄 LogoSelectorDrawer: Updating to logo ${currentLogoCode}`, found);
          setSelectedLogo(found);
          return;
        }
      }
      console.warn(`🔄 LogoSelectorDrawer: Logo not found for DNA code ${currentLogoCode}`);
    }
  }, [currentLogoCode]);

  // Also update when settings change (for compatibility)
  useEffect(() => {
    if (!currentLogoCode && settings?.theme && settings.theme !== selectedLogo.themeId) {
      const savedLogo = findLogoByThemeId(settings.theme);
      setSelectedLogo(savedLogo);
    }
  }, [settings?.theme, currentLogoCode, selectedLogo.themeId]);

  // Apply theme to document and notify parent
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedLogo.themeId);
    onThemeChange?.(selectedLogo.themeId);
  }, [selectedLogo.themeId, onThemeChange]);

  const handleLogoSelect = (logo: typeof selectedLogo) => {
    setSelectedLogo(logo);
    
    // Use setLogoTheme to apply the logo-based theme using the DNA code
    const dnaCode = logo.dnaCode;
    setLogoTheme(dnaCode);
    
    // Save theme to persistent storage
    saveSettings({ theme: logo.themeId });
    onThemeChange?.(logo.themeId);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="group flex items-center gap-2 cursor-pointer outline-none focus:outline-none border-none bg-transparent p-2 rounded-lg transition-all duration-300">
          <LogoWithFallback 
            imageUrl={selectedLogo.imageUrl}
            logoName={selectedLogo.name}
            dnaCode={selectedLogo.dnaCode}
            className="h-16 w-40 object-contain" 
          />
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-all duration-300 opacity-0 group-hover:opacity-100 ${open ? 'rotate-180 opacity-100' : ''}`} />
        </button>
      </DrawerTrigger>
      
      <DrawerContent className="bg-gradient-to-br from-background via-background/95 to-muted/20 border-border/30 max-h-[85vh] backdrop-blur-xl">
        <div className="w-full overflow-hidden">
          <DrawerHeader className="pb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-t-3xl"></div>
            <DrawerTitle className="text-foreground text-xl font-bold text-center relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Choose Your Logo
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-center relative z-10 mt-2">
              Select a logo to customize your theme and unlock new visual experiences
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="w-full px-6 pb-8 space-y-10 overflow-y-auto max-h-[65vh]">
            {logoGroups.map((group, groupIndex) => (
              <div key={group.label} className="w-full space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-lg h-8"></div>
                  <h3 className="text-foreground text-base font-bold mb-1 px-4 py-2 relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-wide">
                    {group.label}
                  </h3>
                  <div className="text-muted-foreground text-xs px-4 relative z-10">
                    {group.logos.length} logo{group.logos.length !== 1 ? 's' : ''} available
                  </div>
                </div>
                
                {/* Use exact same grid layout as design guide */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {group.logos.map((logo) => {
                    const isSelected = selectedLogo.themeId === logo.themeId || currentLogoCode === logo.dnaCode;
                    
                    return (
                      <button
                        key={logo.dnaCode}
                        onClick={() => handleLogoSelect(logo)}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border/20 hover:border-primary/50 bg-card'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Logo with exact sizing from design guide */}
                          <div className="w-full h-16 flex items-center justify-center">
                            <LogoWithFallback 
                              imageUrl={logo.imageUrl}
                              logoName={logo.name}
                              dnaCode={logo.dnaCode}
                              className={`max-w-full max-h-full object-contain ${
                                logo.dnaCode === 'CRD_GRADIENT_MULTI' ? 'max-h-12' : ''
                              }`}
                            />
                          </div>
                          
                          {/* 4 Color Dots Under Logo - Exact match from design guide */}
                          <div className="flex justify-center space-x-1">
                            {logo.colorPalette.slice(0, 4).map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                                style={{ backgroundColor: color }}
                                title={`Color ${index + 1}: ${color}`}
                              />
                            ))}
                          </div>
                          
                          {/* Logo name with exact styling from design guide */}
                          <div className="text-xs font-medium text-primary truncate">
                            {logo.name}
                          </div>
                          
                          {/* Category with exact styling from design guide */}
                          <div className="text-xs text-muted-foreground">
                            {group.label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {groupIndex < logoGroups.length - 1 && (
                  <div className="border-t border-gradient-to-r from-transparent via-border/50 to-transparent mt-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
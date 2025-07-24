import React from 'react';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { PalettePreview, CRDButton, CRDBadge, CRDCard } from '@/components/ui/design-system';

export const TeamThemeShowcase = () => {
  const { currentPalette, availablePalettes, setTheme } = useTeamTheme();

  if (!currentPalette) return null;

  return (
    <div className="p-6 space-y-8">
      {/* Enhanced Current Theme Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-themed-light via-themed-subtle to-themed-light border border-themed-light shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-themed-primary/5 via-transparent to-themed-accent/5 animate-pulse" />
        
        <div className="relative p-8 space-y-6">
          {/* Theme Header with Large Logo */}
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-themed-light border border-themed shadow-sm flex items-center justify-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-themed-primary to-themed-accent opacity-20" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-themed-primary bg-gradient-to-r from-themed-primary to-themed-accent bg-clip-text text-transparent">
                    {currentPalette.name}
                  </h2>
                  <p className="text-themed-secondary text-lg">{currentPalette.description}</p>
                </div>
              </div>
              
              {/* Theme Metadata */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-themed-strong/10 text-themed-strong text-sm font-medium">
                  Active Theme
                </span>
                <span className="px-3 py-1 rounded-full bg-themed-accent/10 text-themed-accent text-sm font-medium">
                  {currentPalette.id}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Color Palette */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-themed-primary">Brand Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Primary', color: currentPalette.colors.primary, label: 'Brand Primary' },
                { name: 'Secondary', color: currentPalette.colors.secondary, label: 'Supporting' },
                { name: 'Accent', color: currentPalette.colors.accent, label: 'Highlight' },
                { name: 'Neutral', color: currentPalette.colors.neutral, label: 'Text & UI' }
              ].map((colorInfo) => (
                <div 
                  key={colorInfo.name}
                  className="group cursor-pointer hover:scale-105 transition-all duration-200"
                  onClick={() => navigator.clipboard?.writeText(colorInfo.color)}
                >
                  <div className="space-y-2">
                    <div 
                      className="w-full h-16 rounded-lg shadow-md border border-white/20 group-hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: colorInfo.color }}
                    />
                    <div className="text-center">
                      <div className="font-medium text-themed-primary text-sm">{colorInfo.name}</div>
                      <div className="text-xs text-themed-secondary">{colorInfo.label}</div>
                      <div className="text-xs font-mono text-themed-accent mt-1">{colorInfo.color}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Showcase Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Component Gallery */}
        <CRDCard className="p-6 space-y-6">
          <h4 className="text-xl font-semibold text-themed-primary flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-themed-accent animate-pulse"></span>
            <span>Live Components</span>
          </h4>
          
          {/* Interactive Buttons */}
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-themed-secondary mb-2">Button Variations</h5>
              <div className="flex gap-3 flex-wrap">
                <CRDButton variant="primary" className="hover:scale-105 transition-transform">
                  Primary Action
                </CRDButton>
                <CRDButton variant="secondary" className="hover:scale-105 transition-transform">
                  Secondary
                </CRDButton>
                <CRDButton variant="ghost" className="hover:scale-105 transition-transform">
                  Ghost
                </CRDButton>
              </div>
            </div>

            {/* Interactive Badges */}
            <div>
              <h5 className="text-sm font-medium text-themed-secondary mb-2">Status Indicators</h5>
              <div className="flex gap-2 flex-wrap">
                <CRDBadge variant="primary" className="hover:scale-110 transition-transform cursor-pointer">
                  Featured
                </CRDBadge>
                <CRDBadge variant="secondary" className="hover:scale-110 transition-transform cursor-pointer">
                  Standard
                </CRDBadge>
                <CRDBadge variant="success" className="hover:scale-110 transition-transform cursor-pointer">
                  Verified
                </CRDBadge>
              </div>
            </div>
          </div>
        </CRDCard>

        {/* Typography & Brand Elements */}
        <CRDCard className="p-6 space-y-6">
          <h4 className="text-xl font-semibold text-themed-primary flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-themed-primary animate-pulse"></span>
            <span>Typography & Style</span>
          </h4>
          
          <div className="space-y-4">
            {/* Typography Scale */}
            <div className="space-y-3">
              <div className="text-2xl font-bold text-themed-primary">Heading Bold</div>
              <div className="text-xl font-semibold text-themed-primary">Subheading</div>
              <div className="text-base text-themed-secondary">Body text that shows how readable content appears in this theme</div>
              <div className="text-sm text-themed-accent font-medium">Accent Text • Call to Action</div>
              <div className="text-xs text-themed-secondary uppercase tracking-wider">METADATA • LABELS</div>
            </div>

            {/* Theme Stats */}
            <div className="pt-4 border-t border-themed-light">
              <h5 className="text-sm font-medium text-themed-secondary mb-3">Theme Properties</h5>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-themed-secondary">Contrast Ratio</div>
                  <div className="font-mono text-themed-accent">4.5:1 AA</div>
                </div>
                <div>
                  <div className="text-themed-secondary">Accessibility</div>
                  <div className="font-mono text-themed-strong">WCAG 2.1</div>
                </div>
                <div>
                  <div className="text-themed-secondary">Color Space</div>
                  <div className="font-mono text-themed-primary">sRGB</div>
                </div>
                <div>
                  <div className="text-themed-secondary">Theme Type</div>
                  <div className="font-mono text-themed-accent">Dynamic</div>
                </div>
              </div>
            </div>
          </div>
        </CRDCard>
      </div>
    </div>
  );
};
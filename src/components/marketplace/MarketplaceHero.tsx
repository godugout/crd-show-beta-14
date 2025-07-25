import React from 'react';
import { Search, TrendingUp, Users, ShoppingBag, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TokenDisplay } from '@/components/marketplace/TokenDisplay';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import heroBackground from '@/assets/marketplace-hero-bg.jpg';

interface MarketplaceHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  searchQuery,
  onSearchChange
}) => {
  const { currentPalette } = useTeamTheme();
  
  // Mock stats - in real app these would come from props or API
  const stats = [
    { label: 'Active Listings', value: '1,247', icon: ShoppingBag },
    { label: 'Total Sales', value: '₹124.5K', icon: TrendingUp },
    { label: 'Active Traders', value: '3,892', icon: Users },
    { label: 'Top Rated', value: '4.9★', icon: Star },
  ];

  return (
    <div className="relative bg-marketplace-hero overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="floating-cards-bg">
          {/* Floating 3D card previews - simplified for now */}
          <div className="absolute top-1/4 left-1/4 w-16 h-20 bg-crd-surface rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-16 bg-crd-surface-light rounded-lg transform -rotate-6 animate-pulse delay-300"></div>
          <div className="absolute bottom-1/3 left-1/3 w-14 h-18 bg-crd-hover rounded-lg transform rotate-45 animate-pulse delay-700"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-dm-sans text-display font-bold text-crd-text mb-4 animate-fade-in">
            Digital Card Marketplace
          </h1>
          <p className="text-large-body text-crd-text-dim max-w-2xl mx-auto animate-fade-in delay-200">
            Discover, trade, and collect premium digital cards from top creators worldwide. 
            Build your ultimate collection with CRD tokens.
          </p>
        </div>

        {/* Search Bar with Token Balance */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-crd-text-dim w-5 h-5" />
              <Input
                placeholder="Search cards, creators, or collections..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-14 text-lg bg-crd-surface/90 border-crd-border backdrop-blur-sm
                         focus:border-primary focus:ring-2 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-200
                         placeholder:text-crd-text-dim"
              />
            </div>
            <div className="lg:w-auto w-full">
              <TokenDisplay />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-crd-surface/80 backdrop-blur-sm border border-crd-border rounded-lg p-6 text-center
                       hover:bg-crd-surface-light/80 hover:border-primary/30 transition-all duration-200 animate-fade-in
                       hover:shadow-lg hover:shadow-primary/10"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${index === 0 ? 'text-primary' : index === 1 ? 'text-secondary' : index === 2 ? 'text-accent' : 'text-primary'}`} />
              <div className="text-2xl font-bold text-crd-text mb-1">{stat.value}</div>
              <div className="text-small-body text-crd-text-dim">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
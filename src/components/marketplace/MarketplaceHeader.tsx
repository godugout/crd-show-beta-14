import React from 'react';
import { TrendingUp, Users, ShoppingBag, Star } from 'lucide-react';

export const MarketplaceHeader = () => {
  const stats = [
    { label: 'Active Listings', value: '2,847', icon: ShoppingBag },
    { label: 'Total Sales', value: '15,234', icon: TrendingUp },
    { label: 'Active Traders', value: '1,892', icon: Users },
    { label: 'Top Rated', value: '4.8★', icon: Star },
  ];

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Digital Card Marketplace</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover, buy, and sell unique digital trading cards from creators worldwide
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
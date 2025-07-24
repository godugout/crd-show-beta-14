
import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Star, Zap, Palette } from 'lucide-react';
import { CRDCard, CRDButton } from '@/components/ui/design-system';
import { CardshowBrandService } from '@/services/cardshowBrandService';
import type { CardshowBrand } from '@/services/cardshowBrandService';
import { cn } from '@/lib/utils';

interface BrandDatabaseProps {
  onBrandSelect?: (brand: CardshowBrand) => void;
}

export const BrandDatabase: React.FC<BrandDatabaseProps> = ({ onBrandSelect }) => {
  const [brands, setBrands] = useState<CardshowBrand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<CardshowBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    filterBrands();
  }, [brands, searchTerm, selectedCategory, selectedRarity]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const brandData = await CardshowBrandService.getAllBrands();
      setBrands(brandData);
    } catch (error) {
      console.error('Failed to load brands:', error);
      // Fallback to empty array if database isn't ready
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBrands = () => {
    let filtered = brands;

    if (searchTerm) {
      filtered = filtered.filter(brand =>
        brand.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.dna_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.team_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(brand => brand.category === selectedCategory);
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter(brand => brand.rarity === selectedRarity);
    }

    setFilteredBrands(filtered);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-orange-400';
      case 'mythic': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const categories = ['all', 'Script', 'Bold', 'Retro', 'Modern', 'Fantasy', 'SciFi', 'Classic'];
  const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

  if (loading) {
    return (
      <CRDCard className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crd-blue mx-auto mb-4"></div>
        <p className="text-crd-lightGray">Loading brand database...</p>
      </CRDCard>
    );
  }

  // Show empty state if no brands loaded (database not ready)
  if (brands.length === 0) {
    return (
      <CRDCard className="p-8 text-center">
        <Database className="mx-auto mb-4 text-crd-lightGray" size={48} />
        <h3 className="text-lg font-semibold text-crd-white mb-2">Database Initializing</h3>
        <p className="text-crd-lightGray">
          The brand database is being set up. Please check back in a moment.
        </p>
        <CRDButton onClick={loadBrands} className="mt-4">
          Retry Loading
        </CRDButton>
      </CRDCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Database className="text-crd-blue" size={24} />
        <h2 className="text-2xl font-bold text-crd-white">Brand Database</h2>
        <span className="text-sm text-crd-lightGray">({brands.length} brands)</span>
      </div>

      {/* Search and Filters */}
      <CRDCard className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray" size={16} />
            <input
              type="text"
              placeholder="Search brands, teams, DNA codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg text-crd-white placeholder-crd-lightGray focus:border-crd-blue focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray" size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg text-crd-white focus:border-crd-blue focus:outline-none appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity Filter */}
          <div className="relative">
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray" size={16} />
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="pl-10 pr-8 py-2 bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg text-crd-white focus:border-crd-blue focus:outline-none appearance-none"
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? 'All Rarities' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CRDCard>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBrands.map((brand) => (
          <CRDCard 
            key={brand.id} 
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-crd-blue/50",
              onBrandSelect && "hover:bg-crd-blue/5"
            )}
            onClick={() => onBrandSelect?.(brand)}
          >
            {/* Brand Image */}
            <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-crd-darkGray border border-crd-mediumGray/30">
              <img
                src={brand.image_url}
                alt={brand.display_name}
                className="w-full h-full object-contain p-2"
                loading="lazy"
              />
            </div>

            {/* Brand Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-crd-white text-sm leading-tight">
                  {brand.display_name}
                </h3>
                <span className={cn("text-xs font-semibold", getRarityColor(brand.rarity))}>
                  {brand.rarity.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-crd-lightGray font-mono">
                {brand.dna_code}
              </p>

              {brand.team_name && (
                <p className="text-xs text-crd-blue">
                  {brand.team_name} {brand.team_city && `• ${brand.team_city}`}
                </p>
              )}

              {/* Color Palette Preview */}
              <div className="flex space-x-1">
                {brand.color_palette.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded border border-crd-mediumGray/30"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-crd-lightGray">
                <div className="flex items-center space-x-1">
                  <Zap size={12} />
                  <span>{brand.power_level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Palette size={12} />
                  <span>{brand.category}</span>
                </div>
              </div>
            </div>
          </CRDCard>
        ))}
      </div>

      {filteredBrands.length === 0 && !loading && brands.length > 0 && (
        <CRDCard className="p-8 text-center">
          <Database className="mx-auto mb-4 text-crd-lightGray" size={48} />
          <h3 className="text-lg font-semibold text-crd-white mb-2">No brands found</h3>
          <p className="text-crd-lightGray">
            Try adjusting your search terms or filters.
          </p>
        </CRDCard>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandDatabase } from './BrandDatabase';
import { Database, Zap, Palette, Star } from 'lucide-react';
import { CRDCard } from '@/components/ui/design-system';
import type { CardshowBrand } from '@/types/cardshowBrands';

export const CRDDNASystem = () => {
  const [selectedBrand, setSelectedBrand] = useState<CardshowBrand | null>(null);

  const handleBrandSelection = (brand: CardshowBrand) => {
    setSelectedBrand(brand);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-crd-darkGray border border-crd-mediumGray/30">
          <TabsTrigger 
            value="database" 
            className="flex items-center space-x-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white"
          >
            <Database size={16} />
            <span>Brand Database</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="flex items-center space-x-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white"
          >
            <Zap size={16} />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="management"
            className="flex items-center space-x-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white"
          >
            <Star size={16} />
            <span>Management</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BrandDatabase onBrandSelect={handleBrandSelection} />
            </div>
            
            <div className="space-y-4">
              {selectedBrand ? (
                <CRDCard className="p-6">
                  <h3 className="text-lg font-bold text-crd-white mb-4">Brand Details</h3>
                  
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-crd-darkGray border border-crd-mediumGray/30">
                      <img
                        src={selectedBrand.image_url}
                        alt={selectedBrand.display_name}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-bold text-crd-white">{selectedBrand.display_name}</h4>
                      <p className="text-sm text-crd-lightGray font-mono">{selectedBrand.dna_code}</p>
                      
                      {selectedBrand.team_name && (
                        <p className="text-sm text-crd-blue">
                          {selectedBrand.team_name}
                          {selectedBrand.team_city && ` • ${selectedBrand.team_city}`}
                          {selectedBrand.league && ` (${selectedBrand.league})`}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-crd-lightGray">Category:</span>
                          <p className="text-crd-white">{selectedBrand.category}</p>
                        </div>
                        <div>
                          <span className="text-crd-lightGray">Rarity:</span>
                          <p className="text-crd-white capitalize">{selectedBrand.rarity}</p>
                        </div>
                        <div>
                          <span className="text-crd-lightGray">Power Level:</span>
                          <p className="text-crd-white">{selectedBrand.power_level}/100</p>
                        </div>
                        <div>
                          <span className="text-crd-lightGray">Collectibility:</span>
                          <p className="text-crd-white">{selectedBrand.collectibility_score}/100</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-crd-lightGray text-xs">Color Palette:</span>
                        <div className="flex space-x-2 mt-1">
                          {selectedBrand.color_palette.map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded border border-crd-mediumGray/30"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {selectedBrand.description && (
                        <div>
                          <span className="text-crd-lightGray text-xs">Description:</span>
                          <p className="text-xs text-crd-white mt-1">{selectedBrand.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CRDCard>
              ) : (
                <CRDCard className="p-6 text-center">
                  <Palette className="mx-auto mb-4 text-crd-lightGray" size={48} />
                  <h3 className="text-lg font-semibold text-crd-white mb-2">Select a Brand</h3>
                  <p className="text-crd-lightGray text-sm">
                    Click on any brand in the database to view detailed information.
                  </p>
                </CRDCard>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CRDCard className="p-8 text-center">
            <Zap className="mx-auto mb-4 text-crd-blue" size={48} />
            <h3 className="text-xl font-semibold text-crd-white mb-2">Brand Analytics</h3>
            <p className="text-crd-lightGray">
              Usage statistics, popularity metrics, and performance analytics coming soon!
            </p>
          </CRDCard>
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <CRDCard className="p-8 text-center">
            <Star className="mx-auto mb-4 text-crd-purple" size={48} />
            <h3 className="text-xl font-semibold text-crd-white mb-2">Brand Management</h3>
            <p className="text-crd-lightGray">
              Admin tools for creating, editing, and managing brand entries coming soon!
            </p>
          </CRDCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

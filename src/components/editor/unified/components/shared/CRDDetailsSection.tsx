import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';

interface CRDDetailsSectionProps {
  cardData: CardData;
}

export const CRDDetailsSection = ({ cardData }: CRDDetailsSectionProps) => {
  // Generate a random serial number for demo purposes
  const serialNumber = React.useMemo(() => 
    Math.floor(Math.random() * 1000000).toString().padStart(6, '0'), 
    []
  );

  return (
    <div className="px-8 py-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <h3 className="text-crd-white font-semibold text-lg mb-3">CRD Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-crd-lightGray text-sm">Serial Number:</span>
              <span className="text-crd-white text-sm font-mono">#CRD-{serialNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-crd-lightGray text-sm">Edition:</span>
              <span className="text-crd-white text-sm">First Edition</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-crd-lightGray text-sm">Print Quality:</span>
              <span className="text-crd-green text-sm font-medium">Premium</span>
            </div>
          </div>
        </div>
        <div className="col-span-6 flex justify-center items-center">
          <div className="text-center">
            <p className="text-crd-lightGray text-sm mb-2">Authentication</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-crd-green rounded-full animate-pulse"></div>
              <span className="text-crd-green text-sm font-medium">Blockchain Verified</span>
            </div>
          </div>
        </div>
        <div className="col-span-3 text-right">
          <h4 className="text-crd-white font-semibold text-sm mb-2">Estimated Value</h4>
          <div className="text-2xl font-bold text-crd-green">
            ${cardData.rarity === 'legendary' ? '19.99' : 
              cardData.rarity === 'epic' ? '14.99' : 
              cardData.rarity === 'rare' ? '9.99' : '4.99'}
          </div>
          <p className="text-crd-lightGray text-xs">Based on rarity & effects</p>
        </div>
      </div>
    </div>
  );
};
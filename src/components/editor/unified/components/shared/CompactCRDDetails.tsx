import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';

interface CompactCRDDetailsProps {
  cardData: CardData;
}

export const CompactCRDDetails = ({ cardData }: CompactCRDDetailsProps) => {
  // Generate a random serial number for demo purposes
  const serialNumber = React.useMemo(() => 
    Math.floor(Math.random() * 1000000).toString().padStart(6, '0'), 
    []
  );

  const estimatedValue = cardData.rarity === 'legendary' ? '19.99' : 
    cardData.rarity === 'epic' ? '14.99' : 
    cardData.rarity === 'rare' ? '9.99' : '4.99';

  return (
    <div className="text-center">
      <div className="text-sm text-crd-white font-medium">
        #CRD-{serialNumber} • <span className="text-crd-green">✓ Verified</span>
      </div>
      <div className="text-xs text-crd-lightGray">
        ${estimatedValue} Est. Value • Premium Edition
      </div>
    </div>
  );
};
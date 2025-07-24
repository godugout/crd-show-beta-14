
import React from 'react';
import { Sparkles } from 'lucide-react';
import type { CardData } from '@/types/card';

interface AIAnalysisSummaryProps {
  cardData: Partial<CardData>;
}

export const AIAnalysisSummary = ({ cardData }: AIAnalysisSummaryProps) => {
  return (
    <div className="bg-crd-darkGray p-4 rounded-lg border border-crd-green/30">
      <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-crd-green" />
        AI Analysis Summary
      </h4>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-crd-lightGray">Type:</span>
          <span className="text-white ml-2">{cardData.type}</span>
        </div>
        <div>
          <span className="text-crd-lightGray">Series:</span>
          <span className="text-white ml-2">{cardData.series}</span>
        </div>
        <div>
          <span className="text-crd-lightGray">Tags:</span>
          <span className="text-white ml-2">{cardData.tags?.length || 0} generated</span>
        </div>
        <div>
          <span className="text-crd-lightGray">Rarity:</span>
          <span className="text-white ml-2">{cardData.rarity}</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Coins, Plus } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useTokens } from '@/hooks/useTokens';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { ComingSoonModal } from '@/components/monetization/ComingSoonModal';

interface TokenDisplayProps {
  className?: string;
  showPurchaseButton?: boolean;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ 
  className = '', 
  showPurchaseButton = true 
}) => {
  const { tokenBalance, isLoading } = useTokens();
  const { currentPalette } = useTeamTheme();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const balance = tokenBalance?.token_balance || 0;

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center ${className}`}>
        {/* Compact Token Balance with Purchase Button */}
        {showPurchaseButton ? (
          <CRDButton
            variant="outline"
            onClick={() => setShowPurchaseModal(true)}
            className="bg-crd-surface/90 border-accent/30 text-crd-text hover:bg-accent/10 hover:border-accent/50 
                     transition-all duration-200 px-3 py-2 flex items-center gap-2"
          >
            <Coins className="w-4 h-4 text-yellow-500" />
            <Plus className="w-3 h-3 text-accent" />
          </CRDButton>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-crd-surface/90 border border-accent/30 rounded-lg">
            <Coins className="w-4 h-4 text-accent" />
            <span className="text-crd-text font-medium text-sm">
              {balance.toLocaleString()}
            </span>
            <span className="text-accent text-xs">CRD</span>
          </div>
        )}
      </div>

      <ComingSoonModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Purchase CRD Tokens"
        description="Token purchasing will be available soon! $1 USD = 100 CRD tokens. Use tokens for marketplace purchases, auctions, and premium features."
        featureType="credits"
      />
    </>
  );
};
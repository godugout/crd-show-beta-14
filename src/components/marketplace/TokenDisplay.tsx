import React, { useState } from 'react';
import { Coins, Plus } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useTokens } from '@/hooks/useTokens';
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
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Token Balance Display */}
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <Coins className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">
            {balance.toLocaleString()}
          </span>
          <span className="text-yellow-600 dark:text-yellow-400 text-xs">CRD</span>
        </div>

        {/* Purchase Button */}
        {showPurchaseButton && (
          <CRDButton
            variant="outline"
            size="sm"
            onClick={() => setShowPurchaseModal(true)}
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-300 dark:hover:bg-yellow-900/20"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Buy Tokens</span>
            <span className="sm:hidden">Buy</span>
          </CRDButton>
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
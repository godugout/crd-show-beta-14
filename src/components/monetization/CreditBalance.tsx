import React, { useState } from 'react';
import { Coins, Plus } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useMonetizationTracking } from './hooks/useMonetizationTracking';
import { ComingSoonModal } from './ComingSoonModal';

interface CreditBalanceProps {
  balance?: number;
  className?: string;
}

export const CreditBalance: React.FC<CreditBalanceProps> = ({ 
  balance = 150, 
  className = '' 
}) => {
  const [showModal, setShowModal] = useState(false);
  const { trackEvent } = useMonetizationTracking();

  const handleAddCredits = () => {
    trackEvent('add_credits_clicked', { current_balance: balance });
    setShowModal(true);
  };

  return (
    <>
      <div className={`flex items-center ${className}`}>
        {/* Compact Credits Button with Balance */}
        <CRDButton
          variant="outline"
          size="sm"
          onClick={handleAddCredits}
          className="border-crd-gold/30 text-crd-gold hover:bg-crd-gold/10 min-h-[44px] px-3 py-2 flex items-center gap-2"
        >
          <Coins className="w-4 h-4 text-crd-gold" />
          <span className="text-crd-white font-medium text-sm">{balance.toLocaleString()}</span>
          <Plus className="w-3 h-3 text-crd-gold ml-1" />
        </CRDButton>
      </div>

      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Credits"
        description="Credit purchasing will be available soon! Track your usage and get ready for launch."
      />
    </>
  );
};
import React, { useState } from 'react';
import { Lock, Coins } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useMonetizationTracking } from './hooks/useMonetizationTracking';
import { ComingSoonModal } from './ComingSoonModal';

interface PremiumTooltipProps {
  children: React.ReactNode;
  cost: number;
  featureName: string;
  description?: string;
  isLocked?: boolean;
}

export const PremiumTooltip: React.FC<PremiumTooltipProps> = ({
  children,
  cost,
  featureName,
  description,
  isLocked = true
}) => {
  const [showModal, setShowModal] = useState(false);
  const { trackEvent } = useMonetizationTracking();

  const handleUnlockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    trackEvent('locked_feature_clicked', {
      feature: featureName,
      cost,
      description
    });
    
    setShowModal(true);
  };

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {children}
            {/* Lock overlay */}
            <div 
              className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center cursor-pointer transition-opacity hover:bg-black/70"
              onClick={handleUnlockClick}
            >
              <Lock className="w-6 h-6 text-crd-orange" />
            </div>
          </div>
        </TooltipTrigger>
        
        <TooltipContent className="bg-crd-darker border-crd-mediumGray/20 p-4 max-w-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-crd-orange" />
              <span className="text-crd-white font-medium">{featureName}</span>
            </div>
            
            {description && (
              <p className="text-crd-lightGray text-sm">{description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-crd-gold" />
                <span className="text-crd-gold font-medium">{cost} credits</span>
              </div>
              
              <CRDButton
                variant="outline"
                size="sm"
                onClick={handleUnlockClick}
                className="border-crd-orange/30 text-crd-orange hover:bg-crd-orange/10 text-xs px-2 py-1 h-auto"
              >
                Unlock
              </CRDButton>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Unlock Premium Feature"
        description={`${featureName} will cost ${cost} credits. Premium features will be available soon!`}
        featureType="premium"
      />
    </TooltipProvider>
  );
};
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Coins, Lock, Sparkles } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  featureType?: 'credits' | 'premium' | 'subscription';
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  featureType = 'credits'
}) => {
  const getIcon = () => {
    switch (featureType) {
      case 'premium': return <Lock className="w-6 h-6 text-crd-orange" />;
      case 'subscription': return <Sparkles className="w-6 h-6 text-crd-green" />;
      default: return <Coins className="w-6 h-6 text-crd-gold" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-crd-darker border-crd-mediumGray/20 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <DialogTitle className="text-crd-white">{title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-crd-lightGray">{description}</p>
          
          <div className="bg-crd-mediumGray/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-crd-green" />
              <span className="text-crd-white font-medium text-sm">Coming Soon</span>
            </div>
            <p className="text-crd-lightGray text-xs">
              We're working hard to bring you the best monetization experience. 
              Stay tuned for updates!
            </p>
          </div>

          <div className="flex gap-2">
            <CRDButton
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              Got it
            </CRDButton>
            <CRDButton
              variant="primary"
              size="sm"
              onClick={() => {
                // TODO: Add to newsletter/notifications
                onClose();
              }}
              className="flex-1"
            >
              Notify me
            </CRDButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
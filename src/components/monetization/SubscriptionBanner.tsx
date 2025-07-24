import React, { useState, useEffect } from 'react';
import { Sparkles, X, Crown, Zap, Star } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useMonetizationTracking } from './hooks/useMonetizationTracking';
import { ComingSoonModal } from './ComingSoonModal';

const BANNER_DISMISSED_KEY = 'subscription_banner_dismissed';

export const SubscriptionBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { trackEvent } = useMonetizationTracking();

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    setIsVisible(!dismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setIsVisible(false);
    trackEvent('subscription_banner_dismissed');
  };

  const handleUpgrade = () => {
    trackEvent('subscription_upgrade_clicked', { source: 'banner' });
    setShowModal(true);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-crd-green/20 to-crd-orange/20 border border-crd-green/30 rounded-lg p-4 mb-6 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-crd-lightGray hover:text-crd-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-crd-green to-crd-orange rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-black" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-crd-white font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-crd-green" />
              Upgrade to Creator Pro
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <Zap className="w-3 h-3 text-crd-orange" />
                Unlimited premium templates
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <Star className="w-3 h-3 text-crd-gold" />
                Advanced 3D effects
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <Crown className="w-3 h-3 text-crd-green" />
                Priority support
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CRDButton
                variant="primary"
                size="sm"
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-crd-green to-crd-orange text-black font-medium min-h-[44px]"
              >
                Upgrade Now
              </CRDButton>
              <span className="text-crd-lightGray text-sm">Starting at $9.99/month</span>
            </div>
          </div>
        </div>
      </div>

      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Creator Pro Subscription"
        description="Get unlimited access to premium features, templates, and priority support. Coming soon!"
        featureType="subscription"
      />
    </>
  );
};
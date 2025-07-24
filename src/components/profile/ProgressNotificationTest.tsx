import React from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { toast } from 'sonner';

// Development component to test progress notifications
export const ProgressNotificationTest = () => {
  const testNotifications = () => {
    // Simulate milestone notifications
    setTimeout(() => {
      toast.success('🎉 Toploader Case Unlocked!', {
        description: 'Card Creator: Create 5 cards',
        duration: 5000,
      });
    }, 500);

    setTimeout(() => {
      toast.success('🏆 Achievement Unlocked!', {
        description: 'Creator Debut: Create your first card',
        duration: 5000,
      });
    }, 1500);

    setTimeout(() => {
      toast.success('🎉 Premium Template Pack Unlocked!', {
        description: 'Template Explorer: Use 3 different templates',
        duration: 5000,
      });
    }, 2500);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="p-4 bg-crd-darker rounded-lg border border-crd-mediumGray">
      <h4 className="text-crd-white font-medium mb-2">Development Tools</h4>
      <CRDButton 
        onClick={testNotifications}
        variant="outline"
        size="sm"
      >
        Test Progress Notifications
      </CRDButton>
    </div>
  );
};
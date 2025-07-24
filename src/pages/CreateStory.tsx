import React from 'react';
import { CRDCardCreatorWrapper } from '@/components/editor/crd/CRDCardCreatorWrapper';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SubscriptionBanner } from '@/components/monetization/SubscriptionBanner';
import type { CardData } from '@/hooks/useCardEditor';

const CreateStory = () => {
  const navigate = useNavigate();

  console.log('CreateStory page loaded - Interactive story card creator');

  const handleComplete = (cardData: CardData) => {
    console.log('Story card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('Story card creation cancelled');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubscriptionBanner />
      </div>
      
      <ErrorBoundary>
        <CRDCardCreatorWrapper 
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CreateStory;

import React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState } from '@/components/common/LoadingState';
import { ShowcaseViewer } from '@/components/showcase/ShowcaseViewer';
import { useShowcaseState } from '@/components/showcase/hooks/useShowcaseState';

const Showcase = () => {
  const { cardId } = useParams();
  
  const {
    selectedCard,
    currentCardIndex,
    isLoading,
    mockCards,
    dataSource,
    slabConfig,
    setSlabConfig,
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  } = useShowcaseState(cardId);

  if (isLoading) {
    return <LoadingState message="Loading showcase..." fullPage />;
  }

  if (!selectedCard) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">No Card Selected</h2>
          <p className="text-crd-lightGray">Please select a card to showcase</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        <ShowcaseViewer
          card={selectedCard}
          cards={mockCards}
          currentCardIndex={currentCardIndex}
          onCardChange={handleCardChange}
          slabConfig={slabConfig}
          onSlabConfigChange={setSlabConfig}
          onClose={handleClose}
          onShare={handleShare}
          onDownload={handleDownload}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Showcase;

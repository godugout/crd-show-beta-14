import React from 'react';
import { PreloadedCRDEditor } from '@/components/editor/crd/PreloadedCRDEditor';
import { CRDEditorProvider } from '@/contexts/CRDEditorContext';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CreateFooter } from '@/components/create/CreateFooter';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCRD = () => {
  const navigate = useNavigate();

  console.log('CRD Collectibles page loaded - Professional card maker');

  const handleComplete = (cardData: CardData) => {
    console.log('CRD Collectible created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('CRD Collectible creation cancelled');
    navigate('/');
  };

  return (
    <CRDEditorProvider>
      <div className="flex flex-col min-h-screen bg-crd-darkest">
        {/* Main Content - Takes remaining space */}
        <div className="flex-1 relative">
          <ErrorBoundary>
            <PreloadedCRDEditor 
              onComplete={handleComplete}
              onCancel={handleCancel}
              isVisible={true}
            />
          </ErrorBoundary>
        </div>
        
        {/* Footer */}
        <CreateFooter />
      </div>
    </CRDEditorProvider>
  );
};

export default CreateCRD;
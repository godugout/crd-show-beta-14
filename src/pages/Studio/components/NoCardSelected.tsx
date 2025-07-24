
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Layers, Plus } from 'lucide-react';

export const NoCardSelected = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <Layers className="w-24 h-24 text-crd-mediumGray mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-crd-white mb-2">
            No Card Selected
          </h1>
          <p className="text-crd-lightGray">
            Choose a card from your gallery to view it in the 3D studio
          </p>
        </div>

        <div className="space-y-4">
          <CRDButton
            variant="primary"
            onClick={() => navigate('/gallery')}
            className="w-full"
          >
            <Layers className="w-4 h-4 mr-2" />
            Browse Gallery
          </CRDButton>

          <CRDButton
            variant="outline"
            onClick={() => navigate('/create')}
            className="w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Card
          </CRDButton>
        </div>
      </div>
    </div>
  );
};

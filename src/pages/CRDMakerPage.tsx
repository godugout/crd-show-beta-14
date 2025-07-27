import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { EnhancedCRDMaker } from '@/components/crdmkr/EnhancedCRDMaker';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CRDMakerPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = (cardData: any) => {
    console.log('CRDMKR process completed:', cardData);
    toast.success('CRD frames generated successfully!');
    navigate('/create/crd', {
      state: {
        importedFrames: cardData,
        source: 'crdmkr',
      },
    });
  };

  const handleCancel = () => {
    console.log('CRDMKR process cancelled');
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className='min-h-screen bg-crd-darkest'>
          <EnhancedCRDMaker />
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
};

export default CRDMakerPage;

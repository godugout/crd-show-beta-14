import React from 'react';
import { PreloadedCRDEditor } from '@/components/editor/crd/PreloadedCRDEditor';
import { CRDEditorProvider } from '@/contexts/CRDEditorContext';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CreateFooter } from '@/components/create/CreateFooter';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminTestingPanel } from '@/components/admin/AdminTestingPanel';
import { AdminFloatingButton } from '@/components/admin/AdminFloatingButton';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCRD = () => {
  const navigate = useNavigate();
  const adminPanel = useAdminPanel();

  console.log('CRD Collectibles page loaded - Professional card maker');

  const handleComplete = (cardData: CardData) => {
    console.log('CRD Collectible created successfully:', cardData);
    navigate('/user/gallery');
  };

  const handleCancel = () => {
    console.log('CRD Collectible creation cancelled');
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <CRDEditorProvider>
        <div className="flex flex-col min-h-screen bg-crd-darkest pt-16">
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
          
          {/* Admin Testing Panel */}
          <AdminTestingPanel 
            isOpen={adminPanel.isOpen} 
            onClose={adminPanel.close} 
          />
          
          {/* Admin Floating Button */}
          <AdminFloatingButton onOpenAdminPanel={adminPanel.open} />
          
          {/* Bottom hover trigger area for footer */}
          <div 
            className="fixed bottom-0 left-0 right-0 h-12 z-[99]"
            onMouseEnter={() => {
              const footer = document.querySelector('footer');
              if (footer) {
                footer.style.transform = 'translateY(0)';
                footer.style.opacity = '1';
              }
            }}
            onMouseLeave={() => {
              const footer = document.querySelector('footer');
              if (footer) {
                footer.style.transform = 'translateY(100%)';
                footer.style.opacity = '0';
              }
            }}
          />
        </div>
      </CRDEditorProvider>
    </ProtectedRoute>
  );
};

export default CreateCRD;
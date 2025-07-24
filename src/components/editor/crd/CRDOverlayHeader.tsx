import React from 'react';
import { ArrowLeft, Save, Share, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedNavbar } from '@/hooks/useEnhancedNavbar';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDOverlayHeaderProps {
  onSave?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  isSaving?: boolean;
}

export const CRDOverlayHeader: React.FC<CRDOverlayHeaderProps> = ({
  onSave,
  onShare,
  onExport,
  isSaving = false
}) => {
  const navigate = useNavigate();
  
  // Get prefersReducedMotion first
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { isVisible, isScrolled, scrollMetrics } = useEnhancedNavbar({ 
    threshold: 20, 
    hideOffset: 80,
    showDelay: prefersReducedMotion ? 0 : 100,
    hideDelay: prefersReducedMotion ? 0 : 200
  });

  const handleBack = () => {
    navigate('/');
  };

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 h-16
        ${prefersReducedMotion 
          ? 'transition-transform duration-200' 
          : scrollMetrics.isScrolling 
            ? 'transition-all duration-200 ease-out' 
            : 'transition-all duration-500 ease-out'
        }
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isScrolled 
          ? 'bg-[hsl(var(--theme-navbar-bg)/0.95)] backdrop-blur-lg border-b border-[hsl(var(--theme-navbar-border)/0.2)] shadow-lg' 
          : 'bg-[hsl(var(--theme-navbar-bg)/0.8)] backdrop-blur-sm'
        }
        ${scrollMetrics.isScrolling ? 'scale-[0.995]' : 'scale-100'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left: Back button with enhanced animation */}
          <div className={`flex items-center space-x-4 transition-all duration-200 ${scrollMetrics.isScrolling ? 'scale-[0.98]' : 'scale-100'}`}>
            <CRDButton
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className={`
                text-crd-lightGray hover:text-crd-white transition-all duration-200 group
                min-h-[44px] min-w-[44px]
                ${!prefersReducedMotion ? 'hover:scale-105' : ''}
              `}
            >
              <ArrowLeft className={`w-4 h-4 mr-2 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:-translate-x-1' : ''}`} />
              <span className="hidden sm:inline">Back</span>
            </CRDButton>
          </div>

          {/* Right: Action buttons with enhanced animation */}
          <div className={`flex items-center space-x-1 sm:space-x-2 transition-all duration-200 ${scrollMetrics.isScrolling ? 'scale-[0.98]' : 'scale-100'}`}>
            {onSave && (
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className={`text-crd-lightGray hover:text-crd-white transition-all duration-200 min-h-[44px] min-w-[44px] ${!prefersReducedMotion ? 'hover:scale-105' : ''}`}
              >
                <Save className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              </CRDButton>
            )}
            
            {onShare && (
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={onShare}
                className={`text-crd-lightGray hover:text-crd-white transition-all duration-200 min-h-[44px] min-w-[44px] ${!prefersReducedMotion ? 'hover:scale-105' : ''}`}
              >
                <Share className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </CRDButton>
            )}
            
            {onExport && (
              <CRDButton
                variant="primary"
                size="sm"
                onClick={onExport}
                className={`bg-crd-blue hover:bg-crd-blue/90 text-white transition-all duration-200 min-h-[44px] min-w-[44px] ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-lg' : ''}`}
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </CRDButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
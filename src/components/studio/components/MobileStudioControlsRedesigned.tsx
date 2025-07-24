import React, { useState, useEffect } from 'react';
import { ChevronUp, Settings, Share2, Download, X, Palette, Camera, Grid3X3, ChevronLeft, ChevronRight, HelpCircle, Zap, Vibrate } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StudioCaseSelector, type CaseStyle } from './StudioCaseSelector';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { MobileOnboardingTour } from './MobileOnboardingTour';
import { ProgressiveDisclosurePanel } from './ProgressiveDisclosurePanel';
import { MobilePerformanceOptimizer } from './MobilePerformanceOptimizer';
import { HapticTestingPanel } from './HapticTestingPanel';
import type { CardData } from '@/types/card';

interface MobileStudioControlsRedesignedProps {
  selectedCard: CardData;
  selectedCase: CaseStyle;
  onCaseChange: (caseStyle: CaseStyle) => void;
  onShare: (card: CardData) => void;
  onDownload: (card: CardData) => void;
  onClose: () => void;
  use3DMode?: boolean;
  onToggle3D?: () => void;
  cards?: CardData[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
}

export const MobileStudioControlsRedesigned: React.FC<MobileStudioControlsRedesignedProps> = ({
  selectedCard,
  selectedCase,
  onCaseChange,
  onShare,
  onDownload,
  onClose,
  use3DMode = true,
  onToggle3D,
  cards = [],
  currentCardIndex = 0,
  onCardChange
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [activeTab, setActiveTab] = useState<'controls' | 'performance' | 'haptics'>('controls');
  const [showHapticTesting, setShowHapticTesting] = useState(false);
  const { isMobile } = useResponsiveBreakpoints();
  const { medium, light, cardFlip, studioEnter } = useHapticFeedback();

  
  // Check if this is the user's first time (in a real app, this would be stored in user preferences)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('studio-onboarding-seen');
    if (!hasSeenOnboarding && isMobile) {
      setShowOnboarding(true);
    }
    
    // Haptic feedback when entering studio
    if (isMobile) {
      studioEnter();
    }
  }, [isMobile, studioEnter]);

  const handleActionWithHaptic = (action: () => void) => {
    light();
    action();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('studio-onboarding-seen', 'true');
    medium(); // Success haptic
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('studio-onboarding-seen', 'true');
    light();
  };

  // Enhanced navigation with haptic feedback
  const handlePreviousCard = () => {
    if (onCardChange && currentCardIndex > 0) {
      cardFlip();
      onCardChange(currentCardIndex - 1);
    }
  };

  const handleNextCard = () => {
    if (onCardChange && currentCardIndex < cards.length - 1) {
      cardFlip();
      onCardChange(currentCardIndex + 1);
    }
  };

  if (!isMobile) {
    return null; // Only show on mobile
  }

  return (
    <>
      {/* Mobile Onboarding Tour */}
      <MobileOnboardingTour
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        {/* Help button - separate from main FAB */}
        <div className="mb-3">
          <CRDButton
            variant="outline"
            size="sm"
            onClick={() => {
              light();
              setShowOnboarding(true);
            }}
            className="w-12 h-12 rounded-full shadow-lg bg-themed-base/90 backdrop-blur-sm border border-themed-accent/20"
            data-testid="help-button"
          >
            <HelpCircle className="w-5 h-5" />
          </CRDButton>
        </div>
        {/* Main FAB */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <CRDButton
              variant="primary"
              size="lg"
              className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-themed-accent/20"
              data-testid="mobile-fab"
              onClick={() => {
                medium();
                setIsDrawerOpen(true);
              }}
            >
              <Settings className="w-6 h-6" />
            </CRDButton>
          </SheetTrigger>

          <SheetContent 
            side="bottom" 
            className="bg-themed-base border-t-2 border-themed-accent/20 rounded-t-2xl"
            style={{
              maxHeight: '85vh',
              paddingBottom: 'env(safe-area-inset-bottom, 1rem)'
            }}
          >
            <SheetHeader className="pb-4 border-b border-themed-light">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-themed-primary text-lg font-semibold">
                  Studio Controls
                </SheetTitle>
                <div className="flex items-center gap-2">
                  {/* Enhanced tab switcher with haptics option */}
                  <div className="flex bg-themed-light rounded-lg p-1">
                    <button
                      onClick={() => {
                        light();
                        setActiveTab('controls');
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        activeTab === 'controls'
                          ? 'bg-themed-accent text-white'
                          : 'text-themed-secondary hover:text-themed-primary'
                      }`}
                    >
                      Controls
                    </button>
                    <button
                      onClick={() => {
                        light();
                        setActiveTab('performance');
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        activeTab === 'performance'
                          ? 'bg-themed-accent text-white'
                          : 'text-themed-secondary hover:text-themed-primary'
                      }`}
                    >
                      Performance
                    </button>
                    <button
                      onClick={() => {
                        light();
                        setActiveTab('haptics');
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        activeTab === 'haptics'
                          ? 'bg-themed-accent text-white'
                          : 'text-themed-secondary hover:text-themed-primary'
                      }`}
                    >
                      Haptics
                    </button>
                  </div>
                  
                  <CRDButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-8 h-8 p-0 text-themed-secondary hover:text-themed-primary"
                  >
                    <X className="w-4 h-4" />
                  </CRDButton>
                </div>
              </div>
              
              {/* Card Summary */}
              <div className="flex items-center gap-3 pt-3">
                <div className="w-12 h-16 bg-themed-light rounded-lg overflow-hidden">
                  <img 
                    src={selectedCard.image_url || '/placeholder.svg'} 
                    alt={selectedCard.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-themed-primary font-semibold text-sm truncate">
                    {selectedCard.title}
                  </h3>
                  <p className="text-themed-secondary text-xs truncate">
                    {selectedCard.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block px-2 py-0.5 bg-themed-accent/20 rounded text-xs text-themed-strong capitalize">
                      {selectedCard.rarity || 'common'}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              <div className="space-y-6 py-4">
                
                {/* Enhanced conditional content with haptics tab */}
                {activeTab === 'controls' ? (
                  <ProgressiveDisclosurePanel
                    selectedCard={selectedCard}
                    selectedCase={selectedCase}
                    onCaseChange={onCaseChange}
                    userExperienceLevel={experienceLevel}
                    onExperienceLevelChange={setExperienceLevel}
                  />
                ) : activeTab === 'performance' ? (
                  <MobilePerformanceOptimizer
                    onSettingsChange={(settings) => {
                      console.log('🎛️ Performance settings changed:', settings);
                      // Apply performance settings to the 3D renderer
                    }}
                    autoOptimize={true}
                  />
                ) : (
                  // Haptics tab content
                  <div className="space-y-4">
                    <div className="bg-themed-light/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Vibrate className="w-4 h-4 text-themed-accent" />
                        <span className="text-sm font-medium text-themed-primary">
                          Haptic Feedback
                        </span>
                      </div>
                      <p className="text-xs text-themed-secondary mb-4">
                        Premium haptic feedback enhances your studio experience with 
                        tactile responses for every interaction.
                      </p>
                      <CRDButton
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          medium();
                          setShowHapticTesting(true);
                        }}
                        className="w-full"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Test & Calibrate Haptics
                      </CRDButton>
                    </div>
                    
                    <div className="bg-themed-light/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-themed-primary mb-3">
                        Quick Tests
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <CRDButton
                          variant="outline"
                          size="sm"
                          onClick={() => light()}
                          className="text-xs"
                        >
                          Light
                        </CRDButton>
                        <CRDButton
                          variant="outline"
                          size="sm"
                          onClick={() => medium()}
                          className="text-xs"
                        >
                          Medium
                        </CRDButton>
                        <CRDButton
                          variant="outline"
                          size="sm"
                          onClick={() => cardFlip()}
                          className="text-xs"
                        >
                          Card Flip
                        </CRDButton>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Safe Area */}
            <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Haptic Testing Panel */}
      <HapticTestingPanel
        isVisible={showHapticTesting}
        onClose={() => setShowHapticTesting(false)}
      />

      {/* Quick Access Mini Panel */}
      <div 
        className="fixed bottom-6 left-6 z-40 lg:hidden bg-themed-base/90 backdrop-blur-sm border border-themed-light rounded-2xl p-3 shadow-lg"
        style={{
          marginBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-10 bg-themed-light rounded overflow-hidden">
            <img 
              src={selectedCard.image_url || '/placeholder.svg'} 
              alt={selectedCard.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-themed-primary text-xs font-medium truncate max-w-[120px]">
              {selectedCard.title}
            </span>
            <span className="text-themed-secondary text-xs capitalize">
              {selectedCard.rarity || 'common'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
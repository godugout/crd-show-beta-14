import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { StudioCardManager } from '@/components/studio/StudioCardManager';
import { ProfessionalWorkspace } from '@/components/studio/workspace';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { MobileStudioControlsRedesigned } from '@/components/studio/components/MobileStudioControlsRedesigned';
import { EnhancedMobileStudioInteractions } from '@/components/studio/components/EnhancedMobileStudioInteractions';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import type { CaseStyle } from '@/components/studio/components/StudioCaseSelector';
import { useStudioState } from './Studio/hooks/useStudioState';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { CardData } from '@/types/card';

// Helper function to convert CardData to the format expected by ImmersiveCardViewer
const convertCardForViewer = (card: CardData) => {
  console.log('🔄 Converting card for viewer:', card.title, 'Image URL:', card.image_url);
  
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url, // Ensure image_url is preserved
    thumbnail_url: card.thumbnail_url,
    tags: card.tags,
    design_metadata: card.design_metadata,
    visibility: card.visibility,
    template_id: card.template_id,
    // Map epic to legendary for compatibility with viewer, but preserve others
    rarity: card.rarity === 'epic' ? 'legendary' as const : 
           card.rarity as 'common' | 'uncommon' | 'rare' | 'legendary',
    // Ensure creator_attribution has required properties for viewer
    creator_attribution: {
      creator_name: card.creator_attribution?.creator_name || 'Unknown Creator',
      creator_id: card.creator_attribution?.creator_id || '',
      collaboration_type: (card.creator_attribution?.collaboration_type as 'solo' | 'collaboration') || 'solo'
    },
    // Ensure publishing_options has required properties for viewer
    publishing_options: {
      marketplace_listing: card.publishing_options?.marketplace_listing ?? false,
      crd_catalog_inclusion: card.publishing_options?.crd_catalog_inclusion ?? false,
      print_available: card.publishing_options?.print_available ?? false,
      pricing: card.publishing_options?.pricing,
      distribution: {
        limited_edition: card.publishing_options?.distribution?.limited_edition ?? false,
        edition_size: card.publishing_options?.distribution?.edition_size
      }
    },
    verification_status: card.verification_status,
    print_metadata: card.print_metadata,
    creator_id: card.creator_id,
    // Add properties that might be needed
    is_public: card.visibility === 'public',
    collection_id: card.collection_id,
    team_id: card.team_id,
    view_count: card.view_count,
    created_at: card.created_at
  };
};

const Studio = () => {
  const { cardId } = useParams();
  const { user } = useAuth();
  const { deviceType } = useResponsiveBreakpoints();
  const [showSeedPrompt, setShowSeedPrompt] = useState(false);
  const [hasCheckedDatabase, setHasCheckedDatabase] = useState(false);
  const [useWorkspaceMode, setUseWorkspaceMode] = useState(false);
  const [use3DMode, setUse3DMode] = useState(true); // Toggle between 3D and immersive modes
  const [selectedCase, setSelectedCase] = useState<CaseStyle>('none');
  
  const {
    selectedCard,
    currentCardIndex,
    isLoading,
    mockCards,
    dataSource,
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  } = useStudioState(cardId);

  console.log('🎮 Studio: Rendering with cardId:', cardId, 'selectedCard:', selectedCard?.title);

  // Check if database has cards and show seed prompt if needed
  useEffect(() => {
    const checkDatabase = async () => {
      if (!user || hasCheckedDatabase) return;
      
      try {
        const hasCards = await checkIfDatabaseHasCards();
        console.log('🔍 Database check result:', hasCards ? 'Has cards' : 'Empty');
        if (!hasCards) {
          setShowSeedPrompt(true);
        }
        setHasCheckedDatabase(true);
      } catch (error) {
        console.error('❌ Studio: Error checking database:', error);
        setHasCheckedDatabase(true);
        
        // Don't show seed prompt if there's a database error
        // The app can still function with mock data
        if (error instanceof Error && error.message.includes('auth')) {
          console.warn('⚠️ Studio: Authentication error - continuing with mock data');
        } else {
          console.warn('⚠️ Studio: Database error - continuing with mock data');
        }
      }
    };

    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (!hasCheckedDatabase) {
        console.warn('⚠️ Studio: Database check timeout - continuing with mock data');
        setHasCheckedDatabase(true);
      }
    }, 5000);

    checkDatabase().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
  }, [user, hasCheckedDatabase]);

  // Auto-enable workspace mode on desktop - MOVED BEFORE EARLY RETURNS
  useEffect(() => {
    if (deviceType === 'desktop' && !useWorkspaceMode) {
      setUseWorkspaceMode(true);
    } else if (deviceType === 'mobile' && useWorkspaceMode) {
      setUseWorkspaceMode(false);
    }
  }, [deviceType, useWorkspaceMode]);

  const handleSeedComplete = () => {
    setShowSeedPrompt(false);
    console.log('🌱 Database seeded, reloading studio...');
    // Trigger a reload of the studio state
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingState message="Loading studio..." fullPage />;
  }

  // Show seed prompt if database is empty and user is authenticated
  if (showSeedPrompt && user && dataSource !== 'database') {
    return <DatabaseSeedPrompt onSeedComplete={handleSeedComplete} />;
  }

  if (!selectedCard) {
    return <NoCardSelected />;
  }

  // Debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎮 Studio rendering card: ${selectedCard.title} from ${dataSource} source`);
    console.log('🖼️ Card image URL:', selectedCard.image_url);
  }

  // Convert card and mockCards for viewer compatibility
  const viewerCard = convertCardForViewer(selectedCard);
  const viewerCards = mockCards.map(convertCardForViewer);

  console.log('🎯 Converted viewer card:', viewerCard.title, 'Image URL:', viewerCard.image_url);

  const handleViewerShare = (card: any) => {
    // Convert back to original CardData format for the handler
    const originalCard: CardData = {
      ...card,
      rarity: card.rarity === 'ultra-rare' ? 'epic' : card.rarity
    };
    handleShare(originalCard);
  };

  const handleViewerDownload = (card: any) => {
    // Convert back to original CardData format for the handler
    const originalCard: CardData = {
      ...card,
      rarity: card.rarity === 'ultra-rare' ? 'epic' : card.rarity
    };
    handleDownload(originalCard);
  };

  // Professional workspace mode for desktop
  if (useWorkspaceMode && deviceType !== 'mobile') {
    return (
      <ErrorBoundary>
        <div className="w-full h-screen bg-background">
          <ProfessionalWorkspace
            card={viewerCard}
            cards={viewerCards}
            currentCardIndex={currentCardIndex}
            onCardChange={handleCardChange}
            onShare={handleViewerShare}
            onDownload={handleViewerDownload}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Mobile/tablet interface (existing layout)
  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-crd-darkest flex flex-col relative">
        
        {/* Header with workspace toggle */}
        <div className="lg:hidden bg-crd-darker/50 backdrop-blur-sm border-b border-crd-mediumGray/20 px-4 py-3 relative z-10" 
             style={{ marginTop: 'var(--navbar-height)' }}>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-crd-white">Studio</h1>
            {deviceType === 'tablet' && (
              <button
                onClick={() => setUseWorkspaceMode(!useWorkspaceMode)}
                className="text-xs bg-primary px-2 py-1 rounded text-primary-foreground"
              >
                Pro Mode
              </button>
            )}
          </div>
        </div>

        {/* Main Content - Full Height */}
        <div className="flex-1 relative">
          <EnhancedMobileStudioInteractions
            cards={mockCards}
            currentCardIndex={currentCardIndex}
            onCardChange={handleCardChange}
            onRefresh={async () => {
              console.log('🔄 Refreshing studio data...');
              // Add refresh logic here - reload cards, update data, etc.
              await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh
            }}
            onRotationChange={(rotation) => {
              console.log('🔄 Card rotation changed:', rotation);
              // Handle rotation changes for 3D card
            }}
          >
            {use3DMode ? (
              <StudioCardManager
                cards={mockCards}
                selectedCardIndex={currentCardIndex}
                onCardSelect={handleCardChange}
                enableInteraction={true}
                showGrid={process.env.NODE_ENV === 'development'}
                cameraControls={true}
              />
            ) : (
              <ImmersiveCardViewer
                card={viewerCard}
                cards={viewerCards}
                currentCardIndex={currentCardIndex}
                onCardChange={handleCardChange}
                isOpen={true}
                onClose={handleClose}
                onShare={handleViewerShare}
                onDownload={handleViewerDownload}
                allowRotation={true}
                showStats={true}
                ambient={true}
              />
            )}
          </EnhancedMobileStudioInteractions>
        </div>

        {/* Mobile Controls - FAB + Drawer Pattern */}
        <MobileStudioControlsRedesigned
          selectedCard={selectedCard}
          selectedCase={selectedCase}
          onCaseChange={setSelectedCase}
          onShare={handleShare}
          onDownload={handleDownload}
          onClose={handleClose}
          use3DMode={use3DMode}
          onToggle3D={() => setUse3DMode(!use3DMode)}
          cards={mockCards}
          currentCardIndex={currentCardIndex}
          onCardChange={handleCardChange}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Studio;

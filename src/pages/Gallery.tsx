
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CardGrid } from '@/components/cards/CardGrid';
import { useCards } from '@/hooks/useCards';
import { LoadingState } from '@/components/common/LoadingState';
import { useCardConversion } from './Gallery/hooks/useCardConversion';
import { SubscriptionBanner } from '@/components/monetization/SubscriptionBanner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Button } from '@/components/ui/button';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const { cards, featuredCards, loading, dataSource } = useCards();
  const { convertCardsToCardData } = useCardConversion();

  console.log('🎨 Gallery: Rendering with cards:', cards.length, 'featured:', featuredCards.length, 'source:', dataSource);

  if (loading) {
    return <LoadingState message="Loading gallery..." fullPage />;
  }

  const getDisplayCards = () => {
    // Convert database cards to CardData format for display
    const allCardsConverted = convertCardsToCardData(cards);
    const featuredCardsConverted = convertCardsToCardData(featuredCards);
    
    console.log('🎨 Gallery getDisplayCards debug:', {
      activeTab,
      allCardsCount: allCardsConverted.length,
      featuredCardsCount: featuredCardsConverted.length,
      rawCardsCount: cards.length,
      rawFeaturedCount: featuredCards.length
    });

    const filterValidCards = (cardList: any[]) => {
      return cardList.filter(card => {
        const hasValidImage = card.image_url && 
          !card.image_url.startsWith('blob:') && 
          !card.image_url.includes('undefined');
        
        if (!hasValidImage) {
          console.log('🎨 Filtering out card with invalid image:', card.title, card.image_url);
        }
        
        return hasValidImage || !card.image_url;
      });
    };
    
    switch (activeTab) {
      case 'featured':
        const validFeatured = filterValidCards(featuredCardsConverted);
        const result = validFeatured.length > 0 ? validFeatured : filterValidCards(allCardsConverted).slice(0, 8);
        console.log('🎨 Featured cards result:', result.length);
        return result;
        
      case 'trending':
        const validAll = filterValidCards(allCardsConverted);
        const cardsWithViews = validAll.filter(card => (card.view_count || 0) > 0);
        const trendingResult = cardsWithViews.length > 0 
          ? cardsWithViews.slice(0, 20)
          : validAll.sort((a, b) => {
              const aDate = new Date(a.created_at || 0).getTime();
              const bDate = new Date(b.created_at || 0).getTime();
              return bDate - aDate;
            }).slice(0, 20);
        console.log('🎨 Trending cards result:', trendingResult.length, 'from', cardsWithViews.length, 'with views');
        return trendingResult;
        
      case 'new':
        const validNew = filterValidCards(allCardsConverted);
        const newResult = validNew.sort((a, b) => {
          const aDate = new Date(a.created_at || 0).getTime();
          const bDate = new Date(b.created_at || 0).getTime();
          return bDate - aDate;
        }).slice(0, 20);
        console.log('🎨 New cards result:', newResult.length);
        return newResult;
        
      default:
        const defaultResult = filterValidCards(allCardsConverted);
        console.log('🎨 Default cards result:', defaultResult.length);
        return defaultResult;
    }
  };

  const displayCards = getDisplayCards();
  console.log('🎨 Gallery: Displaying', displayCards.length, 'cards for tab:', activeTab);

  const gridCards = displayCards.map(card => ({
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    price: card.price?.toString() || undefined
  }));

  return (
    <div className="fixed inset-0 bg-crd-darkest overflow-hidden">
      <div className="h-full pt-16">
        <div className="h-full flex flex-col">
          {/* Breadcrumb and Header */}
          <div className="flex-shrink-0 h-16 px-6 border-b border-crd-mediumGray/20 bg-crd-darker/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link to="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">Gallery</span>
              </div>
              
              <div className="h-6 w-px bg-crd-mediumGray/40"></div>
              
              <div className="flex items-center gap-2 text-xs text-crd-lightGray">
                <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
                  {displayCards.length} Cards
                </div>
                <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </div>
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
                    {dataSource}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/collections">
                <Button variant="outline" size="sm" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Collections
                </Button>
              </Link>
              <CRDButton asChild variant="primary" size="sm">
                <Link to="/create/crd">
                  Create CRD
                </Link>
              </CRDButton>
            </div>
          </div>

          {/* Gallery Header with Tabs */}
          <div className="flex-shrink-0 px-6 py-4 bg-crd-darker/30 border-b border-crd-mediumGray/10">
            <GalleryHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto bg-crd-darkest">
            <div className="p-6">
              <SubscriptionBanner />
              
              <div className="w-full">
                <CardGrid 
                  cards={gridCards}
                  loading={false}
                  viewMode="grid"
                  useProgressiveLoading={false}
                />
                
                {displayCards.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <div className="bg-crd-darker/30 border border-crd-mediumGray/20 rounded-xl p-12 max-w-md mx-auto">
                      <h3 className="text-xl font-semibold text-crd-white mb-4">No Cards Found</h3>
                      <p className="text-crd-lightGray mb-6">
                        {cards.length === 0 
                          ? "No cards have been created yet. Start by creating your first card!"
                          : "No cards match the current filter. Try switching tabs or check other categories."
                        }
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {cards.length === 0 && (
                          <CRDButton asChild variant="primary">
                            <Link to="/create/crd">
                              Create Your First Card
                            </Link>
                          </CRDButton>
                        )}
                        <Button asChild variant="outline" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
                          <Link to="/collections">
                            Browse Collections
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Grid3X3, List, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LoadingState } from '@/components/common/LoadingState';
import { crdDataService } from '@/services/crdDataService';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';
import type { CardData } from '@/types/card';

const UserGallery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to view your gallery');
      navigate('/auth/signin');
      return;
    }
  }, [user, navigate]);

  // Function to normalize card data from different sources
  const normalizeCardData = (card: any): CardData => {
    return {
      id: card.id,
      title: card.title,
      description: card.description,
      rarity: card.rarity || 'common',
      tags: card.tags || [],
      image_url: card.image_url,
      thumbnail_url: card.thumbnail_url,
      visibility: card.visibility || 'private',
      is_public: card.is_public || false,
      template_id: card.template_id,
      collection_id: card.collection_id,
      team_id: card.team_id,
      creator_id: card.creator_id,
      price: card.price,
      edition_size: card.edition_size,
      marketplace_listing: card.marketplace_listing,
      crd_catalog_inclusion: card.crd_catalog_inclusion,
      print_available: card.print_available,
      view_count: card.view_count,
      created_at: card.created_at,
      type: card.type,
      series: card.series,
      isLocal: card.isLocal,
      design_metadata: card.design_metadata || {},
      creator_attribution: card.creator_attribution || {
        creator_id: card.creator_id,
        collaboration_type: 'solo'
      },
      publishing_options: card.publishing_options || {
        marketplace_listing: card.marketplace_listing || false,
        crd_catalog_inclusion: card.crd_catalog_inclusion !== false,
        print_available: card.print_available || false
      },
      verification_status: card.verification_status || 'pending',
      print_metadata: card.print_metadata || {}
    };
  };

  // Load cards from both crdDataService and database
  useEffect(() => {
    const loadCards = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log('📖 Loading cards from both IndexedDB and database...');
        
        // Load from IndexedDB (crdDataService)
        const localCards = await crdDataService.getAllCards();
        console.log('📊 Loaded local cards:', localCards);
        
        // Load from database (if available)
        let databaseCards: any[] = [];
        try {
          // Import the card fetching service dynamically to avoid dependency issues
          const { CardFetchingService } = await import('@/services/cardFetching');
          databaseCards = await CardFetchingService.fetchUserCards(user.id);
          console.log('📊 Loaded database cards:', databaseCards);
        } catch (error) {
          console.log('📝 Database cards not available, using local only:', error);
        }
        
        // Normalize and combine cards from both sources
        const normalizedLocalCards = localCards.map(normalizeCardData);
        const normalizedDatabaseCards = databaseCards.map(normalizeCardData);
        
        // Combine cards, preferring local for duplicates
        const localCardIds = new Set(normalizedLocalCards.map(card => card.id));
        const combinedCards = [
          ...normalizedLocalCards,
          ...normalizedDatabaseCards.filter(card => !localCardIds.has(card.id))
        ];
        
        // Filter cards for current user
        const userCards = combinedCards.filter(card => card.creator_id === user.id);
        setCards(userCards);
        
        console.log(`✅ Loaded ${userCards.length} total cards for user ${user.id} (${localCards.length} local, ${databaseCards.length} database)`);
      } catch (error) {
        console.error('❌ Error loading cards:', error);
        toast.error('Failed to load your cards');
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [user]);

  // Filter cards based on search term
  const filteredCards = cards.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (card.description && card.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <LoadingState message="Loading your gallery..." fullPage />;
  }

  if (!user) {
    return null; // Will redirect to sign in
  }

  return (
    <div className="min-h-screen bg-crd-darkest pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Gallery</h1>
            <p className="text-crd-lightGray">
              {cards.length} {cards.length === 1 ? 'card' : 'cards'} created
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => navigate('/cards/create')}
              className="bg-crd-primary hover:bg-crd-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Card
            </Button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
            <Input
              placeholder="Search your cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-crd-darker border-crd-mediumGray text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="border-crd-mediumGray"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="border-crd-mediumGray"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Cards Display */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-crd-darker border border-crd-mediumGray rounded-xl p-12 max-w-md mx-auto">
              {cards.length === 0 ? (
                <>
                  <h3 className="text-xl font-semibold text-white mb-4">No Cards Yet</h3>
                  <p className="text-crd-lightGray mb-6">
                    Create your first card to get started with your collection!
                  </p>
                  <Button 
                    onClick={() => navigate('/cards/create')}
                    className="bg-crd-primary hover:bg-crd-primary/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Card
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white mb-4">No Matching Cards</h3>
                  <p className="text-crd-lightGray mb-6">
                    No cards match your search "{searchTerm}". Try a different search term.
                  </p>
                  <Button 
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    className="border-crd-mediumGray text-white hover:bg-crd-mediumGray"
                  >
                    Clear Search
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredCards.map((card) => (
              <CardItem 
                key={card.id} 
                card={card} 
                viewMode={viewMode}
                onCardUpdated={() => {
                  // Refresh cards when one is updated
                  crdDataService.getAllCards().then(allCards => {
                    const userCards = allCards.filter(c => c.creator_id === user.id);
                    setCards(userCards);
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CardItemProps {
  card: CardData;
  viewMode: 'grid' | 'list';
  onCardUpdated: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, viewMode, onCardUpdated }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to card detail or edit view
    navigate(`/cards/${card.id}`);
  };

  if (viewMode === 'list') {
    return (
      <Card className="p-4 bg-crd-darker border-crd-mediumGray hover:border-crd-primary transition-colors cursor-pointer">
        <div className="flex items-center gap-4" onClick={handleCardClick}>
          <div className="w-16 h-16 bg-crd-mediumGray rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-crd-lightGray text-xs">No Image</div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{card.title}</h3>
            {card.description && (
              <p className="text-crd-lightGray text-sm mt-1 line-clamp-2">
                {card.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-crd-lightGray">
              <span>Created {new Date(card.created_at).toLocaleDateString()}</span>
              <span className="capitalize">{card.rarity}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-crd-darker border-crd-mediumGray hover:border-crd-primary transition-colors cursor-pointer">
      <div onClick={handleCardClick}>
        {/* Card Image */}
        <div className="aspect-[3/4] bg-crd-mediumGray flex items-center justify-center overflow-hidden">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-crd-lightGray">No Image</div>
          )}
        </div>
        
        {/* Card Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-2 line-clamp-2">{card.title}</h3>
          {card.description && (
            <p className="text-crd-lightGray text-sm mb-3 line-clamp-3">
              {card.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-crd-lightGray">
            <span className="capitalize">{card.rarity}</span>
            <span>{new Date(card.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserGallery;
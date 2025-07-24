
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { CardData } from '@/types/card';
import { mockCards as fallbackMockCards } from '../mockData';
import { useCards } from '@/hooks/useCards';
import { useCardConversion } from '@/pages/Gallery/hooks/useCardConversion';

export const useStudioState = (cardId?: string) => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'database' | 'mock' | 'none'>('none');

  const { featuredCards, loading: cardsLoading } = useCards();
  const { convertCardsToCardData } = useCardConversion();

  // Load card data based on URL params and available data
  useEffect(() => {
    if (cardsLoading) {
      setIsLoading(true);
      return;
    }

    console.log('🏗️ Studio: Processing card data...');
    console.log('📊 Featured cards from database:', featuredCards?.length || 0);

    // Convert database cards to CardData format
    const dbCards = convertCardsToCardData(featuredCards || []);
    console.log('🔄 Converted database cards:', dbCards.length);

    // Determine which card set to use (prioritize database cards)
    let availableCards: CardData[] = [];
    let source: 'database' | 'mock' = 'mock';

    if (dbCards.length > 0) {
      availableCards = dbCards;
      source = 'database';
      console.log('✅ Using database cards as primary source');
    } else {
      availableCards = fallbackMockCards;
      source = 'mock';
      console.log('⚠️ Falling back to mock cards');
    }

    setAllCards(availableCards);
    setDataSource(source);

    let cardToSelect: CardData | undefined;
    let cardIndex = -1;

    if (cardId) {
      // First, try to find the card in available cards
      cardIndex = availableCards.findIndex(c => c.id === cardId);
      
      if (cardIndex !== -1) {
        cardToSelect = availableCards[cardIndex];
        console.log(`🎯 Found requested card: ${cardToSelect.title} at index ${cardIndex} (${source})`);
      } else {
        // Card not found - show helpful error message
        console.warn(`❌ Card with ID "${cardId}" not found in ${source} cards`);
        console.log('🔍 Available card IDs:', availableCards.map(c => `${c.title}:${c.id}`));
        
        // Default to first available card
        cardToSelect = availableCards[0];
        cardIndex = 0;
        
        if (cardToSelect) {
          console.log(`🔄 Redirecting to first available card: ${cardToSelect.id}`);
          navigate(`/studio/${cardToSelect.id}`, { replace: true });
          toast.info(`Card not found in ${source} data. Showing ${cardToSelect.title} instead.`);
        }
      }
    } else {
      // No card ID specified - default to first card
      cardToSelect = availableCards[0];
      cardIndex = 0;
      
      if (cardToSelect) {
        console.log(`📍 No card ID specified, redirecting to: ${cardToSelect.id}`);
        navigate(`/studio/${cardToSelect.id}`, { replace: true });
      }
    }

    if (cardToSelect) {
      setSelectedCard(cardToSelect);
      setCurrentCardIndex(cardIndex >= 0 ? cardIndex : 0);
      console.log(`🎮 Selected card: ${cardToSelect.title} (${cardToSelect.id}) from ${source}`);
    } else {
      // This case happens if no cards are available at all
      console.error('💥 No cards are available to display');
      toast.error('No cards are available to display.');
      setDataSource('none');
      navigate('/gallery');
    }
    
    setIsLoading(false);
  }, [cardId, navigate, featuredCards, cardsLoading, convertCardsToCardData]);

  // Handle card navigation
  const handleCardChange = (index: number) => {
    const newCard = allCards[index];
    if (newCard) {
      console.log(`🔄 Changing to card: ${newCard.title} (${newCard.id})`);
      setSelectedCard(newCard);
      setCurrentCardIndex(index);
      
      // Update URL when changing cards
      navigate(`/studio/${newCard.id}`, { replace: true });
    }
  };

  // Handle sharing - generates shareable URL
  const handleShare = (card: CardData) => {
    const shareUrl = `${window.location.origin}/studio/${card.id}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success(`Studio link copied to clipboard!`);
          console.log(`📋 Shared card: ${card.title}`);
        })
        .catch(() => toast.error('Failed to copy link'));
    } else {
      toast.error('Sharing not supported in this browser');
    }
  };

  // Handle download/export - updated to accept card parameter
  const handleDownload = (card: CardData) => {
    toast.success(`Exporting ${card.title}...`);
    console.log(`💾 Exporting card: ${card.title} from ${dataSource}`);
  };

  // Handle closing studio - use browser history when possible
  const handleClose = () => {
    // Use browser history to go back to previous page
    // If there's no history (direct access), fallback to gallery
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/gallery');
    }
  };

  return {
    selectedCard,
    currentCardIndex,
    isLoading,
    mockCards: allCards, // Pass the correct list of cards (database or mock)
    dataSource, // New: expose data source for debugging
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  };
};


import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useCards } from '@/hooks/useCards';
import { useCardConversion } from '@/pages/Gallery/hooks/useCardConversion';
import type { CardData } from '@/types/card';
import type { SlabPresetConfig } from '../SlabPresets';

export const useShowcaseState = (cardId?: string) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cards, featuredCards, userCards, loading, dataSource } = useCards();
  const { convertCardsToCardData } = useCardConversion();
  
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [slabConfig, setSlabConfig] = useState<SlabPresetConfig>({
    type: 'none'
  });

  // Memoize the converted cards to prevent infinite re-renders
  const mockCards = useMemo(() => {
    const allCards = [...cards, ...featuredCards, ...userCards];
    return convertCardsToCardData(allCards);
  }, [cards, featuredCards, userCards, convertCardsToCardData]);

  // Handle card selection and navigation
  useEffect(() => {
    if (mockCards.length > 0) {
      if (cardId) {
        const foundIndex = mockCards.findIndex(card => card.id === cardId);
        if (foundIndex !== -1) {
          setSelectedCard(mockCards[foundIndex]);
          setCurrentCardIndex(foundIndex);
        } else {
          setSelectedCard(mockCards[0]);
          setCurrentCardIndex(0);
        }
      } else {
        setSelectedCard(mockCards[0]);
        setCurrentCardIndex(0);
      }
    }
  }, [cardId, mockCards]);

  const handleCardChange = useCallback((index: number) => {
    if (index >= 0 && index < mockCards.length) {
      setSelectedCard(mockCards[index]);
      setCurrentCardIndex(index);
      navigate(`/showcase/${mockCards[index].id}`, { replace: true });
    }
  }, [mockCards, navigate]);

  const handleShare = useCallback((card: CardData) => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: `Check out this card: ${card.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  }, []);

  const handleDownload = useCallback((card: CardData) => {
    // Implement download functionality
    console.log('Download card:', card.title);
  }, []);

  const handleClose = useCallback(() => {
    navigate('/gallery');
  }, [navigate]);

  return {
    selectedCard,
    currentCardIndex,
    isLoading: loading,
    mockCards,
    dataSource,
    slabConfig,
    setSlabConfig,
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  };
};

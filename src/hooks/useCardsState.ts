
import { useState, useCallback } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type Card = Tables<'cards'>;

export const useCardsState = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'database' | 'local' | 'mixed'>('database');

  const updateCards = useCallback((newCards: Card[]) => {
    setCards(newCards);
    setFeaturedCards(newCards.slice(0, 8));
  }, []);

  const updateUserCards = useCallback((newUserCards: Card[]) => {
    setUserCards(newUserCards);
  }, []);

  const updateDataSource = useCallback((source: 'database' | 'local' | 'mixed') => {
    setDataSource(source);
  }, []);

  return {
    cards,
    featuredCards,
    userCards,
    loading,
    dataSource,
    setLoading,
    updateCards,
    updateUserCards,
    updateDataSource
  };
};

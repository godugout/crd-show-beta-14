
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardMigrationService } from '@/services/cardMigration';
import { CardFetchingService } from '@/services/cardFetching';
import { useCardsState } from './useCardsState';
import { useRealtimeCardSubscription } from './useRealtimeCardSubscription';
import { toast } from 'sonner';

export const useCards = () => {
  const { user } = useAuth();
  const {
    cards,
    featuredCards,
    userCards,
    loading,
    dataSource,
    setLoading,
    updateCards,
    updateUserCards,
    updateDataSource
  } = useCardsState();

  const fetchFeaturedCards = useCallback(async () => {
    console.log('🔍 Starting fetchFeaturedCards...');
    const featuredCards = await CardFetchingService.fetchFeaturedCards();
    console.log(`📊 Fetched ${featuredCards.length} featured cards`);
    updateCards(featuredCards); // Update featured cards only initially
    updateDataSource('database');
    return featuredCards;
  }, [updateCards, updateDataSource]);

  const fetchAllCardsFromDatabase = useCallback(async () => {
    console.log('🔍 Starting fetchAllCardsFromDatabase...');
    const { cards: fetchedCards, dataSource: source } = await CardFetchingService.fetchAllCardsFromDatabase();
    console.log(`📊 Fetched ${fetchedCards.length} cards from ${source}`);
    console.log('🔍 First few cards:', fetchedCards.slice(0, 3).map(c => ({ id: c.id, title: c.title, created_at: c.created_at })));
    updateCards(fetchedCards);
    updateDataSource(source);
    return fetchedCards;
  }, [updateCards, updateDataSource]);

  const fetchUserCards = useCallback(async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];
    
    console.log(`🔍 Fetching user cards for: ${targetUserId}`);
    const userCardsData = await CardFetchingService.fetchUserCards(targetUserId);
    console.log(`📊 Fetched ${userCardsData.length} user cards`);
    if (!userId || userId === user?.id) {
      updateUserCards(userCardsData);
    }
    return userCardsData;
  }, [user?.id, updateUserCards]);

  const fetchCards = useCallback(async (loadAll = false) => {
    console.log('🔄 Starting card fetch process...');
    setLoading(true);
    try {
      if (loadAll) {
        await Promise.all([
          fetchAllCardsFromDatabase(),
          fetchUserCards()
        ]);
      } else {
        // For initial load, only fetch featured cards for better performance
        await Promise.all([
          fetchFeaturedCards(),
          fetchUserCards()
        ]);
      }
      console.log('✅ Card fetch completed successfully');
    } catch (error) {
      console.error('💥 Error in fetchCards:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFeaturedCards, fetchAllCardsFromDatabase, fetchUserCards, setLoading]);

  // Enhanced migration with detailed error reporting
  const migrateLocalCardsToDatabase = useCallback(async () => {
    if (!user?.id) {
      toast.error('Please sign in to migrate cards');
      return;
    }

    try {
      console.log('🔄 Starting enhanced card migration...');
      
      // First, preview the migration
      const preview = await CardMigrationService.previewMigration(user.id);
      
      if (preview.report.totalCards === 0) {
        toast.info('No local cards found to migrate');
        return;
      }

      console.log('📋 Migration preview:', preview);
      
      // Show preview to user
      if (preview.invalidCards > 0) {
        toast.warning(`Found ${preview.invalidCards} cards with validation issues. Check console for details.`);
        console.warn('Validation issues:', preview.validationIssues);
      }

      // Execute migration
      toast.loading(`Migrating ${preview.report.totalCards} cards...`, { id: 'migration' });
      
      const result = await CardMigrationService.executeMigration(user.id);
      
      toast.dismiss('migration');
      
      if (result.success) {
        const message = `Successfully migrated ${result.migratedCount} cards${
          result.failedCount > 0 ? ` (${result.failedCount} failed)` : ''
        }`;
        toast.success(message);
        
        if (result.warnings.length > 0) {
          console.warn('Migration warnings:', result.warnings);
        }
        
        // Refresh cards after successful migration
        await fetchCards();
      } else {
        toast.error(`Migration failed: ${result.failedCount} cards could not be migrated`);
      }
      
      // Log detailed results
      if (result.errors.length > 0) {
        console.group('❌ Migration Errors');
        result.errors.forEach(error => {
          console.error(`${error.cardTitle} (${error.cardId}): ${error.error}`);
        });
        console.groupEnd();
      }
      
      console.log('🎯 Migration completed:', {
        total: result.totalCards,
        migrated: result.migratedCount,
        failed: result.failedCount,
        success: result.success
      });
      
    } catch (error) {
      console.error('💥 Migration system error:', error);
      toast.error('Migration system error. Check console for details.');
    }
  }, [user?.id, fetchCards]);

  // Set up real-time subscription
  useRealtimeCardSubscription(fetchCards, user?.id);

  useEffect(() => {
    // Initial fetch
    console.log('🚀 useCards mounted, starting initial fetch...');
    fetchCards();
  }, [fetchCards]);

  // Debug log current state
  useEffect(() => {
    console.log('📊 Current card state:', {
      totalCards: cards.length,
      featuredCards: featuredCards.length,
      userCards: userCards.length,
      loading,
      dataSource
    });
  }, [cards.length, featuredCards.length, userCards.length, loading, dataSource]);

  return {
    cards,
    featuredCards,
    userCards,
    loading,
    dataSource,
    fetchCards,
    fetchFeaturedCards,
    fetchAllCardsFromDatabase,
    fetchUserCards,
    migrateLocalCardsToDatabase
  };
};

/**
 * React hook for managing the core user journey
 * Integrates with the core user journey service and provides UI feedback
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { coreUserJourneyService } from '@/services/coreUserJourney';
import type { CardData } from '@/types/card';
import { toast } from 'sonner';

export interface JourneyProgress {
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  isInProgress: boolean;
  lastError?: string;
}

export const useCoreUserJourney = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<JourneyProgress>({
    currentStep: 'registration',
    totalSteps: 5,
    completedSteps: 0,
    isInProgress: false
  });

  const [isExecuting, setIsExecuting] = useState(false);

  /**
   * Execute the complete happy path workflow
   */
  const executeHappyPath = useCallback(async (cardData: Partial<CardData>) => {
    if (!user) {
      toast.error('Please sign in to create a card');
      return { success: false, error: 'User not authenticated' };
    }

    setIsExecuting(true);
    setProgress(prev => ({ ...prev, isInProgress: true }));

    try {
      console.log('🚀 Starting core user journey execution...');
      
      const result = await coreUserJourneyService.executeHappyPath(user, cardData);
      
      if (result.success) {
        toast.success('Card created successfully and added to your collection!');
        setProgress({
          currentStep: 'completed',
          totalSteps: 5,
          completedSteps: 5,
          isInProgress: false
        });
        
        console.log('✅ Core user journey completed successfully:', {
          cardId: result.cardId,
          completedSteps: result.completedSteps
        });
      } else {
        toast.error(`Journey failed: ${result.error}`);
        setProgress(prev => ({
          ...prev,
          isInProgress: false,
          lastError: result.error
        }));
        
        console.error('❌ Core user journey failed:', {
          error: result.error,
          completedSteps: result.completedSteps
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Journey execution failed: ${errorMessage}`);
      setProgress(prev => ({
        ...prev,
        isInProgress: false,
        lastError: errorMessage
      }));
      
      console.error('💥 Journey execution error:', error);
      return { success: false, error: errorMessage, completedSteps: [] };
    } finally {
      setIsExecuting(false);
    }
  }, [user]);

  /**
   * Create a single card (part of the journey)
   */
  const createCard = useCallback(async (cardData: Partial<CardData>) => {
    if (!user) {
      toast.error('Please sign in to create a card');
      return { success: false, error: 'User not authenticated' };
    }

    setProgress(prev => ({ ...prev, isInProgress: true, currentStep: 'first_card_creation' }));

    try {
      const result = await coreUserJourneyService.createCard(user.id, cardData);
      
      if (result.success) {
        toast.success('Card created successfully!');
        setProgress(prev => ({ ...prev, completedSteps: prev.completedSteps + 1 }));
      } else {
        toast.error(`Card creation failed: ${result.error}`);
        setProgress(prev => ({ ...prev, lastError: result.error }));
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Card creation failed: ${errorMessage}`);
      setProgress(prev => ({ ...prev, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [user]);

  /**
   * Get the current journey status
   */
  const getJourneyStatus = useCallback(() => {
    if (!user) return null;
    return coreUserJourneyService.getJourneyStatus(user.id);
  }, [user]);

  /**
   * Initialize journey tracking
   */
  const initializeJourney = useCallback(async () => {
    if (!user) return;
    
    try {
      await coreUserJourneyService.initializeJourney(user);
      setProgress(prev => ({ ...prev, completedSteps: 1 }));
      console.log('🎯 Journey initialized for user:', user.id);
    } catch (error) {
      console.error('Failed to initialize journey:', error);
    }
  }, [user]);

  return {
    progress,
    isExecuting,
    executeHappyPath,
    createCard,
    getJourneyStatus,
    initializeJourney,
    user
  };
};
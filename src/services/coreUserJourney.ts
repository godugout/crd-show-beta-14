/**
 * Core User Journey Service - Manages the critical path from registration to card viewing
 * This service ensures the main user flow is bug-free and consistent
 */

import { CardRepository } from '@/repositories/cardRepository';
import { CollectionCore } from '@/repositories/collection/core';
import { crdDataService } from './crdDataService';
import { errorHandler, withErrorHandling, ErrorCodes } from '@/utils/errorHandling';
import type { CardData } from '@/types/card';
import type { User } from '@supabase/supabase-js';

export interface UserJourneyStep {
  step: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: number;
  error?: string;
}

export interface CoreJourneyState {
  userId: string;
  steps: UserJourneyStep[];
  currentStep: string;
  completedAt?: number;
}

class CoreUserJourneyService {
  private journeyStates = new Map<string, CoreJourneyState>();

  /**
   * Initialize user journey tracking
   */
  async initializeJourney(user: User): Promise<void> {
    const journeyState: CoreJourneyState = {
      userId: user.id,
      currentStep: 'registration',
      steps: [
        { step: 'registration', status: 'completed', timestamp: Date.now() },
        { step: 'profile_setup', status: 'pending' },
        { step: 'first_card_creation', status: 'pending' },
        { step: 'card_save_to_collection', status: 'pending' },
        { step: 'gallery_view', status: 'pending' }
      ]
    };

    this.journeyStates.set(user.id, journeyState);
    await this.persistJourneyState(user.id, journeyState);
    console.log(`🎯 Core journey initialized for user: ${user.id}`);
  }

  /**
   * Update journey step status
   */
  async updateStep(userId: string, stepName: string, status: UserJourneyStep['status'], error?: string): Promise<void> {
    const journey = this.journeyStates.get(userId);
    if (!journey) {
      console.warn(`Journey not found for user: ${userId}`);
      return;
    }

    const step = journey.steps.find(s => s.step === stepName);
    if (!step) {
      console.warn(`Step '${stepName}' not found in journey`);
      return;
    }

    step.status = status;
    step.timestamp = Date.now();
    if (error) step.error = error;

    if (status === 'completed') {
      journey.currentStep = this.getNextStep(stepName) || stepName;
    }

    // Check if journey is complete
    if (journey.steps.every(s => s.status === 'completed')) {
      journey.completedAt = Date.now();
      console.log(`🎉 Core user journey completed for user: ${userId}`);
    }

    await this.persistJourneyState(userId, journey);
  }

  /**
   * Create a card with full validation and error handling
   */
  async createCard(userId: string, cardData: Partial<CardData>): Promise<{ success: boolean; cardId?: string; error?: string }> {
    await this.updateStep(userId, 'first_card_creation', 'in_progress');

    const result = await withErrorHandling(async () => {
      // Validate required fields
      if (!cardData.title?.trim()) {
        throw errorHandler.validationError('Card title is required');
      }

      if (!cardData.image_url) {
        throw errorHandler.validationError('Card image is required');
      }

      // Create the card with all necessary defaults
      const completeCardData: CardData = {
        id: cardData.id || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: cardData.title.trim(),
        description: cardData.description || '',
        image_url: cardData.image_url,
        thumbnail_url: cardData.thumbnail_url || cardData.image_url,
        creator_id: userId,
        visibility: 'private',
        is_public: false,
        tags: cardData.tags || [],
        series: cardData.series || '',
        rarity: cardData.rarity || 'common',
        type: cardData.type || 'Character',
        design_metadata: cardData.design_metadata || {},
        creator_attribution: {
          creator_name: cardData.creator_attribution?.creator_name,
          creator_id: userId,
          collaboration_type: 'solo'
        },
        publishing_options: {
          marketplace_listing: false,
          crd_catalog_inclusion: false,
          print_available: false
        },
        ...cardData
      };

      // Save to database
      const savedCard = await CardRepository.createCard({
        title: completeCardData.title,
        description: completeCardData.description,
        creator_id: completeCardData.creator_id!,
        image_url: completeCardData.image_url,
        thumbnail_url: completeCardData.thumbnail_url,
        rarity: completeCardData.rarity,
        tags: completeCardData.tags,
        design_metadata: completeCardData.design_metadata,
        series: completeCardData.series,
        visibility: completeCardData.visibility,
        marketplace_listing: completeCardData.publishing_options.marketplace_listing,
        is_public: completeCardData.is_public
      });
      
      // Also save locally for offline access
      await crdDataService.saveCard(savedCard.id, savedCard);

      return savedCard.id;
    }, 'createCard');

    if (result.error) {
      await this.updateStep(userId, 'first_card_creation', 'failed', result.error.message);
      return { success: false, error: result.error.message };
    }

    await this.updateStep(userId, 'first_card_creation', 'completed');
    return { success: true, cardId: result.data };
  }

  /**
   * Save card to user's default collection
   */
  async saveCardToCollection(userId: string, cardId: string): Promise<{ success: boolean; error?: string }> {
    await this.updateStep(userId, 'card_save_to_collection', 'in_progress');

    const result = await withErrorHandling(async () => {
      // Get or create user's default collection
      let defaultCollection = await CollectionCore.getUserDefaultCollection(userId);
      
      if (!defaultCollection) {
        defaultCollection = await CollectionCore.createCollection({
          title: 'My Cards',
          description: 'My personal card collection',
          ownerId: userId,
          visibility: 'private'
        });
      }

      // Add card to collection
      await CollectionCore.addCardToCollection(defaultCollection.id, cardId);
      
      return defaultCollection.id;
    }, 'saveCardToCollection');

    if (result.error) {
      await this.updateStep(userId, 'card_save_to_collection', 'failed', result.error.message);
      return { success: false, error: result.error.message };
    }

    await this.updateStep(userId, 'card_save_to_collection', 'completed');
    return { success: true };
  }

  /**
   * Verify gallery access and card visibility
   */
  async verifyGalleryAccess(userId: string): Promise<{ success: boolean; cardCount: number; error?: string }> {
    await this.updateStep(userId, 'gallery_view', 'in_progress');

    const result = await withErrorHandling(async () => {
      const userCards = await CardRepository.getCards({ creator_id: userId });
      
      if (userCards.cards.length === 0) {
        throw errorHandler.createError('NO_CARDS', 'No cards found in gallery');
      }

      return userCards.cards.length;
    }, 'verifyGalleryAccess');

    if (result.error) {
      await this.updateStep(userId, 'gallery_view', 'failed', result.error.message);
      return { success: false, cardCount: 0, error: result.error.message };
    }

    await this.updateStep(userId, 'gallery_view', 'completed');
    return { success: true, cardCount: result.data || 0 };
  }

  /**
   * Complete the full happy path workflow
   */
  async executeHappyPath(user: User, cardData: Partial<CardData>): Promise<{
    success: boolean;
    cardId?: string;
    collectionId?: string;
    error?: string;
    completedSteps: string[];
  }> {
    const completedSteps: string[] = [];

    try {
      // Step 1: Initialize journey
      await this.initializeJourney(user);
      completedSteps.push('journey_initialized');

      // Step 2: Create card
      const cardResult = await this.createCard(user.id, cardData);
      if (!cardResult.success || !cardResult.cardId) {
        return { 
          success: false, 
          error: cardResult.error || 'Failed to create card',
          completedSteps 
        };
      }
      completedSteps.push('card_created');

      // Step 3: Save to collection
      const collectionResult = await this.saveCardToCollection(user.id, cardResult.cardId);
      if (!collectionResult.success) {
        return { 
          success: false, 
          error: collectionResult.error || 'Failed to save to collection',
          completedSteps 
        };
      }
      completedSteps.push('saved_to_collection');

      // Step 4: Verify gallery access
      const galleryResult = await this.verifyGalleryAccess(user.id);
      if (!galleryResult.success) {
        return { 
          success: false, 
          error: galleryResult.error || 'Failed to access gallery',
          completedSteps 
        };
      }
      completedSteps.push('gallery_verified');

      return {
        success: true,
        cardId: cardResult.cardId,
        completedSteps
      };

    } catch (error) {
      const appError = errorHandler.handleError(error, 'executeHappyPath');
      return {
        success: false,
        error: appError.message,
        completedSteps
      };
    }
  }

  /**
   * Get journey status for debugging
   */
  getJourneyStatus(userId: string): CoreJourneyState | null {
    return this.journeyStates.get(userId) || null;
  }

  /**
   * Helper methods
   */
  private getNextStep(currentStep: string): string | null {
    const stepOrder = [
      'registration',
      'profile_setup', 
      'first_card_creation',
      'card_save_to_collection',
      'gallery_view'
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex >= 0 && currentIndex < stepOrder.length - 1) {
      return stepOrder[currentIndex + 1];
    }
    return null;
  }

  private async persistJourneyState(userId: string, state: CoreJourneyState): Promise<void> {
    await crdDataService.set('user_preferences', `journey_${userId}`, state);
  }

  private async loadJourneyState(userId: string): Promise<CoreJourneyState | null> {
    return await crdDataService.get('user_preferences', `journey_${userId}`);
  }
}

export const coreUserJourneyService = new CoreUserJourneyService();
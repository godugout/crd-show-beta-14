
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardRepository } from '@/repositories/cardRepository';
import { CardStorageService } from '@/services/cardStorage';
import type { CardData } from '@/types/card';

export interface SaveResult {
  success: boolean;
  cardId?: string;
  error?: string;
}

export const useCardSaveOperations = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const validateCardData = (cardData: CardData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!cardData.title?.trim()) {
      errors.push('Card title is required');
    }
    
    // Check if image URL is valid (allow both blob and supabase URLs)
    if (cardData.image_url) {
      try {
        const url = new URL(cardData.image_url);
        console.log('✅ Image URL is valid:', url.href);
      } catch (error) {
        // Allow blob URLs for temporary images
        if (!cardData.image_url.startsWith('blob:')) {
          console.error('❌ Invalid image URL:', cardData.image_url);
          errors.push('Invalid image URL format');
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const saveCard = async (cardData: CardData): Promise<SaveResult> => {
    if (!user) {
      const error = 'Please sign in to save cards';
      toast.error(error);
      return { success: false, error };
    }

    console.log('💾 Starting card save process...', {
      cardId: cardData.id,
      hasImage: !!cardData.image_url,
      imageUrl: cardData.image_url?.substring(0, 50) + '...',
      isBlob: cardData.image_url?.startsWith('blob:')
    });

    // Validate card data
    const validation = validateCardData(cardData);
    if (!validation.isValid) {
      const error = `Validation failed: ${validation.errors.join(', ')}`;
      console.error('❌ Card validation failed:', validation.errors);
      toast.error(error);
      return { success: false, error };
    }

    const finalCardData = {
      ...cardData,
      title: cardData.title?.trim() || 'My New Card',
      creator_id: user.id,
    };

    setIsSaving(true);
    try {
      console.log('💾 Saving card with enhanced error handling...');
      
      // 1. Save to localStorage using storage service
      console.log('📱 Attempting localStorage save...');
      const localResult = CardStorageService.saveCard(finalCardData);
      if (!localResult.success) {
        throw new Error(`localStorage save failed: ${localResult.error}`);
      }
      console.log('✅ localStorage save successful');
      
      // 2. Attempt database save with enhanced error handling
      let dbSuccess = false;
      let dbError: string | null = null;
      
      try {
        console.log('🗄️ Attempting database save...');
        
        // Map rarity for database compatibility
        const rarityMap: Record<string, string> = {
          'common': 'common',
          'uncommon': 'uncommon',
          'rare': 'rare',
          'epic': 'legendary',
          'legendary': 'legendary'
        };

        const dbCardData = {
          title: finalCardData.title,
          description: finalCardData.description,
          creator_id: user.id,
          image_url: finalCardData.image_url,
          thumbnail_url: finalCardData.thumbnail_url,
          rarity: rarityMap[finalCardData.rarity] || 'common',
          tags: finalCardData.tags,
          design_metadata: finalCardData.design_metadata,
          is_public: finalCardData.visibility === 'public',
          visibility: finalCardData.visibility,
          marketplace_listing: finalCardData.publishing_options?.marketplace_listing || false,
          print_available: finalCardData.publishing_options?.print_available || false
        };

        console.log('🗄️ Database card data prepared:', {
          title: dbCardData.title,
          hasImage: !!dbCardData.image_url,
          rarity: dbCardData.rarity,
          isBlob: dbCardData.image_url?.startsWith('blob:')
        });

        const dbResult = await CardRepository.createCard(dbCardData);
        if (dbResult) {
          console.log('✅ Database save successful, card ID:', dbResult.id);
          dbSuccess = true;
          setLastSaved(new Date());
          
          // Show success message with image storage note
          if (dbCardData.image_url?.startsWith('blob:')) {
            toast.success('Card saved successfully', {
              description: 'Note: Upload image to make it permanent'
            });
          } else {
            toast.success('Card saved successfully with permanent image');
          }
          
          return { success: true, cardId: dbResult.id };
        } else {
          dbError = 'Database returned null result';
        }
      } catch (error: any) {
        dbError = error.message || 'Unknown database error';
        console.warn('⚠️ Database save failed:', dbError);
        console.warn('Full error:', error);
      }

      setLastSaved(new Date());
      
      if (dbSuccess) {
        toast.success('Card saved successfully');
        return { success: true, cardId: finalCardData.id };
      } else {
        console.log('📱 Card saved locally, database sync will be attempted later');
        toast.success('Card saved locally (will sync to database when connection is restored)', {
          description: dbError ? `Database error: ${dbError}` : undefined
        });
        return { success: true, cardId: finalCardData.id };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred';
      console.error('💥 Critical error saving card:', error);
      toast.error('Failed to save card. Please try again.', {
        description: errorMessage
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (cardData: CardData): Promise<boolean> => {
    console.log('📤 Publishing card...');
    
    const updatedCard = {
      ...cardData,
      is_public: true,
      visibility: 'public' as const
    };
    
    const result = await saveCard(updatedCard);
    if (!result.success) {
      console.error('❌ Publish failed:', result.error);
      toast.error('Failed to publish card', {
        description: result.error
      });
      return false;
    }

    try {
      toast.success('Card published successfully');
      return true;
    } catch (error) {
      console.error('Error in publish flow:', error);
      toast.error('Failed to complete publish process');
      return false;
    }
  };

  return {
    saveCard,
    publishCard,
    isSaving,
    lastSaved
  };
};

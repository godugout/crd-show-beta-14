
import { useCardEditorState } from '@/hooks/card-editor/useCardEditorState';
import { useTagManagement } from '@/hooks/card-editor/useTagManagement';
import { useCardSaveOperations } from '@/hooks/card-editor/useCardSaveOperations';
import { useAutoSave } from '@/hooks/card-editor/useAutoSave';

// Re-export types from the main types file
export type { CardData, CardRarity, CardVisibility, CreatorAttribution, PublishingOptions, DesignTemplate } from '@/types/card';
export type { CardTemplate } from '@/hooks/card-editor/types';

export interface UseCardEditorOptions {
  initialData?: Partial<import('@/types/card').CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const { autoSave = false, autoSaveInterval = 30000 } = options;
  
  // Use the smaller, focused hooks
  const {
    cardData,
    updateCardField,
    updateDesignMetadata,
    isDirty,
    resetDirtyState,
    setCardData
  } = useCardEditorState(options);

  const {
    tags,
    addTag,
    removeTag,
    handleTagInput,
    hasMaxTags,
    updateTags
  } = useTagManagement(cardData.tags);

  const {
    saveCard: saveCardOperation,
    publishCard: publishCardOperation,
    isSaving,
    lastSaved
  } = useCardSaveOperations();

  // Sync tags with card data
  const syncedUpdateCardField = <K extends keyof import('@/types/card').CardData>(
    field: K, 
    value: import('@/types/card').CardData[K]
  ) => {
    updateCardField(field, value);
    if (field === 'tags') {
      updateTags(value as string[]);
    }
  };

  // Sync tag updates with card data
  const syncedAddTag = (tag: string) => {
    const newTags = addTag(tag);
    updateCardField('tags', newTags);
  };

  const syncedRemoveTag = (tagToRemove: string) => {
    const newTags = removeTag(tagToRemove);
    updateCardField('tags', newTags);
  };

  const syncedHandleTagInput = (input: string) => {
    const newTags = handleTagInput(input);
    updateCardField('tags', newTags);
  };

  // Enhanced save functions
  const saveCard = async (): Promise<boolean> => {
    const result = await saveCardOperation(cardData);
    if (result.success) {
      resetDirtyState();
      if (result.cardId && result.cardId !== cardData.id) {
        setCardData(prev => ({ ...prev, id: result.cardId }));
      }
    }
    return result.success;
  };

  const publishCard = async (): Promise<boolean> => {
    const result = await publishCardOperation(cardData);
    if (result) {
      resetDirtyState();
      updateCardField('is_public', true);
      updateCardField('visibility', 'public');
    }
    return result;
  };

  // Auto-save functionality
  useAutoSave(cardData, isDirty, saveCard, autoSave, autoSaveInterval);

  return {
    cardData,
    updateCardField: syncedUpdateCardField,
    updateDesignMetadata,
    saveCard,
    publishCard,
    isSaving,
    lastSaved,
    isDirty,
    tags,
    addTag: syncedAddTag,
    removeTag: syncedRemoveTag,
    handleTagInput: syncedHandleTagInput,
    hasMaxTags
  };
};


import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { CardData } from '@/types/card';

export interface UseCardEditorStateOptions {
  initialData?: Partial<CardData>;
}

export const useCardEditorState = (options: UseCardEditorStateOptions = {}) => {
  const { user } = useAuth();
  const { initialData = {} } = options;
  
  const [cardData, setCardData] = useState<CardData>({
    id: initialData.id || uuidv4(),
    title: initialData.title || 'My New Card',
    description: initialData.description || '',
    image_url: initialData.image_url,
    thumbnail_url: initialData.thumbnail_url,
    rarity: initialData.rarity || 'common',
    tags: initialData.tags || [],
    design_metadata: initialData.design_metadata || {},
    visibility: initialData.visibility || 'private',
    is_public: initialData.is_public || false,
    template_id: initialData.template_id,
    collection_id: initialData.collection_id,
    team_id: initialData.team_id,
    creator_attribution: initialData.creator_attribution || {
      creator_name: user?.email || '',
      creator_id: user?.id || '',
      collaboration_type: 'solo'
    },
    publishing_options: initialData.publishing_options || {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    },
    creator_id: user?.id,
    view_count: initialData.view_count || 0,
    created_at: initialData.created_at || new Date().toISOString()
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user?.id && !cardData.creator_id) {
      setCardData(prev => ({ ...prev, creator_id: user.id }));
    }
  }, [user?.id, cardData.creator_id]);

  const updateCardField = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const updateDesignMetadata = (key: string, value: any) => {
    setCardData(prev => ({
      ...prev,
      design_metadata: { ...prev.design_metadata, [key]: value }
    }));
    setIsDirty(true);
  };

  const resetDirtyState = () => {
    setIsDirty(false);
  };

  return {
    cardData,
    updateCardField,
    updateDesignMetadata,
    isDirty,
    resetDirtyState,
    setCardData
  };
};

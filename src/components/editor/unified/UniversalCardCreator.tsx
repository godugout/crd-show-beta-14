
import React from 'react';
import { SimpleCardCreator } from './SimpleCardCreator';
import type { CreationMode } from './types';
import type { CardData } from '@/hooks/useCardEditor';

interface UniversalCardCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const UniversalCardCreator = (props: UniversalCardCreatorProps) => {
  console.log('🚀 UniversalCardCreator: Delegating to SimpleCardCreator');
  return <SimpleCardCreator {...props} />;
};

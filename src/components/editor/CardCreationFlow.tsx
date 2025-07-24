
import React from 'react';
import { SimpleCardCreator } from './unified/SimpleCardCreator';
import type { CardData } from '@/types/card';

interface CardCreationFlowProps {
  initialCardId?: string;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const CardCreationFlow = ({ 
  initialCardId, 
  onComplete, 
  onCancel 
}: CardCreationFlowProps) => {
  return <SimpleCardCreator />;
};

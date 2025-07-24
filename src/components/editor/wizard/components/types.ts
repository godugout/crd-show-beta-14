
import type { CardRarity, CardVisibility, CreatorAttribution, CardData } from '@/types/card';

export interface CardDetailsStepProps {
  cardData: Partial<CardData>;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: any) => void;
  onCreatorAttributionUpdate: (key: keyof CreatorAttribution, value: any) => void;
  aiAnalysisComplete?: boolean;
}

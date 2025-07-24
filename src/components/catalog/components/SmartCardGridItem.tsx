
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Edit } from 'lucide-react';
import { DetectedCard } from '@/services/cardCatalog/types';
import { getRarityStyles, getRarityBadgeStyles, type CardRarity } from '@/utils/cardDisplayUtils';

interface SmartCardGridItemProps {
  card: DetectedCard;
  isSelected: boolean;
  onToggleSelection: (cardId: string) => void;
  onEdit?: (card: DetectedCard) => void;
  onCreate?: (card: DetectedCard) => void;
}

export const SmartCardGridItem: React.FC<SmartCardGridItemProps> = ({
  card,
  isSelected,
  onToggleSelection,
  onEdit,
  onCreate
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine rarity based on confidence or other metadata
  const rarity: CardRarity = card.confidence >= 0.8 ? 'rare' : card.confidence >= 0.6 ? 'uncommon' : 'common';
  const rarityStyles = getRarityStyles(rarity);
  const badgeStyles = getRarityBadgeStyles(rarity);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'bg-blue-600';
      case 'processing': return 'bg-yellow-600';
      case 'enhanced': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  return (
    <Card 
      className={`
        bg-editor-dark border-editor-border overflow-hidden group cursor-pointer
        transition-all duration-200 ease-out
        hover:scale-105 hover:-translate-y-1
        ${isSelected ? 'ring-2 ring-crd-green' : ''}
      `}
      style={{
        border: `2px solid ${rarityStyles.borderColor}`,
        boxShadow: rarityStyles.hasGlow 
          ? `0 0 20px ${rarityStyles.glowColor}, 0 4px 12px rgba(0, 0, 0, 0.3)`
          : '0 4px 12px rgba(0, 0, 0, 0.2)',
        filter: rarityStyles.hasGlow ? `drop-shadow(0 0 8px ${rarityStyles.glowColor})` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={URL.createObjectURL(card.imageBlob)}
          alt={`Detected card ${card.id}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        
        {/* Glow Overlay */}
        {rarityStyles.hasGlow && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${rarityStyles.glowColor} 0%, transparent 70%)`
            }}
          />
        )}
        
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(card.id)}
            className="bg-black/70 border-white"
          />
        </div>

        {/* Rarity Badge */}
        <div className="absolute top-2 right-2">
          <Badge 
            className="px-2 py-1"
            style={badgeStyles}
          >
            {rarity}
          </Badge>
        </div>

        {/* Status Badge */}
        <div className="absolute top-10 right-2">
          <Badge className={`${getStatusColor(card.status)} text-white text-xs`}>
            {card.status}
          </Badge>
        </div>

        {/* Confidence Score */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
            <span className={getConfidenceColor(card.confidence)}>
              {formatConfidence(card.confidence)}
            </span>
          </Badge>
        </div>

        {/* Action Overlay */}
        <div className={`
          absolute inset-0 bg-black/60 flex items-center justify-center gap-2
          transition-all duration-200 ease-out
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <Button
            onClick={() => onEdit?.(card)}
            size="sm"
            className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 border-white/20 text-white"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            onClick={() => onCreate?.(card)}
            size="sm"
            className="w-8 h-8 p-0 bg-crd-green/80 hover:bg-crd-green text-black"
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

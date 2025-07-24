import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CRDButton } from '@/components/ui/design-system/Button';
import { OptimizedImage } from './OptimizedImage';
import { Eye, Edit, Share2 } from 'lucide-react';
import { getRarityStyles, getRarityBadgeStyles, type CardRarity } from '@/utils/cardDisplayUtils';
import type { CardData } from '@/types/card';

interface EnhancedCardDisplayProps {
  card: CardData;
  className?: string;
  showQuickActions?: boolean;
  onView?: (card: CardData) => void;
  onEdit?: (card: CardData) => void;
  onShare?: (card: CardData) => void;
}

export const EnhancedCardDisplay: React.FC<EnhancedCardDisplayProps> = ({
  card,
  className = '',
  showQuickActions = true,
  onView,
  onEdit,
  onShare
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const rarityStyles = getRarityStyles(card.rarity as CardRarity);
  const badgeStyles = getRarityBadgeStyles(card.rarity as CardRarity);

  return (
    <Card 
      className={`
        relative overflow-hidden bg-crd-darker transition-all duration-200 ease-out cursor-pointer
        hover:scale-105 hover:-translate-y-1
        ${className}
      `}
      style={{
        borderColor: rarityStyles.borderColor,
        boxShadow: rarityStyles.hasGlow 
          ? `0 0 20px ${rarityStyles.glowColor}, 0 4px 12px rgba(0, 0, 0, 0.3)`
          : '0 4px 12px rgba(0, 0, 0, 0.2)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(card)}
    >
      {/* Rarity Badge */}
      <Badge 
        className="absolute top-2 right-2 z-10 px-2 py-1"
        style={badgeStyles}
      >
        {card.rarity}
      </Badge>

      {/* Card Image */}
      <div className="aspect-[3/4] relative overflow-hidden">
        <OptimizedImage
          src={card.image_url || ''}
          alt={card.title}
          className="w-full h-full object-cover transition-all duration-300"
          size="medium"
          showSkeleton={true}
        />
        
        {/* Gradient Overlay for Glow Effect */}
        {rarityStyles.hasGlow && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${rarityStyles.glowColor} 0%, transparent 70%)`
            }}
          />
        )}

        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div className={`
            absolute inset-0 bg-black/60 flex items-center justify-center gap-2
            transition-all duration-200 ease-out
            ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}>
            {onView && (
              <CRDButton
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(card);
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4" />
              </CRDButton>
            )}
            {onEdit && (
              <CRDButton
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(card);
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4" />
              </CRDButton>
            )}
            {onShare && (
              <CRDButton
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(card);
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4" />
              </CRDButton>
            )}
          </div>
        )}
      </div>

      {/* Card Info */}
      <CardContent className="p-4">
        <h3 className="text-crd-white font-semibold text-lg mb-1 truncate">
          {card.title}
        </h3>
        {card.description && (
          <p className="text-crd-lightGray text-sm line-clamp-2 mb-3">
            {card.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-crd-lightGray">
          <span className="capitalize">{card.visibility || 'private'}</span>
          {card.view_count !== undefined && (
            <span>{card.view_count} views</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
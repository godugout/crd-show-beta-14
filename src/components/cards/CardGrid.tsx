
import React, { useState, memo, useCallback } from 'react';
import { usePerformanceMarks } from '@/hooks/usePerformanceMarks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Eye, Edit, Share2 } from 'lucide-react';
import { getRarityStyles, getRarityBadgeStyles, type CardRarity } from '@/utils/cardDisplayUtils';
import { LikeButton } from '@/components/social/LikeButton';
import { ShareButton } from '@/components/social/ShareButton';
import { ProgressiveCard } from './ProgressiveCard';

interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  price?: string;
  rarity?: string;
}

interface CardGridProps {
  cards: CardData[];
  loading: boolean;
  viewMode: 'grid' | 'masonry' | 'feed';
  useProgressiveLoading?: boolean;
  onCardClick?: (cardId: string) => void;
}

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', // Trading cards
  'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80', // Gaming cards
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', // Tech aesthetic
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80', // Code aesthetic
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80', // Abstract digital
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', // Neon aesthetic
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80', // Digital art
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80', // Abstract colorful
];

const CardGridItem = memo(({ card, index }: { card: CardData; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const rarity = (card.rarity || 'common') as CardRarity;
  const rarityStyles = getRarityStyles(rarity);
  const badgeStyles = getRarityBadgeStyles(rarity);
  
  const getDisplayImage = useCallback(() => {
    // Check for valid image URLs, avoiding blob URLs
    if (card.image_url && !card.image_url.startsWith('blob:') && !imageError) {
      return card.image_url;
    }
    if (card.thumbnail_url && !card.thumbnail_url.startsWith('blob:') && !imageError) {
      return card.thumbnail_url;
    }
    // Use placeholder image
    return '/placeholder.svg';
  }, [card.image_url, card.thumbnail_url, imageError]);

  const displayImage = getDisplayImage();

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  return (
    <div 
      className="group cursor-pointer card-item"
      style={{
        filter: rarityStyles.hasGlow ? `drop-shadow(0 0 12px ${rarityStyles.glowColor})` : 'none'
      }}
    >
      <Card 
        className="card-themed rounded-xl overflow-hidden relative"
        style={{
          border: `2px solid ${rarityStyles.borderColor}`,
          boxShadow: rarityStyles.hasGlow 
            ? `0 0 20px ${rarityStyles.glowColor}, 0 4px 12px rgba(0, 0, 0, 0.3)`
            : '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Rarity Badge */}
        <Badge 
          className="absolute top-2 right-2 z-10 px-2 py-1"
          style={badgeStyles}
        >
          {rarity}
        </Badge>

        <div className="aspect-[3/4] relative overflow-hidden bg-crd-mediumGray">
          {imageLoading && (
            <Skeleton className="absolute inset-0 bg-crd-mediumGray" />
          )}
          <img
            src={displayImage}
            alt={card.title || 'Card'}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
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

          {/* Quick Actions Overlay */}
          <div className="
            absolute inset-0 bg-black/60 flex items-center justify-center gap-2
            transition-all duration-200 ease-out
            opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
          ">
            <CRDButton
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4" />
            </CRDButton>
            <CRDButton
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4" />
            </CRDButton>
            <CRDButton
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4" />
            </CRDButton>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-themed-primary font-semibold mb-1 line-clamp-1">{card.title || 'Untitled Card'}</h3>
          <p className="text-themed-secondary text-sm line-clamp-2 mb-3">{card.description || 'Digital collectible card'}</p>
          
          {/* Social actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LikeButton cardId={card.id} />
              <ShareButton 
                cardId={card.id}
                cardTitle={card.title || 'Untitled Card'}
                cardImage={card.image_url}
                variant="icon"
              />
            </div>
            <span className="text-xs success-themed font-medium">0.001 ETH bid</span>
          </div>
        </div>
      </Card>
    </div>
  );
}, (prev, next) => prev.card.id === next.card.id && prev.index === next.index);

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <Skeleton className="aspect-[3/4] rounded-t-lg bg-crd-mediumGray" />
    <div className="bg-crd-dark p-4 rounded-b-lg space-y-2">
      <Skeleton className="h-4 bg-crd-mediumGray rounded" />
      <Skeleton className="h-3 bg-crd-mediumGray rounded w-2/3" />
      <div className="flex justify-between mt-3">
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-16" />
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-20" />
      </div>
    </div>
  </div>
);

export const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  loading, 
  viewMode, 
  useProgressiveLoading = true,
  onCardClick 
}) => {
  // Performance monitoring in development
  usePerformanceMarks('CardGrid');

  // Mobile-optimized grid classes
  const getGridClasses = () => {
    if (viewMode === 'masonry') {
      return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6';
    }
    if (viewMode === 'feed') {
      return 'space-y-6';
    }
    // Grid mode with mobile-first responsive breakpoints
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6';
  };

  if (loading) {
    return (
      <div className={getGridClasses()}>
        {Array(8).fill(0).map((_, i) => (
          <LoadingSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-crd-lightGray mb-4">No cards found</p>
      </div>
    );
  }

  return (
    <div className={getGridClasses()}>
      {cards.map((card, index) => {
        // Use progressive loading for grid mode for better performance
        if (useProgressiveLoading && viewMode === 'grid') {
          return (
            <ProgressiveCard
              key={`progressive-card-${card.id}-${index}`}
              imageUrl={card.image_url || card.thumbnail_url || '/placeholder.svg'}
              title={card.title || 'Untitled Card'}
              description={card.description || 'Digital collectible card'}
              priority={index < 4 ? 'high' : index < 8 ? 'normal' : 'low'}
              rarity={card.rarity as 'common' | 'uncommon' | 'rare' | 'legendary' || 'common'}
              onClick={onCardClick ? () => onCardClick(card.id) : undefined}
            />
          );
        }

        // Fallback to original CardGridItem for other view modes
        return (
          <CardGridItem key={`card-${card.id}-${index}`} card={card} index={index} />
        );
      })}
    </div>
  );
};

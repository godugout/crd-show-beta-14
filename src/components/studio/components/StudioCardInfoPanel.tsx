import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Eye, Calendar, User } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { getRarityStyles, getRarityBadgeStyles, type CardRarity } from '@/utils/cardDisplayUtils';
import type { CardData } from '@/types/card';

interface StudioCardInfoPanelProps {
  card: CardData;
  onLike?: () => void;
  onShare?: () => void;
  isLiked?: boolean;
  className?: string;
}

export const StudioCardInfoPanel: React.FC<StudioCardInfoPanelProps> = ({
  card,
  onLike,
  onShare,
  isLiked = false,
  className = ''
}) => {
  const rarity = (card.rarity || 'common') as CardRarity;
  const badgeStyles = getRarityBadgeStyles(rarity);
  const rarityStyles = getRarityStyles(rarity);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`bg-crd-dark/95 backdrop-blur-sm border-crd-mediumGray ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-crd-white text-lg mb-1">{card.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-crd-lightGray">
              <User size={14} />
              <span>{card.creator_attribution?.creator_name || 'Unknown Creator'}</span>
            </div>
          </div>
          <Badge 
            className="px-2 py-1"
            style={badgeStyles}
          >
            {rarity}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        {card.description && (
          <div>
            <h4 className="text-sm font-medium text-crd-white mb-2">Description</h4>
            <p className="text-sm text-crd-lightGray leading-relaxed">{card.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-crd-lightGray">
            <Calendar size={14} />
            <span>Created {formatDate(card.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-crd-lightGray">
            <Eye size={14} />
            <span>{card.view_count || 0} views</span>
          </div>
        </div>

        {/* Current Effects */}
        <div>
          <h4 className="text-sm font-medium text-crd-white mb-2">Effects Applied</h4>
          <div className="flex flex-wrap gap-2">
            {card.design_metadata?.effects ? (
              Object.entries(card.design_metadata.effects).map(([effect, value]) => (
                <Badge key={effect} variant="secondary" className="text-xs">
                  {effect}: {typeof value === 'boolean' ? (value ? 'On' : 'Off') : String(value)}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-crd-lightGray">No effects applied</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <CRDButton
            size="sm"
            variant={isLiked ? "primary" : "outline"}
            onClick={onLike}
            className={isLiked ? "" : "border border-crd-mediumGray hover:border-crd-blue hover:bg-crd-blue/10"}
          >
            <Heart size={16} className={isLiked ? "fill-current" : ""} />
            <span className="ml-2">Like</span>
          </CRDButton>
          
          <CRDButton
            size="sm"
            variant="outline"
            onClick={onShare}
            className="border border-crd-mediumGray hover:border-crd-blue hover:bg-crd-blue/10"
          >
            <Share2 size={16} />
            <span className="ml-2">Share</span>
          </CRDButton>
        </div>
      </CardContent>
    </Card>
  );
};
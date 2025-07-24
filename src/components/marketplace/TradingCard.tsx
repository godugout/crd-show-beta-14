import React from 'react';
import { Star, Eye, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TradingCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  creator: {
    name: string;
    avatar?: string;
  };
  favorites: number;
  views: number;
  endTime?: string; // For auctions
  isLiked?: boolean;
  onClick?: () => void;
}

const RARITY_COLORS = {
  common: 'bg-gray-500/20 text-gray-300 border-gray-500',
  rare: 'bg-crd-blue/20 text-crd-blue border-crd-blue',
  epic: 'bg-crd-purple/20 text-crd-purple border-crd-purple',
  legendary: 'bg-crd-yellow/20 text-crd-yellow border-crd-yellow',
};

export const TradingCard: React.FC<TradingCardProps> = ({
  id,
  title,
  imageUrl,
  price,
  rarity,
  creator,
  favorites,
  views,
  endTime,
  isLiked = false,
  onClick
}) => {
  const getRarityClass = () => {
    switch (rarity) {
      case 'rare': return 'trading-card rare';
      case 'epic': return 'trading-card epic';
      case 'legendary': return 'trading-card legendary';
      default: return 'trading-card';
    }
  };

  return (
    <div 
      className={`${getRarityClass()} group cursor-pointer`}
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="relative w-full h-[60%] bg-crd-surface-light overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-crd-surface to-crd-surface-light flex items-center justify-center">
            <div className="text-crd-text-dim text-sm">No Image</div>
          </div>
        )}
        
        {/* Rarity Badge */}
        <Badge 
          className={`absolute top-3 right-3 ${RARITY_COLORS[rarity]} border px-2 py-1 text-xs font-semibold capitalize`}
        >
          {rarity}
        </Badge>

        {/* Auction Timer */}
        {endTime && (
          <div className="absolute top-3 left-3 bg-crd-black/80 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-crd-orange" />
            <span className="text-xs text-crd-text font-mono">2h 15m</span>
          </div>
        )}

        {/* Like Button */}
        <button 
          className="absolute bottom-3 right-3 p-2 bg-crd-black/60 backdrop-blur-sm rounded-full
                   hover:bg-crd-black/80 transition-all duration-200 group"
          onClick={(e) => {
            e.stopPropagation();
            // Handle like toggle
          }}
        >
          <Star 
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-crd-yellow text-crd-yellow' : 'text-crd-text-dim hover:text-crd-yellow'
            }`} 
          />
        </button>
      </div>

      {/* Card Info */}
      <div className="p-4 space-y-3">
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={creator.avatar} />
            <AvatarFallback className="bg-crd-surface-light text-crd-text text-xs">
              {creator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-crd-text-dim truncate">{creator.name}</span>
        </div>

        {/* Title */}
        <h3 className="font-dm-sans text-card font-semibold text-crd-text truncate">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="token-amount text-lg font-bold">
            {price}
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-crd-text-dim">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{favorites}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
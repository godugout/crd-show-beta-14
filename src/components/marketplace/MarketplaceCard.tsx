import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface MarketplaceCardProps {
  listing: {
    id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    rarity: string;
    listing_type: string;
    creator_name?: string;
    creator_avatar?: string;
    views: number;
    auction_end_time?: string;
    created_at: string;
    card_id: string;
  };
}

export const MarketplaceCard = ({ listing }: MarketplaceCardProps) => {
  const navigate = useNavigate();

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      uncommon: 'bg-green-100 text-green-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-orange-100 text-orange-800',
      mythic: 'bg-red-100 text-red-800'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getListingTypeDisplay = (type: string) => {
    const types = {
      fixed_price: 'Buy Now',
      auction: 'Auction',
      bundle: 'Bundle'
    };
    return types[type as keyof typeof types] || type;
  };

  const handleCardClick = () => {
    navigate(`/marketplace/listing/${listing.id}`);
  };

  const timeLeft = listing.auction_end_time 
    ? formatDistanceToNow(new Date(listing.auction_end_time), { addSuffix: true })
    : null;

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div onClick={handleCardClick}>
        {/* Card Image */}
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
              <div className="text-4xl">🎴</div>
            </div>
          )}
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge className={`${getRarityColor(listing.rarity)} capitalize`}>
              {listing.rarity}
            </Badge>
            <Badge variant={listing.listing_type === 'auction' ? 'destructive' : 'default'}>
              {getListingTypeDisplay(listing.listing_type)}
            </Badge>
          </div>

          {/* Auction Timer */}
          {listing.listing_type === 'auction' && timeLeft && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {timeLeft}
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Card Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          {/* Creator Info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={listing.creator_avatar} />
              <AvatarFallback className="text-xs">
                {listing.creator_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {listing.creator_name || 'Unknown Creator'}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">${listing.price}</div>
              {listing.listing_type === 'auction' && (
                <div className="text-xs text-muted-foreground">Current bid</div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {listing.views}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              {listing.listing_type === 'auction' ? 'Place Bid' : 'Buy Now'}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                // Handle favorite
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
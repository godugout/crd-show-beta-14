import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Heart, Share2, Clock, Eye, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ListingDetail {
  id: string;
  price: number;
  listing_type: string;
  description?: string;
  views: number;
  auction_end_time?: string;
  created_at: string;
  seller_id: string;
  card: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    rarity: string;
    creator_id: string;
  };
  seller: {
    username?: string;
    avatar_url?: string;
  };
  current_bid?: number;
  bid_count?: number;
}

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListingDetail();
    }
  }, [id]);

  const fetchListingDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          id,
          price,
          listing_type,
          description,
          views,
          auction_end_time,
          created_at,
          seller_id,
          card_id,
          cards (
            id,
            title,
            description,
            image_url,
            rarity,
            creator_id
          ),
          user_profiles (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to load listing');
        return;
      }

      // Get current highest bid for auctions
      let currentBid = data.price;
      let bidCount = 0;

      if (data.listing_type === 'auction') {
        const { data: bids } = await supabase
          .from('auction_bids')
          .select('amount')
          .eq('auction_id', id)
          .order('amount', { ascending: false });

        if (bids && bids.length > 0) {
          currentBid = bids[0].amount;
          bidCount = bids.length;
        }
      }

      // Extract seller data properly - user_profiles could be an array or object
      let sellerData = { username: 'Anonymous', avatar_url: null };
      if (data.user_profiles) {
        if (Array.isArray(data.user_profiles) && data.user_profiles.length > 0) {
          sellerData = data.user_profiles[0];
        } else if (!Array.isArray(data.user_profiles)) {
          sellerData = data.user_profiles;
        }
      }

      setListing({
        ...data,
        card: data.cards,
        seller: sellerData,
        current_bid: currentBid,
        bid_count: bidCount
      });

      // Increment view count
      await supabase
        .from('marketplace_listings')
        .update({ views: data.views + 1 })
        .eq('id', id);

    } catch (error) {
      console.error('Error fetching listing detail:', error);
      toast.error('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!listing) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to purchase');
        return;
      }

      if (user.id === listing.seller_id) {
        toast.error('You cannot purchase your own listing');
        return;
      }

      // For fixed price listings, update listing status to sold
      if (listing.listing_type === 'fixed_price') {
        // Update listing status
        const { error } = await supabase
          .from('marketplace_listings')
          .update({ status: 'sold' })
          .eq('id', listing.id);

        if (error) {
          console.error('Error updating listing:', error);
          toast.error('Purchase failed');
          return;
        }

        // TODO: Create transaction record once marketplace_transactions types are available
        toast.success('Purchase successful!');
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error purchasing:', error);
      toast.error('Purchase failed');
    }
  };

  const handlePlaceBid = async () => {
    if (!listing || !bidAmount) return;

    const bidValue = parseFloat(bidAmount);
    const currentHighest = listing.current_bid || listing.price;

    if (bidValue <= currentHighest) {
      toast.error('Bid must be higher than current bid');
      return;
    }

    setPlacing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to place a bid');
        return;
      }

      if (user.id === listing.seller_id) {
        toast.error('You cannot bid on your own listing');
        return;
      }

      const { error } = await supabase
        .from('auction_bids')
        .insert([{
          auction_id: listing.id,
          bidder_id: user.id,
          amount: bidValue
        }]);

      if (error) {
        console.error('Error placing bid:', error);
        toast.error('Failed to place bid');
        return;
      }

      toast.success('Bid placed successfully!');
      setBidAmount('');
      fetchListingDetail(); // Refresh to get updated bid info

    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Listing not found</h2>
          <p className="text-muted-foreground mb-4">This listing may have been removed or sold.</p>
          <Button onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

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

  const isAuction = listing.listing_type === 'auction';
  const timeLeft = listing.auction_end_time 
    ? formatDistanceToNow(new Date(listing.auction_end_time), { addSuffix: true })
    : null;
  const auctionEnded = listing.auction_end_time && new Date(listing.auction_end_time) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/marketplace')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Image */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
              {listing.card.image_url ? (
                <img
                  src={listing.card.image_url}
                  alt={listing.card.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                  <div className="text-6xl">🎴</div>
                </div>
              )}
              
              {/* Rarity Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`${getRarityColor(listing.card.rarity)} capitalize`}>
                  {listing.card.rarity}
                </Badge>
              </div>
            </div>

            {/* Card Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="font-semibold">{listing.views}</span>
                </div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
              
              {isAuction && (
                <>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{listing.bid_count || 0}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Bids</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold text-xs">{timeLeft}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Time Left</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{listing.card.title}</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Badge variant={isAuction ? 'destructive' : 'default'}>
                {isAuction ? 'Auction' : 'Fixed Price'}
              </Badge>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={listing.seller.avatar_url} />
                    <AvatarFallback>
                      {listing.seller.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {listing.seller.username || 'Unknown Seller'}
                    </div>
                    <div className="text-sm text-muted-foreground">Seller</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price & Purchase */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {isAuction ? 'Current Bid' : 'Price'}
                  </span>
                  {isAuction && !auctionEnded && (
                    <div className="flex items-center text-sm text-destructive">
                      <Clock className="w-4 h-4 mr-1" />
                      {timeLeft}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">
                  ${isAuction ? listing.current_bid : listing.price}
                </div>

                {isAuction && !auctionEnded ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bid-amount">Your Bid</Label>
                      <Input
                        id="bid-amount"
                        type="number"
                        step="0.01"
                        placeholder={`Minimum: $${(listing.current_bid || listing.price) + 0.01}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handlePlaceBid}
                      disabled={placing || !bidAmount || parseFloat(bidAmount) <= (listing.current_bid || listing.price)}
                      className="w-full"
                    >
                      {placing ? 'Placing Bid...' : 'Place Bid'}
                    </Button>
                  </div>
                ) : auctionEnded ? (
                  <div className="text-center py-4">
                    <div className="text-lg font-semibold text-muted-foreground">
                      Auction Ended
                    </div>
                  </div>
                ) : (
                  <Button onClick={handlePurchase} className="w-full">
                    Buy Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {(listing.description || listing.card.description) && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {listing.description || listing.card.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Listing Details */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed</span>
                  <span>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card ID</span>
                  <span className="font-mono text-sm">{listing.card.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rarity</span>
                  <span className="capitalize">{listing.card.rarity}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
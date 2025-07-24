import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreVertical, Edit, Trash2, Eye, DollarSign, Package, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface SellerListing {
  id: string;
  price: number;
  listing_type: string;
  status: string;
  views: number;
  created_at: string;
  card: {
    title: string;
    image_url?: string;
    rarity: string;
  };
  current_bid?: number;
  bid_count?: number;
}

interface SellerStats {
  totalListings: number;
  activeListings: number;
  totalSales: number;
  totalRevenue: number;
}

export const SellerDashboard = () => {
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [stats, setStats] = useState<SellerStats>({
    totalListings: 0,
    activeListings: 0,
    totalSales: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch listings
      const { data: listingsData } = await supabase
        .from('marketplace_listings')
        .select(`
          id,
          price,
          listing_type,
          status,
          views,
          created_at,
          cards (
            title,
            image_url,
            rarity
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      // Get bid counts for auctions
      const auctionIds = listingsData?.filter(l => l.listing_type === 'auction').map(l => l.id) || [];
      let bidData: any = {};
      
      if (auctionIds.length > 0) {
        const { data: bids } = await supabase
          .from('auction_bids')
          .select('auction_id, amount')
          .in('auction_id', auctionIds);

        bidData = bids?.reduce((acc: any, bid) => {
          if (!acc[bid.auction_id]) {
            acc[bid.auction_id] = { count: 0, highest: 0 };
          }
          acc[bid.auction_id].count++;
          acc[bid.auction_id].highest = Math.max(acc[bid.auction_id].highest, bid.amount);
          return acc;
        }, {}) || {};
      }

      const transformedListings = listingsData?.map((listing: any) => ({
        ...listing,
        card: listing.cards,
        bid_count: bidData[listing.id]?.count || 0,
        current_bid: bidData[listing.id]?.highest || listing.price
      })) || [];

      setListings(transformedListings);

      // Calculate stats
      const totalListings = transformedListings.length;
      const activeListings = transformedListings.filter(l => l.status === 'active').length;
      
      // TODO: Fetch sales data once marketplace_transactions table types are available
      // For now, using mock data
      const totalSales = 0;
      const totalRevenue = 0;

      setStats({
        totalListings,
        activeListings,
        totalSales,
        totalRevenue
      });

    } catch (error) {
      console.error('Error fetching seller data:', error);
      toast.error('Failed to load seller data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .delete()
        .eq('id', listingId);

      if (error) {
        toast.error('Failed to delete listing');
        return;
      }

      toast.success('Listing deleted successfully');
      fetchSellerData();
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const filteredListings = listings.filter(listing => {
    switch (activeTab) {
      case 'active': return listing.status === 'active';
      case 'sold': return listing.status === 'sold';
      case 'expired': return listing.status === 'expired';
      default: return true;
    }
  });

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

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Listings</p>
                <p className="text-2xl font-bold">{stats.totalListings}</p>
              </div>
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold">{stats.activeListings}</p>
              </div>
              <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{stats.totalSales}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Management */}
      <Card>
        <CardHeader>
          <CardTitle>My Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="active">Active ({listings.filter(l => l.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="sold">Sold ({listings.filter(l => l.status === 'sold').length})</TabsTrigger>
              <TabsTrigger value="expired">Expired ({listings.filter(l => l.status === 'expired').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredListings.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No {activeTab} listings</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'active' ? 'Create your first listing to get started.' : `You have no ${activeTab} listings.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="aspect-[4/3] relative bg-muted">
                        {listing.card.image_url ? (
                          <img
                            src={listing.card.image_url}
                            alt={listing.card.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-4xl">🎴</div>
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className={getRarityColor(listing.card.rarity)}>
                            {listing.card.rarity}
                          </Badge>
                        </div>

                        {/* Actions Menu */}
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              {listing.status === 'active' && (
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleDeleteListing(listing.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-1">{listing.card.title}</h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-lg font-bold">
                            ${listing.listing_type === 'auction' ? listing.current_bid : listing.price}
                          </div>
                          <Badge variant={listing.listing_type === 'auction' ? 'destructive' : 'default'}>
                            {listing.listing_type === 'auction' ? 'Auction' : 'Fixed'}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {listing.views} views
                          </div>
                          {listing.listing_type === 'auction' && (
                            <div>
                              {listing.bid_count} bids
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground mt-2">
                          Listed {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
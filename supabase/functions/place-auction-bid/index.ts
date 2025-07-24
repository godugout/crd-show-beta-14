import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { auction_id, amount, proxy_max } = await req.json();
    
    if (!auction_id || !amount) {
      throw new Error('Missing required fields: auction_id and amount');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('Invalid user token');
    }

    // Verify auction exists and is still active
    const { data: auction, error: auctionError } = await supabaseClient
      .from('marketplace_listings')
      .select('*')
      .eq('id', auction_id)
      .eq('listing_type', 'auction')
      .eq('status', 'active')
      .single();

    if (auctionError || !auction) {
      throw new Error('Auction not found or no longer active');
    }

    // Check if auction has ended
    if (auction.auction_end_time && new Date(auction.auction_end_time) < new Date()) {
      throw new Error('Auction has ended');
    }

    // Prevent self-bidding
    if (auction.seller_id === userData.user.id) {
      throw new Error('Cannot bid on your own auction');
    }

    // Use the database function to place bid
    const { data: bidId, error: bidError } = await supabaseClient
      .rpc('place_bid', {
        p_auction_id: auction_id,
        p_amount: amount,
        p_proxy_max: proxy_max || null,
      });

    if (bidError) {
      throw new Error(bidError.message || 'Failed to place bid');
    }

    // Update listing with new current bid
    await supabaseClient
      .from('marketplace_listings')
      .update({
        current_bid: amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', auction_id);

    // Get updated bid information
    const { data: bidInfo } = await supabaseClient
      .from('auction_bids')
      .select('*')
      .eq('id', bidId)
      .single();

    return new Response(JSON.stringify({
      success: true,
      bid_id: bidId,
      amount: amount,
      is_winning: bidInfo?.is_winning_bid || false,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error placing bid:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to place bid' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
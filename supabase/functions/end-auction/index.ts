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
    const { auction_id } = await req.json();
    
    if (!auction_id) {
      throw new Error('Missing auction_id');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get auction details
    const { data: auction, error: auctionError } = await supabaseClient
      .from('marketplace_listings')
      .select('*')
      .eq('id', auction_id)
      .eq('listing_type', 'auction')
      .single();

    if (auctionError || !auction) {
      throw new Error('Auction not found');
    }

    // Check if auction has actually ended
    if (auction.auction_end_time && new Date(auction.auction_end_time) > new Date()) {
      throw new Error('Auction has not ended yet');
    }

    // Get winning bid
    const { data: winningBid, error: bidError } = await supabaseClient
      .from('auction_bids')
      .select('*')
      .eq('auction_id', auction_id)
      .eq('is_winning_bid', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (bidError || !winningBid) {
      // No bids - mark auction as ended without winner
      await supabaseClient
        .from('marketplace_listings')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
        })
        .eq('id', auction_id);

      return new Response(JSON.stringify({
        success: true,
        has_winner: false,
        message: 'Auction ended with no bids',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Create transaction record for winning bid
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('marketplace_transactions')
      .insert({
        listing_id: auction_id,
        buyer_id: winningBid.bidder_id,
        seller_id: auction.seller_id,
        amount: winningBid.amount,
        transaction_type: 'auction_win',
        status: 'pending_payment',
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error('Failed to create transaction record');
    }

    // Update auction status
    await supabaseClient
      .from('marketplace_listings')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
        final_price: winningBid.amount,
      })
      .eq('id', auction_id);

    return new Response(JSON.stringify({
      success: true,
      has_winner: true,
      winner_id: winningBid.bidder_id,
      winning_amount: winningBid.amount,
      transaction_id: transaction.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error ending auction:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to end auction' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
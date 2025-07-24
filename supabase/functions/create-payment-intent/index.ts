import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    const { listing_id, amount } = await req.json();
    
    if (!listing_id || !amount) {
      throw new Error('Missing required fields: listing_id and amount');
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

    // Verify listing exists and get details
    const { data: listing, error: listingError } = await supabaseClient
      .from('marketplace_listings')
      .select('*')
      .eq('id', listing_id)
      .single();

    if (listingError || !listing) {
      throw new Error('Listing not found');
    }

    // Prevent self-purchase
    if (listing.seller_id === userData.user.id) {
      throw new Error('Cannot purchase your own listing');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        listing_id,
        buyer_id: userData.user.id,
        seller_id: listing.seller_id,
      },
    });

    // Store transaction record
    await supabaseClient.from('marketplace_transactions').insert({
      listing_id,
      buyer_id: userData.user.id,
      seller_id: listing.seller_id,
      amount,
      stripe_payment_intent_id: paymentIntent.id,
      transaction_type: listing.listing_type === 'auction' ? 'auction_win' : 'direct_purchase',
      status: 'pending',
    });

    return new Response(JSON.stringify({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create payment intent' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
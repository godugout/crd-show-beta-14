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
    const { payment_intent_id } = await req.json();
    
    if (!payment_intent_id) {
      throw new Error('Missing payment_intent_id');
    }

    // Initialize services
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Verify payment intent status
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not completed');
    }

    // Get transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('marketplace_transactions')
      .select('*')
      .eq('stripe_payment_intent_id', payment_intent_id)
      .single();

    if (transactionError || !transaction) {
      throw new Error('Transaction record not found');
    }

    // Update transaction status
    await supabaseClient
      .from('marketplace_transactions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', transaction.id);

    // Update listing status
    const { error: listingError } = await supabaseClient
      .from('marketplace_listings')
      .update({
        status: 'sold',
        sold_at: new Date().toISOString(),
        final_price: transaction.amount,
      })
      .eq('id', transaction.listing_id);

    if (listingError) {
      console.error('Error updating listing:', listingError);
    }

    // Calculate platform fee (5%)
    const platformFee = transaction.amount * 0.05;
    const sellerAmount = transaction.amount - platformFee;

    // Create seller earnings record
    const { error: earningsError } = await supabaseClient
      .from('creator_earnings')
      .insert({
        creator_id: transaction.seller_id,
        transaction_id: transaction.id,
        gross_amount: transaction.amount,
        platform_fee: platformFee,
        net_amount: sellerAmount,
        transaction_date: new Date().toISOString(),
        status: 'pending', // Will be paid out later
      });

    if (earningsError) {
      console.error('Error creating earnings record:', earningsError);
    }

    return new Response(JSON.stringify({
      success: true,
      transaction_id: transaction.id,
      seller_earnings: sellerAmount,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error finalizing transaction:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to finalize transaction' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
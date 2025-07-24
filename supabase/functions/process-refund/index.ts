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
    const { transaction_id, reason } = await req.json();
    
    if (!transaction_id) {
      throw new Error('Missing transaction_id');
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

    // Get transaction details
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('marketplace_transactions')
      .select('*')
      .eq('id', transaction_id)
      .single();

    if (transactionError || !transaction) {
      throw new Error('Transaction not found');
    }

    // Verify user is buyer or seller
    if (transaction.buyer_id !== userData.user.id && transaction.seller_id !== userData.user.id) {
      throw new Error('Not authorized to refund this transaction');
    }

    // Check if refund already exists
    const { data: existingRefund } = await supabaseClient
      .from('payment_refunds')
      .select('id')
      .eq('transaction_id', transaction_id)
      .single();

    if (existingRefund) {
      throw new Error('Refund already requested for this transaction');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: transaction.stripe_payment_intent_id,
      amount: Math.round(transaction.amount * 100), // Convert to cents
      reason: reason || 'requested_by_customer',
      metadata: {
        transaction_id: transaction_id,
        requested_by: userData.user.id,
      },
    });

    // Create refund record
    const { data: refundRecord, error: refundError } = await supabaseClient
      .from('payment_refunds')
      .insert({
        transaction_id: transaction_id,
        stripe_refund_id: refund.id,
        amount: transaction.amount,
        reason: reason,
        status: refund.status,
        requested_by: userData.user.id,
      })
      .select()
      .single();

    if (refundError) {
      throw new Error('Failed to create refund record');
    }

    // Update transaction status
    await supabaseClient
      .from('marketplace_transactions')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction_id);

    // If buyer paid with tokens, refund tokens
    if (transaction.payment_method === 'tokens') {
      await supabaseClient.rpc('update_user_token_balance', {
        user_uuid: transaction.buyer_id,
        amount_change: Math.round(transaction.amount * 100), // Convert to tokens
        transaction_type_param: 'refund',
        source_param: 'marketplace_refund',
        source_id_param: transaction_id,
        description_param: `Refund for transaction ${transaction_id}`,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      refund_id: refundRecord.id,
      stripe_refund_id: refund.id,
      amount: transaction.amount,
      status: refund.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process refund' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
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

    const user_id = paymentIntent.metadata.user_id;
    const token_amount = parseInt(paymentIntent.metadata.token_amount);
    
    if (!user_id || !token_amount) {
      throw new Error('Invalid payment metadata');
    }

    // Add tokens to user balance
    const { data, error } = await supabaseClient.rpc('update_user_token_balance', {
      user_uuid: user_id,
      amount_change: token_amount,
      transaction_type_param: 'purchase',
      source_param: 'stripe_purchase',
      source_id_param: null,
      description_param: `Purchased ${token_amount} CRD tokens`
    });

    if (error) {
      console.error('Error updating token balance:', error);
      throw new Error('Failed to add tokens to account');
    }

    // Get updated token balance
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('user_tokens')
      .select('token_balance, lifetime_earned')
      .eq('user_id', user_id)
      .single();

    return new Response(JSON.stringify({
      success: true,
      tokens_added: token_amount,
      new_balance: tokenData?.token_balance || 0,
      lifetime_earned: tokenData?.lifetime_earned || 0,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error finalizing token purchase:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to finalize token purchase' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
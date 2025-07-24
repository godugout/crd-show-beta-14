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
    const { token_amount, payment_method } = await req.json();
    
    if (!token_amount || token_amount < 100) {
      throw new Error('Minimum purchase is 100 CRD tokens');
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

    // Calculate USD price ($1 = 100 CRD tokens)
    const usd_amount = token_amount / 100;
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: userData.user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create payment intent for token purchase
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(usd_amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      customer_email: customerId ? undefined : userData.user.email,
      metadata: {
        user_id: userData.user.id,
        token_amount: token_amount.toString(),
        purchase_type: 'crd_tokens',
      },
      description: `Purchase ${token_amount} CRD tokens`,
    });

    return new Response(JSON.stringify({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      token_amount,
      usd_amount,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating token purchase:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create token purchase' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
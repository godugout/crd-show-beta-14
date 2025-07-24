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

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get or create Stripe Connect account
    let { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('stripe_connect_account_id, stripe_customer_id')
      .eq('id', userData.user.id)
      .single();

    if (!profile?.stripe_connect_account_id) {
      // Create Stripe Connect account
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: userData.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          user_id: userData.user.id,
        },
      });

      // Update user profile with Connect account ID
      await supabaseClient
        .from('user_profiles')
        .update({
          stripe_connect_account_id: account.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.user.id);

      profile = { ...profile, stripe_connect_account_id: account.id };
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: profile.stripe_connect_account_id,
      refresh_url: `${req.headers.get('origin')}/creator-dashboard?setup=refresh`,
      return_url: `${req.headers.get('origin')}/creator-dashboard?setup=complete`,
      type: 'account_onboarding',
    });

    // Check account status
    const account = await stripe.accounts.retrieve(profile.stripe_connect_account_id);
    const isOnboarded = account.details_submitted && account.charges_enabled;

    if (isOnboarded) {
      // Update user profile payment status
      await supabaseClient
        .from('user_profiles')
        .update({
          payment_methods_enabled: true,
          kyc_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.user.id);
    }

    return new Response(JSON.stringify({
      account_id: profile.stripe_connect_account_id,
      onboarding_url: accountLink.url,
      is_onboarded: isOnboarded,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error setting up Stripe Connect:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to setup Stripe Connect' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
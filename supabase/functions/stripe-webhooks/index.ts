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
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Log webhook event
    await supabaseClient.from('payment_webhooks').insert({
      stripe_event_id: event.id,
      event_type: event.type,
      data: event.data,
    });

    console.log(`Processing webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        // Handle token purchases
        if (paymentIntent.metadata.purchase_type === 'crd_tokens') {
          const user_id = paymentIntent.metadata.user_id;
          const token_amount = parseInt(paymentIntent.metadata.token_amount);
          
          await supabaseClient.rpc('update_user_token_balance', {
            user_uuid: user_id,
            amount_change: token_amount,
            transaction_type_param: 'purchase',
            source_param: 'stripe_webhook',
            source_id_param: null,
            description_param: `Webhook: Purchased ${token_amount} CRD tokens`
          });
        }
        
        // Handle marketplace transactions
        const { data: transaction } = await supabaseClient
          .from('marketplace_transactions')
          .select('*')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single();

        if (transaction) {
          await supabaseClient
            .from('marketplace_transactions')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
            })
            .eq('id', transaction.id);

          // Create creator earnings record
          const platformFee = transaction.amount * 0.025;
          const netAmount = transaction.amount - platformFee;

          await supabaseClient.from('creator_earnings').insert({
            creator_id: transaction.seller_id,
            transaction_id: transaction.id,
            gross_amount: transaction.amount,
            platform_fee: platformFee,
            net_amount: netAmount,
            transaction_date: new Date().toISOString(),
            status: 'pending',
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get user from customer ID
        const { data: profile } = await supabaseClient
          .from('user_profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabaseClient
            .from('user_subscriptions')
            .upsert({
              user_id: profile.id,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await supabaseClient
          .from('user_subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object;
        const paymentIntentId = dispute.payment_intent;
        
        // Handle disputes - mark transaction as disputed
        await supabaseClient
          .from('marketplace_transactions')
          .update({ status: 'disputed' })
          .eq('stripe_payment_intent_id', paymentIntentId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark webhook as processed
    await supabaseClient
      .from('payment_webhooks')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq('stripe_event_id', event.id);

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    
    // Log error in webhook record if possible
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );
      
      await supabaseClient
        .from('payment_webhooks')
        .update({
          processed: false,
          error_message: error.message,
          processed_at: new Date().toISOString(),
        })
        .eq('stripe_event_id', req.headers.get('stripe-signature'));
    } catch {}

    return new Response(JSON.stringify({ 
      error: error.message || 'Webhook processing failed' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
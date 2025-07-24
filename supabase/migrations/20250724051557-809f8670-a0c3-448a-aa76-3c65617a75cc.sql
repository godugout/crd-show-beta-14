-- Add Stripe customer ID to user profiles and enhance payment tables
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_connect_account_id TEXT,
ADD COLUMN IF NOT EXISTS payment_methods_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false;

-- Payment webhooks table for tracking Stripe events
CREATE TABLE public.payment_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Escrow table for auction bidding
CREATE TABLE public.auction_escrow (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID NOT NULL REFERENCES marketplace_listings(id),
  bidder_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'held', 'released', 'refunded'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  released_at TIMESTAMP WITH TIME ZONE
);

-- Refunds table
CREATE TABLE public.payment_refunds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES marketplace_transactions(id),
  stripe_refund_id TEXT UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'succeeded', 'failed'
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Creator payout requests
CREATE TABLE public.creator_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC(10,2) NOT NULL,
  stripe_transfer_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  earnings_period_start DATE NOT NULL,
  earnings_period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on new tables
ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_webhooks (admin access only)
CREATE POLICY "System can manage webhooks" ON public.payment_webhooks
FOR ALL WITH CHECK (true);

-- RLS Policies for auction_escrow
CREATE POLICY "Users can view their escrow" ON public.auction_escrow
FOR SELECT USING (auth.uid() = bidder_id);

CREATE POLICY "System can manage escrow" ON public.auction_escrow
FOR ALL WITH CHECK (true);

-- RLS Policies for payment_refunds
CREATE POLICY "Users can view their refunds" ON public.payment_refunds
FOR SELECT USING (auth.uid() = requested_by OR EXISTS (
  SELECT 1 FROM marketplace_transactions mt 
  WHERE mt.id = payment_refunds.transaction_id 
  AND (mt.buyer_id = auth.uid() OR mt.seller_id = auth.uid())
));

CREATE POLICY "Users can request refunds" ON public.payment_refunds
FOR INSERT WITH CHECK (auth.uid() = requested_by);

-- RLS Policies for creator_payouts
CREATE POLICY "Creators can view their payouts" ON public.creator_payouts
FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "System can manage payouts" ON public.creator_payouts
FOR ALL WITH CHECK (true);

-- Function to get user's Stripe customer ID or create one
CREATE OR REPLACE FUNCTION public.get_or_create_stripe_customer(user_uuid UUID, email_param TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  customer_id TEXT;
BEGIN
  -- Try to get existing customer ID
  SELECT stripe_customer_id INTO customer_id
  FROM public.user_profiles
  WHERE id = user_uuid;
  
  -- Return existing ID if found
  IF customer_id IS NOT NULL THEN
    RETURN customer_id;
  END IF;
  
  -- If no customer ID exists, this function should be called from edge function
  -- that will create the customer and update the profile
  RETURN NULL;
END;
$$;

-- Function to calculate creator earnings for payout
CREATE OR REPLACE FUNCTION public.calculate_pending_earnings(creator_uuid UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  total_earnings NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM(net_amount), 0) INTO total_earnings
  FROM public.creator_earnings
  WHERE creator_id = creator_uuid AND status = 'pending';
  
  RETURN total_earnings;
END;
$$;
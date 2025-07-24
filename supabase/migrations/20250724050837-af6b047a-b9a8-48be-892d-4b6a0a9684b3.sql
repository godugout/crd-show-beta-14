-- Create CRD tokens and subscription system tables (avoiding existing tables)

-- User tokens table for CRD token balances
CREATE TABLE public.user_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_balance INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  last_transaction_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Token transactions for tracking all CRD token movements
CREATE TABLE public.token_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'purchase', 'spend', 'earn', 'refund'
  amount INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'stripe_purchase', 'marketplace_sale', 'auction_win', etc.
  source_id UUID, -- Reference to related transaction/purchase
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subscription plans
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  stripe_price_id TEXT UNIQUE,
  price_monthly NUMERIC(10,2) NOT NULL,
  price_annual NUMERIC(10,2),
  features JSONB NOT NULL DEFAULT '{}',
  monthly_card_limit INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User subscriptions
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'expired', 'past_due'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_tokens
CREATE POLICY "Users can view their own tokens" ON public.user_tokens
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" ON public.user_tokens
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert tokens" ON public.user_tokens
FOR INSERT WITH CHECK (true);

-- RLS Policies for token_transactions
CREATE POLICY "Users can view their own token transactions" ON public.token_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert token transactions" ON public.token_transactions
FOR INSERT WITH CHECK (true);

-- RLS Policies for subscription_plans
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans
FOR SELECT USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
FOR UPDATE USING (auth.uid() = user_id);

-- Add missing columns to marketplace_transactions if not exist
ALTER TABLE public.marketplace_transactions 
ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0;

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_annual, features, monthly_card_limit, sort_order) VALUES
('Free', 0.00, 0.00, '{"cards_per_month": 10, "basic_effects": true, "community_access": true}', 10, 1),
('Collector', 8.99, 89.99, '{"cards_per_month": -1, "premium_effects": true, "priority_support": true, "marketplace_access": true}', -1, 2),
('Creator Pro', 29.99, 299.99, '{"cards_per_month": -1, "premium_effects": true, "marketplace_selling": true, "analytics": true, "priority_support": true, "revenue_sharing": true}', -1, 3);

-- Functions for token management
CREATE OR REPLACE FUNCTION public.update_user_token_balance(
  user_uuid UUID,
  amount_change INTEGER,
  transaction_type_param TEXT,
  source_param TEXT,
  source_id_param UUID DEFAULT NULL,
  description_param TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT token_balance INTO current_balance
  FROM public.user_tokens
  WHERE user_id = user_uuid;
  
  -- Create user tokens record if it doesn't exist
  IF current_balance IS NULL THEN
    INSERT INTO public.user_tokens (user_id, token_balance, lifetime_earned, lifetime_spent)
    VALUES (user_uuid, 0, 0, 0);
    current_balance := 0;
  END IF;
  
  -- Check if user has sufficient balance for spending
  IF amount_change < 0 AND current_balance + amount_change < 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Update token balance
  UPDATE public.user_tokens
  SET 
    token_balance = token_balance + amount_change,
    lifetime_earned = CASE WHEN amount_change > 0 THEN lifetime_earned + amount_change ELSE lifetime_earned END,
    lifetime_spent = CASE WHEN amount_change < 0 THEN lifetime_spent + ABS(amount_change) ELSE lifetime_spent END,
    last_transaction_at = NOW(),
    updated_at = NOW()
  WHERE user_id = user_uuid;
  
  -- Log transaction
  INSERT INTO public.token_transactions (user_id, transaction_type, amount, source, source_id, description)
  VALUES (user_uuid, transaction_type_param, amount_change, source_param, source_id_param, description_param);
  
  RETURN TRUE;
END;
$$;

-- Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_tokens_updated_at
  BEFORE UPDATE ON public.user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
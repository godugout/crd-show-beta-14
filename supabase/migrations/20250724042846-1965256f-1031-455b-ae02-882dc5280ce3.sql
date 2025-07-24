-- Add seller_id to marketplace_listings table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'marketplace_listings' AND column_name = 'seller_id') THEN
        ALTER TABLE public.marketplace_listings ADD COLUMN seller_id UUID REFERENCES public.user_profiles(id);
    END IF;
END $$;

-- Create marketplace_transactions table
CREATE TABLE IF NOT EXISTS public.marketplace_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id),
    buyer_id UUID NOT NULL REFERENCES public.user_profiles(id),
    seller_id UUID NOT NULL REFERENCES public.user_profiles(id),
    amount NUMERIC(10,2) NOT NULL,
    transaction_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    transaction_hash TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on marketplace_transactions
ALTER TABLE public.marketplace_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for marketplace_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.marketplace_transactions 
FOR SELECT 
USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "System can create transactions" 
ON public.marketplace_transactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update transaction status" 
ON public.marketplace_transactions 
FOR UPDATE 
USING (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_buyer_id ON public.marketplace_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_seller_id ON public.marketplace_transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_listing_id ON public.marketplace_transactions(listing_id);
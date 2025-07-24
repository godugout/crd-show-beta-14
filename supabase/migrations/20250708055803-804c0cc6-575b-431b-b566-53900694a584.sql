-- Create card likes table
CREATE TABLE public.card_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(card_id, user_id)
);

-- Enable RLS
ALTER TABLE public.card_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for card likes
CREATE POLICY "Anyone can view likes" 
ON public.card_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can like cards" 
ON public.card_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike cards" 
ON public.card_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update like count on cards
CREATE OR REPLACE FUNCTION public.update_card_like_count()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.cards SET favorite_count = favorite_count + 1 WHERE id = NEW.card_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.cards SET favorite_count = GREATEST(favorite_count - 1, 0) WHERE id = OLD.card_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Create trigger for like count updates
CREATE TRIGGER update_card_like_count_trigger
  AFTER INSERT OR DELETE ON public.card_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_card_like_count();

-- Create social shares table for tracking
CREATE TABLE public.social_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id uuid NOT NULL,
  user_id uuid,
  share_type text NOT NULL, -- 'link', 'twitter', 'facebook', etc.
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;

-- Create policies for shares
CREATE POLICY "Anyone can track shares" 
ON public.social_shares 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view all shares" 
ON public.social_shares 
FOR SELECT 
USING (true);
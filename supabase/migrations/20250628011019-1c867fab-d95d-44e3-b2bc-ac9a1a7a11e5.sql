
-- Create temporary table for web scrape analysis
CREATE TABLE IF NOT EXISTS public.temp_card_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL,
  title text NOT NULL,
  snippet text,
  url text,
  source text NOT NULL,
  relevance_score numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  processed boolean DEFAULT false
);

-- Add index for session lookups
CREATE INDEX IF NOT EXISTS idx_temp_card_analysis_session ON public.temp_card_analysis(session_id);

-- Add cleanup function to remove old temporary data
CREATE OR REPLACE FUNCTION cleanup_temp_card_analysis()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM public.temp_card_analysis 
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$function$;

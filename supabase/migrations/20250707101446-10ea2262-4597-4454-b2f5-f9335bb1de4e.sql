-- Initialize progress for existing users based on their current cards
UPDATE public.user_profiles 
SET 
  cards_created_count = COALESCE((
    SELECT COUNT(*) 
    FROM public.cards 
    WHERE creator_id = user_profiles.id
  ), 0),
  unique_templates_used = COALESCE((
    SELECT COUNT(DISTINCT template_id) 
    FROM public.cards 
    WHERE creator_id = user_profiles.id AND template_id IS NOT NULL
  ), 0),
  effects_applied_count = COALESCE((
    SELECT COUNT(*) 
    FROM public.cards 
    WHERE creator_id = user_profiles.id 
    AND design_metadata IS NOT NULL 
    AND design_metadata::text != '{}'::text
  ), 0),
  updated_at = NOW()
WHERE cards_created_count = 0; -- Only update users who haven't been initialized yet
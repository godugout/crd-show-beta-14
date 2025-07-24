-- Add user progress tracking fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS cards_created_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unique_templates_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS effects_applied_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS days_active_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS progress_milestones JSONB DEFAULT '[]'::jsonb;

-- Create function to update user progress stats
CREATE OR REPLACE FUNCTION update_user_progress_on_card_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Update cards created count and last active date
  UPDATE public.user_profiles 
  SET 
    cards_created_count = cards_created_count + 1,
    last_active_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE id = NEW.creator_id;
  
  -- Update unique templates used if template_id is new for this user
  IF NEW.template_id IS NOT NULL THEN
    UPDATE public.user_profiles 
    SET unique_templates_used = (
      SELECT COUNT(DISTINCT template_id) 
      FROM public.cards 
      WHERE creator_id = NEW.creator_id AND template_id IS NOT NULL
    )
    WHERE id = NEW.creator_id;
  END IF;
  
  -- Update effects applied count based on design_metadata
  IF NEW.design_metadata IS NOT NULL AND NEW.design_metadata::text != '{}'::text THEN
    UPDATE public.user_profiles 
    SET effects_applied_count = effects_applied_count + 1
    WHERE id = NEW.creator_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for card creation progress tracking
DROP TRIGGER IF EXISTS trigger_update_user_progress_on_card_creation ON public.cards;
CREATE TRIGGER trigger_update_user_progress_on_card_creation
  AFTER INSERT ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress_on_card_creation();

-- Create function to update daily streak
CREATE OR REPLACE FUNCTION update_daily_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user was active yesterday
  IF OLD.last_active_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Continue streak
    NEW.days_active_streak = OLD.days_active_streak + 1;
  ELSIF OLD.last_active_date < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Reset streak
    NEW.days_active_streak = 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for daily streak tracking
DROP TRIGGER IF EXISTS trigger_update_daily_streak ON public.user_profiles;
CREATE TRIGGER trigger_update_daily_streak
  BEFORE UPDATE OF last_active_date ON public.user_profiles
  FOR EACH ROW
  WHEN (NEW.last_active_date != OLD.last_active_date)
  EXECUTE FUNCTION update_daily_streak();
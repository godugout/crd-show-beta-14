
-- Enable RLS on all tables that don't have it yet (ignore if already enabled)
DO $$ 
BEGIN
    IF NOT (SELECT schemaname FROM pg_tables WHERE tablename = 'cards' AND schemaname = 'public') IS NULL THEN
        BEGIN
            ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
        EXCEPTION WHEN OTHERS THEN
            -- RLS already enabled
        END;
    END IF;
END $$;

-- Drop existing policies and recreate them to ensure consistency
DROP POLICY IF EXISTS "Users can view all public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view public cards" ON public.cards;
DROP POLICY IF EXISTS "Users can create their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can update their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can delete their own cards" ON public.cards;

DROP POLICY IF EXISTS "Users can view public collections and their own" ON public.collections;
DROP POLICY IF EXISTS "Users can create their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can update their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can delete their own collections" ON public.collections;

DROP POLICY IF EXISTS "Users can view collection cards from accessible collections" ON public.collection_cards;
DROP POLICY IF EXISTS "Users can manage their own collection cards" ON public.collection_cards;

DROP POLICY IF EXISTS "Users can view public memories and their own" ON public.memories;
DROP POLICY IF EXISTS "Users can create their own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can update their own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can delete their own memories" ON public.memories;

DROP POLICY IF EXISTS "Users can view all comments" ON public.comments;
DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

DROP POLICY IF EXISTS "Users can view all reactions" ON public.reactions;
DROP POLICY IF EXISTS "Users can create their own reactions" ON public.reactions;
DROP POLICY IF EXISTS "Users can update their own reactions" ON public.reactions;
DROP POLICY IF EXISTS "Users can delete their own reactions" ON public.reactions;

DROP POLICY IF EXISTS "Users can view all follows" ON public.follows;
DROP POLICY IF EXISTS "Users can create their own follows" ON public.follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON public.follows;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can view all media" ON public.media;
DROP POLICY IF EXISTS "Users can create their own media" ON public.media;
DROP POLICY IF EXISTS "Users can update their own media" ON public.media;
DROP POLICY IF EXISTS "Users can delete their own media" ON public.media;

DROP POLICY IF EXISTS "Anyone can view public templates" ON public.card_templates;
DROP POLICY IF EXISTS "Authenticated users can create templates" ON public.card_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.card_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.card_templates;

DROP POLICY IF EXISTS "Anyone can view tags" ON public.tags;
DROP POLICY IF EXISTS "Authenticated users can create tags" ON public.tags;

-- Enable RLS on all tables
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all public profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cards policies
CREATE POLICY "Users can view public cards" ON public.cards
  FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create their own cards" ON public.cards
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own cards" ON public.cards
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own cards" ON public.cards
  FOR DELETE USING (auth.uid() = creator_id);

-- Collections policies
CREATE POLICY "Users can view public collections and their own" ON public.collections
  FOR SELECT USING (visibility = 'public' OR owner_id = auth.uid());

CREATE POLICY "Users can create their own collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own collections" ON public.collections
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own collections" ON public.collections
  FOR DELETE USING (auth.uid() = owner_id);

-- Collection cards policies
CREATE POLICY "Users can view collection cards from accessible collections" ON public.collection_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collections 
      WHERE id = collection_id 
      AND (visibility = 'public' OR owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own collection cards" ON public.collection_cards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections 
      WHERE id = collection_id 
      AND owner_id = auth.uid()
    )
  );

-- Memories policies
CREATE POLICY "Users can view public memories and their own" ON public.memories
  FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can create their own memories" ON public.memories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories" ON public.memories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories" ON public.memories
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view all comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

-- Reactions policies
CREATE POLICY "Users can view all reactions" ON public.reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reactions" ON public.reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" ON public.reactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON public.reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view all follows" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own follows" ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = recipient_id);

-- Media policies
CREATE POLICY "Users can view all media" ON public.media
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own media" ON public.media
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own media" ON public.media
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own media" ON public.media
  FOR DELETE USING (auth.uid() = owner_id);

-- Card templates policies
CREATE POLICY "Anyone can view public templates" ON public.card_templates
  FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Authenticated users can create templates" ON public.card_templates
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own templates" ON public.card_templates
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own templates" ON public.card_templates
  FOR DELETE USING (auth.uid() = creator_id);

-- Tags policies
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tags" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, preferences)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'bio', ''),
    COALESCE(new.raw_user_meta_data->>'preferences', '{}')::jsonb
  );
  RETURN new;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at trigger for profiles
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

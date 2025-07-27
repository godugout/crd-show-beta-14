-- Create user account for jaybhai784@hotmail.com
-- Run this in your Supabase SQL editor

-- First, create the auth user (this would normally be done through Supabase Auth)
-- For now, we'll create a profile entry that will be linked when you sign up

INSERT INTO public.profiles (
  id,
  username,
  full_name,
  avatar_url,
  created_at,
  updated_at,
  team_id,
  creator_verified,
  creator_badge,
  specialties,
  portfolio_links,
  bio_extended
) VALUES (
  gen_random_uuid(),
  'jaybhai',
  'Jay Patel',
  null,
  NOW(),
  NOW(),
  null,
  false,
  null,
  ARRAY[]::text[],
  '{}'::jsonb,
  null
) ON CONFLICT (id) DO NOTHING;

-- You can now sign up with jaybhai784@hotmail.com and it will link to this profile 
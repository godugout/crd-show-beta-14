# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-07-27-auth-profiles-enhancement/spec.md

> Created: 2025-07-27
> Version: 1.0.0

## Schema Changes

### Enhanced profiles Table

```sql
-- Add new columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
ADD COLUMN IF NOT EXISTS profile_type text DEFAULT 'personal' CHECK (profile_type IN ('personal', 'creator', 'business')),
ADD COLUMN IF NOT EXISTS email text UNIQUE,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS completeness_score integer DEFAULT 0 CHECK (completeness_score >= 0 AND completeness_score <= 100),
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS privacy_settings jsonb DEFAULT '{"profile_public": true, "show_email": false}',
ADD COLUMN IF NOT EXISTS deleted_at timestamptz,

-- Creator-specific fields
ADD COLUMN IF NOT EXISTS portfolio_url text,
ADD COLUMN IF NOT EXISTS specialties text[],
ADD COLUMN IF NOT EXISTS commission_rates jsonb,
ADD COLUMN IF NOT EXISTS stripe_account_id text,
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS total_earnings numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS cards_created_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_rating numeric(3, 2),

-- Business-specific fields
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS tax_id text,
ADD COLUMN IF NOT EXISTS business_address jsonb,

-- Activity tracking
ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS experience_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS days_active_streak integer DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NULL;
```

### Profile Audit Table

```sql
-- Create audit table for profile changes
CREATE TABLE IF NOT EXISTS public.profile_audits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  changed_by uuid REFERENCES public.profiles(id),
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'role_change')),
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profile_audits_profile_id ON public.profile_audits(profile_id);
CREATE INDEX idx_profile_audits_created_at ON public.profile_audits(created_at);
```

### Role Permissions Table

```sql
-- Create role permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('user', 'creator', 'admin')),
  permission text NOT NULL,
  resource text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, permission, resource)
);

-- Insert default permissions
INSERT INTO public.role_permissions (role, permission, resource) VALUES
-- User permissions
('user', 'read', 'own_profile'),
('user', 'update', 'own_profile'),
('user', 'create', 'cards'),
('user', 'read', 'public_cards'),

-- Creator permissions (includes all user permissions)
('creator', 'read', 'own_profile'),
('creator', 'update', 'own_profile'),
('creator', 'create', 'cards'),
('creator', 'read', 'public_cards'),
('creator', 'create', 'marketplace_listings'),
('creator', 'manage', 'own_shop'),
('creator', 'view', 'earnings_analytics'),

-- Admin permissions (includes all permissions)
('admin', 'read', 'all_profiles'),
('admin', 'update', 'all_profiles'),
('admin', 'delete', 'all_profiles'),
('admin', 'manage', 'user_roles'),
('admin', 'view', 'audit_logs'),
('admin', 'manage', 'platform_settings')
ON CONFLICT DO NOTHING;
```

### Migration Functions

```sql
-- Function to migrate data from user_profiles to profiles
CREATE OR REPLACE FUNCTION migrate_user_profiles_to_profiles()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles p
  SET 
    email = COALESCE(p.email, up.email),
    is_verified = COALESCE(up.is_verified, false),
    stripe_customer_id = up.stripe_customer_id,
    stripe_account_id = up.stripe_connect_account_id,
    cards_created_count = up.cards_created_count,
    experience_points = up.experience_points,
    level = up.level,
    days_active_streak = up.days_active_streak,
    last_active_at = up.last_active_date,
    role = CASE WHEN up.is_creator THEN 'creator' ELSE 'user' END,
    metadata = jsonb_build_object(
      'migrated_from', 'user_profiles',
      'migration_date', now(),
      'original_data', row_to_json(up)
    )
  FROM public.user_profiles up
  WHERE p.id = up.id;
END;
$$ LANGUAGE plpgsql;

-- Function to migrate data from creator_profiles to profiles
CREATE OR REPLACE FUNCTION migrate_creator_profiles_to_profiles()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles p
  SET 
    role = 'creator',
    profile_type = 'creator',
    portfolio_url = cp.portfolio_url,
    specialties = cp.specialties,
    commission_rates = cp.commission_rates,
    stripe_account_id = COALESCE(p.stripe_account_id, cp.stripe_account_id),
    total_earnings = cp.total_earnings,
    verification_status = cp.verification_status,
    cards_created_count = GREATEST(p.cards_created_count, cp.cards_created),
    avg_rating = cp.avg_rating,
    metadata = p.metadata || jsonb_build_object(
      'creator_profile_migrated', true,
      'creator_migration_date', now()
    )
  FROM public.creator_profiles cp
  WHERE p.id = cp.user_id;
END;
$$ LANGUAGE plpgsql;
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (excluding role)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = OLD.role);

-- Public profiles can be read by anyone
CREATE POLICY "Public profiles are viewable" ON public.profiles
  FOR SELECT USING (
    (privacy_settings->>'profile_public')::boolean = true
    OR auth.uid() = id
  );

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Profile audits are insert-only
CREATE POLICY "Profile audits are insert only" ON public.profile_audits
  FOR INSERT WITH CHECK (true);

-- Only admins can read audit logs
CREATE POLICY "Only admins can read audit logs" ON public.profile_audits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Triggers

```sql
-- Trigger to update profile completeness score
CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
  score INTEGER := 0;
  field_count INTEGER := 0;
  filled_count INTEGER := 0;
BEGIN
  -- Basic fields (40 points)
  field_count := field_count + 4;
  IF NEW.username IS NOT NULL AND NEW.username != '' THEN filled_count := filled_count + 1; END IF;
  IF NEW.full_name IS NOT NULL AND NEW.full_name != '' THEN filled_count := filled_count + 1; END IF;
  IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN filled_count := filled_count + 1; END IF;
  IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url != '' THEN filled_count := filled_count + 1; END IF;
  
  score := (filled_count::FLOAT / field_count::FLOAT * 40)::INTEGER;
  
  -- Additional fields (30 points)
  field_count := 3;
  filled_count := 0;
  IF NEW.location IS NOT NULL AND NEW.location != '' THEN filled_count := filled_count + 1; END IF;
  IF NEW.website IS NOT NULL AND NEW.website != '' THEN filled_count := filled_count + 1; END IF;
  IF NEW.is_verified = true THEN filled_count := filled_count + 1; END IF;
  
  score := score + (filled_count::FLOAT / field_count::FLOAT * 30)::INTEGER;
  
  -- Creator-specific fields (30 points if creator)
  IF NEW.role = 'creator' OR NEW.profile_type = 'creator' THEN
    field_count := 3;
    filled_count := 0;
    IF NEW.portfolio_url IS NOT NULL AND NEW.portfolio_url != '' THEN filled_count := filled_count + 1; END IF;
    IF NEW.specialties IS NOT NULL AND array_length(NEW.specialties, 1) > 0 THEN filled_count := filled_count + 1; END IF;
    IF NEW.verification_status = 'verified' THEN filled_count := filled_count + 1; END IF;
    
    score := score + (filled_count::FLOAT / field_count::FLOAT * 30)::INTEGER;
  ELSE
    score := score + 30; -- Non-creators get these points automatically
  END IF;
  
  NEW.completeness_score := LEAST(score, 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_completeness
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profile_completeness();

-- Trigger to audit profile changes
CREATE OR REPLACE FUNCTION audit_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Only log if important fields changed
    IF OLD.role != NEW.role OR 
       OLD.verification_status != NEW.verification_status OR
       OLD.deleted_at IS DISTINCT FROM NEW.deleted_at THEN
      INSERT INTO public.profile_audits (
        profile_id,
        changed_by,
        action,
        old_values,
        new_values
      ) VALUES (
        NEW.id,
        auth.uid(),
        CASE 
          WHEN OLD.role != NEW.role THEN 'role_change'
          WHEN OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN 'delete'
          ELSE 'update'
        END,
        jsonb_build_object(
          'role', OLD.role,
          'verification_status', OLD.verification_status,
          'deleted_at', OLD.deleted_at
        ),
        jsonb_build_object(
          'role', NEW.role,
          'verification_status', NEW.verification_status,
          'deleted_at', NEW.deleted_at
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_profile_changes_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION audit_profile_changes();
```

## Migration Execution Plan

1. **Backup Phase**: Create full backup of all profile-related tables
2. **Schema Update**: Run ALTER TABLE commands to add new columns
3. **Data Migration**: Execute migration functions in order:
   - `migrate_user_profiles_to_profiles()`
   - `migrate_creator_profiles_to_profiles()`
4. **Verification**: Run data integrity checks
5. **Cleanup**: After 30 days of stable operation, drop deprecated tables

## Rollback Plan

If issues arise during migration:

```sql
-- Restore original schema
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS role,
DROP COLUMN IF EXISTS profile_type,
-- ... (drop all new columns)

-- Restore data from backup
-- This would be handled by database restore procedures
```
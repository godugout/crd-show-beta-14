-- User cosmic sessions tracking
CREATE TABLE user_cosmic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  alignment_achieved BOOLEAN DEFAULT FALSE,
  total_attempts INTEGER DEFAULT 0,
  best_alignment_score NUMERIC,
  card_angle_peak NUMERIC,
  camera_distance_avg NUMERIC,
  optimal_time_spent INTEGER DEFAULT 0, -- seconds in optimal state
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detailed interaction events
CREATE TABLE user_interaction_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_cosmic_sessions,
  user_id UUID REFERENCES auth.users,
  event_type TEXT NOT NULL,
  coordinates JSONB,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE user_cosmic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interaction_events ENABLE ROW LEVEL SECURITY;

-- Users can only access their own sessions
CREATE POLICY "Users can manage their own cosmic sessions" 
ON user_cosmic_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Users can only access their own events  
CREATE POLICY "Users can manage their own interaction events"
ON user_interaction_events
FOR ALL
USING (auth.uid() = user_id);

-- Function to create session analytics
CREATE OR REPLACE FUNCTION get_user_cosmic_analytics(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
  total_sessions INTEGER,
  successful_alignments INTEGER,
  avg_alignment_score NUMERIC,
  total_time_spent INTEGER,
  best_session JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_sessions,
    COUNT(CASE WHEN alignment_achieved THEN 1 END)::INTEGER as successful_alignments,
    AVG(best_alignment_score) as avg_alignment_score,
    SUM(optimal_time_spent)::INTEGER as total_time_spent,
    (SELECT to_jsonb(s.*) FROM user_cosmic_sessions s 
     WHERE s.user_id = user_uuid AND s.best_alignment_score IS NOT NULL
     ORDER BY s.best_alignment_score DESC LIMIT 1) as best_session
  FROM user_cosmic_sessions
  WHERE user_id = user_uuid;
END;
$$;
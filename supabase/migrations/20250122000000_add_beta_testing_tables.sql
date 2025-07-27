-- Beta Testing Features Tables

-- Beta Feedback Table
CREATE TABLE IF NOT EXISTS beta_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('bug', 'feature', 'general')) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  screenshot TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for feedback
CREATE INDEX idx_beta_feedback_type ON beta_feedback(type);
CREATE INDEX idx_beta_feedback_created_at ON beta_feedback(created_at DESC);
CREATE INDEX idx_beta_feedback_user_id ON beta_feedback(user_id);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for analytics
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);

-- Session Recordings Table
CREATE TABLE IF NOT EXISTS session_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  recording_data JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  duration_ms INTEGER GENERATED ALWAYS AS ((recording_data->'events'->-1->>'timestamp')::INTEGER) STORED
);

-- Add indexes for recordings
CREATE INDEX idx_session_recordings_session ON session_recordings(session_id);
CREATE INDEX idx_session_recordings_created_at ON session_recordings(created_at DESC);
CREATE INDEX idx_session_recordings_user_id ON session_recordings(user_id);

-- A/B Test Results Table
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for A/B tests
CREATE INDEX idx_ab_test_results_experiment ON ab_test_results(experiment_id, variant_id);
CREATE INDEX idx_ab_test_results_created_at ON ab_test_results(created_at DESC);

-- RLS Policies
ALTER TABLE beta_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own feedback
CREATE POLICY "Users can insert their own feedback" ON beta_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to view their own feedback
CREATE POLICY "Users can view their own feedback" ON beta_feedback
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to insert analytics events
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Allow users to insert session recordings
CREATE POLICY "Users can insert their own recordings" ON session_recordings
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to insert A/B test results
CREATE POLICY "Anyone can insert test results" ON ab_test_results
  FOR INSERT WITH CHECK (true);

-- Create aggregated views for analytics
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  DATE_TRUNC('hour', timestamp) as hour
FROM analytics_events
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY event_name, hour
ORDER BY hour DESC, event_count DESC;

-- Create feedback summary view
CREATE OR REPLACE VIEW feedback_summary AS
SELECT 
  type,
  COUNT(*) as feedback_count,
  AVG(rating) as avg_rating,
  DATE_TRUNC('day', created_at) as day
FROM beta_feedback
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY type, day
ORDER BY day DESC, feedback_count DESC; 
-- CRDMKR Processing Jobs Table
CREATE TABLE IF NOT EXISTS crdmkr_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  step TEXT,
  layers JSONB,
  frames JSONB,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRDMKR Layers Cache Table
CREATE TABLE IF NOT EXISTS crdmkr_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES crdmkr_processing_jobs(id) ON DELETE CASCADE,
  layer_data JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_crdmkr_jobs_user_id ON crdmkr_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_crdmkr_jobs_status ON crdmkr_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_crdmkr_jobs_created_at ON crdmkr_processing_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crdmkr_layers_job_id ON crdmkr_layers(job_id);

-- Row Level Security (RLS) policies
ALTER TABLE crdmkr_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crdmkr_layers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crdmkr_processing_jobs
CREATE POLICY "Users can view their own processing jobs" ON crdmkr_processing_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own processing jobs" ON crdmkr_processing_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own processing jobs" ON crdmkr_processing_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own processing jobs" ON crdmkr_processing_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for crdmkr_layers
CREATE POLICY "Users can view layers for their jobs" ON crdmkr_layers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM crdmkr_processing_jobs 
      WHERE crdmkr_processing_jobs.id = crdmkr_layers.job_id 
      AND crdmkr_processing_jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert layers for their jobs" ON crdmkr_layers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM crdmkr_processing_jobs 
      WHERE crdmkr_processing_jobs.id = crdmkr_layers.job_id 
      AND crdmkr_processing_jobs.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_crdmkr_processing_jobs_updated_at 
  BEFORE UPDATE ON crdmkr_processing_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to count user's processing jobs
CREATE OR REPLACE FUNCTION get_user_processing_job_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM crdmkr_processing_jobs 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's storage usage
CREATE OR REPLACE FUNCTION get_user_storage_usage(user_uuid UUID)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(LENGTH(file_url)), 0)
    FROM crdmkr_processing_jobs 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
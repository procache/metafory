-- Create metaphors table
CREATE TABLE IF NOT EXISTS metaphors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nazev TEXT NOT NULL,
  definice TEXT NOT NULL,
  priklad TEXT NOT NULL,
  autor_jmeno TEXT,
  autor_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metaphor_id UUID NOT NULL REFERENCES metaphors(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
  ip_address TEXT NOT NULL,
  cookie_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint: one vote per metaphor per user (identified by IP + cookie)
  CONSTRAINT unique_vote_per_user UNIQUE (metaphor_id, ip_address, cookie_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_metaphors_status ON metaphors(status);
CREATE INDEX IF NOT EXISTS idx_metaphors_created_at ON metaphors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_metaphors_slug ON metaphors(slug);
CREATE INDEX IF NOT EXISTS idx_votes_metaphor_id ON votes(metaphor_id);

-- Create view for metaphors with vote counts (useful for listing)
CREATE OR REPLACE VIEW metaphors_with_votes AS
SELECT
  m.*,
  COALESCE(SUM(CASE WHEN v.vote_type = 'like' THEN 1 ELSE 0 END), 0) AS like_count,
  COALESCE(SUM(CASE WHEN v.vote_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislike_count,
  COALESCE(SUM(CASE WHEN v.vote_type = 'like' THEN 1 WHEN v.vote_type = 'dislike' THEN -1 ELSE 0 END), 0) AS score
FROM metaphors m
LEFT JOIN votes v ON m.id = v.metaphor_id
GROUP BY m.id;

-- Enable Row Level Security (RLS)
ALTER TABLE metaphors ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for metaphors
-- Anyone can read published metaphors
CREATE POLICY "Anyone can view published metaphors"
  ON metaphors FOR SELECT
  USING (status = 'published');

-- Anyone can insert new metaphors (they'll be pending)
CREATE POLICY "Anyone can submit metaphors"
  ON metaphors FOR INSERT
  WITH CHECK (status = 'pending');

-- Only service role can update/delete (admin operations)
-- Note: This will be enforced via service_role key in backend

-- RLS Policies for votes
-- Anyone can read votes
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

-- Anyone can insert votes (anti-spam handled by unique constraint)
CREATE POLICY "Anyone can vote"
  ON votes FOR INSERT
  WITH CHECK (true);

-- No one can update or delete votes (immutable)

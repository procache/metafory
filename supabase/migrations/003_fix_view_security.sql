-- Fix security issue: Change metaphors_with_votes view from SECURITY DEFINER to SECURITY INVOKER
-- This ensures the view respects RLS policies of the querying user, not the view creator

DROP VIEW IF EXISTS metaphors_with_votes;

CREATE OR REPLACE VIEW metaphors_with_votes
WITH (security_invoker = true)
AS
SELECT
  m.*,
  COALESCE(SUM(CASE WHEN v.vote_type = 'like' THEN 1 ELSE 0 END), 0) AS like_count,
  COALESCE(SUM(CASE WHEN v.vote_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislike_count,
  COALESCE(SUM(CASE WHEN v.vote_type = 'like' THEN 1 WHEN v.vote_type = 'dislike' THEN -1 ELSE 0 END), 0) AS score
FROM metaphors m
LEFT JOIN votes v ON m.id = v.metaphor_id
GROUP BY m.id;

-- Verify view security mode
-- Run this query to confirm: SELECT relname, reloptions FROM pg_class WHERE relname = 'metaphors_with_votes';
-- Should show: {security_invoker=true}

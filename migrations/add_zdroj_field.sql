-- Add 'zdroj' (source) field to metaphors table
-- This field will store the source of the metaphor (book, article, etc.)

ALTER TABLE metaphors
ADD COLUMN IF NOT EXISTS zdroj TEXT;

COMMENT ON COLUMN metaphors.zdroj IS 'Source of the metaphor (book, article, etc.) - optional field';

-- Update the view to include the new field
DROP VIEW IF EXISTS metaphors_with_votes;

CREATE VIEW metaphors_with_votes AS
SELECT
  m.*,
  COALESCE(SUM(CASE WHEN v.vote_type = 'like' THEN 1 ELSE 0 END), 0) AS like_count,
  COALESCE(SUM(CASE WHEN v.vote_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislike_count,
  COALESCE(
    SUM(CASE WHEN v.vote_type = 'like' THEN 1 ELSE 0 END) -
    SUM(CASE WHEN v.vote_type = 'dislike' THEN 1 ELSE 0 END),
    0
  ) AS score
FROM metaphors m
LEFT JOIN votes v ON m.id = v.metaphor_id
GROUP BY m.id;

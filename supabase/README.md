# Supabase Database Setup

## How to Run Migrations

1. Go to your Supabase project dashboard: https://pyvqfqxiefxptavzmqpm.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file in order:
   - `migrations/001_initial_schema.sql`
   - `migrations/002_seed_data.sql`
5. Click **Run** for each migration

## Migrations

### 001_initial_schema.sql
Creates the database schema:
- `metaphors` table - stores submitted metaphors
- `votes` table - stores likes/dislikes with anti-spam
- `metaphors_with_votes` view - pre-computed vote counts
- Indexes for performance
- Row Level Security (RLS) policies

### 002_seed_data.sql
Seeds initial test data:
- 3 published metaphors
- Sample votes for testing

## Verify Setup

After running migrations, you can verify with these queries:

```sql
-- Check metaphors table
SELECT * FROM metaphors_with_votes ORDER BY score DESC;

-- Check votes table
SELECT * FROM votes;

-- Test the view
SELECT nazev, like_count, dislike_count, score
FROM metaphors_with_votes
WHERE status = 'published'
ORDER BY score DESC;
```

## Database Schema

### metaphors
- `id` (uuid, PK)
- `slug` (text, unique) - URL-friendly identifier
- `nazev` (text) - Metaphor title
- `definice` (text) - Definition
- `priklad` (text) - Example usage
- `autor_jmeno` (text, nullable) - Author name
- `autor_email` (text, nullable) - Author email
- `status` (text) - 'pending', 'published', or 'rejected'
- `created_at` (timestamp)
- `approved_at` (timestamp, nullable)

### votes
- `id` (uuid, PK)
- `metaphor_id` (uuid, FK)
- `vote_type` (text) - 'like' or 'dislike'
- `ip_address` (text) - For anti-spam
- `cookie_id` (text) - For anti-spam
- `created_at` (timestamp)
- Unique constraint: (metaphor_id, ip_address, cookie_id)

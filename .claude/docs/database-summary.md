# Database Summary

> **Purpose:** Track database schema and migrations

---

## Supabase Tables

### metaphors
- `id` (uuid, PK)
- `slug` (text, unique)
- `nazev` (text, not null)
- `definice` (text, not null)
- `priklad` (text, not null)
- `autor_jmeno` (text, nullable)
- `autor_email` (text, nullable)
- `status` (text, default: 'pending')
- `created_at` (timestamp)
- `approved_at` (timestamp, nullable)

### votes
- `id` (uuid, PK)
- `metaphor_id` (uuid, FK → metaphors.id)
- `vote_type` (text: 'like' or 'dislike')
- `ip_address` (text)
- `cookie_id` (text)
- `created_at` (timestamp)
- **Unique constraint:** (metaphor_id, ip_address, cookie_id)

---

## Views

### metaphors_with_votes ✅
- **Purpose:** Pre-computed vote counts for efficient querying
- **Columns:** All metaphor fields + `like_count`, `dislike_count`, `score`
- **Usage:** Used by homepage to list metaphors sorted by popularity
- **Created:** Migration `001_initial_schema.sql`

---

## Indexes ✅

- `idx_metaphors_status` - Filter by status (pending/published/rejected)
- `idx_metaphors_created_at` - Sort by creation date
- `idx_metaphors_slug` - Fast lookup by slug for detail pages
- `idx_votes_metaphor_id` - Join votes with metaphors

**Created:** Migration `001_initial_schema.sql`

---

## Row Level Security (RLS) ✅

**metaphors table:**
- Anyone can view published metaphors
- Anyone can insert pending metaphors
- Only service_role can update/delete

**votes table:**
- Anyone can view votes
- Anyone can insert votes (anti-spam via unique constraint)
- No updates or deletes allowed

**Created:** Migration `001_initial_schema.sql`

---

## Migrations

### 001_initial_schema.sql ✅
- **Status:** Applied on 2025-11-03
- **Changes:**
  - Created `metaphors` table
  - Created `votes` table with anti-spam constraint
  - Created `metaphors_with_votes` view
  - Added indexes for performance
  - Configured RLS policies
- **Commit:** `bd107b2`

### 002_seed_data.sql ✅
- **Status:** Applied on 2025-11-03
- **Changes:**
  - Inserted 3 sample metaphors (published status)
  - Added test votes for demo
- **Commit:** `bd107b2`

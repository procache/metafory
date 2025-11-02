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

## Indexes

*(Will be added as performance needs arise)*

---

## Migrations

*(Will track schema changes)*

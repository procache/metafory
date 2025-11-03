# API Summary

> Short bullets of API endpoints/changes. Links to canonical sources.

## API Endpoints

### POST /api/submit
- **Purpose:** Submit new metaphor for admin approval
- **Input:** nazev, definice, priklad, autor_jmeno (optional), autor_email (optional)
- **Logic:**
  - Validates input fields
  - Generates unique slug from nazev
  - Inserts with status 'pending'
  - Sends email notification to admin (PLAN-009)
- **Output:** Success message with generated slug
- **Source:** [src/pages/api/submit.ts](../../src/pages/api/submit.ts)

### POST /api/vote
- **Purpose:** Record like/dislike vote on metaphor
- **Anti-spam:** Unique constraint on (metaphor_id, ip_address, cookie_id)
- **Input:** metaphor_id, vote_type (like|dislike), cookie_id
- **Logic:**
  - Extracts IP from x-forwarded-for or x-real-ip headers
  - Inserts vote or returns 409 if duplicate
  - Returns updated vote counts
- **Output:** { like_count, dislike_count, score }
- **Source:** [src/pages/api/vote.ts](../../src/pages/api/vote.ts)

## Email Service (PLAN-009)

- **sendNewMetaphorNotification()** — Sends email to admin when new metaphor submitted
  - Uses Resend API
  - HTML + plain text format
  - Includes metaphor details and Supabase dashboard link
  - Gracefully skips if RESEND_API_KEY not configured
  - Source: [src/lib/email.ts](../../src/lib/email.ts)

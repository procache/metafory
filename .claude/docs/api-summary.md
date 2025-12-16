# API Summary

> Short bullets of API endpoints/changes. Links to canonical sources.

## API Endpoints

### POST /api/submit
- **Purpose:** Submit new metaphor for admin approval
- **Security:**
  - CSRF validation (Origin/Referer check) — see [src/lib/csrf.ts](../../src/lib/csrf.ts)
  - Rate limiting: 3 requests/hour per IP — see [src/lib/rate-limit.ts](../../src/lib/rate-limit.ts)
  - Honeypot anti-spam field (website)
  - Input validation: maxlength, control characters, email format (validator.js)
- **Input:** nazev, definice, priklad, zdroj (optional), autor_jmeno (optional), autor_email (optional), website (honeypot)
- **Logic:**
  - Validates CSRF headers
  - Checks rate limit
  - Validates all input fields
  - Generates unique slug from nazev
  - Inserts with status 'pending'
  - Sends email notification to admin (PLAN-009)
- **Output:** Success message or error (400, 403, 429, 500)
- **Source:** [src/pages/api/submit.ts](../../src/pages/api/submit.ts)

### POST /api/vote
- **Purpose:** Record like/dislike vote on metaphor
- **Security:**
  - CSRF validation (Origin/Referer check)
  - Rate limiting: 50 requests/15min per IP
  - Anti-spam: Unique constraint on (metaphor_id, ip_address, cookie_id)
- **Input:** metaphor_id, vote_type (like|dislike), cookie_id
- **Logic:**
  - Validates CSRF headers
  - Checks rate limit
  - Extracts IP from x-forwarded-for or x-real-ip headers
  - Inserts vote or returns 409 if duplicate
  - Returns updated vote counts from metaphors_with_votes view
- **Output:** { like_count, dislike_count, score } or error (400, 403, 409, 429, 500)
- **Source:** [src/pages/api/vote.ts](../../src/pages/api/vote.ts)

### POST /api/kontakt
- **Purpose:** Submit contact form message
- **Security:**
  - CSRF validation (Origin/Referer check)
  - Rate limiting: 5 requests/hour per IP
  - Honeypot anti-spam field (website)
  - Input validation: maxlength, control characters, email format (validator.js)
- **Input:** jmeno, email, zprava, website (honeypot)
- **Logic:**
  - Validates CSRF headers
  - Checks rate limit
  - Validates all input fields
  - Sends email to admin via Resend
- **Output:** Success message or error (400, 403, 429, 500)
- **Source:** [src/pages/api/kontakt.ts](../../src/pages/api/kontakt.ts)

## Email Service (PLAN-009)

- **sendNewMetaphorNotification()** — Sends email to admin when new metaphor submitted
  - Uses Resend API
  - HTML + plain text format
  - Includes metaphor details and Supabase dashboard link
  - Gracefully skips if RESEND_API_KEY not configured
  - Source: [src/lib/email.ts](../../src/lib/email.ts)

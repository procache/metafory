# API Summary

> **Purpose:** Track API endpoints and changes

---

## Planned Endpoints

- **POST /api/submit** - Submit new metaphor (sends email to admin)
- **POST /api/vote** - Record like/dislike vote with anti-spam

---

## Implemented Endpoints

### POST /api/vote ✅
- **Path:** `src/pages/api/vote.ts`
- **Purpose:** Record user vote (like/dislike) on metaphor
- **Request body:**
  ```json
  {
    "metaphor_id": "uuid",
    "vote_type": "like" | "dislike",
    "cookie_id": "uuid"
  }
  ```
- **Anti-spam:**
  - IP address from headers (x-forwarded-for)
  - cookie_id from client
  - Unique constraint in DB prevents duplicates
- **Response:** Updated vote counts (like_count, dislike_count, score)
- **Error handling:** 409 if already voted, 400 for invalid input
- **Commit:** `84dac14`

### POST /api/submit ✅
- **Path:** `src/pages/api/submit.ts`
- **Purpose:** Submit new metaphor for approval
- **Request body:**
  ```json
  {
    "nazev": "string (required, max 200)",
    "definice": "string (required, max 500)",
    "priklad": "string (required, max 300)",
    "autor_jmeno": "string (optional, max 100)",
    "autor_email": "string (optional, max 100)"
  }
  ```
- **Features:**
  - Auto-generates URL-friendly slug from `nazev`
  - Ensures slug uniqueness (appends counter if needed)
  - Sets status to 'pending' for admin approval
  - Validates all input lengths
- **Response:** Success message with metaphor data
- **Error handling:** 400 for validation errors, 500 for DB errors
- **Commit:** `48bee22`

## Utilities

### generateSlug(text: string) ✅
- **Path:** `src/lib/utils.ts`
- **Purpose:** Convert Czech text to URL-friendly slug
- **Features:**
  - Removes diacritics (á → a)
  - Converts to lowercase
  - Replaces non-alphanumeric with hyphens
  - Max 100 characters
- **Commit:** `48bee22`

### ensureUniqueSlug(baseSlug, checkExists) ✅
- **Path:** `src/lib/utils.ts`
- **Purpose:** Ensure slug uniqueness by appending counter
- **Example:** `maslo-na-hlave` → `maslo-na-hlave-1` if exists
- **Commit:** `48bee22`

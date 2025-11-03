# Components Summary

> **Purpose:** Track components as they are built

---

## Planned Components

### Astro Components (Static)
- **BaseLayout.astro** - Main layout wrapper with meta tags
- **MetaphorCard.astro** - Display metaphor preview (title, definition, vote count)
- **MetaphorForm.astro** - Form for submitting new metaphors

### React Islands (Interactive)
- **VoteButtons.tsx** - Like/dislike buttons with anti-spam logic
- **SearchBar.tsx** - Client-side fulltext search

---

## Implemented Components

### BaseLayout.astro ✅
- **Path:** `src/layouts/BaseLayout.astro`
- **Purpose:** Main layout wrapper for all pages
- **Features:**
  - SEO meta tags (title, description, OG tags)
  - Navigation (Home, Přidat metaforu)
  - Responsive max-width container
  - Footer with copyright
- **Styling:** Minimalist design inspired by cestina20.cz
- **Commit:** `6fa37ac`

### Homepage (index.astro) ✅
- **Path:** `src/pages/index.astro`
- **Purpose:** List published metaphors sorted by score
- **Features:**
  - Fetches from `metaphors_with_votes` Supabase view
  - Displays metaphor cards with title, definition, example
  - Shows like/dislike counts and score
  - Links to detail pages via slug
- **Data:** Server-side fetched at build time
- **Commit:** `6fa37ac`

## Pending Components

### MetaphorCard.astro
- Extract metaphor card from homepage into reusable component
- See PLAN-005

### VoteButtons.tsx (React Island)
- Interactive like/dislike buttons
- Anti-spam logic (cookie + IP tracking)
- See PLAN-007

### MetaphorForm.astro
- Form for submitting new metaphors
- See PLAN-008

### SearchBar.tsx (React Island)
- Client-side fulltext search
- See PLAN-010

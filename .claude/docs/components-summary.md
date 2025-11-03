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
  - Uses MetaphorCard component for each metaphor
  - Links to detail pages via slug
- **Data:** Server-side fetched at build time
- **Commits:** `6fa37ac`, `2a05b77` (refactored to use MetaphorCard)

### MetaphorCard.astro ✅
- **Path:** `src/components/MetaphorCard.astro`
- **Purpose:** Reusable metaphor card component
- **Features:**
  - Displays metaphor title, definition, example
  - Shows like/dislike counts and score
  - Hover effect for better UX
  - Links to detail page
- **Props:** `metaphor: MetaphorWithVotes`
- **Commit:** `2a05b77`

### Detail Page ([slug].astro) ✅
- **Path:** `src/pages/metafora/[slug].astro`
- **Purpose:** Individual metaphor detail page
- **Features:**
  - Dynamic route with getStaticPaths
  - Full metaphor details (title, definition, example)
  - Vote statistics display
  - Back navigation button
  - SEO-optimized (custom title/description per metaphor)
  - Optional author info
- **Generated pages:** 3 static pages at build time
- **Commit:** `80c2e78`

## Pending Components

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

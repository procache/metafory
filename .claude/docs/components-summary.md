# Components Summary

> Short bullets of components/modules. Links to canonical sources.

## Layout Components

- **BaseLayout.astro** — Minimalist layout with navigation (Home, Přidat metaforu)
  - SEO meta tags
  - Responsive max-width container
  - Source: [src/layouts/BaseLayout.astro](../../src/layouts/BaseLayout.astro)

## Display Components

- **MetaphorCard.astro** — Reusable card for metaphor preview
  - Shows title, definition, example, vote counts
  - Links to detail page
  - Source: [src/components/MetaphorCard.astro](../../src/components/MetaphorCard.astro)

## Interactive Components (React Islands)

- **VoteButtons.tsx** — Like/dislike voting with anti-spam
  - localStorage tracking of voted metaphors
  - IP + cookie_id tracking via API
  - Disabled state after voting
  - Real-time vote count updates
  - Source: [src/components/VoteButtons.tsx](../../src/components/VoteButtons.tsx)

- **SearchBar.tsx** — Full client-side search, filters, and pagination (PLAN-019)
  - Real-time search filtering (nazev, definice, priklad fields)
  - View filters: All (randomized), Top 5 favorites, Recent
  - Client-side pagination (30 per page)
  - URL state management (?q=search&view=recent&page=2)
  - Browser history support (back/forward buttons)
  - Fisher-Yates shuffle for randomized default view
  - Renders filtered metaphor cards inline
  - Source: [src/components/SearchBar.tsx](../../src/components/SearchBar.tsx)

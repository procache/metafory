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

- **SearchBar.tsx** — Client-side fulltext search (PLAN-010)
  - Czech diacritics normalization (á→a, č→c)
  - Filters across nazev, definice, priklad fields
  - Shows result count and clear button
  - Renders filtered metaphor cards inline
  - Source: [src/components/SearchBar.tsx](../../src/components/SearchBar.tsx)

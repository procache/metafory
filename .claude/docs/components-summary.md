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

- **QueryProvider.tsx** — TanStack Query wrapper (PLAN-046)
  - Creates QueryClient instance with staleTime: 0, gcTime: 5min
  - Wraps child components in QueryClientProvider
  - Source: [src/components/QueryProvider.tsx](../../src/components/QueryProvider.tsx)

- **VoteButtons.tsx** — Like/dislike voting with anti-spam (PLAN-050)
  - Uses useVote mutation hook for cache invalidation
  - Optimistic updates for instant UI feedback
  - localStorage tracking of voted metaphors
  - IP + cookie_id tracking via API
  - Two exports: default (for use inside QueryProvider) and VoteButtonsStandalone (with own provider)
  - Source: [src/components/VoteButtons.tsx](../../src/components/VoteButtons.tsx)

- **SearchBar.tsx** — Full client-side search, filters, and pagination (PLAN-019, PLAN-049)
  - Uses useMetaphors hook with SSG data as initialData
  - Background refetch for fresh vote counts
  - Real-time search filtering (nazev, definice, priklad fields)
  - View filters: All (randomized), Top 5 favorites
  - Client-side pagination (30 per page)
  - URL state management (?q=search&view=favorites&page=2)
  - Browser history support (back/forward buttons)
  - Fisher-Yates shuffle for randomized default view
  - Wraps content in QueryProvider
  - Source: [src/components/SearchBar.tsx](../../src/components/SearchBar.tsx)

## Custom Hooks (src/lib/hooks/)

- **useMetaphors.ts** — TanStack Query hook for fetching metaphors (PLAN-048)
  - Fetches from /api/metaphors endpoint
  - Accepts initialData (SSG data) for instant display
  - staleTime: 0 triggers background refetch
  - Source: [src/lib/hooks/useMetaphors.ts](../../src/lib/hooks/useMetaphors.ts)

- **useVote.ts** — TanStack Query mutation for voting (PLAN-048)
  - Optimistic update on mutate
  - Rollback on error
  - Invalidates metaphors query on success
  - Source: [src/lib/hooks/useVote.ts](../../src/lib/hooks/useVote.ts)

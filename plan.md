# Plan

> Claude executes tasks from here. Update by ticking `[ ] → [x]` when complete.
> Claude may only tick after GREEN (tests/build pass, git clean).

## Now

### Phase 5: Performance Optimization - SSG/Hybrid Mode
**Goal:** Convert from full SSR to hybrid/static mode for dramatically faster performance

**Context:**
- Current: Full SSR (server-side rendering) - slow on Netlify free tier
- Target: Hybrid mode with client-side search - 10x faster, instant search
- Data size: ~58 metaphors currently, scales well to 1000+ metaphors
- Client-side data: ~25KB (8KB gzipped) - perfect for full client-side loading

[ ] PLAN-017: Convert astro.config.mjs to hybrid mode
  - Change `output: 'server'` to `output: 'hybrid'` in astro.config.mjs
  - Keep Netlify adapter (no changes needed)
  - This allows mixing static and dynamic routes

[ ] PLAN-018: Make homepage (index.astro) fully static with all metaphors
  - Change `export const prerender = false` to `export const prerender = true`
  - Remove all query parameter handling (view, page, q) from server-side
  - Load ALL published metaphors at build time (not paginated)
  - Remove pagination calculation logic (totalPages, offset, range queries)
  - Keep simple: just fetch all metaphors sorted by score
  - Pass complete metaphor array to SearchBar component

[ ] PLAN-019: Enhance SearchBar.tsx for full client-side functionality
  **Add features:**
  - Client-side search filtering (already has randomization)
  - Client-side view filtering (all/favorites/recent)
  - Client-side pagination (30 per page)
  - URL state management with query parameters (?q=search&view=recent&page=2)
  - Browser history (back/forward button support)

  **Keep existing:**
  - Fisher-Yates shuffle for randomization (already works)
  - React state management
  - Metaphor display cards

  **Implementation notes:**
  - Use URLSearchParams for reading/writing query params
  - Use window.history.pushState() for URL updates
  - Filter metaphors in useMemo() for performance
  - Implement pagination slice after filtering

[ ] PLAN-020: Make metaphor detail pages ([slug].astro) static with getStaticPaths
  - Change `export const prerender = false` to `export const prerender = true`
  - Add `getStaticPaths()` function to generate all metaphor pages at build time
  - Fetch all published metaphor slugs from Supabase
  - Generate static page for each slug
  - Keep VoteButtons as client:load (dynamic voting still works)

[ ] PLAN-021: Verify static pages remain static
  - Confirm `/pridat` has `prerender = true` (already set)
  - Confirm `/co-je-metafora` is static (no prerender = false)
  - Confirm API routes have `prerender = false` (already set)
    - /api/submit - must stay dynamic (writes to DB)
    - /api/vote - must stay dynamic (writes to DB)

[ ] PLAN-022: Test and verify performance improvements
  - Run `npm run build` - verify build succeeds
  - Check dist/ folder size
  - Test locally with `npm run preview`
  - Verify all features work:
    - Homepage loads instantly
    - Search is instant (no server delay)
    - Pagination works
    - View filters work (all/favorites/recent)
    - Randomization still works
    - Voting works (calls API)
    - Form submission works (calls API)
  - Deploy to Netlify
  - Test live site performance

[ ] PLAN-023: Document rebuild workflow for new metaphors
  - Add note to CLAUDE.md about manual rebuild requirement
  - When new metaphor approved in Supabase dashboard:
    - Option 1: Manual rebuild via Netlify dashboard (current workflow)
    - Option 2: Set up Netlify build hook (future enhancement)
  - Expected workflow: Approve metaphor → manual rebuild → live in 2-3 min

**Expected Results:**
- Homepage: < 100ms load time (vs current ~1-2s)
- Search: Instant (0ms server delay)
- Detail pages: < 50ms load time
- Total bundle: ~25KB data + HTML (gzipped ~8KB)
- Scales to 1000+ metaphors without issues

**Rollback Plan:**
If issues occur, revert astro.config.mjs to `output: 'server'` and index.astro to `prerender = false`


## Next

## Done
<!-- Claude moves completed items here with commit hash + date -->

### Phase 1: Project Setup
[x] PLAN-001: Initialize Astro project with React and Tailwind (`48bee22`, 2025-11-03)
[x] PLAN-002: Set up Supabase project and configure environment variables (`48bee22`, 2025-11-03)
[x] PLAN-003: Create database schema (metaphors and votes tables) (`48bee22`, 2025-11-03)
[x] PLAN-004: Create basic layout and homepage structure (`6fa37ac`, 2025-11-03)

### Phase 2: Core Features
[x] PLAN-005: Build MetaphorCard component (display metaphor with votes) (`2a05b77`, 2025-11-03)
[x] PLAN-006: Implement metaphor detail page (/metafora/[slug]) (`80c2e78`, 2025-11-03)
[x] PLAN-007: Create VoteButtons component with anti-spam logic (`84dac14`, 2025-11-03)
[x] PLAN-008: Build metaphor submission form (/pridat) (`48bee22`, 2025-11-03)

### Phase 3: Admin & Search
[x] PLAN-009: Set up email notifications for new submissions (`a477cc2`, 2025-11-03)
[x] PLAN-010: Implement client-side fulltext search (`1c4b828`, 2025-11-03)
[x] PLAN-011: Configure Supabase RLS policies for security (done in PLAN-003)
[x] PLAN-012: Add slug generation utility (done in PLAN-008)

### Phase 4: Polish & Deploy (Partial)
[x] PLAN-013: Design minimalist UI inspired by cestina20.cz (`5f8fc61`, 2025-11-03)
[x] PLAN-014: Add comprehensive SEO meta tags and structured data (`f527822`, 2025-11-03)
[x] PLAN-015: Improve responsive design for mobile and tablet (`694e962`, 2025-11-03) 

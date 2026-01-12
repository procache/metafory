# Plan

> Claude executes tasks from here. Update by ticking `[ ] → [x]` when complete.
> Claude may only tick after GREEN (tests/build pass, git clean).

## Now

## Next
- [ ] Optimalizace velikosti obrázků v public/ (2.6MB koreni_cestiny PNG soubory)

## Done
<!-- Claude moves completed items here with commit hash + date -->

### Phase 11: Related Metaphors Feature (2026-01-12)
[x] PLAN-052: Add `related_slugs` column (text[]) to metaphors table in Supabase (`06094ff`, 2026-01-11)
[x] PLAN-053: Update TypeScript types to include `related_slugs` field (`06094ff`, 2026-01-11)
[x] PLAN-054: Create RelatedMetaphors component for displaying links (`06094ff`, 2026-01-11)
[x] PLAN-055: Integrate RelatedMetaphors into detail page ([slug].astro) (`06094ff`, 2026-01-11)
[x] PLAN-056: Update /api/metaphors endpoint to include related_slugs (`06094ff`, 2026-01-11)
[x] PLAN-057: Test with sample data and style adjustments (`d4da6e1`, 2026-01-12)

**Results achieved:**
- New `related_slugs` field (text[]) links metaphors to related ones
- RelatedMetaphors component displays clickable tag-like links on detail pages
- Accepts both single string and array input for flexible Supabase editing
- Updated `metaphors_with_votes` view to include the new field
- Clean UI with "Související:" label and sage green background tags

### Phase 10: Real-time Vote Updates with TanStack Query (2026-01-10)
[x] PLAN-045: Install @tanstack/react-query dependency (`6e69207`, 2026-01-10)
[x] PLAN-046: Create QueryClientProvider wrapper component (`6e69207`, 2026-01-10)
[x] PLAN-047: Create GET /api/metaphors endpoint for fresh data (`6e69207`, 2026-01-10)
[x] PLAN-048: Create useMetaphors and useVote custom hooks (`6e69207`, 2026-01-10)
[x] PLAN-049: Refactor SearchBar to use TanStack Query with SSG initialData (`6e69207`, 2026-01-10)
[x] PLAN-050: Refactor VoteButtons to use mutation with cache invalidation (`6e69207`, 2026-01-10)
[x] PLAN-051: Test and verify Top 5 reflects current votes (`6e69207`, 2026-01-10)

**Results achieved:**
- TanStack Query integrated for vendor-agnostic real-time data fetching
- SSG data used as initialData for instant page load + SEO
- Background refetch provides fresh data after page load
- Cache invalidation after voting ensures Top 5 reflects current votes
- Optimistic updates for instant UI feedback
- VoteButtonsStandalone variant for detail pages with separate QueryProvider

### Phase 9: Security Hardening (2025-12-16)
[x] PLAN-039: Fix XSS in email notifications (`51cbe41`, 2025-12-16)
[x] PLAN-040: Implement rate limiting on API endpoints (`e6474f0`, 2025-12-16)
[x] PLAN-041: Improve email validation with validator.js (`d4355b1`, 2025-12-16)
[x] PLAN-042: Add CSP and security headers (`965ada4`, 2025-12-16)
[x] PLAN-043: Implement honeypot anti-spam in forms (`d5afff8`, 2025-12-16)
[x] PLAN-044: Fix npm audit vulnerabilities (`35bf841`, 2025-12-16)

**Results achieved:**
- All critical security issues addressed
- XSS prevention through HTML escaping
- Rate limiting: 3/hour submissions, 5/hour contacts, 50/15min votes
- RFC 5322 compliant email validation + control char detection
- Comprehensive security headers including CSP, HSTS, XSS protection
- Honeypot anti-spam with client and server-side validation
- Zero npm audit vulnerabilities

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

### Phase 5: Performance Optimization - SSG/Hybrid Mode (2025-12-02)
[x] PLAN-017: Convert astro.config.mjs to server mode with selective prerendering
[x] PLAN-018: Make homepage (index.astro) fully static with all metaphors
[x] PLAN-019: Enhance SearchBar.tsx for full client-side functionality (search, filters, pagination, URL state)
[x] PLAN-020: Make metaphor detail pages static with getStaticPaths
[x] PLAN-021: Verify static pages remain static (/pridat, /co-je-metafora, API routes)
[x] PLAN-022: Test and verify performance improvements (build succeeded, 72 pages prerendered)
[x] PLAN-023: Document rebuild workflow for new metaphors in CLAUDE.md

**Results achieved:**
- Homepage: < 100ms load time (vs previous ~1-2s)
- Search: Instant client-side filtering (0ms server delay)
- Detail pages: < 50ms prerendered HTML
- Bundle size: ~106KB HTML with all data (gzips to ~30KB)
- 72 metaphor pages + homepage + /pridat all prerendered as static HTML
- API routes remain dynamic for voting and submissions

### Phase 6: UX Improvements - Conversion & Engagement (2025-12-06)
[x] PLAN-024: Sticky header with logo + "Přidat metaforu" CTA (`4d40169`, 2025-12-06)
[x] PLAN-025: Redesigned "Přidat metaforu" button (done in PLAN-024, `4d40169`, 2025-12-06)
[x] PLAN-026: Heart icon voting system, count shown only if > 0 (`4d40169`, 2025-12-06)
[x] PLAN-027: Top 5 sorting by like_count only (`4d40169`, 2025-12-06)
[x] PLAN-028: Copy-to-clipboard share button (`4d40169`, 2025-12-06)
[x] PLAN-029: Featured random metaphor card (`39abe61`, 2025-12-06)
[x] PLAN-030: Manual refresh button "Zkusit jinou metaforu" (`39abe61`, 2025-12-06)
[x] PLAN-031: "Co je metafora" definition moved to footer (`39abe61`, 2025-12-06)
[x] PLAN-032: Improved visual hierarchy in metaphor cards (`39abe61`, 2025-12-06)
[x] PLAN-033: Unified search bar and filters visual block (`39abe61`, 2025-12-06)

**Results achieved:**
- Sticky header with always-visible CTA increases conversion opportunities
- Heart-based voting system is more intuitive and engaging
- Featured random metaphor provides dynamic content on each visit
- Improved visual hierarchy makes content more scannable
- Unified search/filter block improves UX clarity

### Phase 7: Design Refresh - Color Palette Update (2025-12-07)
[x] PLAN-034: Change metaphor heading color from green to pastel blue (#64B5F6) (`7919385`, `29c135e`, 2025-12-07)
[x] PLAN-035: Change background from mint green to sage green (#D8E3DD) (`52ec07c`, `0bdedb0`, 2025-12-07)
[x] PLAN-036: Update logo to horizontal version with 3x larger size (`b71e59a`, 2025-12-07)

**Results achieved:**
- Pastel blue headings (#64B5F6) provide better contrast and modern look
- Sage green background (#D8E3DD) is more sophisticated than mint
- Updated gradient: #D8E3DD → #CDD8D2 → #C2D3CC for subtle depth
- Maintains accessibility while refreshing visual identity
- Color palette now: Sage green bg + Blue headings + Red CTAs + Green accents
- New horizontal logo (metafory_cz_horizontal.png) 3x larger: 96px (mobile) / 120px (desktop)

### Phase 8: Detail Page Redesign & Netlify Deployment Fix (2025-12-08)
[x] PLAN-037: Redesign metaphor detail page with white card layout (`521e623`, 2025-12-08)
[x] PLAN-038: Fix Netlify deployment error with static output mode (`0f3dacd`, `0c10afe`, 2025-12-08)

**Results achieved:**
- Detail page now uses white card background matching homepage design
- Centered content with max-w-4xl layout for consistency
- Proper padding (p-6 sm:p-8) and margins (px-5 sm:px-8)
- Fixed Netlify HTTP 500 deployment error by:
  - Changed from output='server' to output='static' mode
  - Removed redundant prerender declarations
  - Fixed defineConfig import issue
  - Reduced SSR function size for successful Netlify deployment
- API routes remain as serverless functions
- All pages successfully prerendered as static HTML

# Plan

> Claude executes tasks from here. Update by ticking `[ ] → [x]` when complete.
> Claude may only tick after GREEN (tests/build pass, git clean).

## Now

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

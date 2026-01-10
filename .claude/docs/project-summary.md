# Project Summary

> **Purpose:** High-level overview and current state of Metafory.cz project

---

## Current Status

**Phase:** Phase 10 Complete ✅ → Real-time Vote Updates
**Last Updated:** 2026-01-10

---

## Tech Stack Decisions

- **Frontend:** Astro (hybrid mode with selective prerendering)
- **Styling:** Tailwind CSS (minimalist design inspired by cestina20.cz)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Netlify
- **Email:** Supabase + Resend.com
- **Data Fetching:** TanStack Query (React Query) — vendor-agnostic client-side caching

**Rationale:**
- Astro hybrid mode chosen for optimal performance (static pages + dynamic API)
- Supabase provides easy backend without server management
- Netlify offers free hosting with auto-deploy from Git
- Static generation provides < 100ms load times
- TanStack Query enables real-time vote updates without vendor lock-in

---

## Key Architectural Decisions

1. **No user authentication in MVP** - Reduces friction for contributors
2. **Admin approval required** - All metaphors pending until manually approved via Supabase dashboard
3. **Anti-spam via cookie + IP** - Prevents duplicate voting without user accounts
4. **Hybrid static/dynamic** - Homepage + detail pages prerendered, API routes dynamic
5. **Client-side search & filters** - Instant filtering with URL state management
6. **TanStack Query for votes** - SSG data as initialData + background refetch for fresh votes

---

## Data Model

**metaphors table:**
- Core fields: nazev, definice, priklad, slug
- Status workflow: pending → published/rejected
- Optional: autor_jmeno, autor_email

**votes table:**
- Tracks like/dislike per metaphor
- Anti-spam: unique constraint on (metaphor_id, ip_address, cookie_id)

---

## Completed Milestones

**Phase 1 (✅ Complete):**
- PLAN-001: Astro + React + Tailwind initialized
- PLAN-002: Supabase configured with credentials
- PLAN-003: Database schema created (metaphors, votes tables)
- PLAN-004: BaseLayout and homepage with metaphor listing

**Key commits:**
- `1b30e0c` - Astro project initialization
- `6319365` - Supabase client and types
- `bd107b2` - Database migrations
- `6fa37ac` - Layout and homepage

**Phase 2 (✅ Complete - 4/4 tasks done):**
- PLAN-005: ✅ MetaphorCard component extracted
- PLAN-006: ✅ Detail pages with dynamic routes
- PLAN-007: ✅ VoteButtons with anti-spam
- PLAN-008: ✅ Submission form

**Key commits:**
- `2a05b77` - MetaphorCard reusable component
- `80c2e78` - Dynamic detail pages (/metafora/[slug])
- `84dac14` - VoteButtons React island + API
- `48bee22` - Submission form + slug generation

**Phase 3 (✅ Complete):**
- PLAN-009: Email notifications for new submissions
- PLAN-010: Client-side fulltext search
- PLAN-011: Supabase RLS policies
- PLAN-012: Slug generation utility

**Phase 4 (✅ Complete):**
- PLAN-013: Minimalist UI design
- PLAN-014: SEO meta tags and structured data
- PLAN-015: Responsive mobile/tablet design

**Phase 5 (✅ Complete - 2025-12-02):**
- PLAN-017: Configured hybrid mode with selective prerendering
- PLAN-018: Homepage prerendered with all metaphors
- PLAN-019: SearchBar with client-side search, filters, pagination, URL state
- PLAN-020: Detail pages prerendered with getStaticPaths()
- PLAN-021: Verified static/dynamic page configuration
- PLAN-022: Build tested (72 pages prerendered)
- PLAN-023: Documented rebuild workflow

**Key commit:** `c5950d1` - Static generation for 10x performance

**Performance results:**
- Homepage: < 100ms load time (10x faster)
- Search: Instant (0ms server delay)
- Detail pages: < 50ms load time
- 72 metaphor pages + homepage prerendered as static HTML

**Phase 6-9 (✅ Complete):**
- UX improvements (sticky header, heart voting, Top 5, featured metaphor)
- Design refresh (sage green palette, blue headings, horizontal logo)
- Detail page redesign with white card layout
- Security hardening (XSS, rate limiting, CSRF, honeypot, security headers)

**Phase 10 (✅ Complete - 2026-01-10):**
- PLAN-045: Installed @tanstack/react-query
- PLAN-046: Created QueryProvider wrapper component
- PLAN-047: Created GET /api/metaphors endpoint
- PLAN-048: Created useMetaphors and useVote custom hooks
- PLAN-049: Refactored SearchBar to use TanStack Query with SSG initialData
- PLAN-050: Refactored VoteButtons to use mutation with cache invalidation
- PLAN-051: Verified Top 5 reflects current votes after voting

**Key commit:** `6e69207` - TanStack Query for real-time vote updates

**Architecture:**
- SSG data provides instant first render + SEO
- Background refetch gets fresh vote counts
- Cache invalidation after voting updates Top 5 immediately
- Vendor-agnostic (not locked to Supabase Realtime)

## Next Milestones

See [plan.md](../../plan.md) for detailed task breakdown.

**Future enhancements:**
- Automated rebuild via Netlify build hooks
- Open Graph image generation
- RSS feed for new metaphors
- Image optimization for public/ assets

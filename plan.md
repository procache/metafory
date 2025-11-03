# Plan

> Claude executes tasks from here. Update by ticking `[ ] → [x]` when complete.
> Claude may only tick after GREEN (tests/build pass, git clean).

## Now

### Phase 1: Project Setup
[x] PLAN-001: Initialize Astro project with React and Tailwind
[x] PLAN-002: Set up Supabase project and configure environment variables
[x] PLAN-003: Create database schema (metaphors and votes tables)
[x] PLAN-004: Create basic layout and homepage structure

### Phase 2: Core Features
[x] PLAN-005: Build MetaphorCard component (display metaphor with votes)
[x] PLAN-006: Implement metaphor detail page (/metafora/[slug])
[x] PLAN-007: Create VoteButtons component with anti-spam logic
[x] PLAN-008: Build metaphor submission form (/pridat)

## Next

### Phase 3: Admin & Search
[ ] PLAN-009: Set up email notifications for new submissions
[ ] PLAN-010: Implement client-side fulltext search
[x] PLAN-011: Configure Supabase RLS policies for security (done in PLAN-003)
[x] PLAN-012: Add slug generation utility (done in PLAN-008)

### Phase 4: Polish & Deploy
[ ] PLAN-013: Design minimalist UI (inspired by cestina20.cz)
[ ] PLAN-014: Add SEO meta tags to all pages
[ ] PLAN-015: Test responsive design (mobile/desktop)
[ ] PLAN-016: Deploy to Netlify and configure custom domain

## Done
<!-- Claude moves completed items here with commit hash + date --> 

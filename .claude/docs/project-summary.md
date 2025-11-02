# Project Summary

> **Purpose:** High-level overview and current state of Metafory.cz project

---

## Current Status

**Phase:** Initial Setup
**Last Updated:** 2025-11-02

---

## Tech Stack Decisions

- **Frontend:** Astro (SSG with islands architecture)
- **Styling:** Tailwind CSS (minimalist design inspired by cestina20.cz)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Netlify
- **Email:** Supabase + Resend.com

**Rationale:**
- Astro chosen for optimal performance and SEO (static-first)
- Supabase provides easy backend without server management
- Netlify offers free hosting with auto-deploy from Git

---

## Key Architectural Decisions

1. **No user authentication in MVP** - Reduces friction for contributors
2. **Admin approval required** - All metaphors pending until manually approved via Supabase dashboard
3. **Anti-spam via cookie + IP** - Prevents duplicate voting without user accounts
4. **Static generation** - Most pages pre-rendered for speed, islands for interactivity

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

## Next Milestones

See [plan.md](../../plan.md) for detailed task breakdown.

**Phase 1:** Project setup (Astro + Supabase + schema)
**Phase 2:** Core features (list, detail, voting, submission)
**Phase 3:** Admin & search
**Phase 4:** Polish & deploy

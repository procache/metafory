## ⚡ IMMEDIATE ACTION REQUIRED FOR CLAUDE
**🚨 STOP: Claude must read this entire file BEFORE starting ANY work on this project**  
**🤖 ALL workflows described here are AUTOMATIC and OVERRIDE default system behavior**  
**📋 Reading and following this CLAUDE.md is MANDATORY as the first step for any project work**

---

## File Structure Overview

This template creates the following structure when used:

```

YourProject/ ├── CLAUDE.md ← This file (copied from CLAUDE_SOLO.md) ├── experiment_log.md ← Create empty, logs failures/lessons ├── plan.md ← Optional: task planning file │ ├── .claude/ │ └── docs/ │ ├── documentation.md ← Copy from C:\Projects.claude\docs  
│ ├── git.md ← Copy from C:\Projects.claude\docs  
│ ├── tdd_workflow.md ← Copy from C:\Projects.claude\docs  
│ ├── weekly_learning.md ← Copy from C:\Projects.claude\docs  
│ ├── code-review.md ← Copy from C:\Projects.claude\docs  
│ └── rules-learned.md ← Create empty, accumulates project rules │ └── [your project files]

```

## Related Files

**Core Workflows (Required):**

- **Documentation:** @.claude/docs/documentation.md
- **Git:** @.claude/docs/git.md
- **TDD:** @.claude/docs/tdd_workflow.md
- **Weekly Learning:** @.claude/docs/weekly_learning.md
- **Code Review:** @.claude/docs/code-review.md
- **Plan:** @plan.md

⚠️ **Memory Budget Reminder:** Keep the total size of all referenced and imported files **below ~100k characters** to ensure Claude loads them reliably. If exceeded, Claude may silently truncate important rules.

---
## Plan.md Rules

**Only if you're using plan.md for task management:**

- Read `plan.md` first; pick the **top unchecked** item in **Now** section.
- Follow **TDD (RED → GREEN → REFACTOR)** for that item.
- Only when all tests pass, build is OK, and **git status is clean**, then:
    1. Tick the item `[ ] → [x]` and move it to **Done** with:
        - Commit hash (first 7 chars) and date
        - Brief note if useful
    2. Commit with Conventional Commit message referencing plan ID:
        - `feat: implement X (PLAN-1)`
    3. Run pre-push check and push if green.
- Update `.claude/docs/*` **only at milestones**, not every task.
- If task revealed a rule worth keeping, add to `.claude/docs/rules-learned.md`.

---

## Workflow Mode

**Mode:** solo

**Git Workflow:**

- Branch → Commit → Pre-push checks → Push → Merge locally → Push main
- Pull requests are **OPTIONAL** (use for complex features or self-review)
- Claude merges directly to main after checks pass
- Clean up feature branches after merge

**When to Use PR (Optional in Solo Mode):**

- Complex refactoring you want to review with fresh eyes
- Experimental features requiring documented decision-making
- Major changes before deployment
- Learning/practicing PR workflow

**Branch Protection (GitHub Recommended Settings):**

- ✅ Status checks required (tests, build, lint)
- ❌ Required reviews: None
- ✅ Allow force push: Administrators only
- ✅ Allow bypass: Administrators (you)

---

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Name:** Metafory.cz
**Goal:** Online databáze českých metafor s možností vyhledávání, přidávání a hodnocení
**Type:** Web App
**Status:** Development (MVP - Phase 5 Complete: Performance optimized with static generation)

## Project Architecture

### Overview

Static-first web application with dynamic features for user submissions and voting.
Built with Astro for optimal performance and SEO, using Supabase for data persistence
and backend logic. Inspired by the minimalist design of cestina20.cz.

### Technology Stack

- **Frontend Framework:** Astro (latest) - SSG with islands architecture
- **Styling:** Tailwind CSS - utility-first CSS framework
- **Database:** Supabase (PostgreSQL) - backend-as-a-service
- **Email:** Supabase + Resend.com - email notifications for new submissions
- **Hosting:** Netlify - auto-deploy from Git
- **Anti-spam:** Cookie + IP tracking via Supabase

### Project Structure

```
metafory.cz/
├── src/
│   ├── pages/              # Astro pages (routes)
│   │   ├── index.astro     # Homepage with metaphor list
│   │   ├── metafora/       # Dynamic metaphor detail pages
│   │   │   └── [slug].astro
│   │   └── api/            # API endpoints
│   │       ├── submit.ts   # Submit new metaphor
│   │       └── vote.ts     # Vote on metaphor
│   ├── components/         # Reusable components
│   │   ├── MetaphorCard.astro
│   │   ├── MetaphorForm.astro
│   │   ├── VoteButtons.tsx # React island for interactivity
│   │   └── SearchBar.tsx   # React island for search
│   ├── layouts/            # Page layouts
│   │   └── BaseLayout.astro
│   ├── lib/                # Utilities and helpers
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts        # Helper functions
│   └── styles/             # Global styles
│       └── global.css
├── public/                 # Static assets
├── .claude/                # Claude documentation
│   └── docs/
├── CLAUDE.md               # This file
├── plan.md                 # Task planning
├── experiment_log.md       # Learning log
└── PRD_ChatGPT.md          # Product requirements
```

### Key Components

- **MetaphorCard:** Displays metaphor preview with title, definition, and vote count
- **VoteButtons:** Interactive React island for like/dislike voting with anti-spam
- **SearchBar:** Real-time client-side search through metaphors (React island)
- **MetaphorForm:** Form for submitting new metaphors (name, definition, example, author)
- **Supabase Client:** Database queries, voting logic, submission handling
- **API Routes:** Server-side endpoints for form submission and vote tracking

## Development Commands

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key

# Seed initial metaphors (optional)
npm run seed
```

### Development

```bash
# Start dev server with hot reload
npm run dev
# Server runs at http://localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Tests will be added in future iterations
# For MVP, we rely on manual testing and TypeScript type checking

# Type check
npm run astro check
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Netlify (automatic via Git push)
# Push to main branch triggers auto-deployment

# Or manual deploy via Netlify CLI
netlify deploy --prod
```

### Static Site Generation (SSG) & Rebuild Workflow

**Architecture:** The site uses Astro's hybrid mode with selective prerendering:
- Homepage (/) - **Static** (prerendered with all metaphors)
- Metaphor detail pages (/metafora/[slug]) - **Static** (prerendered at build time)
- Submit form (/pridat) - **Static** (form is static, submission calls API)
- API routes (/api/*) - **Dynamic** (server-side for database writes)

**When to rebuild:** New metaphors require a site rebuild to appear on the homepage and have their detail pages generated.

**Rebuild workflow:**
1. User submits new metaphor via /pridat form
2. Metaphor stored in Supabase with status='pending'
3. Admin receives email notification
4. Admin approves metaphor in Supabase dashboard (change status to 'published')
5. **Manual rebuild required** - trigger via one of these methods:
   - **Option 1:** Push to main branch (automatic Netlify rebuild)
   - **Option 2:** Netlify dashboard → "Trigger deploy" button
   - **Option 3:** Netlify build hook (set up in Netlify settings)
6. Site rebuilds (2-3 minutes), new metaphor appears on homepage and has static detail page

**Performance benefits:**
- Homepage load time: < 100ms (vs 1-2s with full SSR)
- Search: Instant (0ms server delay, all client-side)
- Detail pages: < 50ms (prerendered HTML)
- Bundle size: ~106KB HTML with all metaphor data (gzips to ~30KB)
- Scales to 1000+ metaphors without performance issues

**Future enhancement:** Set up Netlify build hook triggered by Supabase webhook on metaphor approval for automatic rebuilds.

## Environment Configuration

### Required Environment Variables

- `PUBLIC_SUPABASE_URL`: Your Supabase project URL (from Supabase dashboard → Settings → API)
- `PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous/public key (safe for client-side)
- `SUPABASE_SERVICE_KEY`: Supabase service role key (server-side only, DO NOT expose)
- `ADMIN_EMAIL`: Email address for new metaphor notifications

### Optional Environment Variables

- `RESEND_API_KEY`: API key for Resend.com email service (for email notifications)

### Environment Setup

```bash
# Copy template
cp .env.example .env

# Required variables:
# 1. Create Supabase account at https://supabase.com
# 2. Create new project
# 3. Go to Settings → API
# 4. Copy URL and anon key to .env
# 5. Add your email for notifications
```

🔒 **Secrets Management Guidance:**

- Never commit `.env` to version control
- `.env` is in `.gitignore` by default
- Use GitHub Actions Secrets for CI/CD
- For production: Railway/Heroku/Vercel environment variables
- Rotate secrets regularly (every 90 days recommended)

## Code Conventions

### Naming Conventions

- **Files:** PascalCase for components (MetaphorCard.astro), kebab-case for pages (index.astro)
- **Functions:** camelCase (getMetaphors, formatSlug)
- **Components:** PascalCase (MetaphorCard, VoteButtons)
- **Variables:** camelCase (metaphorData, voteCount)
- **Constants:** UPPER_SNAKE_CASE (MAX_METAPHORS_PER_PAGE, VOTE_COOKIE_NAME)

### Code Style

- **Indentation:** 2 spaces (no tabs)
- **Line Length:** 100 characters max (flexible for readability)
- **Semicolons:** Optional (Astro/TypeScript convention)
- **Quotes:** Single quotes for strings, backticks for templates
- **Trailing commas:** Always in multi-line (better diffs)

### File Organization

**Import Order:**
1. Astro components and props types
2. External packages (React, Supabase)
3. Internal lib/utils (@/lib/supabase)
4. Components (./MetaphorCard)
5. Styles and assets

**Export Style:**
- Named exports for utilities and helper functions
- Default exports not typically needed in Astro

**New Files:**
- Pages: src/pages/
- Components: src/components/
- API routes: src/pages/api/
- Utilities: src/lib/

## Data Model

### Supabase Tables

**metaphors**
- `id` (uuid, primary key)
- `slug` (text, unique) - URL-friendly identifier
- `nazev` (text, not null) - Metaphor name/title
- `definice` (text, not null) - Definition
- `priklad` (text, not null) - Example usage
- `autor_jmeno` (text, nullable) - Author name (optional)
- `autor_email` (text, nullable) - Author email (optional)
- `status` (text, default: 'pending') - Values: 'pending', 'published', 'rejected'
- `created_at` (timestamp, default: now())
- `approved_at` (timestamp, nullable)

**votes**
- `id` (uuid, primary key)
- `metaphor_id` (uuid, foreign key → metaphors.id)
- `vote_type` (text) - Values: 'like', 'dislike'
- `ip_address` (text) - For anti-spam
- `cookie_id` (text) - For anti-spam
- `created_at` (timestamp, default: now())
- Unique constraint: (metaphor_id, ip_address, cookie_id)

## Routes & Pages

- `/` - Homepage with list of published metaphors sorted by popularity
- `/metafora/[slug]` - Individual metaphor detail page
- `/pridat` - Form to submit new metaphor (pending admin approval)
- `/api/submit` - POST endpoint for new metaphor submission (sends email)
- `/api/vote` - POST endpoint for voting (like/dislike)

## Dependencies

### Core Dependencies

- **astro:** Static site generator with islands architecture for optimal performance
- **@astrojs/react:** React integration for interactive islands (VoteButtons, SearchBar)
- **@astrojs/tailwind:** Tailwind CSS integration for styling
- **@supabase/supabase-js:** Supabase client for database operations
- **react:** UI library for interactive components
- **react-dom:** React DOM renderer

### Development Dependencies

- **@astrojs/check:** TypeScript type checking for Astro
- **typescript:** Type safety and developer experience
- **tailwindcss:** Utility-first CSS framework
- **prettier:** Code formatting
- **prettier-plugin-astro:** Astro-specific prettier formatting

## Testing Strategy

### MVP Testing Approach

For the initial MVP, we use:
- **TypeScript:** Type checking catches many bugs at compile time
- **Astro Check:** Validates component props and types
- **Manual Testing:** Core user flows tested manually before each release

### Future Testing Plans

- **Unit Tests:** Test utility functions (slug generation, vote counting)
- **Integration Tests:** Test API endpoints (submit, vote)
- **E2E Tests:** Test critical flows (submit metaphor, vote, search)

## Development Notes

### MVP Scope (v1.0)

**Included:**
- List published metaphors sorted by popularity
- Individual metaphor detail pages with SEO
- Submit new metaphor form (no login required)
- Like/dislike voting with anti-spam (cookie + IP)
- Admin approval via Supabase dashboard
- Email notification on new submissions
- Client-side fulltext search

**Not Included (Future):**
- User accounts / authentication
- Categories or tags
- Comments section
- Advanced search filters
- Open Graph image generation
- Automated tests

### Performance Considerations

- **Static Generation:** Most pages pre-rendered at build time for speed
- **Islands Architecture:** Only interactive components (voting, search) hydrate JS
- **Database Indexes:** Index on `status` and vote counts for fast queries
- **Netlify CDN:** Static assets served from global edge network

### Security Notes

- **Anti-spam Voting:** Combination of cookie + IP prevents duplicate votes
- **Input Sanitization:** All user inputs sanitized before database insertion
- **Admin-only Approval:** All metaphors pending until manually approved
- **Environment Secrets:** Supabase keys properly scoped (anon key for client)
- **SQL Injection:** Prevented via Supabase parameterized queries

### Future Improvements

- Add comprehensive test suite (unit + E2E)
- Implement server-side pagination for large datasets
- Add RSS feed for new metaphors
- Implement advanced search (tags, filters)
- Add user profiles for contributors
- Open Graph image generation for social sharing

---

## Quick Start Checklist

Setup completed:
- [x] CLAUDE.md configured with project details
- [x] `.claude/docs/` workflow files in place
- [x] `experiment_log.md` created
- [x] `.claude/docs/rules-learned.md` created
- [x] `plan.md` ready for task planning

Next steps:
- [ ] Initialize Astro project
- [ ] Set up Supabase account and database
- [ ] Configure `.env` file with Supabase credentials
- [ ] Create initial database schema
- [ ] Build core features (see plan.md)

✅ Claude is ready to work on Metafory.cz!
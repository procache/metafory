# Rules Learned

> **Purpose:** Accumulates project-specific rules and lessons learned from failures and experiments.

---

## Project Rules

### Security Rules (2025-12-16)

**CSRF Protection:**
- Always validate Origin or Referer headers on state-changing API endpoints (POST, PUT, DELETE)
- Maintain allowlist of trusted origins (production domain + localhost for development)
- Return 403 Forbidden for requests from untrusted origins
- Enforcement: `src/lib/csrf.ts` utility used in all API routes

**Supabase RLS Policies:**
- Keep RLS policies minimal - only what's strictly necessary for public access
- Audit policies for privacy leaks (e.g., exposing IP addresses, email addresses)
- Never create INSERT policies that bypass API-level validation and rate limiting
- Submissions should go through API endpoints (with rate limiting, CSRF, validation), not direct DB access
- Enforcement: Only 2 policies in production (metaphors SELECT published, votes INSERT with unique constraint)

**API Security Layers:**
- Layer 1: CSRF validation (Origin/Referer check)
- Layer 2: Rate limiting (per IP address)
- Layer 3: Input validation (maxlength, control characters, email format)
- Layer 4: Honeypot anti-spam (hidden form fields)
- Layer 5: RLS policies (database-level access control)
- All layers must be present for production readiness

**Pre-Production Security Checklist:**
- Run security audit before every production deployment
- Check: CSRF, XSS, SQL injection, rate limiting, input validation, secrets management
- Verify RLS policies in Supabase Dashboard
- Run npm audit for vulnerable dependencies
- Test all API endpoints manually after deployment

**CSRF Origin Allowlists (2025-12-18):**
- Hardcoded origin allowlists break on dynamic deployment environments (Netlify previews, staging)
- Always include: production domain, www subdomain, localhost variants, AND hosting platform patterns
- Use dynamic same-origin fallback: compare Origin host with request Host header
- Test form submissions on Netlify preview deployments before merging to production
- Enforcement: `src/lib/csrf.ts` includes regex patterns for `*.netlify.app` + dynamic host check


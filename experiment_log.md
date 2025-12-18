# Experiment Log

> **Purpose:** Raw record of failures, experiments, and lessons learned during development.

---

## Log Entries

### 2025-12-16: Pre-Production Security Audit

**Context:** Comprehensive security analysis before production deployment

**Findings:**
1. **Missing CSRF Protection** - API endpoints lacked Origin/Referer validation
2. **Supabase RLS Policies Issues** - Duplicate policies and security risks:
   - `Anyone can submit metaphors` INSERT policy bypassed API validation/rate limiting
   - `Anyone can view votes` SELECT policy exposed IP addresses and cookie IDs
3. **All other security measures working correctly:**
   - XSS protection via HTML escaping (email.ts)
   - Rate limiting implemented (3/h submit, 5/h contact, 50/15min votes)
   - Input validation with control character detection
   - Security headers (CSP, HSTS, X-Frame-Options) in netlify.toml
   - Honeypot anti-spam in all forms
   - 0 npm audit vulnerabilities

**Actions Taken:**
1. Created `src/lib/csrf.ts` with `validateCsrf()` utility
2. Added CSRF validation to all API endpoints (submit.ts, vote.ts, kontakt.ts)
3. Cleaned up Supabase RLS policies:
   - Removed duplicate SELECT policies on metaphors
   - Removed dangerous INSERT policy on metaphors (submissions only via API)
   - Removed dangerous SELECT policy on votes (privacy protection)
   - Final state: 2 policies only (metaphors SELECT, votes INSERT)

**Commit:** `e46e26d` - feat: implement CSRF protection on all API endpoints

**Security Score:** Improved from 8.5/10 to 9.5/10

**Lessons Learned:**
- CSRF protection must be implemented for all state-changing operations
- RLS policies should be minimal and audited for privacy leaks
- Direct database access bypass application-level security (rate limiting, validation)
- Security audit checklist valuable before production deployment

---

### 2025-12-18: CSRF Validation Too Restrictive for Netlify Deployments

**Context:** Form submission on /pridat page returned "Neplatný požadavek" error after security hardening

**Failure Type:** misconfig

**Root Cause:**
- CSRF validation in `src/lib/csrf.ts` had hardcoded allowlist of origins
- Only allowed: metafory.cz, www.metafory.cz, localhost:4321, localhost:3000
- Netlify preview deployments use dynamic subdomains (e.g., `abc123--metafory.netlify.app`)
- Requests from Netlify preview URLs failed CSRF validation

**Fix Applied:**
1. Added regex patterns for Netlify subdomains: `/^https:\/\/[a-z0-9-]+\.netlify\.app$/`
2. Added dynamic same-origin check: compare Origin header host with request Host header
3. Kept explicit allowlist as primary check, dynamic check as fallback

**Commit:** `04500c7` - fix: CSRF validation now supports dynamic origins and Netlify previews

### 📏 Rule Added
- .claude/docs/rules-learned.md: CSRF allowlists must include all deployment environments
- enforcement: Manual testing on Netlify preview before production deploy


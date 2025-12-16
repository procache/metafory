# Security Summary

> Comprehensive overview of security measures implemented in the project.

## Security Score: 9.5/10

Last updated: 2025-12-16 (Pre-production security audit)

---

## Implemented Security Measures

### 1. CSRF Protection
- **Implementation:** `src/lib/csrf.ts`
- **Coverage:** All API endpoints (/api/submit, /api/vote, /api/kontakt)
- **Method:** Origin/Referer header validation
- **Allowed origins:**
  - https://metafory.cz
  - https://www.metafory.cz
  - http://localhost:4321 (development)
- **Response:** 403 Forbidden for invalid origins
- **Status:** ✅ Implemented (commit e46e26d)

### 2. XSS Protection
- **Email content:** HTML escaping via `escapeHtml()` in `src/lib/email.ts`
- **Template output:** Astro automatically escapes all outputs in .astro templates
- **Status:** ✅ Implemented

### 3. Rate Limiting
- **Implementation:** `src/lib/rate-limit.ts`
- **Method:** In-memory tracking by IP address
- **Limits:**
  - Submit metaphor: 3 requests/hour per IP
  - Contact form: 5 requests/hour per IP
  - Voting: 50 requests/15 minutes per IP
- **Response:** 429 Too Many Requests with Retry-After header
- **Note:** In-memory (resets on serverless function restart) - future: move to database
- **Status:** ✅ Implemented

### 4. Input Validation
- **Location:** All API endpoints (submit.ts, vote.ts, kontakt.ts)
- **Checks:**
  - Required fields validation
  - Maxlength enforcement (200-2000 characters)
  - Control character detection (`/[\x00-\x1F\x7F]/`)
  - Email format validation (validator.js, RFC 5322 compliant)
- **Status:** ✅ Implemented

### 5. Anti-Spam
- **Method:** Honeypot hidden fields
- **Implementation:**
  - `src/pages/pridat.astro` (line 42-51)
  - `src/pages/kontakt.astro` (line 34-43)
- **Logic:** Silently reject if honeypot field filled (bots only)
- **Status:** ✅ Implemented

### 6. SQL Injection Protection
- **Method:** Supabase parameterized queries
- **Risk:** Zero (Supabase SDK handles sanitization)
- **Status:** ✅ Protected by default

### 7. Security Headers
- **Implementation:** `netlify.toml` (lines 13-48)
- **Headers:**
  - `X-Frame-Options: DENY` (anti-clickjacking)
  - `X-Content-Type-Options: nosniff` (MIME sniffing protection)
  - `X-XSS-Protection: 1; mode=block` (legacy browser XSS protection)
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HTTPS enforcement)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=()...` (disable unnecessary features)
  - `Content-Security-Policy` (see below)
- **Status:** ✅ Implemented

### 8. Content Security Policy (CSP)
- **Implementation:** `netlify.toml` (lines 37-48)
- **Policy:**
  ```
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co https://resend.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
  ```
- **Note:** `unsafe-inline` required by Astro - consider nonces for stricter CSP in future
- **Status:** ✅ Implemented

### 9. Supabase Row Level Security (RLS)
- **Status:** ✅ Enabled on metaphors and votes tables
- **Policies:**
  1. **metaphors SELECT:** Public can view only published metaphors (`status = 'published'`)
  2. **votes INSERT:** Anyone can vote (protected by unique constraint on metaphor_id + ip_address + cookie_id)
- **Cleaned up:** Removed dangerous policies that bypassed API security or leaked privacy data
- **Audit date:** 2025-12-16
- **Status:** ✅ Implemented and audited

### 10. Secrets Management
- **Method:** Environment variables
- **Storage:** `.env` file (gitignored)
- **Variables:**
  - `PUBLIC_SUPABASE_URL` (safe for client)
  - `PUBLIC_SUPABASE_ANON_KEY` (safe for client)
  - `SUPABASE_SERVICE_KEY` (server-only, secret)
  - `ADMIN_EMAIL` (server-only)
  - `RESEND_API_KEY` (server-only, optional)
- **Deployment:** Set in Netlify Environment Variables dashboard
- **Status:** ✅ Implemented

### 11. Dependency Security
- **Check:** `npm audit`
- **Result:** 0 vulnerabilities (997 total dependencies)
- **Last checked:** 2025-12-16
- **Status:** ✅ Clean

---

## Security Architecture Layers

API requests flow through multiple security layers:

```
User Request
    ↓
1. CSRF Validation (Origin/Referer) → 403 if invalid
    ↓
2. Rate Limiting (IP-based) → 429 if exceeded
    ↓
3. Input Validation (maxlength, format, control chars) → 400 if invalid
    ↓
4. Honeypot Check (bot detection) → silent reject
    ↓
5. Business Logic (API endpoint)
    ↓
6. Supabase RLS Policies (database-level) → enforces access rules
    ↓
Database Write/Read
```

---

## Known Limitations & Future Improvements

### Low Priority
1. **CSP unsafe-inline:** Consider using nonces for stricter CSP (requires Astro config changes)
2. **Rate limiting persistence:** Move from in-memory to Supabase/Redis for persistence across serverless restarts
3. **Monitoring:** Add Sentry or LogRocket for error tracking in production

### Not Security Issues
- Email notifications optional (graceful degradation if RESEND_API_KEY missing)
- Static site generation means minimal attack surface (only API routes are dynamic)

---

## Pre-Production Checklist

Before every production deployment:

- [ ] Run security audit (check all measures above)
- [ ] Verify RLS policies in Supabase Dashboard
- [ ] Run `npm audit` (must be 0 vulnerabilities)
- [ ] Test CSRF protection works (try cross-origin request)
- [ ] Test rate limiting works (exceed limits)
- [ ] Verify security headers present (browser DevTools → Network → Headers)
- [ ] Test all API endpoints manually
- [ ] Verify environment variables set in Netlify

---

## Resources

- CSRF implementation: `src/lib/csrf.ts`
- Rate limiting: `src/lib/rate-limit.ts`
- Email security: `src/lib/email.ts` (XSS escaping)
- Security headers: `netlify.toml` (lines 13-63)
- API endpoints: See [api-summary.md](./api-summary.md)
- Lessons learned: See [rules-learned.md](./rules-learned.md)

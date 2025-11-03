# Deployment Guide - Metafory.cz

This guide walks you through deploying your Metafory.cz application to Netlify.

## Prerequisites

- GitHub account with the repository pushed
- Netlify account (free tier works fine)
- Custom domain (optional)

## Step 1: Connect Netlify to GitHub

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub account
5. Select the `metafory` repository

## Step 2: Configure Build Settings

Netlify should auto-detect the settings from `netlify.toml`, but verify:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 20

## Step 3: Add Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

### Required Variables
- `PUBLIC_SUPABASE_URL` = https://pyvqfqxiefxptavzmqpm.supabase.co
- `PUBLIC_SUPABASE_ANON_KEY` = [your Supabase anon key from .env]
- `SUPABASE_SERVICE_KEY` = [your Supabase service key from .env]

### Optional Variables (for email notifications)
- `RESEND_API_KEY` = [your Resend API key]
- `ADMIN_EMAIL` = prochor.apps@gmail.com

## Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete (~2-3 minutes)
3. Your site will be available at `https://[random-name].netlify.app`

## Step 5: Configure Custom Domain (Optional)

If you have a custom domain (e.g., metafory.cz):

1. In Netlify: Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain: `metafory.cz`
4. Netlify will provide DNS records to add

### DNS Configuration

Add these records at your domain registrar:

**For apex domain (metafory.cz):**
- Type: `A`
- Name: `@`
- Value: `75.2.60.5` (Netlify's load balancer)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `[your-site].netlify.app`

### SSL Certificate

Netlify automatically provisions a free SSL certificate via Let's Encrypt.
This usually takes 5-10 minutes after DNS propagation.

## Step 6: Verify Deployment

1. Visit your site URL
2. Test key features:
   - Homepage loads with metaphors
   - Search works
   - Voting works (check Supabase for new votes)
   - Submission form works (check email notifications)
   - Responsive design on mobile

## Continuous Deployment

Netlify is now configured for auto-deploy:

- Every push to `main` branch triggers a new build
- Build logs are available in Netlify dashboard
- Failed builds won't affect the live site

## Troubleshooting

### Build fails

Check Netlify build logs for errors. Common issues:
- Missing environment variables
- Node version mismatch
- npm install failures

### Environment variables not working

- Ensure variable names match exactly (case-sensitive)
- Redeploy after adding new variables
- Check Supabase keys are correct

### Domain not resolving

- DNS propagation can take 24-48 hours
- Verify DNS records at your registrar
- Use `dig metafory.cz` to check DNS

### Supabase connection fails

- Check PUBLIC_SUPABASE_URL is correct
- Verify anon key has correct permissions
- Test Supabase connection in browser console

## Post-Deployment Checklist

- [ ] Site loads at production URL
- [ ] Search functionality works
- [ ] Voting system works
- [ ] Submission form sends emails
- [ ] Mobile responsive design works
- [ ] SEO meta tags present (view page source)
- [ ] SSL certificate is active (HTTPS)
- [ ] Custom domain configured (if applicable)
- [ ] Google Search Console submitted (optional)
- [ ] Analytics configured (optional)

## Next Steps

1. **Monitor:** Check Netlify analytics for traffic
2. **SEO:** Submit sitemap to Google Search Console
3. **Performance:** Run Lighthouse audit
4. **Backup:** Export Supabase data regularly
5. **Updates:** Keep dependencies updated

---

🎉 **Congratulations!** Your site is now live at https://metafory.cz

import type { APIRoute } from 'astro'
import { getServerSupabase } from '../../lib/supabase'
import { generateSlug, ensureUniqueSlug } from '../../lib/utils'
import { sendNewMetaphorNotification } from '../../lib/email'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../lib/rate-limit'
import { validateCsrf, createCsrfErrorResponse } from '../../lib/csrf'
import validator from 'validator'

// Ensure this route is never prerendered (needed for Netlify)
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    // CSRF Protection: Validate Origin/Referer headers
    if (!validateCsrf(request)) {
      return createCsrfErrorResponse()
    }

    // Check rate limit
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.SUBMIT)

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      return new Response(
        JSON.stringify({
          error: 'Příliš mnoho požadavků. Zkuste to prosím později.',
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': RATE_LIMITS.SUBMIT.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
          }
        }
      )
    }

    // Use service role for admin operations (bypasses RLS)
    const supabase = getServerSupabase()

    const body = await request.json()
    const { nazev, definice, priklad, zdroj, autor_jmeno, autor_email, website } = body

    // Check honeypot field (anti-spam) - silently reject bots
    if (website) {
      return new Response(
        JSON.stringify({ success: true, message: 'Metafora byla úspěšně odeslána' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate required fields
    if (!nazev || !definice || !priklad) {
      return new Response(
        JSON.stringify({ error: 'Všechna povinná pole musí být vyplněna' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check for control characters in all fields (prevent injection attacks)
    const hasControlChars = (str: string) => /[\x00-\x1F\x7F]/.test(str)
    if (
      hasControlChars(nazev) ||
      hasControlChars(definice) ||
      hasControlChars(priklad) ||
      (zdroj && hasControlChars(zdroj)) ||
      (autor_jmeno && hasControlChars(autor_jmeno)) ||
      (autor_email && hasControlChars(autor_email))
    ) {
      return new Response(
        JSON.stringify({ error: 'Pole obsahují neplatné znaky' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format if provided
    if (autor_email && !validator.isEmail(autor_email)) {
      return new Response(
        JSON.stringify({ error: 'Neplatný formát emailu autora' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate lengths
    if (nazev.length > 200 || definice.length > 500 || priklad.length > 300) {
      return new Response(
        JSON.stringify({ error: 'Některé pole překračuje maximální délku' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique slug
    const baseSlug = generateSlug(nazev)

    const checkSlugExists = async (slug: string): Promise<boolean> => {
      const { data } = await supabase
        .from('metaphors')
        .select('slug')
        .eq('slug', slug)
        .single()

      return data !== null
    }

    const slug = await ensureUniqueSlug(baseSlug, checkSlugExists)

    // Insert metaphor with status 'pending'
    const { data, error } = await supabase
      .from('metaphors')
      .insert({
        slug,
        nazev: nazev.trim(),
        definice: definice.trim(),
        priklad: priklad.trim(),
        zdroj: zdroj ? zdroj.trim() : null,
        autor_jmeno: autor_jmeno ? autor_jmeno.trim() : null,
        autor_email: autor_email ? autor_email.trim() : null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Submit error:', error)
      return new Response(
        JSON.stringify({ error: 'Nepodařilo se uložit metaforu' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Send email notification to admin
    await sendNewMetaphorNotification({
      nazev: data.nazev,
      definice: data.definice,
      priklad: data.priklad,
      zdroj: data.zdroj,
      autor_jmeno: data.autor_jmeno,
      autor_email: data.autor_email,
      slug: data.slug
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Metafora byla úspěšně odeslána',
        metaphor: data
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMITS.SUBMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
        }
      }
    )
  } catch (err) {
    console.error('Submit API error:', err)
    return new Response(
      JSON.stringify({ error: 'Interní chyba serveru' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

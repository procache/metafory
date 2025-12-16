import type { APIRoute } from 'astro'
import { sendContactMessage } from '../../lib/email'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../lib/rate-limit'
import validator from 'validator'

// Ensure this route is never prerendered (needed for Netlify)
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check rate limit
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.CONTACT)

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
            'X-RateLimit-Limit': RATE_LIMITS.CONTACT.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
          }
        }
      )
    }

    const body = await request.json()
    const { jmeno, email, zprava, website } = body

    // Check honeypot field (anti-spam) - silently reject bots
    if (website) {
      return new Response(
        JSON.stringify({ success: true, message: 'Zpráva byla úspěšně odeslána' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate required fields
    if (!jmeno || !email || !zprava) {
      return new Response(
        JSON.stringify({ error: 'Všechna pole musí být vyplněna' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check for control characters in all fields (prevent injection attacks)
    const hasControlChars = (str: string) => /[\x00-\x1F\x7F]/.test(str)
    if (hasControlChars(jmeno) || hasControlChars(email) || hasControlChars(zprava)) {
      return new Response(
        JSON.stringify({ error: 'Pole obsahují neplatné znaky' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format using validator.js (RFC 5322 compliant)
    if (!validator.isEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Neplatný formát emailu' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate lengths
    if (jmeno.length > 100 || email.length > 100 || zprava.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Některé pole překračuje maximální délku' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Send email notification to admin
    const result = await sendContactMessage({
      jmeno: jmeno.trim(),
      email: email.trim(),
      zprava: zprava.trim()
    })

    if (!result.success && !result.skipped) {
      console.error('Contact email failed:', result.error)
      return new Response(
        JSON.stringify({ error: 'Nepodařilo se odeslat zprávu' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Zpráva byla úspěšně odeslána'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMITS.CONTACT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
        }
      }
    )
  } catch (err) {
    console.error('Contact API error:', err)
    return new Response(
      JSON.stringify({ error: 'Interní chyba serveru' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

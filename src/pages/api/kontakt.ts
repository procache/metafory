import type { APIRoute } from 'astro'
import { sendContactMessage } from '../../lib/email'

// Ensure this route is never prerendered (needed for Netlify)
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { jmeno, email, zprava } = body

    // Validate required fields
    if (!jmeno || !email || !zprava) {
      return new Response(
        JSON.stringify({ error: 'Všechna pole musí být vyplněna' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
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
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Contact API error:', err)
    return new Response(
      JSON.stringify({ error: 'Interní chyba serveru' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

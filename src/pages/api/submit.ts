import type { APIRoute } from 'astro'
import { getServerSupabase } from '../../lib/supabase'
import { generateSlug, ensureUniqueSlug } from '../../lib/utils'
import { sendNewMetaphorNotification } from '../../lib/email'

// Ensure this route is never prerendered (needed for Netlify)
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    // Use service role for admin operations (bypasses RLS)
    const supabase = getServerSupabase()

    const body = await request.json()
    const { nazev, definice, priklad, zdroj, autor_jmeno, autor_email } = body

    // Validate required fields
    if (!nazev || !definice || !priklad) {
      return new Response(
        JSON.stringify({ error: 'Všechna povinná pole musí být vyplněna' }),
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
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Submit API error:', err)
    return new Response(
      JSON.stringify({ error: 'Interní chyba serveru' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'
import { generateSlug, ensureUniqueSlug } from '../../lib/utils'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { nazev, definice, priklad, autor_jmeno, autor_email } = body

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

    // TODO: Send email notification to admin (PLAN-009)
    // For now, just log
    console.log('New metaphor submitted:', data)

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

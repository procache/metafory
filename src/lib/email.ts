import { Resend } from 'resend'

const resendApiKey = import.meta.env.RESEND_API_KEY
const adminEmail = import.meta.env.ADMIN_EMAIL

// Initialize Resend only if API key is available
let resend: Resend | null = null
if (resendApiKey) {
  resend = new Resend(resendApiKey)
}

/**
 * Escape HTML to prevent XSS attacks in email content
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

interface NewMetaphorEmailParams {
  nazev: string
  definice: string
  priklad: string
  zdroj?: string | null
  autor_jmeno?: string | null
  autor_email?: string | null
  slug: string
}

export async function sendNewMetaphorNotification(params: NewMetaphorEmailParams) {
  // If no Resend API key or admin email, skip email sending
  if (!resend || !adminEmail) {
    console.warn('Email notification skipped: Missing RESEND_API_KEY or ADMIN_EMAIL')
    return { success: false, skipped: true }
  }

  try {
    const { nazev, definice, priklad, zdroj, autor_jmeno, autor_email, slug } = params

    // Escape all user-provided data to prevent XSS
    const escapedNazev = escapeHtml(nazev)
    const escapedDefinice = escapeHtml(definice)
    const escapedPriklad = escapeHtml(priklad)
    const escapedZdroj = zdroj ? escapeHtml(zdroj) : null
    const escapedAutorJmeno = autor_jmeno ? escapeHtml(autor_jmeno) : null
    const escapedAutorEmail = autor_email ? escapeHtml(autor_email) : null
    const escapedSlug = escapeHtml(slug)

    const sourceInfo = escapedZdroj
      ? `<p><strong>Zdroj:</strong> ${escapedZdroj}</p>`
      : ''

    const authorInfo = escapedAutorJmeno || escapedAutorEmail
      ? `<p><strong>Autor:</strong> ${escapedAutorJmeno || 'Neposkytnut'} ${escapedAutorEmail ? `(${escapedAutorEmail})` : ''}</p>`
      : ''

    const htmlContent = `
      <h2>Nová metafora čeká na schválení</h2>

      <h3>${escapedNazev}</h3>

      <p><strong>Definice:</strong><br>${escapedDefinice}</p>

      <p><strong>Příklad:</strong><br>${escapedPriklad}</p>

      ${sourceInfo}

      ${authorInfo}

      <hr>

      <p><strong>Akce:</strong></p>
      <ul>
        <li>Přejděte do <a href="https://supabase.com/dashboard/project/pyvqfqxiefxptavzmqpm/editor">Supabase Dashboard</a></li>
        <li>Najděte metaforu se slug: <code>${escapedSlug}</code></li>
        <li>Změňte status na 'published' nebo 'rejected'</li>
      </ul>
    `

    const textContent = `
Nová metafora čeká na schválení

Název: ${nazev}

Definice: ${definice}

Příklad: ${priklad}

${zdroj ? `Zdroj: ${zdroj}` : ''}
${autor_jmeno ? `Autor: ${autor_jmeno}` : ''}
${autor_email ? `Email: ${autor_email}` : ''}

Slug: ${slug}

Přejděte do Supabase Dashboard pro schválení.
    `.trim()

    const { data, error } = await resend.emails.send({
      from: 'Metafory.cz <onboarding@resend.dev>', // Default Resend sender for testing
      to: [adminEmail],
      subject: `Nová metafora: ${nazev}`,
      html: htmlContent,
      text: textContent
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Email notification error:', err)
    return { success: false, error: err }
  }
}

interface ContactEmailParams {
  jmeno: string
  email: string
  zprava: string
}

export async function sendContactMessage(params: ContactEmailParams) {
  // If no Resend API key or admin email, skip email sending
  if (!resend || !adminEmail) {
    console.warn('Contact email skipped: Missing RESEND_API_KEY or ADMIN_EMAIL')
    return { success: false, skipped: true }
  }

  try {
    const { jmeno, email, zprava } = params

    // Escape all user-provided data to prevent XSS
    const escapedJmeno = escapeHtml(jmeno)
    const escapedEmail = escapeHtml(email)
    const escapedZprava = escapeHtml(zprava)

    const htmlContent = `
      <h2>Nová zpráva z kontaktního formuláře</h2>

      <p><strong>Od:</strong> ${escapedJmeno}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapedEmail}">${escapedEmail}</a></p>

      <hr>

      <p><strong>Zpráva:</strong></p>
      <p style="white-space: pre-wrap;">${escapedZprava}</p>
    `

    const textContent = `
Nová zpráva z kontaktního formuláře

Od: ${jmeno}
Email: ${email}

Zpráva:
${zprava}
    `.trim()

    const { data, error } = await resend.emails.send({
      from: 'Metafory.cz <onboarding@resend.dev>', // Default Resend sender for testing
      to: [adminEmail],
      replyTo: email, // Allow easy reply to the sender
      subject: `Kontakt: ${jmeno}`,
      html: htmlContent,
      text: textContent
    })

    if (error) {
      console.error('Contact email send error:', error)
      return { success: false, error }
    }

    console.log('Contact email sent successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Contact email error:', err)
    return { success: false, error: err }
  }
}

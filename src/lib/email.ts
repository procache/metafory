import { Resend } from 'resend'

const resendApiKey = import.meta.env.RESEND_API_KEY
const adminEmail = import.meta.env.ADMIN_EMAIL

// Initialize Resend only if API key is available
let resend: Resend | null = null
if (resendApiKey) {
  resend = new Resend(resendApiKey)
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

    const sourceInfo = zdroj
      ? `<p><strong>Zdroj:</strong> ${zdroj}</p>`
      : ''

    const authorInfo = autor_jmeno || autor_email
      ? `<p><strong>Autor:</strong> ${autor_jmeno || 'Neposkytnut'} ${autor_email ? `(${autor_email})` : ''}</p>`
      : ''

    const htmlContent = `
      <h2>Nová metafora čeká na schválení</h2>

      <h3>${nazev}</h3>

      <p><strong>Definice:</strong><br>${definice}</p>

      <p><strong>Příklad:</strong><br>${priklad}</p>

      ${sourceInfo}

      ${authorInfo}

      <hr>

      <p><strong>Akce:</strong></p>
      <ul>
        <li>Přejděte do <a href="https://supabase.com/dashboard/project/pyvqfqxiefxptavzmqpm/editor">Supabase Dashboard</a></li>
        <li>Najděte metaforu se slug: <code>${slug}</code></li>
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

    const htmlContent = `
      <h2>Nová zpráva z kontaktního formuláře</h2>

      <p><strong>Od:</strong> ${jmeno}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>

      <hr>

      <p><strong>Zpráva:</strong></p>
      <p style="white-space: pre-wrap;">${zprava}</p>
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

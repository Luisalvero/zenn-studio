/**
 * Zenn Studio — contact form Worker (Cloudflare Workers).
 * ---------------------------------------------------------------------------
 * Receives the site's contact form POST and sends it to your inbox via Resend.
 * The Resend API key lives here as a Worker secret — never in the browser.
 *
 * Deploy: see contact-worker/README.md
 *
 * Required Worker variables:
 *   RESEND_API_KEY  (secret)  — from resend.com/api-keys
 *   TO_EMAIL        (var)     — where inquiries are delivered (e.g. luis@empcnet.com)
 *   FROM_EMAIL      (var)     — a Resend-verified sender, e.g. "Zenn Studio <hello@zennvoi.com>"
 *                               (or "onboarding@resend.dev" while testing)
 */

const ALLOWED_ORIGINS = ['https://zennvoi.com', 'https://www.zennvoi.com']

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    }

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors)

    let data
    try {
      data = await request.json()
    } catch {
      return json({ error: 'Invalid request' }, 400, cors)
    }

    const name = String(data.name || '').trim()
    const email = String(data.email || '').trim()
    const projectType = String(data.projectType || '').trim()
    const message = String(data.message || '').trim()
    const honeypot = String(data.company || '').trim() // bots fill hidden fields

    if (honeypot) return json({ ok: true }, 200, cors) // silently drop spam
    if (!name || !email || !message) return json({ error: 'Please fill in your name, email, and message.' }, 400, cors)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'That email looks invalid.' }, 400, cors)
    if (message.length > 5000) return json({ error: 'Message is too long.' }, 400, cors)

    const subject = `New inquiry — ${projectType || 'General'} (${name})`
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${projectType || '—'}`,
      '',
      message,
    ].join('\n')

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.TO_EMAIL],
        reply_to: email,
        subject,
        text,
      }),
    })

    if (!resendRes.ok) {
      const detail = await resendRes.text().catch(() => '')
      return json({ error: 'Could not send right now — please email directly.', detail: detail.slice(0, 300) }, 502, cors)
    }

    return json({ ok: true }, 200, cors)
  },
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

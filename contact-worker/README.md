# Contact form Worker

A tiny Cloudflare Worker that receives the site's contact form and emails it to
you via **Resend**. Your Resend API key stays on the server (never in the
browser), which is why the static site needs this.

## Deploy (dashboard — no CLI needed, ~3 min)

1. Go to **Cloudflare dashboard → Workers & Pages → Create → Create Worker**.
2. Name it e.g. `zenn-contact`. Click **Deploy** (a placeholder deploys first).
3. Click **Edit code**, delete the placeholder, and paste the contents of
   [`worker.js`](./worker.js). **Deploy**.
4. Go to the Worker's **Settings → Variables and Secrets** and add:
   | Name | Type | Value |
   |------|------|-------|
   | `RESEND_API_KEY` | **Secret** | your key from resend.com/api-keys |
   | `TO_EMAIL` | Text | where inquiries go, e.g. `luis@empcnet.com` |
   | `FROM_EMAIL` | Text | a Resend-verified sender, e.g. `Zenn Studio <hello@zennvoi.com>` |
5. Copy the Worker URL (looks like `https://zenn-contact.<you>.workers.dev`).
6. Paste that URL into `contactEndpoint` in `src/config/site.ts`, then commit —
   the form goes live automatically.

## Resend notes

- **Sender domain:** `FROM_EMAIL` must use a domain you've **verified in Resend**
  (Resend → Domains). If you verify `zennvoi.com`, use something like
  `hello@zennvoi.com`. While testing you can use `onboarding@resend.dev`.
- `reply_to` is set to the visitor's email, so you can reply straight from your
  inbox.

## Optional hardening

- Add **Cloudflare Turnstile** (free CAPTCHA) if you ever get spam — the Worker
  already drops obvious bots via a honeypot field.
- You can bind the Worker to a custom route like `zennvoi.com/api/contact`
  instead of the `workers.dev` URL if you prefer.

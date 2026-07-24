# Zenn Studio — Portfolio

The portfolio and creative home of **Luis Alvero** / Zenn Studio — cinematic
video editing, sound design, and color grading. Built to feel like a boutique
post-production studio: minimal, dark, cinematic, and intentional.

> Everything showcased is personal and spec work — creative explorations made to
> sharpen the craft. The site is designed to present that honestly.

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (build tooling)
- **Tailwind CSS v4** (design system via CSS `@theme`)
- **React Router v7** (client-side routing)
- **Framer Motion** (cinematic, reduced-motion-aware animation)
- **Lucide** (icons)
- **@fontsource** (self-hosted **Inter** + **Manrope** variable fonts)
- **GitHub Pages** deployment via GitHub Actions

---

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build locally
npm run lint     # type-check only
```

Requires Node 20+.

---

## Project structure

```
src/
├── components/
│   ├── layout/      Navbar, Footer, Layout, Logo, PageHeader, ScrollToTop
│   ├── portfolio/   ProjectCard
│   ├── sections/    Hero, FeaturedReel, PortfolioPreview, ServicesPreview,
│   │                AboutPreview, ProcessSection, ContactCTA
│   └── ui/          Button, Container, Section, SectionHeading, Reveal, Tag,
│                    Image, VideoModal, VideoEmbed, BeforeAfter, Marquee,
│                    GrainOverlay, ServiceIcon, SEO
├── config/
│   └── site.ts      ← ALL brand + contact info lives here
├── data/            projects.ts, services.ts, process.ts
├── hooks/           useLockBodyScroll, useMediaQuery
├── lib/             animations.ts, utils.ts, video.ts
├── pages/           Home, Portfolio, Project, Services, About, Contact, 404
├── types/           shared TypeScript interfaces
├── App.tsx          routes
├── main.tsx         entry (fonts + providers)
└── index.css        Tailwind theme + design system
```

---

## Customizing the content

Everything you'll want to change is centralized — no need to touch component code.

### 1. Brand & contact — `src/config/site.ts`

Replace the values marked `TODO`:

- `email`, `whatsapp` (number + display), `instagram`, `github`
- `showreel` — your YouTube/Vimeo `provider` + video `id`
- `url` — your live domain (used for canonical + Open Graph URLs)

### 2. Projects — `src/data/projects.ts`

Each project is one object with full detail fields (overview, goals, process,
software, techniques, notes, challenges, lessons, stills, grade comparisons).

- **Images:** drop files into `public/images/projects/<slug>/` and set the path
  (e.g. `thumbnail: '/images/projects/echoes/thumb.jpg'`). An empty string `''`
  renders an on-brand placeholder, so the layout always looks intentional while
  you're still producing assets.
- **Video:** set `video: { provider: 'youtube', id: 'xxxx' }` to embed the final piece.

### 3. Services & process — `src/data/services.ts`, `src/data/process.ts`

### 4. Social/OG image

The site references `/og-image.jpg` (1200×630) for link previews. A design
reference lives at `public/og-image.svg` — export a JPG/PNG named `og-image.jpg`
into `public/` (most social scrapers don't render SVG).

Also update the **absolute** URLs in `index.html` (canonical, `og:url`,
`og:image`), `public/robots.txt`, and `public/sitemap.xml` to your real domain.

---

## Deployment (GitHub Pages)

This repo deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`).

1. Push the repo to GitHub.
2. In **Settings → Pages → Build and deployment**, set **Source** to
   **GitHub Actions**.
3. Every push to `main` builds and deploys.

### Custom domain

The site is configured for a **custom domain** served from the root:

- `vite.config.ts` → `base: '/'`
- `public/CNAME` → contains your domain (currently `zennvoi.com` — **change
  this** to your real domain)
- In **Settings → Pages**, add the same custom domain and enable
  **Enforce HTTPS**.
- Point your DNS at GitHub Pages (A/AAAA records for an apex domain, or a CNAME
  record for a `www` subdomain — see GitHub's Pages docs).

Client-side routing on GitHub Pages is handled by `public/404.html` +
a small restore snippet in `index.html` (the standard SPA fallback), so deep
links like `/portfolio/echoes-in-the-static` work on refresh.

> **Not using a custom domain?** If you deploy to a project page
> (`username.github.io/repo`), change `base` in `vite.config.ts` to `'/repo/'`,
> set `pathSegmentsToKeep = 1` in `public/404.html`, delete `public/CNAME`, and
> update the absolute URLs above.

---

## Notes

- **`npm audit` shows a react-router advisory** (RSC-mode CSRF). It only affects
  React Router's server-components / server-actions mode. This is a static,
  client-only SPA with no server, so it does not apply. Left on the latest v7 to
  avoid a breaking downgrade.
- **Accessibility & motion:** all animation respects `prefers-reduced-motion`
  (via Framer Motion's `MotionConfig reducedMotion="user"` and a CSS fallback).
- **Performance:** fonts are self-hosted (no external requests), images are lazy
  by default, and the video modal only loads its iframe when opened.

---

## Roadmap (structured for easy addition)

Blog · Case studies · Testimonials · Pricing · Booking system · Client portal ·
Admin dashboard · Light theme · CMS integration · Analytics.

The data-driven architecture (`src/data/*`, `src/config/site.ts`) and reusable
component library are set up so these can be layered in without rework.

---

© Zenn Studio. Crafted by Luis Alvero.

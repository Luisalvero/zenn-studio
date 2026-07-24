import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Mail, Clock, Send } from 'lucide-react'
import { siteConfig, contactLinks } from '@/config/site'
import { services } from '@/data/services'
import { SEO } from '@/components/ui/SEO'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { InstagramIcon, WhatsappIcon } from '@/components/ui/BrandIcons'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'
import { cn } from '@/lib/utils'

const channels = [
  {
    icon: WhatsappIcon,
    label: 'WhatsApp Business',
    value: siteConfig.whatsapp.display,
    href: contactLinks.whatsapp(),
    external: true,
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    value: `@${siteConfig.instagram.handle}`,
    href: contactLinks.instagram,
    external: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: siteConfig.email,
    href: contactLinks.email,
    external: false,
  },
]

const inputClasses =
  'w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-bone placeholder:text-ash/70 transition-colors duration-300 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20'

export function ContactPage() {
  const [sent, setSent] = useState(false)

  // No backend yet: compose a pre-filled email the visitor can send. Swap this
  // handler for a POST to Formspree/Netlify/your API when a form service is added.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '')
    const email = String(data.get('email') || '')
    const projectType = String(data.get('projectType') || '')
    const message = String(data.get('message') || '')

    const subject = `Project inquiry — ${projectType || 'General'} (${name})`
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${projectType}`,
      '',
      message,
    ].join('\n')

    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <>
      <SEO
        title="Contact"
        path="/contact"
        description="Start a project with Zenn Studio. Reach out via WhatsApp, Instagram, or email — open for new collaborations with creators, developers, filmmakers, and small businesses."
      />

      <PageHeader
        eyebrow="Contact"
        title="Let's create something unforgettable."
        description="Have footage and a story to tell? Tell me about it. I reply to every genuine message — usually within a day or two."
      />

      <Section spacing="compact" className="pt-0">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Channels */}
            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col gap-4"
            >
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <motion.a
                  key={label}
                  variants={fadeUp}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-carbon p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/25 hover:bg-graphite"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-bone transition-colors group-hover:text-chalk">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs uppercase tracking-[0.2em] text-ash">{label}</span>
                    <span className="text-sm text-silver group-hover:text-chalk">{value}</span>
                  </span>
                </motion.a>
              ))}

              <motion.div
                variants={fadeUp}
                className="mt-2 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-5 text-sm text-mist"
              >
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
                <p>
                  {siteConfig.availability}. I'm selective so I can give each project real attention —
                  which means yours gets it too.
                </p>
              </motion.div>
            </motion.div>

            {/* Inquiry form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="rounded-2xl border border-white/10 bg-carbon p-6 sm:p-8"
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk">
                Start a project
              </h2>
              <p className="mt-2 text-sm text-mist">
                A few details to get us going. This opens your email app with everything filled in.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-[0.15em] text-ash">
                      Name
                    </label>
                    <input id="name" name="name" type="text" required autoComplete="name" className={inputClasses} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-[0.15em] text-ash">
                      Email
                    </label>
                    <input id="email" name="email" type="email" required autoComplete="email" className={inputClasses} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="projectType" className="text-xs uppercase tracking-[0.15em] text-ash">
                    Project type
                  </label>
                  <select id="projectType" name="projectType" className={cn(inputClasses, 'appearance-none')} defaultValue="">
                    <option value="" disabled>
                      Select a service…
                    </option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.title} className="bg-carbon">
                        {s.title}
                      </option>
                    ))}
                    <option value="Something else" className="bg-carbon">
                      Something else
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-[0.15em] text-ash">
                    Tell me about it
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="What are you making, what footage do you have, and when do you need it?"
                    className={cn(inputClasses, 'resize-y')}
                  />
                </div>

                <button
                  type="submit"
                  className="group mt-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-chalk px-8 py-4 text-sm font-medium text-void transition-all duration-500 hover:-translate-y-0.5 hover:bg-bone"
                >
                  Send inquiry
                  <Send className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                </button>

                {sent && (
                  <p className="text-sm text-silver" role="status">
                    Your email app should have opened with the message ready to send. If it didn't, reach
                    me directly at{' '}
                    <a href={contactLinks.email} className="text-chalk underline underline-offset-4">
                      {siteConfig.email}
                    </a>
                    .
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  )
}

import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Mail, Clock, Send, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { siteConfig, contactLinks } from '@/config/site'
import { useContent } from '@/lib/content'
import { services } from '@/data/services'
import { SEO } from '@/components/ui/SEO'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { InstagramIcon, WhatsappIcon } from '@/components/ui/BrandIcons'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'
import { cn } from '@/lib/utils'

const channels = [
  { icon: WhatsappIcon, label: 'WhatsApp Business', value: siteConfig.whatsapp.display, href: contactLinks.whatsapp(), external: true },
  { icon: InstagramIcon, label: 'Instagram', value: `@${siteConfig.instagram.handle}`, href: contactLinks.instagram, external: true },
  { icon: Mail, label: 'Email', value: siteConfig.email, href: contactLinks.email, external: false },
]

const SERVICE_OPTIONS = [...services.map((s) => s.title), 'Original Music / Score', 'Something else']
const BUDGETS = ['Under $250', '$250–$1k', '$1k–$5k', '$5k+', 'Not sure yet']
const TIMELINES = ['ASAP', '1–2 weeks', 'This month', 'Flexible']

const inputClasses =
  'w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-bone placeholder:text-ash/70 transition-colors duration-300 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20'

type Status = 'idle' | 'submitting' | 'success' | 'error'

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
        active
          ? 'border-white/40 bg-white/10 text-chalk'
          : 'border-white/10 text-mist hover:border-white/25 hover:text-bone',
      )}
    >
      {label}
    </button>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-xs uppercase tracking-[0.15em] text-ash">{children}</span>
}

export function ContactPage() {
  const { get } = useContent()
  const useLiveForm = siteConfig.contactEndpoint.trim().length > 0

  const [step, setStep] = useState<1 | 2>(1)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [svc, setSvc] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [reference, setReference] = useState('')
  const [company, setCompany] = useState('') // honeypot

  function toggleSvc(s: string) {
    setSvc((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const projectType = [svc.join(', '), budget, timeline].filter(Boolean).join(' · ')
    const fullMessage = reference.trim() ? `${message.trim()}\n\nReference: ${reference.trim()}` : message.trim()
    const payload = { name, email, projectType, message: fullMessage, company }

    if (useLiveForm) {
      setStatus('submitting')
      setErrorMsg('')
      try {
        const res = await fetch(siteConfig.contactEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const result = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
        if (!res.ok || !result.ok) throw new Error(result.error || 'Something went wrong.')
        setStatus('success')
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
        setStatus('error')
      }
      return
    }

    // Fallback: open the visitor's email app with everything filled in.
    const subject = `Project inquiry — ${projectType || 'General'} (${name})`
    const body = [`Name: ${name}`, `Email: ${email}`, `Project: ${projectType}`, '', fullMessage].join('\n')
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('success')
  }

  return (
    <>
      <SEO
        title="Start a project"
        path="/contact"
        description="Start a project with Zenn Studio — cinematic video editing, sound design, and color grading. Tell me what you're making, your budget, and timeline, and I'll reply personally."
      />

      <PageHeader
        eyebrow="Start a project"
        title="Let's create something unforgettable."
        description="A few quick details and I'll come back to you personally — usually within a day or two."
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
                  {get('availability')}. I'm selective so I can give each project real attention — which means
                  yours gets it too.
                </p>
              </motion.div>
            </motion.div>

            {/* Guided intake */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="rounded-2xl border border-white/10 bg-carbon p-6 sm:p-8"
            >
              {status === 'success' ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Check className="h-6 w-6" />
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-chalk">Got it — thank you.</h2>
                  <p className="max-w-sm text-sm text-mist">
                    {useLiveForm
                      ? "Your project details are in my inbox. I'll reply personally, usually within a day or two."
                      : 'Your email app should have opened with everything filled in. If not, email me at ' + siteConfig.email + '.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk">Start a project</h2>
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.15em]">
                      <span className={step === 1 ? 'text-chalk' : 'text-ash'}>Project</span>
                      <span className="h-px w-5 bg-white/15" />
                      <span className={step === 2 ? 'text-chalk' : 'text-ash'}>You</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-6">
                    {/* Honeypot */}
                    <input
                      type="text"
                      name="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />

                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                      >
                        <div className="flex flex-col gap-2.5">
                          <FieldLabel>What do you need? <span className="normal-case tracking-normal text-ash/60">· pick any</span></FieldLabel>
                          <div className="flex flex-wrap gap-2">
                            {SERVICE_OPTIONS.map((s) => (
                              <Chip key={s} label={s} active={svc.includes(s)} onClick={() => toggleSvc(s)} />
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <FieldLabel>Budget</FieldLabel>
                          <div className="flex flex-wrap gap-2">
                            {BUDGETS.map((b) => (
                              <Chip key={b} label={b} active={budget === b} onClick={() => setBudget(budget === b ? '' : b)} />
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <FieldLabel>Timeline</FieldLabel>
                          <div className="flex flex-wrap gap-2">
                            {TIMELINES.map((t) => (
                              <Chip key={t} label={t} active={timeline === t} onClick={() => setTimeline(timeline === t ? '' : t)} />
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="group mt-1 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-all duration-500 hover:-translate-y-0.5 hover:bg-bone"
                        >
                          Next
                          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-5"
                      >
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <FieldLabel>Name</FieldLabel>
                            <input required autoComplete="name" className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <FieldLabel>Email</FieldLabel>
                            <input required type="email" autoComplete="email" className={inputClasses} value={email} onChange={(e) => setEmail(e.target.value)} />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <FieldLabel>Tell me about it</FieldLabel>
                          <textarea
                            required
                            rows={4}
                            placeholder="What are you making, what footage/assets do you have, and what's the vision?"
                            className={cn(inputClasses, 'resize-y')}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <FieldLabel>Reference or footage link <span className="normal-case tracking-normal text-ash/60">· optional</span></FieldLabel>
                          <input
                            className={inputClasses}
                            placeholder="A link to a reference, your footage, or something you love"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                          />
                        </div>

                        {status === 'error' && (
                          <p className="text-sm text-ember-soft" role="alert">
                            {errorMsg} You can also email me at{' '}
                            <a href={contactLinks.email} className="text-chalk underline underline-offset-4">
                              {siteConfig.email}
                            </a>
                            .
                          </p>
                        )}

                        <div className="mt-1 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-3 text-sm text-bone transition-colors hover:bg-white/5"
                          >
                            <ArrowLeft className="h-4 w-4" /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-all duration-500 hover:-translate-y-0.5 hover:bg-bone disabled:pointer-events-none disabled:opacity-50"
                          >
                            {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
                            <Send className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  )
}

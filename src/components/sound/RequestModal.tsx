import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Check } from 'lucide-react'
import { submitRequest } from '@/lib/sound-social'
import { cn } from '@/lib/utils'

const input =
  'w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-bone placeholder:text-ash/60 transition-colors focus:border-white/30 focus:outline-none'

export function RequestModal({
  trackId,
  trackTitle,
  onClose,
}: {
  trackId: string
  trackTitle: string
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [project, setProject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!name.trim() || !email.trim()) return setError('Name and email are required.')
    setSending(true)
    setError('')
    try {
      await submitRequest({ track_id: trackId, track_title: trackTitle, name, email, project, message })
      setSent(true)
    } catch {
      setError("Couldn't send that — please try again, or email luis@empcnet.com directly.")
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-md rounded-2xl border border-white/10 bg-carbon p-6 shadow-2xl shadow-black/60"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-ash transition-colors hover:text-chalk"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <Check className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-semibold text-chalk">Request sent</h3>
              <p className="max-w-xs text-sm text-mist">
                Thanks — I'll get back to you at <span className="text-silver">{email}</span> with the
                download and how to credit it.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-full bg-chalk px-5 py-2 text-sm font-medium text-void transition-colors hover:bg-bone"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <span className="eyebrow">Request to use</span>
              <h3 className="mt-1 font-display text-xl font-semibold text-chalk">"{trackTitle}"</h3>
              <p className="mt-1 text-sm text-mist">
                Tell me a bit about your project and I'll send you the track + how to credit it.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className={input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <input
                  className={input}
                  placeholder="What are you making? (video, game, podcast…)"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />
                <textarea
                  className={cn(input, 'resize-y')}
                  rows={3}
                  placeholder="Anything else? (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {error && <p className="text-sm text-ember-soft">{error}</p>}
                <button
                  onClick={submit}
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-chalk px-6 py-2.5 text-sm font-medium text-void transition-colors hover:bg-bone disabled:opacity-50"
                >
                  {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : 'Send request'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

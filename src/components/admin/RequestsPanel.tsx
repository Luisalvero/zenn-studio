import { useCallback, useEffect, useState } from 'react'
import { Loader2, Mail, Check, Archive, RotateCcw, Trash2, Inbox, Music2, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { fetchTracks } from '@/lib/sound-api'
import { siteConfig } from '@/config/site'
import { useAuth } from '@/hooks/useAuth'
import { GoogleIcon } from '@/components/ui/BrandIcons'
import { cn } from '@/lib/utils'

interface Request {
  id: string
  created_at: string
  track_id: string
  track_title: string
  name: string
  email: string
  project: string | null
  message: string | null
  status: string
}

const FILTERS = [
  { key: 'new', label: 'New' },
  { key: 'handled', label: 'Handled' },
  { key: 'archived', label: 'Archived' },
  { key: 'all', label: 'All' },
] as const

type FilterKey = (typeof FILTERS)[number]['key']

const statusStyles: Record<string, string> = {
  new: 'border-ember/40 text-ember-soft',
  handled: 'border-emerald-500/30 text-emerald-400',
  archived: 'border-white/10 text-ash',
}

/** Build the download link + credit reply, pre-filled for Gmail compose. */
function replyUrl(req: Request, downloadUrl: string | undefined): string {
  const link = downloadUrl
    ? downloadUrl.startsWith('http')
      ? downloadUrl
      : siteConfig.url.replace(/\/$/, '') + downloadUrl
    : '[add the download link]'
  const subject = `Your request to use "${req.track_title}" — Zenn Studio`
  const body = `Hey ${req.name || 'there'},

Thanks for reaching out about "${req.track_title}" — you're welcome to use it.

Download (this track): ${link}

All I ask in return:
• Credit "Zenn Studio" (Luis Alvero)
• Tag / link my Instagram: ${siteConfig.instagram.url}

If it's for something commercial, or you need the original high-quality file, just reply and we'll sort it out.

— Luis, Zenn Studio`
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(req.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function RequestsPanel() {
  const { user, isAdmin, signIn } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<FilterKey>('new')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    let query = supabase.from('song_requests').select('*')
    if (filter !== 'all') query = query.eq('status', filter)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setRequests((data ?? []) as Request[])
    setLoading(false)
  }, [filter])

  useEffect(() => {
    void load()
  }, [load, user])

  // Track id → audio/download URL, for the reply link.
  useEffect(() => {
    void fetchTracks()
      .then((rows) => setUrls(Object.fromEntries(rows.map((r) => [r.id, r.url]))))
      .catch(() => {})
  }, [])

  async function setStatus(id: string, status: string) {
    await supabase.from('song_requests').update({ status }).eq('id', id)
    void load()
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this request permanently?')) return
    await supabase.from('song_requests').delete().eq('id', id)
    void load()
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 py-16 text-center">
        <Lock className="h-7 w-7 text-ash" strokeWidth={1.5} />
        <div className="max-w-xs">
          <p className="text-sm text-mist">Requests are private — they include people's emails.</p>
          <p className="mt-1 text-xs text-ash">
            Sign in as the owner to view and reply to them. (Anyone can still submit requests without
            signing in.)
          </p>
        </div>
        <button
          onClick={() => signIn()}
          className="inline-flex items-center gap-2 rounded-full bg-chalk px-5 py-2.5 text-sm font-medium text-void transition-colors hover:bg-bone"
        >
          <GoogleIcon className="h-4 w-4" /> Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
              filter === f.key
                ? 'border-white/40 bg-white/10 text-chalk'
                : 'border-white/10 text-mist hover:border-white/25 hover:text-bone',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-10 text-sm text-ash">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading requests…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-ember/30 bg-ember/5 p-5 text-sm text-ember-soft">
          <p className="font-medium">Couldn't load requests.</p>
          <p className="mt-1 text-mist">{error}</p>
          <p className="mt-2 text-xs text-ash">
            If this says the table doesn't exist, run <span className="text-silver">supabase/sound-social.sql</span>.
            Note: reading requests needs you signed in as the owner (they're private).
          </p>
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 py-16 text-center">
          <Inbox className="h-8 w-8 text-ash" strokeWidth={1.4} />
          <p className="text-sm text-mist">No {filter === 'all' ? '' : filter} song requests yet.</p>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <ul className="flex flex-col gap-4">
          {requests.map((req) => (
            <li key={req.id} className="rounded-xl border border-white/10 bg-carbon p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-chalk">
                    <Music2 className="h-4 w-4 text-ash" />
                    <span className="font-display text-base font-semibold">{req.track_title}</span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.15em]',
                        statusStyles[req.status] ?? statusStyles.archived,
                      )}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ash">
                    <span className="text-silver">{req.name}</span>
                    <a href={`mailto:${req.email}`} className="text-mist hover:text-chalk">
                      {req.email}
                    </a>
                    {req.project && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{req.project}</span>
                      </>
                    )}
                    <span aria-hidden>·</span>
                    <span>{new Date(req.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {req.message && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-silver">{req.message}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                <a
                  href={replyUrl(req, urls[req.track_id])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-chalk px-3.5 py-1.5 text-xs font-medium text-void transition-colors hover:bg-bone"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply with link
                </a>
                {req.status !== 'handled' && (
                  <ActionBtn onClick={() => setStatus(req.id, 'handled')} icon={Check} label="Handled" />
                )}
                {req.status !== 'new' && (
                  <ActionBtn onClick={() => setStatus(req.id, 'new')} icon={RotateCcw} label="Reopen" />
                )}
                {req.status !== 'archived' && (
                  <ActionBtn onClick={() => setStatus(req.id, 'archived')} icon={Archive} label="Archive" />
                )}
                <ActionBtn onClick={() => remove(req.id)} icon={Trash2} label="Delete" danger />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ActionBtn({
  onClick,
  icon: Icon,
  label,
  danger,
}: {
  onClick: () => void
  icon: typeof Check
  label: string
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-colors',
        danger
          ? 'border-white/10 text-ash hover:border-ember/40 hover:text-ember-soft'
          : 'border-white/15 text-mist hover:bg-white/5 hover:text-bone',
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  )
}

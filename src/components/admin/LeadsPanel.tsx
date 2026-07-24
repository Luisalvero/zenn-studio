import { useCallback, useEffect, useState } from 'react'
import { Loader2, Mail, Check, Archive, RotateCcw, Trash2, Inbox } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface Lead {
  id: string
  created_at: string
  name: string
  email: string
  project_type: string | null
  message: string
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

export function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<FilterKey>('new')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    let query = supabase.from('leads').select('*')
    if (filter !== 'all') query = query.eq('status', filter)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setLeads((data ?? []) as Lead[])
    setLoading(false)
  }, [filter])

  useEffect(() => {
    void load()
  }, [load])

  async function setStatus(id: string, status: string) {
    await supabase.from('leads').update({ status }).eq('id', id)
    void load()
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this inquiry permanently?')) return
    await supabase.from('leads').delete().eq('id', id)
    void load()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter tabs */}
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
          <Loader2 className="h-4 w-4 animate-spin" /> Loading inquiries…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-ember/30 bg-ember/5 p-5 text-sm text-ember-soft">
          <p className="font-medium">Couldn't load leads.</p>
          <p className="mt-1 text-mist">{error}</p>
          <p className="mt-2 text-xs text-ash">
            If this says the table doesn't exist yet, run the leads SQL in Supabase (see chat).
          </p>
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 py-16 text-center">
          <Inbox className="h-8 w-8 text-ash" strokeWidth={1.4} />
          <p className="text-sm text-mist">No {filter === 'all' ? '' : filter} inquiries yet.</p>
        </div>
      )}

      {!loading && !error && leads.length > 0 && (
        <ul className="flex flex-col gap-4">
          {leads.map((lead) => (
            <li key={lead.id} className="rounded-xl border border-white/10 bg-carbon p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-base font-semibold text-chalk">{lead.name}</span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.15em]',
                        statusStyles[lead.status] ?? statusStyles.archived,
                      )}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ash">
                    <a href={`mailto:${lead.email}`} className="text-mist hover:text-chalk">
                      {lead.email}
                    </a>
                    {lead.project_type && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{lead.project_type}</span>
                      </>
                    )}
                    <span aria-hidden>·</span>
                    <span>{new Date(lead.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-silver">{lead.message}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}&su=${encodeURIComponent('Re: your Zenn Studio inquiry')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-chalk px-3.5 py-1.5 text-xs font-medium text-void transition-colors hover:bg-bone"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply
                </a>
                {lead.status !== 'handled' && (
                  <ActionBtn onClick={() => setStatus(lead.id, 'handled')} icon={Check} label="Handled" />
                )}
                {lead.status !== 'new' && (
                  <ActionBtn onClick={() => setStatus(lead.id, 'new')} icon={RotateCcw} label="Reopen" />
                )}
                {lead.status !== 'archived' && (
                  <ActionBtn onClick={() => setStatus(lead.id, 'archived')} icon={Archive} label="Archive" />
                )}
                <ActionBtn onClick={() => remove(lead.id)} icon={Trash2} label="Delete" danger />
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

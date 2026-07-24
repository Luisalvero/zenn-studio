import { useEffect, useState } from 'react'
import { Loader2, Check, RotateCcw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CONTENT_DEFAULTS, type ContentKey } from '@/lib/content'
import { cn } from '@/lib/utils'

interface Field {
  key: ContentKey
  label: string
  type: 'text' | 'textarea' | 'select'
  options?: string[]
}

const FIELDS: Field[] = [
  { key: 'availability', label: 'Availability line', type: 'text' },
  { key: 'hero_line1', label: 'Hero headline — line 1', type: 'text' },
  { key: 'hero_line2', label: 'Hero headline — line 2 (muted)', type: 'text' },
  { key: 'hero_paragraph', label: 'Hero paragraph', type: 'textarea' },
  { key: 'about_intro', label: 'About intro paragraph', type: 'textarea' },
  { key: 'showreel_provider', label: 'Showreel provider', type: 'select', options: ['youtube', 'vimeo', 'drive'] },
  { key: 'showreel_id', label: 'Showreel video ID', type: 'text' },
]

const inputClasses =
  'w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-bone placeholder:text-ash/60 transition-colors focus:border-white/30 focus:outline-none'

export function ContentPanel() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .then(({ data, error }) => {
        const merged: Record<string, string> = { ...CONTENT_DEFAULTS }
        if (data) {
          for (const row of data as { key: string; value: string | null }[]) {
            if (row.value != null && row.value !== '') merged[row.key] = row.value
          }
        }
        if (error) setError(error.message)
        setValues(merged)
        setLoading(false)
      })
  }, [])

  function update(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    setError('')
    setSaved(false)
    const rows = FIELDS.map((f) => ({
      key: f.key,
      value: values[f.key] ?? '',
      updated_at: new Date().toISOString(),
    }))
    const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
    if (error) setError(error.message)
    else setSaved(true)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-ash">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading content…
      </div>
    )
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <p className="text-sm text-mist">
        Edit the site's key copy. Changes go live on save (visitors may need a refresh).
      </p>

      {FIELDS.map((f) => (
        <div key={f.key} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-[0.15em] text-ash">{f.label}</label>
            <button
              type="button"
              onClick={() => update(f.key, CONTENT_DEFAULTS[f.key])}
              className="inline-flex items-center gap-1 text-[0.65rem] text-ash transition-colors hover:text-mist"
            >
              <RotateCcw className="h-3 w-3" /> reset
            </button>
          </div>
          {f.type === 'textarea' ? (
            <textarea
              value={values[f.key] ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              rows={3}
              className={cn(inputClasses, 'resize-y')}
            />
          ) : f.type === 'select' ? (
            <select
              value={values[f.key] ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              className={cn(inputClasses, 'appearance-none')}
            >
              {f.options?.map((o) => (
                <option key={o} value={o} className="bg-carbon">
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={values[f.key] ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              className={inputClasses}
            />
          )}
        </div>
      ))}

      {error && <p className="text-sm text-ember-soft">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-chalk px-6 py-2.5 text-sm font-medium text-void transition-colors hover:bg-bone disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            'Save changes'
          )}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </div>
  )
}

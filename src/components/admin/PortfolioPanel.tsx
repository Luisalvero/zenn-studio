import { useCallback, useEffect, useState } from 'react'
import {
  Loader2,
  Plus,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  Upload,
  Check,
  Star,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { ProjectRow } from '@/lib/projects-store'
import { parseVideoUrl } from '@/lib/video'
import { cn } from '@/lib/utils'

type Row = ProjectRow & { id: string; sort_order: number }

interface Form {
  id?: string
  slug: string
  title: string
  summary: string
  kind: string
  year: string
  categories: string[]
  orientation: string
  video_provider: string
  video_id: string
  thumbnail: string
  preview_video: string
  collaborator_name: string
  collaborator_url: string
  overview: string
  featured: boolean
  sort_order: number
}

const CATEGORY_OPTIONS = [
  'Trailer',
  'Game Cinematic',
  'Sound Design',
  'Color Grading',
  'Motion Graphics',
  'VFX',
  'Short Film',
  'Developer Log',
  'Documentary',
  'Horror',
]

const input =
  'w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-bone placeholder:text-ash/60 transition-colors focus:border-white/30 focus:outline-none'

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function blankForm(sortOrder: number): Form {
  return {
    slug: '',
    title: '',
    summary: '',
    kind: '',
    year: String(new Date().getFullYear()),
    categories: [],
    orientation: 'landscape',
    video_provider: '',
    video_id: '',
    thumbnail: '',
    preview_video: '',
    collaborator_name: '',
    collaborator_url: '',
    overview: '',
    featured: true,
    sort_order: sortOrder,
  }
}

export function PortfolioPanel() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Form | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
    if (error) setError(error.message)
    else setRows((data ?? []) as Row[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function move(index: number, dir: -1 | 1) {
    const a = rows[index]
    const b = rows[index + dir]
    if (!a || !b) return
    await supabase.from('projects').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('projects').update({ sort_order: a.sort_order }).eq('id', b.id)
    void load()
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this project permanently?')) return
    await supabase.from('projects').delete().eq('id', id)
    void load()
  }

  function startNew() {
    const maxOrder = rows.reduce((m, r) => Math.max(m, r.sort_order), 0)
    setEditing(blankForm(maxOrder + 1))
  }

  function startEdit(row: Row) {
    setEditing({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary ?? '',
      kind: row.kind ?? '',
      year: row.year ?? '',
      categories: row.categories ?? [],
      orientation: row.orientation ?? 'landscape',
      video_provider: row.video_provider ?? '',
      video_id: row.video_id ?? '',
      thumbnail: row.thumbnail ?? '',
      preview_video: row.preview_video ?? '',
      collaborator_name: row.collaborator_name ?? '',
      collaborator_url: row.collaborator_url ?? '',
      overview: row.overview ?? '',
      featured: row.featured ?? false,
      sort_order: row.sort_order,
    })
  }

  if (editing) {
    return <ProjectForm form={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); void load() }} onDelete={editing.id ? () => { void remove(editing.id!); setEditing(null) } : undefined} />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-mist">Your live portfolio. Reorder, edit, or add projects.</p>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-full bg-chalk px-4 py-2 text-sm font-medium text-void transition-colors hover:bg-bone"
        >
          <Plus className="h-4 w-4" /> Add project
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-10 text-sm text-ash">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-ember/30 bg-ember/5 p-5 text-sm text-ember-soft">
          <p className="font-medium">Couldn't load projects.</p>
          <p className="mt-1 text-mist">{error}</p>
          <p className="mt-2 text-xs text-ash">If the table doesn't exist yet, run the projects SQL in Supabase.</p>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="py-10 text-sm text-mist">No projects yet — add your first one.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <ul className="flex flex-col divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10">
          {rows.map((row, i) => (
            <li key={row.id} className="flex items-center gap-4 bg-carbon p-4">
              <div className="flex flex-col">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-ash transition-colors hover:text-bone disabled:opacity-20"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  className="text-ash transition-colors hover:text-bone disabled:opacity-20"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-display text-sm font-semibold text-chalk">{row.title}</span>
                  {row.featured && <Star className="h-3.5 w-3.5 shrink-0 text-ember-soft" fill="currentColor" strokeWidth={0} />}
                </div>
                <span className="text-xs text-ash">{(row.categories ?? []).join(' · ')}</span>
              </div>
              <button
                onClick={() => startEdit(row)}
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-bone transition-colors hover:bg-white/5"
              >
                Edit
              </button>
              <button
                onClick={() => remove(row.id)}
                className="text-ash transition-colors hover:text-ember-soft"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ProjectForm({
  form: initial,
  onCancel,
  onSaved,
  onDelete,
}: {
  form: Form
  onCancel: () => void
  onSaved: () => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState<Form>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onVideoUrl(url: string) {
    const parsed = parseVideoUrl(url)
    if (parsed) {
      setForm((f) => ({ ...f, video_provider: parsed.provider, video_id: parsed.id }))
    }
  }

  function toggleCategory(c: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c],
    }))
  }

  async function uploadMedia(data: Blob, folder: string, ext: string, contentType: string): Promise<string> {
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage
      .from('project-media')
      .upload(path, data, { upsert: true, contentType })
    if (error) throw error
    return supabase.storage.from('project-media').getPublicUrl(path).data.publicUrl
  }

  async function upload(file: File, field: 'thumbnail' | 'preview_video', folder: string) {
    if (file.size > 100 * 1024 * 1024) return setError('That file is over 100 MB.')
    setUploading(field)
    setError('')
    try {
      const url = await uploadMedia(file, folder, file.name.split('.').pop() || 'bin', file.type)
      set(field, url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setUploading(null)
    }
  }

  // Upload a video AND auto-generate its poster + muted hover-preview (ffmpeg.wasm).
  async function handleVideoUpload(file: File) {
    if (file.size > 100 * 1024 * 1024) return setError('That video is over 100 MB — use a link, or a smaller file.')
    setUploading('video')
    setError('')
    try {
      const ext = file.name.split('.').pop() || 'mp4'
      const videoUrl = await uploadMedia(file, 'videos', ext, file.type)
      setForm((f) => ({ ...f, video_provider: 'file', video_id: videoUrl }))

      setProcessing('Generating poster + hover preview… (loads a one-time processor; can take up to a minute)')
      const { detectOrientation, generatePreviewAssets } = await import('@/lib/ffmpeg')
      const orientation = (await detectOrientation(file)) as string
      setForm((f) => ({ ...f, orientation }))
      const { poster, preview } = await generatePreviewAssets(file, orientation as 'landscape' | 'portrait')
      const [posterUrl, previewUrl] = await Promise.all([
        uploadMedia(poster, 'thumbnails', 'jpg', 'image/jpeg'),
        uploadMedia(preview, 'previews', 'mp4', 'video/mp4'),
      ])
      setForm((f) => ({ ...f, thumbnail: posterUrl, preview_video: previewUrl }))
    } catch (e) {
      setError(
        (e instanceof Error ? e.message : 'Processing failed') +
          ' — the video uploaded, but auto-preview failed. You can still add a thumbnail/preview manually.',
      )
    } finally {
      setUploading(null)
      setProcessing(null)
    }
  }

  async function save() {
    if (!form.title.trim()) return setError('A title is required.')
    setSaving(true)
    setError('')
    // Always slugify, and ignore a pasted URL in the slug field (a common
    // mix-up with the video field) — derive a clean slug from the title instead.
    const typedSlug = form.slug.trim()
    const slug = slugify(typedSlug && !/^https?:\/\//i.test(typedSlug) ? typedSlug : form.title)
    const payload = {
      slug,
      title: form.title.trim(),
      summary: form.summary.trim(),
      kind: form.kind.trim(),
      year: form.year.trim(),
      categories: form.categories,
      orientation: form.orientation,
      video_provider: form.video_provider || null,
      video_id: form.video_id || null,
      thumbnail: form.thumbnail || null,
      preview_video: form.preview_video || null,
      collaborator_name: form.collaborator_name.trim() || null,
      collaborator_url: form.collaborator_url.trim() || null,
      overview: form.overview.trim() || null,
      featured: form.featured,
      sort_order: form.sort_order,
    }
    const q = form.id
      ? supabase.from('projects').update(payload).eq('id', form.id)
      : supabase.from('projects').insert(payload)
    const { error } = await q
    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }
    onSaved()
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <button onClick={onCancel} className="inline-flex w-fit items-center gap-1.5 text-sm text-mist hover:text-chalk">
        <ArrowLeft className="h-4 w-4" /> Back to list
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Page slug · auto from title (not the video link)">
          <input className={input} value={form.slug} placeholder={slugify(form.title) || 'leave blank to auto-fill'} onChange={(e) => set('slug', e.target.value)} />
        </Field>
      </div>

      <Field label="Summary (one line)">
        <input className={input} value={form.summary} onChange={(e) => set('summary', e.target.value)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kind (e.g. Short film · Personal)">
          <input className={input} value={form.kind} onChange={(e) => set('kind', e.target.value)} />
        </Field>
        <Field label="Year">
          <input className={input} value={form.year} onChange={(e) => set('year', e.target.value)} />
        </Field>
      </div>

      <Field label="Categories / tags">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategory(c)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs transition-colors',
                form.categories.includes(c)
                  ? 'border-white/40 bg-white/10 text-chalk'
                  : 'border-white/10 text-mist hover:border-white/25',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Orientation">
        <div className="flex gap-2">
          {['landscape', 'portrait'].map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => set('orientation', o)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs capitalize transition-colors',
                form.orientation === o ? 'border-white/40 bg-white/10 text-chalk' : 'border-white/10 text-mist',
              )}
            >
              {o}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Video — paste a YouTube / Vimeo / Drive link, or upload a file">
        <input
          className={input}
          placeholder="https://…"
          defaultValue={form.video_provider === 'file' ? form.video_id : ''}
          onChange={(e) => onVideoUrl(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ash">
          <UploadButton
            accept="video/*"
            busy={uploading === 'video'}
            label="Upload video → auto poster + preview"
            onFile={handleVideoUpload}
          />
          {form.video_id && (
            <span className="text-mist">
              {form.video_provider === 'file' ? 'Uploaded file' : `${form.video_provider}: ${form.video_id}`}
            </span>
          )}
        </div>
        {processing && (
          <p className="mt-2 flex items-center gap-2 text-xs text-mist">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> {processing}
          </p>
        )}
        <p className="mt-1.5 text-[0.7rem] text-ash">
          Uploading a video file auto-creates the poster + muted hover-preview in your browser. For a
          YouTube/Vimeo/Drive link, paste it above (thumbnail can be auto-pulled for YouTube).
        </p>
      </Field>

      <Field label="Thumbnail (poster image)">
        <input className={input} placeholder="Image URL, or upload →" value={form.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} />
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ash">
          <UploadButton accept="image/*" busy={uploading === 'thumbnail'} label="Upload image" onFile={(f) => upload(f, 'thumbnail', 'thumbnails')} />
          {form.video_provider === 'youtube' && form.video_id && (
            <button
              type="button"
              onClick={() => set('thumbnail', `https://img.youtube.com/vi/${form.video_id}/maxresdefault.jpg`)}
              className="text-mist underline underline-offset-2 hover:text-chalk"
            >
              use YouTube thumbnail
            </button>
          )}
        </div>
      </Field>

      <Field label="Hover-preview clip (optional, short muted mp4)">
        <input className={input} placeholder="Video URL, or upload →" value={form.preview_video} onChange={(e) => set('preview_video', e.target.value)} />
        <div className="mt-2">
          <UploadButton accept="video/mp4" busy={uploading === 'preview_video'} label="Upload clip" onFile={(f) => upload(f, 'preview_video', 'previews')} />
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Credit — name (optional)">
          <input className={input} value={form.collaborator_name} onChange={(e) => set('collaborator_name', e.target.value)} />
        </Field>
        <Field label="Credit — link (optional)">
          <input className={input} value={form.collaborator_url} onChange={(e) => set('collaborator_url', e.target.value)} />
        </Field>
      </div>

      <Field label="Overview (optional, longer description on the project page)">
        <textarea className={cn(input, 'resize-y')} rows={3} value={form.overview} onChange={(e) => set('overview', e.target.value)} />
      </Field>

      <label className="flex items-center gap-3 text-sm text-silver">
        <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-white" />
        Featured (show on the home page)
      </label>

      {error && <p className="text-sm text-ember-soft">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-chalk px-6 py-2.5 text-sm font-medium text-void transition-colors hover:bg-bone disabled:opacity-50"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Check className="h-4 w-4" /> Save project</>}
        </button>
        <button onClick={onCancel} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-bone hover:bg-white/5">
          Cancel
        </button>
        {onDelete && (
          <button onClick={onDelete} className="ml-auto inline-flex items-center gap-1.5 text-sm text-ash hover:text-ember-soft">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-[0.15em] text-ash">{label}</label>
      {children}
    </div>
  )
}

function UploadButton({
  accept,
  label,
  busy,
  onFile,
}: {
  accept: string
  label: string
  busy: boolean
  onFile: (file: File) => void
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-bone transition-colors hover:bg-white/5">
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
      {busy ? 'Uploading…' : label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ''
        }}
      />
    </label>
  )
}

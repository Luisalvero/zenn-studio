import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Plus, Trash2, Check, Play, Pause, ArrowUp, ArrowDown } from 'lucide-react'
import { PLAYLIST_META, type SoundTrackRow } from '@/data/sound'
import { fetchTracks, saveTracks, canEdit } from '@/lib/sound-api'
import { cn } from '@/lib/utils'

const input =
  'w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-bone placeholder:text-ash/60 transition-colors focus:border-white/30 focus:outline-none'

export function SoundPanel() {
  const [tracks, setTracks] = useState<SoundTrackRow[]>([])
  const [savedSnapshot, setSavedSnapshot] = useState('[]')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetchTracks()
      .then((rows) => {
        setTracks(rows)
        setSavedSnapshot(JSON.stringify(rows))
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const dirty = JSON.stringify(tracks) !== savedSnapshot

  const patch = useCallback((id: string, partial: Partial<SoundTrackRow>) => {
    setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, ...partial } : t)))
  }, [])

  function togglePlay(row: SoundTrackRow) {
    const a = audioRef.current
    if (!a || !row.url) return
    if (playingId === row.id) {
      a.pause()
      setPlayingId(null)
      return
    }
    a.src = row.url
    a.play().then(() => setPlayingId(row.id)).catch(() => setPlayingId(null))
  }

  const move = useCallback((row: SoundTrackRow, dir: -1 | 1) => {
    setTracks((ts) => {
      const group = ts.filter((t) => t.playlist === row.playlist).sort((a, b) => a.sort_order - b.sort_order)
      const i = group.findIndex((t) => t.id === row.id)
      const other = group[i + dir]
      if (!other) return ts
      return ts.map((t) =>
        t.id === row.id
          ? { ...t, sort_order: other.sort_order }
          : t.id === other.id
            ? { ...t, sort_order: row.sort_order }
            : t,
      )
    })
  }, [])

  const remove = useCallback((id: string) => {
    if (!window.confirm('Delete this track from the library?')) return
    setPlayingId((p) => (p === id ? null : p))
    setTracks((ts) => ts.filter((t) => t.id !== id))
  }, [])

  function addTrack() {
    setTracks((ts) => {
      const maxOrder = ts.reduce((m, t) => Math.max(m, t.sort_order), 0)
      return [
        ...ts,
        {
          id: `new-track-${Date.now().toString(36)}`,
          title: 'New track',
          description: '',
          url: '',
          duration: null,
          playlist: PLAYLIST_META[0]?.id ?? 'beats-instrumentals',
          sort_order: maxOrder + 1,
        },
      ]
    })
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      await saveTracks(tracks)
      setSavedSnapshot(JSON.stringify(tracks))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const groups = PLAYLIST_META.map((meta) => ({
    meta,
    rows: tracks.filter((t) => t.playlist === meta.id).sort((a, b) => a.sort_order - b.sort_order),
  })).filter((g) => g.rows.length > 0)

  return (
    <div className="flex flex-col gap-6 pb-24">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} onPause={() => setPlayingId(null)} className="hidden" />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-mist">
          {tracks.length} tracks. Play each one, rewrite its title + description, move it to a playlist, reorder,
          or delete it.
        </p>
        <button
          onClick={addTrack}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-bone transition-colors hover:bg-white/5"
        >
          <Plus className="h-4 w-4" /> Add track
        </button>
      </div>

      {!canEdit && (
        <div className="rounded-xl border border-ember/30 bg-ember/5 p-4 text-sm text-ember-soft">
          Editing only works when you run the site locally (<span className="text-silver">npm run dev</span>).
          On the live site this is read-only.
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-10 text-sm text-ash">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-ember/30 bg-ember/5 p-5 text-sm text-ember-soft">{error}</div>
      )}

      {!loading &&
        groups.map((group) => (
          <section key={group.meta.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-sm"
                style={{ backgroundImage: `linear-gradient(135deg, ${group.meta.colors[0]}, ${group.meta.colors[1]})` }}
              />
              <h3 className="font-display text-sm font-semibold text-chalk">{group.meta.title}</h3>
              <span className="text-xs text-ash">{group.rows.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {group.rows.map((row, i) => (
                <SoundRow
                  key={row.id}
                  row={row}
                  playing={playingId === row.id}
                  canUp={i > 0}
                  canDown={i < group.rows.length - 1}
                  onPlay={togglePlay}
                  onPatch={patch}
                  onMove={move}
                  onDelete={remove}
                />
              ))}
            </div>
          </section>
        ))}

      {/* Sticky save bar */}
      {dirty && canEdit && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3 sm:px-10">
            <span className="text-sm text-mist">You have unsaved changes.</span>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-chalk px-6 py-2.5 text-sm font-medium text-void transition-colors hover:bg-bone disabled:opacity-50"
            >
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Check className="h-4 w-4" /> Save changes</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const SoundRow = memo(function SoundRow({
  row,
  playing,
  canUp,
  canDown,
  onPlay,
  onPatch,
  onMove,
  onDelete,
}: {
  row: SoundTrackRow
  playing: boolean
  canUp: boolean
  canDown: boolean
  onPlay: (row: SoundTrackRow) => void
  onPatch: (id: string, partial: Partial<SoundTrackRow>) => void
  onMove: (row: SoundTrackRow, dir: -1 | 1) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-carbon p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onPlay(row)}
          disabled={!row.url}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-chalk transition-colors hover:bg-white/10 disabled:opacity-30"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} /> : <Play className="h-4 w-4 translate-x-px" fill="currentColor" strokeWidth={0} />}
        </button>

        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              className={input}
              value={row.title}
              onChange={(e) => onPatch(row.id, { title: e.target.value })}
              placeholder="Title"
            />
            <select
              value={row.playlist}
              onChange={(e) => onPatch(row.id, { playlist: e.target.value })}
              className="shrink-0 rounded-lg border border-white/10 bg-carbon px-2 py-2 text-xs text-bone focus:border-white/30 focus:outline-none"
            >
              {PLAYLIST_META.map((m) => (
                <option key={m.id} value={m.id} className="bg-carbon">
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className={cn(input, 'resize-y')}
            rows={2}
            value={row.description}
            onChange={(e) => onPatch(row.id, { description: e.target.value })}
            placeholder="Description — what it actually is, in your words."
          />

          <div className="flex flex-wrap items-center gap-2">
            <input
              className={cn(input, 'w-24 flex-none')}
              value={row.duration ?? ''}
              onChange={(e) => onPatch(row.id, { duration: e.target.value || null })}
              placeholder="0:00"
            />
            <input
              className={cn(input, 'flex-1 min-w-0 text-xs text-ash')}
              value={row.url}
              onChange={(e) => onPatch(row.id, { url: e.target.value })}
              placeholder="/audio/…mp3 or an uploaded URL"
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <button onClick={() => onMove(row, -1)} disabled={!canUp} className="text-ash transition-colors hover:text-bone disabled:opacity-20" aria-label="Move up">
            <ArrowUp className="h-4 w-4" />
          </button>
          <button onClick={() => onMove(row, 1)} disabled={!canDown} className="text-ash transition-colors hover:text-bone disabled:opacity-20" aria-label="Move down">
            <ArrowDown className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(row.id)} className="mt-1 text-ash transition-colors hover:text-ember-soft" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
})

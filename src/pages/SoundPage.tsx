import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Music2, AudioLines } from 'lucide-react'
import { type SoundPlaylist, type SoundTrack } from '@/data/sound'
import { useSound } from '@/lib/sound-store'
import { SEO } from '@/components/ui/SEO'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

const GREEN = '#1DB954'

function Cover({ colors, className }: { colors: [string, string]; className?: string }) {
  return (
    <div
      className={cn('flex items-center justify-center overflow-hidden rounded-md', className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    >
      <Music2 className="h-1/3 w-1/3 text-white/60" strokeWidth={1.25} />
    </div>
  )
}

function fmt(sec: number) {
  if (!Number.isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SoundPage() {
  const { playlists, loading } = useSound()
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playlist: SoundPlaylist = playlists.find((p) => p.id === playlistId) ?? playlists[0]
  const allTracks = playlists.flatMap((p) => p.tracks)
  const current = allTracks.find((t) => t.id === currentId) || null

  useEffect(() => {
    const a = audioRef.current
    if (!a || !current?.url) return
    a.src = current.url
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [currentId, current?.url])

  function selectTrack(track: SoundTrack) {
    if (currentId === track.id) return togglePlay()
    setCurrentId(track.id)
    if (!track.url) setPlaying(false)
  }

  function togglePlay() {
    const a = audioRef.current
    if (!a || !current?.url) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      void a.play()
      setPlaying(true)
    }
  }

  function skip(dir: 1 | -1) {
    const list = playlist.tracks
    const i = list.findIndex((t) => t.id === currentId)
    const next = list[(i + dir + list.length) % list.length]
    if (next) setCurrentId(next.id)
  }

  function seek(v: number) {
    const a = audioRef.current
    if (a && Number.isFinite(a.duration)) {
      a.currentTime = (v / 100) * a.duration
    }
  }

  if (loading || !playlist) {
    return (
      <>
        <SEO
          title="Sound"
          path="/sound"
          description="Sound design by Zenn Studio — impacts, atmospheres, whooshes, and foley, organised into playlists."
        />
        <PageHeader
          eyebrow="Sound Design"
          title="A library, not a list."
          description="Sound design work — impacts, atmospheres, transitions, and foley — organised into playlists. Press play."
        />
        <Section spacing="compact" className="pt-0 pb-40">
          <Container size="wide">
            <p className="py-16 text-sm text-ash">{loading ? 'Loading…' : 'No tracks yet.'}</p>
          </Container>
        </Section>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Sound"
        path="/sound"
        description="Sound design by Zenn Studio — impacts, atmospheres, whooshes, and foley, organised into playlists."
      />

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => skip(1)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />

      <PageHeader
        eyebrow="Sound Design"
        title="A library, not a list."
        description="Sound design work — impacts, atmospheres, transitions, and foley — organised into playlists. Press play."
      />

      <Section spacing="compact" className="pt-0 pb-40">
        <Container size="wide">
          {/* Playlist picker */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {playlists.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlaylistId(p.id)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                  playlist.id === p.id
                    ? 'border-white/25 bg-white/[0.06]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]',
                )}
              >
                <Cover colors={p.colors} className="h-12 w-12 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-chalk">{p.title}</p>
                  <p className="truncate text-xs text-ash">{p.tracks.length} tracks</p>
                </div>
              </button>
            ))}
          </div>

          {/* Selected playlist */}
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end">
            <Cover colors={playlist.colors} className="h-40 w-40 shrink-0 shadow-2xl shadow-black/50 sm:h-48 sm:w-48" />
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Playlist</span>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-chalk sm:text-5xl">
                {playlist.title}
              </h2>
              <p className="max-w-md text-sm text-mist">{playlist.description}</p>
              <span className="text-xs text-ash">{playlist.tracks.length} tracks · Zenn Studio</span>
            </div>
          </div>

          {/* Track list */}
          <ul className="mt-10 flex flex-col">
            <li className="grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-white/5 px-3 pb-2 text-[0.65rem] uppercase tracking-[0.2em] text-ash">
              <span>#</span>
              <span>Title</span>
              <span>Time</span>
            </li>
            {playlist.tracks.map((track, i) => {
              const active = currentId === track.id
              return (
                <li key={track.id}>
                  <button
                    onClick={() => selectTrack(track)}
                    className={cn(
                      'group grid w-full grid-cols-[2rem_1fr_auto] items-center gap-4 rounded-md px-3 py-3 text-left transition-colors hover:bg-white/[0.04]',
                      active && 'bg-white/[0.04]',
                    )}
                  >
                    <span className="flex h-5 w-5 items-center justify-center text-sm text-ash">
                      {active && playing ? (
                        <AudioLines className="h-4 w-4" style={{ color: GREEN }} />
                      ) : (
                        <>
                          <span className="group-hover:hidden">{i + 1}</span>
                          <Play className="hidden h-4 w-4 text-chalk group-hover:block" fill="currentColor" strokeWidth={0} />
                        </>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className={cn('block truncate text-sm font-medium', active ? 'text-chalk' : 'text-silver')} style={active ? { color: GREEN } : undefined}>
                        {track.title}
                      </span>
                      <span className="block truncate text-xs text-ash">{track.description}</span>
                    </span>
                    <span className="text-xs text-ash">{track.duration ?? '—'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Container>
      </Section>

      {/* Now-playing bar */}
      {current && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[88rem] items-center gap-4 px-4 py-3 sm:px-8">
            <Cover colors={playlist.colors} className="h-11 w-11 shrink-0" />
            <div className="min-w-0 flex-1 sm:flex-none sm:w-56">
              <p className="truncate text-sm font-medium text-chalk">{current.title}</p>
              <p className="truncate text-xs text-ash">{current.url ? playlist.title : 'Preview not available yet'}</p>
            </div>

            <div className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex items-center gap-4">
                <button onClick={() => skip(-1)} className="text-mist transition-colors hover:text-chalk">
                  <SkipBack className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                </button>
                <button
                  onClick={togglePlay}
                  disabled={!current.url}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-chalk text-void transition-transform hover:scale-105 disabled:opacity-40"
                >
                  {playing ? <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} /> : <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" strokeWidth={0} />}
                </button>
                <button onClick={() => skip(1)} className="text-mist transition-colors hover:text-chalk">
                  <SkipForward className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                </button>
              </div>
              <div className="hidden w-full max-w-md items-center gap-2 sm:flex">
                <span className="text-[0.65rem] tabular-nums text-ash">{fmt(progress)}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={duration ? (progress / duration) * 100 : 0}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-white"
                />
                <span className="text-[0.65rem] tabular-nums text-ash">{fmt(duration)}</span>
              </div>
            </div>

            <div className="hidden w-56 sm:block" />
          </div>
        </div>
      )}
    </>
  )
}

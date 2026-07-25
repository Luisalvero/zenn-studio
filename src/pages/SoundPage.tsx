import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Music2, Volume2, VolumeX, Heart, Download } from 'lucide-react'
import { type SoundPlaylist, type SoundTrack } from '@/data/sound'
import { useSound } from '@/lib/sound-store'
import { fetchLikeCounts, fetchMyLikes, setLike } from '@/lib/sound-social'
import { RequestModal } from '@/components/sound/RequestModal'
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

/** Little animated equalizer, shown on the row that's currently playing. */
function EqBars() {
  return (
    <span className="flex h-4 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: GREEN }}
          animate={{ height: ['25%', '100%', '45%', '80%', '30%'] }}
          transition={{ duration: 0.9 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }}
        />
      ))}
    </span>
  )
}

/** Canvas frequency visualizer driven by the real Web Audio analyser node. */
function Visualizer({ analyser, active }: { analyser: AnalyserNode | null; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const W = 148
  const H = 38

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !analyser) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const bins = analyser.frequencyBinCount
    const data = new Uint8Array(bins)
    const BARS = 24
    const gap = 2
    const bw = (W - gap * (BARS - 1)) / BARS
    let raf = 0

    const draw = () => {
      raf = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(data)
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < BARS; i++) {
        // sample the lower ~65% of the spectrum, where the music lives
        const idx = Math.floor((i / BARS) * bins * 0.65)
        const v = data[idx] / 255
        const bh = Math.max(2, v * v * H) // square for a punchier response
        const x = i * (bw + gap)
        const y = H - bh
        const grad = ctx.createLinearGradient(0, H, 0, y)
        grad.addColorStop(0, GREEN)
        grad.addColorStop(1, '#9dffc4')
        ctx.fillStyle = grad
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, bw, bh, bw / 2)
        else ctx.rect(x, y, bw, bh)
        ctx.fill()
      }
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [analyser])

  return (
    <canvas
      ref={ref}
      style={{ width: W, height: H }}
      className={cn('transition-opacity duration-500', active ? 'opacity-100' : 'opacity-30')}
      aria-hidden
    />
  )
}

/** Full-page ambient glow that pulses with the music's energy, tinted to the
 *  active playlist. Driven imperatively from the analyser (no per-frame React). */
function ReactiveBackground({
  analyser,
  colors,
  active,
}: {
  analyser: AnalyserNode | null
  colors: [string, string]
  active: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      let energy = 0
      if (analyser && data) {
        analyser.getByteFrequencyData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) sum += data[i]
        energy = sum / (data.length * 255)
      }
      const op = Math.min(0.85, (active ? 0.22 : 0.1) + energy * 1.7)
      el.style.opacity = String(op)
      el.style.transform = `scale(${1 + energy * 0.45})`
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [analyser, active])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={ref}
        className="absolute inset-0 will-change-transform"
        style={{
          background: `radial-gradient(55% 55% at 22% 18%, ${colors[0]}, transparent 68%), radial-gradient(50% 55% at 82% 82%, ${colors[1]}, transparent 68%)`,
          filter: 'blur(48px)',
          mixBlendMode: 'screen',
          opacity: 0.1,
        }}
      />
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
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set())
  const [requestTrack, setRequestTrack] = useState<SoundTrack | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const graphRef = useRef<{ ctx: AudioContext; analyser: AnalyserNode } | null>(null)

  useEffect(() => {
    void fetchLikeCounts().then(setLikeCounts).catch(() => {})
    void fetchMyLikes().then(setMyLikes).catch(() => {})
  }, [])

  function toggleLike(trackId: string) {
    const liked = myLikes.has(trackId)
    // optimistic — flip locally, then persist
    setMyLikes((s) => {
      const n = new Set(s)
      if (liked) n.delete(trackId)
      else n.add(trackId)
      return n
    })
    setLikeCounts((c) => ({ ...c, [trackId]: Math.max(0, (c[trackId] ?? 0) + (liked ? -1 : 1)) }))
    void setLike(trackId, !liked).catch(() => {})
  }

  const playlist: SoundPlaylist = playlists.find((p) => p.id === playlistId) ?? playlists[0]
  const allTracks = playlists.flatMap((p) => p.tracks)
  const current = allTracks.find((t) => t.id === currentId) || null

  // Lazily wire the audio element into a Web Audio graph on the first user
  // gesture (browsers require a gesture to start an AudioContext).
  function ensureGraph() {
    const a = audioRef.current
    if (!a) return
    if (!graphRef.current) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      const ctx = new AC()
      const node = ctx.createAnalyser()
      node.fftSize = 256
      node.smoothingTimeConstant = 0.82
      ctx.createMediaElementSource(a).connect(node)
      node.connect(ctx.destination)
      graphRef.current = { ctx, analyser: node }
      setAnalyser(node)
    }
    void graphRef.current.ctx.resume()
  }

  useEffect(() => {
    const a = audioRef.current
    if (!a || !current?.url) return
    a.src = current.url
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [currentId, current?.url])

  useEffect(() => {
    const a = audioRef.current
    if (a) a.volume = muted ? 0 : volume
  }, [volume, muted, currentId])

  function selectTrack(track: SoundTrack) {
    ensureGraph()
    if (currentId === track.id) return togglePlay()
    setCurrentId(track.id)
    if (!track.url) setPlaying(false)
  }

  function togglePlay() {
    ensureGraph()
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

      <ReactiveBackground analyser={analyser} colors={playlist.colors} active={playing} />

      <audio
        ref={audioRef}
        crossOrigin="anonymous"
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
                  'group relative flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-300 hover:-translate-y-0.5',
                  playlist.id === p.id
                    ? 'border-white/25 bg-white/[0.06]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]',
                )}
              >
                {/* colored glow on hover, tinted to the playlist's own gradient */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: `0 10px 34px -8px ${p.colors[1]}, 0 0 14px -3px ${p.colors[0]}` }}
                />
                <Cover colors={p.colors} className="h-12 w-12 shrink-0 transition-transform duration-300 group-hover:scale-105" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-chalk">{p.title}</p>
                  <p className="truncate text-xs text-ash">{p.tracks.length} tracks</p>
                </div>
              </button>
            ))}
          </div>

          {/* Selected playlist */}
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end">
            <motion.div
              animate={
                playing && playlist.tracks.some((t) => t.id === currentId)
                  ? { boxShadow: ['0 0 0 rgba(29,185,84,0)', '0 0 45px rgba(29,185,84,0.35)', '0 0 0 rgba(29,185,84,0)'] }
                  : { boxShadow: '0 0 0 rgba(29,185,84,0)' }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="shrink-0 rounded-md"
            >
              <Cover colors={playlist.colors} className="h-40 w-40 shadow-2xl shadow-black/50 sm:h-48 sm:w-48" />
            </motion.div>
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
            <li className="flex items-center gap-3 border-b border-white/5 px-3 pb-2 text-[0.65rem] uppercase tracking-[0.2em] text-ash">
              <span className="w-5 shrink-0 text-center">#</span>
              <span className="flex-1">Title</span>
              <span className="hidden shrink-0 sm:block">Like · Use · Time</span>
            </li>
            {playlist.tracks.map((track, i) => {
              const active = currentId === track.id
              const liked = myLikes.has(track.id)
              const likes = likeCounts[track.id] ?? 0
              return (
                <li
                  key={track.id}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-white/[0.04]',
                    active && 'bg-white/[0.04]',
                  )}
                >
                  <button
                    onClick={() => selectTrack(track)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center text-sm text-ash"
                    aria-label={active && playing ? 'Pause' : 'Play'}
                  >
                    {active && playing ? (
                      <EqBars />
                    ) : (
                      <>
                        <span className="group-hover:hidden">{i + 1}</span>
                        <Play className="hidden h-4 w-4 text-chalk group-hover:block" fill="currentColor" strokeWidth={0} />
                      </>
                    )}
                  </button>

                  <button onClick={() => selectTrack(track)} className="min-w-0 flex-1 text-left">
                    <span className={cn('block truncate text-sm font-medium', active ? 'text-chalk' : 'text-silver')} style={active ? { color: GREEN } : undefined}>
                      {track.title}
                    </span>
                    <span className="block truncate text-xs text-ash">{track.description}</span>
                  </button>

                  <button
                    onClick={() => toggleLike(track.id)}
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors',
                      liked ? 'text-ember-soft' : 'text-ash hover:text-bone',
                    )}
                    aria-label={liked ? 'Unlike' : 'Like'}
                  >
                    <Heart className={cn('h-4 w-4 transition-transform', liked && 'scale-110')} fill={liked ? 'currentColor' : 'none'} />
                    {likes > 0 && <span className="tabular-nums">{likes}</span>}
                  </button>

                  <button
                    onClick={() => setRequestTrack(track)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-xs text-mist transition-colors hover:border-white/30 hover:text-bone sm:px-3"
                  >
                    <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Use</span>
                  </button>

                  <span className="hidden w-10 shrink-0 text-right text-xs text-ash sm:block">{track.duration ?? '—'}</span>
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
            <motion.div
              animate={playing ? { boxShadow: ['0 0 0 rgba(29,185,84,0)', '0 0 18px rgba(29,185,84,0.5)', '0 0 0 rgba(29,185,84,0)'] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="shrink-0 rounded-md"
            >
              <Cover colors={playlist.colors} className="h-11 w-11" />
            </motion.div>
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

            {/* Visualizer + volume */}
            <div className="hidden w-56 items-center justify-end gap-3 md:flex">
              <Visualizer analyser={analyser} active={playing} />
              <button
                onClick={() => setMuted((m) => !m)}
                className="shrink-0 text-mist transition-colors hover:text-chalk"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : Math.round(volume * 100)}
                onChange={(e) => {
                  const v = Number(e.target.value) / 100
                  setVolume(v)
                  setMuted(v === 0)
                }}
                className="h-1 w-20 shrink-0 cursor-pointer appearance-none rounded-full bg-white/15 accent-white"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      )}

      {requestTrack && (
        <RequestModal
          trackId={requestTrack.id}
          trackTitle={requestTrack.title}
          onClose={() => setRequestTrack(null)}
        />
      )}
    </>
  )
}

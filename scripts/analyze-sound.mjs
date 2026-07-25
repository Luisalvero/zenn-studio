/**
 * Zenn Studio — AI sound-library builder.
 * ---------------------------------------------------------------------------
 * Downloads a public Google Drive folder of audio, asks Gemini to title +
 * describe + bucket each clip, transcodes them to web mp3, and regenerates
 * src/data/sound.ts. Run from the project root:
 *
 *   GEMINI_API_KEY=xxx node scripts/analyze-sound.mjs "<public drive folder url>"
 */
import { execFileSync, execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const FFMPEG = require('ffmpeg-static')

const GEMINI_KEY = process.env.GEMINI_API_KEY
const FOLDER = process.env.DRIVE_FOLDER || process.argv[2]
const LOCAL = process.env.SOUND_SRC // if set, use this local folder instead of downloading
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
const DELAY = Number(process.env.GEMINI_DELAY_MS || 4500) // pace to respect free-tier RPM

if (!GEMINI_KEY) throw new Error('Set GEMINI_API_KEY')
if (!FOLDER && !LOCAL) throw new Error('Pass the Drive folder URL (or set DRIVE_FOLDER / SOUND_SRC)')

const PLAYLISTS = {
  'Beats & Instrumentals': { colors: ['#3b1d5e', '#c34a3e'], description: 'Original beats and instrumental productions.' },
  'Ambient & Chill': { colors: ['#0b3d3a', '#1d6e5e'], description: 'Atmospheric, ambient, and downtempo pieces.' },
  'Remixes & Covers': { colors: ['#1a2a52', '#4a6cc3'], description: 'Flips, remixes, and reimagined tracks.' },
  'Game Audio': { colors: ['#12303a', '#2f9ab9'], description: 'Music and sound designed for games.' },
  'Sound Design & FX': { colors: ['#4a3410', '#b98a2f'], description: 'Impacts, alarms, textures, and designed sound.' },
  'Vocals & Voice': { colors: ['#3a1a4a', '#8a4ac3'], description: 'Vocal work, chops, and voice.' },
  Other: { colors: ['#2a2a30', '#444'], description: 'Everything else worth a listen.' },
}
const CATEGORIES = Object.keys(PLAYLISTS).filter((c) => c !== 'Other')
const AUDIO_EXT = ['.mp3', '.wav', '.aac', '.m4a', '.ogg', '.flac', '.aif', '.aiff', '.opus']

const TMP = path.join(os.tmpdir(), 'zenn-sound-' + Date.now())
const OUT_AUDIO = path.join('public', 'audio')
fs.mkdirSync(TMP, { recursive: true })
fs.mkdirSync(OUT_AUDIO, { recursive: true })

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

function durationOf(file) {
  try {
    execFileSync(FFMPEG, ['-i', file], { stdio: ['ignore', 'ignore', 'pipe'] })
  } catch (e) {
    const m = (e.stderr?.toString() || '').match(/Duration:\s*(\d+):(\d+):(\d+)/)
    if (m) return `${+m[1] * 60 + +m[2]}:${m[3].padStart(2, '0')}`
  }
  return undefined
}

async function analyze(b64) {
  const prompt = `You are cataloguing a music/sound producer's audio clip for a portfolio website. Listen to the FULL clip and reply in EXACTLY this format, nothing else:
TITLE: <a punchy 2-5 word title in Title Case>
DESC: <exactly two sentences. Sentence one: the sound, mood, genre, tempo feel, and key instrumentation. Sentence two: where it would fit — a scene, a game, a type of project. Be specific and evocative, never generic.>
PLAYLIST: <the single best fit from: ${CATEGORIES.join(' | ')}>`
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'audio/mpeg', data: b64 } }] }],
        }),
      },
    )
    if (r.status === 429) {
      await new Promise((res) => setTimeout(res, 5000 * (attempt + 1)))
      continue
    }
    const j = await r.json()
    if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300))
    return j.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }
  throw new Error('Rate limited by Gemini after retries')
}

let srcDir = TMP
if (LOCAL) {
  srcDir = LOCAL
  console.log(`📂 Using local folder: ${srcDir}`)
} else {
  console.log('⬇  Downloading Drive folder…')
  execSync(`python -m gdown --folder "${FOLDER}" -O "${TMP}"`, { stdio: 'inherit' })
}

const files = walk(srcDir).filter((f) => AUDIO_EXT.includes(path.extname(f).toLowerCase()))
const LIMIT = Number(process.env.SOUND_LIMIT || 0)
const queue = LIMIT ? files.slice(0, LIMIT) : files
console.log(`🎧 Found ${files.length} audio files${LIMIT ? ` (processing first ${queue.length})` : ''}.\n`)

const tracks = []
for (const [i, file] of queue.entries()) {
  const base = path.basename(file, path.extname(file))
  const slug = slugify(base) || `track-${i}`
  const mp3 = path.join(OUT_AUDIO, `${slug}.mp3`)
  try {
    execFileSync(FFMPEG, ['-y', '-i', file, '-vn', '-ac', '2', '-b:a', '128k', mp3], { stdio: ['ignore', 'ignore', 'ignore'] })
  } catch {
    console.log(`  ✗ transcode failed: ${base} — skipping`)
    continue
  }
  const duration = durationOf(mp3)
  const b64 = fs.readFileSync(mp3).toString('base64')
  let title = base.replace(/[_-]+/g, ' ').trim()
  let description = ''
  let playlist = 'Other'
  try {
    const text = await analyze(b64)
    title = (text.match(/TITLE:\s*(.+)/i)?.[1] || title).trim()
    const dm = text.match(/DESC:\s*([\s\S]*?)\s*PLAYLIST:/i) || text.match(/DESC:\s*([\s\S]+)/i)
    description = (dm?.[1] || '').trim().replace(/\s+/g, ' ')
    const pl = (text.match(/PLAYLIST:\s*(.+)/i)?.[1] || 'Other').trim()
    playlist = CATEGORIES.find((c) => pl.toLowerCase().includes(c.toLowerCase().split(' ')[0])) || 'Other'
  } catch (e) {
    console.log(`  ! Gemini failed for ${base}: ${e.message}`)
  }
  tracks.push({ id: slug, title, description, url: `/audio/${slug}.mp3`, duration, playlist })
  console.log(`  ${i + 1}/${queue.length}  ${title}  →  ${playlist}`)
  await new Promise((res) => setTimeout(res, DELAY)) // be gentle on the free tier
}

// Group into playlists and write src/data/sound.ts
const order = [...CATEGORIES, 'Other']
const grouped = order
  .map((cat) => ({ cat, list: tracks.filter((t) => t.playlist === cat) }))
  .filter((g) => g.list.length)

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const playlistsTs = grouped
  .map(
    ({ cat, list }) => `  {
    id: '${slugify(cat)}',
    title: '${esc(cat)}',
    description: '${esc(PLAYLISTS[cat].description)}',
    colors: ['${PLAYLISTS[cat].colors[0]}', '${PLAYLISTS[cat].colors[1]}'],
    tracks: [
${list
  .map(
    (t) =>
      `      { id: '${t.id}', title: '${esc(t.title)}', description: '${esc(t.description)}', url: '${t.url}'${
        t.duration ? `, duration: '${t.duration}'` : ''
      } },`,
  )
  .join('\n')}
    ],
  },`,
  )
  .join('\n')

const header = fs.readFileSync(path.join('src', 'data', 'sound.ts'), 'utf8').split('export const soundPlaylists')[0]
fs.writeFileSync(
  path.join('src', 'data', 'sound.ts'),
  `${header}export const soundPlaylists: SoundPlaylist[] = [\n${playlistsTs}\n]\n`,
)

if (!LOCAL) fs.rmSync(TMP, { recursive: true, force: true })
console.log(`\n✅ Done. ${tracks.length} tracks across ${grouped.length} playlists → src/data/sound.ts + public/audio/`)

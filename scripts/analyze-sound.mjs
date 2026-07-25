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
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

if (!GEMINI_KEY) throw new Error('Set GEMINI_API_KEY')
if (!FOLDER) throw new Error('Pass the public Drive folder URL (or set DRIVE_FOLDER)')

const PLAYLISTS = {
  'Impacts & Hits': { colors: ['#3b1d5e', '#c34a3e'], description: 'Booms, hits, and stingers with weight.' },
  'Risers & Builds': { colors: ['#5e2a1d', '#d98a3e'], description: 'Tension risers and builds toward a moment.' },
  'Whooshes & Transitions': { colors: ['#1a2a52', '#4a6cc3'], description: 'Movement and transitions for cuts and reveals.' },
  'Atmospheres & Drones': { colors: ['#0b3d3a', '#1d6e5e'], description: 'Evolving textures and tension beds.' },
  'Foley & Textures': { colors: ['#4a3410', '#b98a2f'], description: 'Recorded and processed foley, designed to detail.' },
  'Music & Score': { colors: ['#3a1a4a', '#8a4ac3'], description: 'Musical cues, beds, and scored moments.' },
  'UI & Motion': { colors: ['#12303a', '#2f9ab9'], description: 'Interface, motion-graphics, and mnemonic sounds.' },
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
  const prompt = `You are cataloguing a sound designer's audio clip for a portfolio website. Listen to the clip and reply in EXACTLY this format, nothing else:
TITLE: <a punchy 2-4 word title>
DESC: <one concise sentence, max 16 words, describing its sonic character>
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

console.log('⬇  Downloading Drive folder…')
execSync(`python -m gdown --folder "${FOLDER}" -O "${TMP}" --remaining-ok`, { stdio: 'inherit' })

const files = walk(TMP).filter((f) => AUDIO_EXT.includes(path.extname(f).toLowerCase()))
console.log(`🎧 Found ${files.length} audio files.\n`)

const tracks = []
for (const [i, file] of files.entries()) {
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
    description = (text.match(/DESC:\s*(.+)/i)?.[1] || '').trim()
    const pl = (text.match(/PLAYLIST:\s*(.+)/i)?.[1] || 'Other').trim()
    playlist = CATEGORIES.find((c) => pl.toLowerCase().includes(c.toLowerCase().split(' ')[0])) || 'Other'
  } catch (e) {
    console.log(`  ! Gemini failed for ${base}: ${e.message}`)
  }
  tracks.push({ id: slug, title, description, url: `/audio/${slug}.mp3`, duration, playlist })
  console.log(`  ${i + 1}/${files.length}  ${title}  →  ${playlist}`)
  await new Promise((res) => setTimeout(res, 1200)) // be gentle on the free tier
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

fs.rmSync(TMP, { recursive: true, force: true })
console.log(`\n✅ Done. ${tracks.length} tracks across ${grouped.length} playlists → src/data/sound.ts + public/audio/`)

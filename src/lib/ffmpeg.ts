import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

/**
 * In-browser video processing (ffmpeg.wasm) for the admin.
 * Uses the SINGLE-THREADED core so it works on GitHub Pages without the
 * cross-origin-isolation (COOP/COEP) headers a static host can't set.
 * The ~30MB core is fetched from a CDN and cached; only loaded on first use.
 */
const CORE_BASE = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

let instance: FFmpeg | null = null
let loading: Promise<FFmpeg> | null = null

async function getFFmpeg(): Promise<FFmpeg> {
  if (instance) return instance
  if (!loading) {
    loading = (async () => {
      const ff = new FFmpeg()
      await ff.load({
        coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      instance = ff
      return ff
    })()
  }
  return loading
}

export type Orientation = 'landscape' | 'portrait'

export interface PreviewAssets {
  poster: Blob
  preview: Blob
}

/** Detect orientation from a video file via a hidden <video> element. */
export function detectOrientation(file: File): Promise<Orientation> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.onloadedmetadata = () => {
      const o: Orientation = v.videoHeight > v.videoWidth ? 'portrait' : 'landscape'
      URL.revokeObjectURL(url)
      resolve(o)
    }
    v.onerror = () => {
      URL.revokeObjectURL(url)
      resolve('landscape')
    }
    v.src = url
  })
}

/** Generate a poster frame + a short muted hover-preview clip from a video. */
export async function generatePreviewAssets(file: File, orientation: Orientation): Promise<PreviewAssets> {
  const ff = await getFFmpeg()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
  const inputName = `in.${ext}`
  await ff.writeFile(inputName, await fetchFile(file))

  const posterScale = orientation === 'portrait' ? 'scale=720:-2' : 'scale=1280:-2'
  const previewScale = orientation === 'portrait' ? 'scale=480:-2' : 'scale=720:-2'

  // Poster (JPEG — always supported)
  await ff.exec(['-y', '-ss', '1', '-i', inputName, '-frames:v', '1', '-vf', posterScale, '-q:v', '4', 'poster.jpg'])
  const posterData = (await ff.readFile('poster.jpg')) as Uint8Array

  // Preview (muted, ~8s). Try H.264; fall back to stream copy if the encoder is unavailable.
  try {
    await ff.exec([
      '-y', '-ss', '1', '-i', inputName, '-t', '8', '-an',
      '-vf', `${previewScale},fps=24`,
      '-c:v', 'libx264', '-crf', '30', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', 'preview.mp4',
    ])
  } catch {
    await ff.exec(['-y', '-ss', '1', '-i', inputName, '-t', '8', '-an', '-c:v', 'copy', 'preview.mp4'])
  }
  const previewData = (await ff.readFile('preview.mp4')) as Uint8Array

  await ff.deleteFile(inputName).catch(() => {})
  await ff.deleteFile('poster.jpg').catch(() => {})
  await ff.deleteFile('preview.mp4').catch(() => {})

  return {
    poster: new Blob([new Uint8Array(posterData)], { type: 'image/jpeg' }),
    preview: new Blob([new Uint8Array(previewData)], { type: 'video/mp4' }),
  }
}

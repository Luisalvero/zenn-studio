import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const SOUND_DATA = path.resolve(import.meta.dirname, './src/data/sound.data.json')

/**
 * Serves the sound library at /sound.data.json and lets the local admin editor
 * write it back to disk (dev only). In the build, the same file is emitted as a
 * static asset so the deployed site can fetch it read-only. No database, no auth.
 */
function soundData(): Plugin {
  return {
    name: 'zenn-sound-data',
    configureServer(server) {
      server.middlewares.use('/sound.data.json', (req, res) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(fs.existsSync(SOUND_DATA) ? fs.readFileSync(SOUND_DATA, 'utf8') : '[]')
          return
        }
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => (body += chunk))
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              fs.writeFileSync(SOUND_DATA, JSON.stringify(data, null, 2) + '\n', 'utf8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end('{"ok":true}')
            } catch (e) {
              res.statusCode = 400
              res.end(JSON.stringify({ ok: false, error: (e as Error).message }))
            }
          })
          return
        }
        res.statusCode = 405
        res.end()
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sound.data.json',
        source: fs.existsSync(SOUND_DATA) ? fs.readFileSync(SOUND_DATA, 'utf8') : '[]',
      })
    },
  }
}

// Zenn Studio — Vite configuration
// Deployment: custom domain (served from the site root), so `base` is '/'.
// If you ever move to a GitHub project page (username.github.io/repo), change
// `base` to '/repo-name/' and update the router basename accordingly.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), soundData()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
  },
})

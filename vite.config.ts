import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// LA Productions — Vite configuration
// Deployment: custom domain (served from the site root), so `base` is '/'.
// If you ever move to a GitHub project page (username.github.io/repo), change
// `base` to '/repo-name/' and update the router basename accordingly.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
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

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA — builds to /dist, deployable on any static host (Vercel, Netlify,
// GitHub Pages, S3). base './' keeps asset paths relative so it works on subpaths.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist' },
})

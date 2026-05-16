import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel handles asset rewrites cleanly at the absolute root '/'
export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: { outDir: 'dist' },
})

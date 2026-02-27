import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use '/' for custom domain (Vercel), '/cricket-manager/' for GitHub Pages
const isVercel = process.env.VERCEL === '1'
const basePath = isVercel ? '/' : '/cricket-manager/'

export default defineConfig({
  plugins: [react()],
  base: basePath,
})

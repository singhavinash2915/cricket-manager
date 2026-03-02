import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Use '/' for custom domain (Vercel), '/cricket-manager/' for GitHub Pages
const isVercel = process.env.VERCEL === '1'
const basePath = isVercel ? '/' : '/cricket-manager/'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: false,
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpeg,svg,woff2}'],
      },
    }),
  ],
  base: basePath,
})

import { readFileSync } from 'node:fs'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version: string
}

// ANITEW — local-first PWA. Kein Tracking, keine ANITEW-Nutzerdatenbank.
// OAuth und der optionale Web-Push-Wecker sind Infrastruktur; Trainings-,
// Gedächtnis- und Sicherungsdaten bleiben lokal/auf dem eigenen Drive.
export default defineConfig({
  define: {
    __ANITEW_BUILD__: JSON.stringify({
      version: pkg.version,
      commit: (process.env.GITHUB_SHA ?? 'dev').slice(0, 7),
      builtAt: new Date().toISOString(),
    }),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'ANITEW',
        short_name: 'ANITEW',
        description:
          'Gedächtnis ist Technik, kein Talent. Fünf Minuten Training am Tag — mit einer Messung, die zählt, was am Folgetag noch da ist.',
        lang: 'de',
        theme_color: '#0f1218',
        background_color: '#0f1218',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Der kleine Push-Handler bleibt eigenes, gut prüfbares JS und wird in
        // den von Workbox erzeugten Service Worker importiert.
        importScripts: ['push-sw.js'],
        // OAuth und Push sind echte Worker-Endpunkte. Der PWA-Navigations-
        // Fallback darf sie niemals mit einer gecachten index.html beantworten.
        navigateFallbackDenylist: [/^\/oauth\/google\//, /^\/push\//],
        // Bei einem Release soll kein alter App-Shell-Cache weiterleben. Das
        // ist besonders auf iOS wichtig, wo offene/installierte PWAs sonst
        // noch die vorherige JS-Fassung ausliefern koennen.
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
})

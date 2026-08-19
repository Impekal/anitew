import { readFileSync } from 'node:fs'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version: string
}

// ANITEW — local-first PWA. Kein Backend, keine Analytik, kein Tracking
// (Backlog A10). Der Build ist ein Ordner statischer Dateien; jeder Hoster
// kann ihn ausliefern, und daraus wird später ohne Umbau ein Android-Bundle
// (D-010).
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
        // Diese Zeile wandert beim Verpacken in den Store-Eintrag und ist
        // damit eine Marketingfläche (F7): Sie trägt denselben Werbespruch wie
        // die App und dieselbe Zurückhaltung — gezählt wird, was am Folgetag
        // noch da ist, versprochen wird nichts darüber hinaus (R-2).
        // Der Wortlaut steht in docs/STORE.md, ein Test hält beide zusammen.
        description:
          'Gedächtnis ist Technik, kein Talent. Fünf Minuten Training am Tag — mit einer Messung, die zählt, was am Folgetag noch da ist.',
        // Der Manifest-Name ist die eine Zeichenkette, die Android beim
        // Verpacken als TWA übernimmt — deshalb steht hier schon der endgültige
        // Name (D-001) und kein Arbeitstitel.
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
            /*
              Maskable braucht Grund bis in die Ecken und das Zeichen in
              der 80%-Schutzzone — das abgerundete Normal-Icon würde beim
              Android-Zuschnitt Ecken verlieren (D-039).
            */
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})

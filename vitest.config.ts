import { defineConfig } from 'vitest/config'

/**
 * Zwei Sorten Tests, getrennt gehalten:
 *
 *   tests/core/  — der Kern, in Node, ohne Browser (D-010). Millisekunden.
 *   tests/e2e/   — die gebaute App im echten Browser, über Playwright.
 *
 * Ohne diese Trennung würde Vitest auch die Playwright-Dateien einsammeln und
 * an deren Importen scheitern.
 */
export default defineConfig({
  test: {
    /*
      tests/worker/ prüft den Cloudflare-Worker (OAuth + Web Push) als reine
      fetch-Handler mit gestubbtem env — dieselbe Node-Umgebung genügt, denn
      der Worker benutzt nur Web-Standards (crypto.subtle, Response, Intl).
    */
    include: ['tests/core/**/*.test.ts', 'tests/worker/**/*.test.ts'],
    environment: 'node',
  },
})

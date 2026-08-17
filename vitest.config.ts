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
    include: ['tests/core/**/*.test.ts'],
    environment: 'node',
  },
})

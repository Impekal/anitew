import { defineConfig, devices } from '@playwright/test'

/**
 * Getestet wird der gebaute Stand aus dist/, nicht der Entwicklungsserver
 * (Backlog P2). Nur so laufen Service Worker, Manifest und die tatsächlich
 * ausgelieferten Bündel mit — also genau das, was auf dem Telefon ankommt.
 *
 * Vorher `npm run build`.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    // Die App übernimmt die Sprache des Geräts (D-007) — also muss das Gerät
    // im Test eine haben. Ohne diese Zeile liefe die Prüfung auf en-US, und
    // jeder deutsche Erwartungstext wäre stumm falsch. Der Sprachtest legt
    // sich seine eigenen Umgebungen an.
    locale: 'de-DE',
    // Für Umgebungen, in denen bereits ein Chromium liegt und kein zweiter
    // heruntergeladen werden soll. Bleibt die Variable leer, nimmt Playwright
    // wie üblich seinen eigenen — so läuft die CI unverändert.
    ...(process.env.ANITEW_CHROMIUM !== undefined && process.env.ANITEW_CHROMIUM !== ''
      ? { launchOptions: { executablePath: process.env.ANITEW_CHROMIUM } }
      : {}),
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Ein Telefon ist der eigentliche Zielfall — eine App, die nur am
    // Schreibtisch geprüft wird, ist am Telefon ungeprüft.
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

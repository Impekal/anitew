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
  /*
   * Ein Arbeiter, nicht mehrere — und das ist hier keine Bequemlichkeit.
   *
   * Mehrere Tests warten auf **echte Sekunden**: Der eine sitzt eine volle
   * 60-Sekunden-Einheit ab, um nachzumessen, dass das Zeitbudget stimmt (B2);
   * die beiden Wiederholungstests laufen jeweils zwei Einheiten durch. Laufen
   * zwei davon gleichzeitig, nehmen sie sich auf einer kleinen Maschine die
   * Rechenzeit weg, die Zeitgeber in den Seiten kommen ins Stocken, und ein
   * Block dauert länger als seine nominellen Sekunden. Der Test wird dann rot,
   * ohne dass an der App etwas falsch ist.
   *
   * Genau das ist zweimal passiert — einzeln immer grün, im vollen Lauf
   * gelegentlich rot. Das ist das Muster, das man gern als Flackern abtut;
   * hier hat es eine Ursache, und die Ursache liegt im Testaufbau.
   *
   * Der Preis ist Laufzeit (rund sechs statt zwei Minuten). Bei einer Suite,
   * die über Veröffentlichungen entscheidet, ist ein verlässliches Ergebnis
   * das mehr wert.
   */
  fullyParallel: false,
  workers: 1,
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

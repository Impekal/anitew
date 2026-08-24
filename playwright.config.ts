import { defineConfig, devices } from '@playwright/test'

/**
 * Getestet wird der gebaute Stand aus dist/, nicht der Entwicklungsserver
 * (Backlog P2). Nur so laufen Service Worker, Manifest und die tatsächlich
 * ausgelieferten Bündel mit — also genau das, was auf dem Telefon ankommt.
 *
 * Vorher `npm run build`.
 */
/** Der Layouttest läuft auf der Gerätematrix, alles andere nicht. */
const LAYOUT = /layout\.spec\.ts/

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
  // Ein Retry bleibt Diagnosehilfe, darf einen wackeligen Release-Gate aber
  // nicht mehr in „grün“ verwandeln. Jeder Flake macht CI absichtlich rot.
  failOnFlakyTests: Boolean(process.env.CI),
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
    /*
     * Die **funktionalen** Projekte fahren die ganze Suite — außer dem
     * Layouttest. Zwei genügen: der Schreibtisch und ein Telefon.
     */
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: LAYOUT },
    // Ein Telefon ist der eigentliche Zielfall — eine App, die nur am
    // Schreibtisch geprüft wird, ist am Telefon ungeprüft.
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: LAYOUT },

    /*
     * Die **Geräteprojekte** fahren nur `layout.spec.ts` — schnelle Prüfungen
     * ohne Wartezeiten, dafür über die ganze Breite echter Geräte:
     * kleines und randloses iPhone, iPad hoch und quer, Android-Tablet,
     * Schreibtisch schmal und breit (P6).
     *
     * Alle laufen auf Chromium (mehr ist hier nicht installiert), deshalb
     * `defaultBrowserType: 'chromium'` über den iOS-Profilen — sonst suchte
     * Playwright ein WebKit, das es nicht gibt. Geprüft wird damit das
     * **Layout** über alle Größen, Hoch- und Querformat und die sicheren
     * Ränder — **nicht** die Safari-Engine. Deren Eigenheiten fängt nur ein
     * echtes iPhone (siehe `docs/DEVICES.md`).
     */
    { name: 'iphone-se', testMatch: LAYOUT, use: { ...devices['iPhone SE'], defaultBrowserType: 'chromium' } },
    { name: 'iphone-15', testMatch: LAYOUT, use: { ...devices['iPhone 14 Pro'], defaultBrowserType: 'chromium' } },
    { name: 'ipad', testMatch: LAYOUT, use: { ...devices['iPad (gen 7)'], defaultBrowserType: 'chromium' } },
    { name: 'ipad-landscape', testMatch: LAYOUT, use: { ...devices['iPad (gen 7) landscape'], defaultBrowserType: 'chromium' } },
    { name: 'android-tablet', testMatch: LAYOUT, use: { ...devices['Galaxy Tab S4'], defaultBrowserType: 'chromium' } },
    { name: 'desktop-small', testMatch: LAYOUT, use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } } },
    { name: 'desktop-wide', testMatch: LAYOUT, use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

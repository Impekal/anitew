import { expect, test } from '@playwright/test'

import { openPage } from './helpers.ts'

/**
 * Der Smoke-Pfad je Interface-Sprache (TRANSLATION_WORKFLOW §6):
 * Eine Sprache steht erst zur Wahl, wenn dieser Weg für sie grün ist.
 *
 * Geprüft wird die Wirkung entlang des Hauptflusses: Wahl auf dem ersten
 * Bildschirm → ganzer Welcome-Screen (inklusive der imperativ eingebauten
 * Teile) in der Zielsprache → Neuladen behält sie → hinter dem Ankommen
 * spricht auch der Startbildschirm die Sprache. Vor dem Umbau blieben die
 * eingebauten Teile englisch (gemessen 30.08., fr-FR: React französisch,
 * Philosophie/Karten/Knöpfe englisch) — deshalb prüft der Test genau dort.
 */
const SMOKE = [
  {
    tag: 'fr',
    pill: 'Français',
    welcome: 'Bienvenue dans ton système de mémoire.',
    philosophy: 'Retenir. Relier. Garder.',
    skip: 'Commencer sans questions',
    start: 'Commencer',
  },
  {
    tag: 'es',
    pill: 'Español',
    welcome: 'Bienvenido a tu sistema de memoria.',
    philosophy: 'Recordar. Conectar. Conservar.',
    skip: 'Empezar sin preguntas',
    start: 'Empezar',
  },
  {
    tag: 'it',
    pill: 'Italiano',
    welcome: 'Benvenuto nel tuo sistema di memoria.',
    philosophy: 'Ricordare. Collegare. Conservare.',
    skip: 'Iniziare senza domande',
    start: 'Iniziare',
  },
  {
    tag: 'pt',
    pill: 'Português',
    welcome: 'Bem-vindo ao teu sistema de memória.',
    philosophy: 'Lembrar. Ligar. Guardar.',
    skip: 'Começar sem perguntas',
    start: 'Começar',
  },
] as const

for (const lang of SMOKE) {
  test(`spricht ${lang.pill} vom ersten Bildschirm bis hinter das Ankommen`, async ({ page }) => {
    await page.goto('/')
    const appRow = page.locator('.arrival-language:not(.arrival-language-training)')
    await expect(appRow).toBeVisible()
    // Erst den fertig ausgebauten Bildschirm abwarten — der Weg des Menschen,
    // und zugleich der Zustand, in dem der Wechsel früher halb stecken blieb.
    await expect(page.locator('.first-run-drive-card')).toBeVisible({ timeout: 10_000 })

    await appRow.getByRole('button', { name: lang.pill }).click()

    await expect(page.locator('html')).toHaveAttribute('lang', lang.tag)
    await expect(page.getByText(lang.welcome)).toBeVisible({ timeout: 10_000 })
    // Die Philosophie-Zeile bauen die Schichten ein — sie ist der Beweis,
    // dass nicht nur React übersetzt.
    await expect(page.locator('.first-run-philosophy')).toHaveText(lang.philosophy, {
      timeout: 10_000,
    })

    // Die Wahl überlebt das Neuladen (gespeichert, dann erst angezeigt).
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', lang.tag)
    await expect(
      page
        .locator('.arrival-language:not(.arrival-language-training)')
        .getByRole('button', { name: lang.pill }),
    ).toHaveAttribute('aria-pressed', 'true')

    // Und sie trägt hinter das Ankommen: Der Startbildschirm spricht sie.
    await page.getByRole('button', { name: lang.skip }).click()
    await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('.start .start-label').first()).toHaveText(lang.start)
  })
}

/**
 * Ein Bildschirm, eine Sprache (Gerätebild 01.09.).
 *
 * Auf dem Foto steht die App auf Französisch — und der Drive-Bildschirm
 * antwortet auf Englisch: „Your data stays under your control …“, mit einer
 * französischen Fehlerzeile darunter. Zwei Sprachen übereinander.
 *
 * Die Ursache war ein Muster aus der Zeit mit zwei Sprachen:
 * `startsWith('de') ? DE : EN`. Die Suche fand sechs solche Stellen;
 * `tests/core/languageIslands.test.ts` hält sie aus dem Quelltext heraus,
 * und dieser Test prüft die Wirkung dort, wo sie gemeldet wurde.
 */
const DRIVE_SMOKE = [
  {
    tag: 'fr',
    pill: 'Français',
    skip: 'Commencer sans questions',
    page: 'Synchroniser / Se déconnecter',
    mark: 'restent sous ton contrôle',
  },
  {
    tag: 'es',
    pill: 'Español',
    skip: 'Empezar sin preguntas',
    page: 'Sincronizar / Cerrar sesión',
    mark: 'siguen bajo tu control',
  },
  {
    tag: 'it',
    pill: 'Italiano',
    skip: 'Iniziare senza domande',
    page: 'Sincronizzare / Uscire',
    mark: 'restano sotto il tuo controllo',
  },
  {
    tag: 'pt',
    pill: 'Português',
    skip: 'Começar sem perguntas',
    page: 'Sincronizar / Terminar sessão',
    mark: 'ficam sob o teu controlo',
  },
] as const

for (const lang of DRIVE_SMOKE) {
  test(`der Drive-Bildschirm spricht ${lang.pill}, nicht Englisch`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.goto('/')
    const appRow = page.locator('.arrival-language:not(.arrival-language-training)')
    await expect(appRow).toBeVisible()
    await expect(page.locator('.first-run-drive-card')).toBeVisible({ timeout: 10_000 })
    await appRow.getByRole('button', { name: lang.pill }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', lang.tag)

    /*
     * Erst neu laden, dann weiter — genau wie im Smoke-Pfad darüber: Der
     * Erstlauf-Vorhang baut sich nach dem Sprachwechsel neu auf, und wer
     * mitten im Umbau tippt, trifft den Knopf nicht.
     */
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', lang.tag)
    await page.getByRole('button', { name: lang.skip }).click()
    await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })
    await openPage(page, lang.page)

    // Der Satz, der auf dem Foto englisch war.
    await expect(page.locator('.sync-privacy-lead')).toContainText(lang.mark, { timeout: 15_000 })
    await expect(page.getByText('Your data stays under your control')).toHaveCount(0)
  })
}

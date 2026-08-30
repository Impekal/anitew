import { expect, test } from '@playwright/test'

import { openPage, startButton } from './helpers.ts'

/**
 * Das Kennenlernen (Onboarding).
 *
 * Hier wird absichtlich **nicht** `visit` benutzt: Diese Prüfungen wollen
 * genau den allerersten Start sehen, den alle anderen überspringen.
 *
 * Die Regel hinter allen Fällen: Was jemand über sich sagt, wird Vorschlag
 * und Anrede — nie eine Aussage über sein Gedächtnis (R-1). Und einmal
 * beantwortet (auch mit „nichts“) kommt keine Frage wieder (D-015).
 */

test('erlaubt die Sprachwahl schon auf dem ersten Screen und merkt sie dauerhaft', async ({
  page,
}) => {
  await page.goto('/')

  const language = page.locator('.arrival-language')
  await expect(language).toBeVisible()
  await expect(page.getByText('Dein Gedächtnis, trainiert.')).toBeVisible()

  /*
   * Erst den fertig ausgebauten Bildschirm abwarten, dann wechseln — das ist
   * der Weg des Menschen, der erst liest und sich dann entscheidet. Genau in
   * diesem Zustand blieb der Wechsel vorher halb stecken: Die beiden
   * Enhancement-Schichten markieren das `.arrival`-Element als erledigt, und
   * ohne Remount (key in OnboardingScreen.tsx) sprachen Überschrift und
   * Knöpfe danach Englisch, aber Philosophie, alle sechs Karten, Trust-Zeile,
   * Fragen-Absatz, Drive-Karte und Scroll-Cue weiter Deutsch (gemessen
   * 30.08.). Die alte Fassung dieses Tests prüfte nur die Begrüßungszeile —
   * die einzige, die React selbst umschreibt — und blieb deshalb grün.
   */
  await expect(page.locator('.first-run-drive-card')).toBeVisible({ timeout: 10_000 })
  await expect(page.locator('.first-run-philosophy')).toHaveText('Erinnern. Verknüpfen. Behalten.')

  await language.getByRole('button', { name: 'English' }).click()

  // Kein Reload als Übersetzungstrick: Der bereits sichtbare Welcome-Screen
  // muss sofort aus demselben App-Zustand heraus Englisch sprechen — und
  // zwar ganz, bis in die imperativ eingebauten Teile hinein.
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByText('Welcome to your memory system.')).toBeVisible()
  await expect(page.locator('.first-run-philosophy')).toHaveText('Remember. Connect. Retain.')
  await expect(page.getByText('What ANITEW does')).toBeVisible()
  await expect(page.getByText('Adaptive training', { exact: true })).toBeVisible()
  await expect(page.getByText('PRIVATE · LOCAL FIRST · YOUR DATA, YOUR CONTROL')).toBeVisible()
  await expect(
    page.getByText('Sign in / save data in Google Drive', { exact: true }),
  ).toBeVisible()
  await expect(page.locator('.first-run-scroll-label')).toHaveText('Explore more')
  await expect(language.getByRole('button', { name: 'English' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  // Die Wahl ist nicht nur optisch: erst die persistierte Wahrheit macht sie
  // dauerhaft. Beim nächsten Öffnen bleibt der allererste Screen Englisch.
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const open = indexedDB.open('anitew')
          const database: IDBDatabase = await new Promise((resolve, reject) => {
            open.onsuccess = () => resolve(open.result)
            open.onerror = () => reject(open.error)
          })
          const row: { value?: string } | undefined = await new Promise((resolve, reject) => {
            const request = database
              .transaction('settings', 'readonly')
              .objectStore('settings')
              .get('language')
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          })
          return row?.value
        }),
      { timeout: 10_000 },
    )
    .toBe('en')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  // Der belastbare Endzustand ist der fertig ausgebaute Bildschirm — nicht
  // die React-Zeile, die die Enhancement-Schicht gleich darauf überschreibt.
  await expect(page.getByText('Welcome to your memory system.')).toBeVisible({ timeout: 10_000 })
  await expect(page.locator('.first-run-philosophy')).toHaveText('Remember. Connect. Retain.')
})

test('markiert bei unübersetzter Systemsprache die englische Fassung als aktiv', async ({
  browser,
}) => {
  /*
   * Türkisch steht in SUPPORTED_LANGUAGES, ist aber (noch) nicht übersetzt —
   * die Oberfläche fällt auf Englisch zurück (FALLBACK_LANGUAGE). Vorher
   * markierte der erste Screen trotzdem „DE“ als aktiv, samt
   * `aria-pressed="true"` auf einer Sprache, die nicht zu sehen war
   * (gemessen 30.08. mit tr-TR).
   */
  const context = await browser.newContext({ locale: 'tr-TR' })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/')

  await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
  await expect(page.locator('.first-run-drive-card')).toBeVisible({ timeout: 10_000 })
  await expect(page.locator('.first-run-philosophy')).toHaveText('Remember. Connect. Retain.')

  const language = page.locator('.arrival-language')
  await expect(language.getByRole('button', { name: 'English' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(language.getByRole('button', { name: 'Deutsch' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )

  await context.close()
})

test('erzeugt in unter drei Schritten die erste echte Erinnerung, ohne ein Urteil', async ({
  page,
}) => {
  await page.goto('/')

  // Der erste Bildschirm ist die Begrüßung, nicht ein Formular.
  await expect(page.locator('.arrival')).toBeVisible()
  await expect(page.getByText('Dein Gedächtnis, trainiert.')).toBeVisible()

  await startButton(page).click()

  await page.locator('.remember-input').fill('Daniel arbeitet im Museum und kommt aus Madrid.')
  await page.locator('.arrival-next').click()

  // Nur noch das reale Zeitbudget; keine acht Erklärscreens.
  await page.locator('.choice', { hasText: '3 Minuten' }).click()

  // Danach steht der Startbildschirm mit der gewählten Dauer …
  await expect(page.locator('.challenge')).toBeVisible()
  await expect(page.locator('.mode-active')).toHaveText('3 Minuten')

  // … und der echten ersten Erinnerung im lokalen Graphen.
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memory-counts')).toContainText('3 Erinnerungen')
})

test('lässt alles überspringen — und fragt danach nie wieder', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.arrival')).toBeVisible()

  // Der Ausgang ist ein echter Knopf auf dem ersten Schritt (D-015).
  // Der Startbildschirm baut sich nach dem Klick asynchron auf — unter
  // Suite-Volllast hat das die 5-Sekunden-Standardfrist einmal gerissen
  // (dieselbe Familie wie der Neulade-Fall unten bei „Über dich“).
  await page.locator('.arrival .quiet').click()
  await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })

  // Auch ein leeres Profil ist eine Antwort: Beim nächsten Öffnen steht
  // sofort der Startbildschirm.
  await page.reload()
  await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('.arrival')).toHaveCount(0)
})

test('macht die Antworten unter „Über dich“ änderbar — und die Änderung wirkt', async ({
  page,
}) => {
  await page.goto('/')
  await page.locator('.arrival .quiet').click()
  await expect(page.locator('.challenge')).toBeVisible()

  // Ohne Antworten: kein Schwerpunkt aus dem Nichts (K7).
  await expect(page.locator('.focus')).toHaveCount(0)

  // Nachträglich ein Ziel setzen.
  await openPage(page, 'Über dich')
  await page.locator('.about-field select').first().selectOption('names')

  /*
   * Erst neuladen, wenn die Antwort wirklich **geschrieben** ist. Das
   * Speichern läuft asynchron in die Einstellungen; ein sofortiges
   * Neuladen konnte es unter Suite-Volllast überholen — dann fehlte das
   * Ziel nach dem Neuladen zu Recht, und der Test wartete auf einen
   * Schwerpunkt, den es nie geben würde. Ablesen der persistierten
   * Wahrheit statt Wette aufs Timing — dieselbe Lehre wie bei der
   * Modul-Erkennung (pollFirstModule).
   */
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const open = indexedDB.open('anitew')
          const database: IDBDatabase = await new Promise((resolve, reject) => {
            open.onsuccess = () => resolve(open.result)
            open.onerror = () => reject(open.error)
          })
          const row: { value?: { goal?: string } } | undefined = await new Promise(
            (resolve, reject) => {
              const request = database
                .transaction('settings', 'readonly')
                .objectStore('settings')
                .get('profile.onboarding')
              request.onsuccess = () => resolve(request.result)
              request.onerror = () => reject(request.error)
            },
          )
          return row?.value?.goal
        }),
      { timeout: 10_000 },
    )
    .toBe('names')

  // Die Änderung überlebt das Neuladen und wird zum Vorschlag. Nach dem
  // Neuladen liest die App Profil und Zählungen erst asynchron — unter
  // Suite-Volllast hat das die 5-Sekunden-Standardfrist einmal gerissen.
  await page.reload()
  await expect(page.locator('.focus')).toContainText('Gesichter', { timeout: 15_000 })
  await expect(page.locator('.focus-why')).toContainText('vorgenommen')
})

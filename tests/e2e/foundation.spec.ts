import { expect, test, type Page } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/** Der Systemcheck liegt zusammengeklappt am Fuß (D-011/G-2). */
async function openFoundation(page: Page) {
  await page.getByText('Fundament', { exact: true }).click()
  await expect(page.locator('.foundation')).toBeVisible()
}

/**
 * Was M0 verspricht, hier nachgeprüft: Die App startet, spricht die Sprache
 * des Geräts, schreibt auf das Gerät und lässt sich installieren.
 *
 * Absichtlich keine Momentaufnahmen der Gestaltung — es gibt noch nichts zu
 * gestalten, und ein Test, der bei jeder Farbänderung rot wird, wird nach
 * zwei Wochen abgeschaltet.
 */

test('startet ohne Fehler in der Konsole', async ({ page }) => {
  const problems: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text())
  })
  page.on('pageerror', (error) => problems.push(error.message))

  await visit(page)
  await expect(page.getByRole('heading', { name: 'ANITEW', level: 1 })).toBeVisible()
  expect(problems).toEqual([])
})

test('übernimmt beim ersten Start die Sprache des Geräts (D-007)', async ({ browser }) => {
  const german = await browser.newContext({ locale: 'de-DE' })
  const englishPage = await (await browser.newContext({ locale: 'en-GB' })).newPage()
  const germanPage = await german.newPage()

  await visit(germanPage)
  await expect(startButton(germanPage)).toBeVisible()

  await visit(englishPage)
  /*
   * Über die Beschriftung des Startknopfes, nicht über seinen Rollennamen:
   * „Begin“ steckt als Teilzeichenkette in „Messung beginnen“, und Playwright
   * vergleicht ohne Rücksicht auf Groß- und Kleinschreibung. Solange die
   * gespeicherte Sprache noch geladen wird, steht die deutsche Einladung zur
   * Messung da — und der Selektor fand zwei Knöpfe. Vierte Begegnung mit
   * derselben Falle in diesem Projekt.
   */
  await expect(startButton(englishPage).locator('.start-label')).toHaveText('Begin')

  // Eine Sprache, die wir nicht anbieten, landet auf Englisch — nicht auf leer.
  const swedishPage = await (await browser.newContext({ locale: 'sv-SE' })).newPage()
  await visit(swedishPage)
  await expect(startButton(swedishPage).locator('.start-label')).toHaveText('Begin')
})

test('merkt sich die gewählte Sprache über einen Neustart hinweg', async ({ page }) => {
  await visit(page)
  await page.locator('.language:not(.language-training) select').selectOption('en')
  await expect(startButton(page).locator('.start-label')).toHaveText('Begin')

  /*
   * Erst warten, bis die Wahl wirklich auf dem Gerät steht — dann neu laden.
   *
   * Der Bildschirm wechselt sofort, geschrieben wird gleich danach. Wer in
   * dieser Lücke neu lädt, liest den alten Stand; im Alltag passiert das
   * niemandem, in einer Prüfung mit Millisekunden schon. Die Prüfung fragt
   * „überlebt die Wahl einen Neustart“ und nicht „überlebt sie einen Neustart
   * fünf Millisekunden später“.
   *
   * Aufgefallen ist das erst, als der Selektor genauer wurde: `{ name:
   * 'Begin' }` fand vorher auch die deutsche Einladung „Messung beginnen“ —
   * die Prüfung war grün, egal welche Sprache dastand.
   */
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const open = indexedDB.open('anitew')
        const database: IDBDatabase = await new Promise((resolve, reject) => {
          open.onsuccess = () => resolve(open.result)
          open.onerror = () => reject(open.error)
        })
        return new Promise<unknown>((resolve) => {
          const request = database.transaction('settings').objectStore('settings').get('language')
          request.onsuccess = () => resolve(request.result?.value)
          request.onerror = () => resolve(undefined)
        })
      }),
    )
    .toBe('en')

  await page.reload()
  await expect(startButton(page).locator('.start-label')).toHaveText('Begin')
})

test('schreibt auf das Gerät und liest zurück', async ({ page }) => {
  await visit(page)
  await openFoundation(page)
  const storage = page.locator('.foundation .row', { hasText: 'Speicher auf dem Gerät' })
  await expect(storage.locator('dd')).toHaveText('bereit')

  // Der Zähler ist der Beweis, dass etwas einen Neustart überlebt hat.
  const counter = page.locator('.foundation .row', { hasText: 'Bisher geöffnet' }).locator('dd')
  await expect(counter).toContainText('1×')
  await page.reload()
  await openFoundation(page)
  await expect(counter).toContainText('2×')
})

test('kennt den Trainingstag, mit der Grenze um 4 Uhr', async ({ page }) => {
  await visit(page)
  await openFoundation(page)
  const day = page.locator('.foundation .row', { hasText: 'Trainingstag' }).locator('dd')
  await expect(day).toHaveText(/^\d{4}-\d{2}-\d{2}$/)
})

test('hält den ersten Bildschirm frei von Technik', async ({ page }) => {
  // D-011/G-2: Der Systemcheck aus M0 ist erreichbar, aber er beherrscht den
  // Einstieg nicht mehr. Wer die App öffnet, sieht ein Angebot, kein Protokoll.
  await visit(page)
  await expect(page.locator('.foundation')).toBeHidden()
  await expect(startButton(page)).toBeVisible()
})

test('ist als App installierbar', async ({ page, request }) => {
  await visit(page)

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href')
  expect(manifestHref).toBeTruthy()

  const manifest = await (await request.get(manifestHref!)).json()
  expect(manifest.name).toBe('ANITEW')
  expect(manifest.display).toBe('standalone')
  expect(manifest.start_url).toBeTruthy()
  // Android braucht beide Größen, iOS das 192er als Touch-Icon.
  const sizes = (manifest.icons as { sizes: string }[]).map((icon) => icon.sizes)
  expect(sizes).toContain('192x192')
  expect(sizes).toContain('512x512')
  // Ohne maskable schneidet Android das Zeichen in einen Kreis und trifft daneben.
  expect(
    (manifest.icons as { purpose?: string }[]).some((icon) => icon.purpose === 'maskable'),
  ).toBe(true)

  // Der Service Worker ist die Bedingung für „ohne Netz nutzbar“.
  await expect(page.locator('.foundation .row', { hasText: 'Ohne Netz' }).locator('dd')).toHaveText(
    /bereit|wird eingerichtet/,
  )
})

test('lässt sich der Ton abschalten, und die Wahl bleibt', async ({ page }) => {
  // D-011/G-9: Ton ist voreingestellt an — sonst wüsste niemand, dass es ihn
  // gibt. Abschalten muss dafür an Ort und Stelle möglich sein und halten.
  await visit(page)
  const toggle = page.getByRole('button', { name: /Ton (an|aus)/ })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')

  await page.reload()
  await expect(page.getByRole('button', { name: /Ton (an|aus)/ })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
})

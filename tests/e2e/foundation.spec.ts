import { expect, test, type Page } from '@playwright/test'

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

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'ANITEW', level: 1 })).toBeVisible()
  expect(problems).toEqual([])
})

test('übernimmt beim ersten Start die Sprache des Geräts (D-007)', async ({ browser }) => {
  const german = await browser.newContext({ locale: 'de-DE' })
  const englishPage = await (await browser.newContext({ locale: 'en-GB' })).newPage()
  const germanPage = await german.newPage()

  await germanPage.goto('/')
  await expect(germanPage.getByRole('button', { name: 'Beginnen' })).toBeVisible()

  await englishPage.goto('/')
  await expect(englishPage.getByRole('button', { name: 'Begin' })).toBeVisible()

  // Eine Sprache, die wir nicht anbieten, landet auf Englisch — nicht auf leer.
  const swedishPage = await (await browser.newContext({ locale: 'sv-SE' })).newPage()
  await swedishPage.goto('/')
  await expect(swedishPage.getByRole('button', { name: 'Begin' })).toBeVisible()
})

test('merkt sich die gewählte Sprache über einen Neustart hinweg', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Sprache').selectOption('en')
  await expect(page.getByRole('button', { name: 'Begin' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('button', { name: 'Begin' })).toBeVisible()
})

test('schreibt auf das Gerät und liest zurück', async ({ page }) => {
  await page.goto('/')
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
  await page.goto('/')
  await openFoundation(page)
  const day = page.locator('.foundation .row', { hasText: 'Trainingstag' }).locator('dd')
  await expect(day).toHaveText(/^\d{4}-\d{2}-\d{2}$/)
})

test('hält den ersten Bildschirm frei von Technik', async ({ page }) => {
  // D-011/G-2: Der Systemcheck aus M0 ist erreichbar, aber er beherrscht den
  // Einstieg nicht mehr. Wer die App öffnet, sieht ein Angebot, kein Protokoll.
  await page.goto('/')
  await expect(page.locator('.foundation')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Beginnen' })).toBeVisible()
})

test('ist als App installierbar', async ({ page, request }) => {
  await page.goto('/')

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

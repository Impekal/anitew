import { expect, test, type Locator } from '@playwright/test'

import { visit } from './helpers.ts'

/**
 * Impressum und Datenschutz sind eigene Dokumente, keine Ansichten der App.
 *
 * Gemeldet vom Gerät (30.08.): Beide Links brachten den Nutzer nur auf den
 * Startbildschirm zurück, ohne Text. Ursache war der PWA-Navigations-Fallback
 * — die genaue Kette steht in `scripts/navigation-denylist.ts`.
 *
 * Was dieser Test **nicht** kann, und das gehört dazu: Er läuft gegen
 * `vite preview`, und das liefert `/impressum.html` direkt aus. Cloudflare
 * leitet dieselbe Adresse dagegen auf `/impressum` um — und erst diese
 * Umleitung hat den Fehler ausgelöst. Dieser Weg war deshalb die ganze Zeit
 * grün und trotzdem auf dem Telefon kaputt. Die Umleitung selbst prüft
 * `tests/core/navigationDenylist.test.ts` ohne Server.
 *
 * Hier wird die Verdrahtung geprüft: Die Links sind da, sie zeigen auf die
 * Rechtstexte, und ein Klick verlässt die App und zeigt den Text.
 */
test('die Rechtstexte sind aus der Fußzeile erreichbar und zeigen ihren Text', async ({ page }) => {
  await visit(page)

  const fusszeile = page.locator('#anitew-legal-footer')
  await expect(fusszeile).toBeVisible()

  const links = fusszeile.locator('a')
  await expect(links).toHaveCount(2)
  await expect(links.nth(0)).toHaveAttribute('href', '/impressum.html')
  await expect(links.nth(1)).toHaveAttribute('href', '/datenschutz.html')

  await links.nth(0).click()
  await page.waitForLoadState('domcontentloaded')

  // Die App darf nicht mehr da sein — genau das war das gemeldete Symptom.
  await expect(page.locator('.challenge, .arrival')).toHaveCount(0)
  await expect(page).toHaveTitle(/Impressum/)
  await expect(page.locator('body')).toContainText('Impressum')

  // Von dort muss der Weg zum zweiten Rechtstext und zurück in die App gehen.
  await page.locator('.legal-nav a', { hasText: 'Datenschutz' }).first().click()
  await page.waitForLoadState('domcontentloaded')
  await expect(page).toHaveTitle(/Datenschutz/)
  await expect(page.locator('.challenge, .arrival')).toHaveCount(0)

  await page.locator('.legal-nav a', { hasText: 'ANITEW' }).first().click()
  await page.waitForLoadState('domcontentloaded')
  await expect(page.locator('.challenge, .arrival').first()).toBeVisible({ timeout: 15_000 })
})

/**
 * Und in der Sprache, in der die App gerade spricht (Gerätebefund 01.09.).
 *
 * Gemeldet: „Impressum und Datenschutz: auch bereits übersetzt? Text wird nur
 * in Deutsch angezeigt." Die Kurzfassung in der App lag in sechs Sprachen, die
 * beiden öffentlichen Seiten nur auf Deutsch — und die Fußzeile verlinkte
 * immer die deutschen.
 *
 * Geprüft wird der Weg, den der Mensch geht: Sprache wählen, Fußzeile
 * antippen, Text lesen. Nicht geprüft wird, ob die Übersetzung juristisch
 * trägt — das steht als USER ACTION im Backlog.
 */
/**
 * Löst den echten Click-Handler aus, ohne auf Positionsruhe zu warten.
 *
 * Die CI hat diesen Test als unzuverlässig gemeldet, und die Ursache war
 * nicht die Sprache: Playwright klickt erst, wenn ein Element zwei Bilder
 * lang an derselben Stelle steht. Die Fußzeile sitzt am Seitenende, und
 * solange oben noch etwas nachlädt, rutscht sie — dann wartet der Klick bis
 * zum Zeitablauf. Gemessen: `waiting for element to be visible, enabled and
 * stable`, 120 Sekunden lang.
 *
 * Dieselbe Stelle und dieselbe Lösung wie in `layout.spec.ts`: Der Link ist
 * da und zeigt nachweislich auf die richtige Adresse — das prüft die Zeile
 * darüber. Ob er dabei stillsteht, ist eine zweite, fachfremde Frage.
 */
async function clickDirect(target: Locator): Promise<void> {
  await target.evaluate((element) => (element as HTMLElement).click())
}

const RECHTSTEXTE = [
  { tag: 'fr', pill: 'Français', skip: 'Commencer sans questions', fuss: 'Mentions légales', titel: /Mentions légales/ },
  { tag: 'es', pill: 'Español', skip: 'Empezar sin preguntas', fuss: 'Aviso legal', titel: /Aviso legal/ },
] as const

for (const sprache of RECHTSTEXTE) {
  test(`die Rechtstexte sprechen ${sprache.pill}`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.goto('/')
    const zeile = page.locator('.arrival-language:not(.arrival-language-training)')
    await expect(zeile).toBeVisible()
    await expect(page.locator('.first-run-drive-card')).toBeVisible({ timeout: 10_000 })
    await zeile.getByRole('button', { name: sprache.pill }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', sprache.tag)

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', sprache.tag)
    await page.getByRole('button', { name: sprache.skip }).click()
    await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })

    // Die Fußzeile trägt die Sprache — und zeigt auf die Seite in dieser Sprache.
    const fusszeile = page.locator('#anitew-legal-footer')
    const links = fusszeile.locator('a')
    await expect(links.nth(0)).toHaveText(sprache.fuss)
    await expect(links.nth(0)).toHaveAttribute('href', `/impressum.${sprache.tag}.html`)

    await clickDirect(links.nth(0))
    await page.waitForLoadState('domcontentloaded')
    await expect(page).toHaveTitle(sprache.titel)
    await expect(page.locator('html')).toHaveAttribute('lang', sprache.tag)

    // Und der Sprachumschalter führt zurück zur verbindlichen Fassung.
    await clickDirect(page.locator('.legal-langs a', { hasText: 'Deutsch' }).first())
    await page.waitForLoadState('domcontentloaded')
    await expect(page).toHaveTitle(/Impressum/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  })
}

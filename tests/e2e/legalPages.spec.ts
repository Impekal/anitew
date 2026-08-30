import { expect, test } from '@playwright/test'

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

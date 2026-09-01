import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/**
 * Töne nach Bereichen (Gerätewunsch 31.08.: „Töne/Songs nach individuellen
 * Bereichen aktivierbar/deaktivierbar oder alle auf einmal") und der Klang
 * während der Einheit.
 *
 * **Was dieser Test prüfen kann und was nicht.** Playwright hört nichts. Er
 * prüft deshalb die Verkabelung: ob der Dauerklang zu den richtigen Momenten
 * **läuft** — die App sagt das über ein Datenattribut, das der Ton-Port
 * setzt — und ob die Schalter wirken. Ob es angenehm klingt, entscheidet ein
 * Mensch mit Kopfhörern (`docs/DEVICES.md`), nicht diese Datei.
 */

const ambient = 'html[data-anitew-ambient="focus"]'

test('der Klang läuft in der Einheit und hört danach auf', async ({ page }) => {
  test.setTimeout(180_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Vorher ist es still: Der Startbildschirm ist kein Trainingsraum.
  await expect(page.locator(ambient)).toHaveCount(0)

  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  // In der Einheit klingt es.
  await expect(page.locator(ambient)).toHaveCount(1, { timeout: 20_000 })

  // Und nach dem Abbrechen ist wieder Ruhe — kein Klang, der die Einheit
  // überlebt (das wäre die Dauerlast, die P9 abgestellt hat).
  await page.locator('.session-abort').click()
  await expect(page.locator('.challenge')).toBeVisible()
  await expect(page.locator(ambient)).toHaveCount(0)
})

test('jeder Ton-Bereich lässt sich einzeln abschalten', async ({ page }) => {
  test.setTimeout(180_000)
  await visit(page)
  // Sprache und Ton stehen am Fuss des Startbildschirms — dieselbe
  // Komponente wie auf der Core-Seite, nur ohne Umweg.
  await expect(startButton(page)).toBeVisible()

  const focusSwitch = page.locator('.sound-area-focus')
  await expect(focusSwitch).toBeVisible()
  await expect(focusSwitch).toHaveAttribute('aria-pressed', 'true')

  // Die drei Bereiche sind da — und die ehrliche Zeile dazu.
  await expect(page.locator('.sound-area')).toHaveCount(3)
  await expect(page.getByText(/Gemessen haben wir das nicht/)).toBeVisible()

  // „Klang während der Einheit" aus …
  await focusSwitch.click()
  await expect(focusSwitch).toHaveAttribute('aria-pressed', 'false')

  // … und die Wahl überlebt das Neuladen.
  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await expect(page.locator('.sound-area-focus')).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.sound-area-feedback')).toHaveAttribute('aria-pressed', 'true')
})

test('abgeschaltet bleibt der Klang auch in der Einheit still', async ({ page }) => {
  test.setTimeout(180_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.locator('.sound-area-focus').click()
  await expect(page.locator('.sound-area-focus')).toHaveAttribute('aria-pressed', 'false')

  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()
  await page.locator('.session-clock').waitFor({ timeout: 20_000 })

  // Der Schalter wirkt: Trotz laufender Einheit bleibt es still.
  await expect(page.locator(ambient)).toHaveCount(0)
})

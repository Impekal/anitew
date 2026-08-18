import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/**
 * Datenschutz in der App (Backlog R4).
 *
 * Geprüft wird die Aussage, nicht die Formulierung: **kein Server, nichts
 * verlässt das Gerät** — und der unbequeme Absatz, der trotzdem dasteht. Eine
 * Datenschutzerklärung, die nur das Angenehme nennt, ist eine Werbeseite.
 */
test('sagt in fünf Zeilen, wo die Daten liegen', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.getByText('Datenschutz', { exact: true }).click()

  await expect(page.locator('.privacy-lead')).toHaveText('ANITEW hat keinen Server.')
  await expect(page.locator('.privacy-points li')).toHaveCount(5)
  await expect(page.getByText(/Alles, was beim Training entsteht, bleibt auf diesem Gerät/)).toBeVisible()
})

test('nennt auch das Unbequeme', async ({ page }) => {
  /*
   * Damit die App überhaupt aufs Gerät kommt, wird sie einmal geladen — und
   * der Anbieter sieht dabei, was jeder Webserver sieht. Das zu verschweigen
   * wäre bequem und falsch (R-2).
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.getByText('Datenschutz', { exact: true }).click()

  await expect(page.getByText(/wird sie einmal geladen/)).toBeVisible()
  await expect(page.getByText(/was jeder Webserver sieht/)).toBeVisible()
})

test('hält den ersten Bildschirm davon frei (D-011/G-2)', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await expect(page.locator('.privacy-lead')).toBeHidden()
})

import { expect, test } from '@playwright/test'

import { startButton } from './helpers.ts'

/**
 * Die Wissenschaftsseite, im Browser nachgeprüft (Backlog F6, R-2, R5).
 *
 * Geprüft wird vor allem das Unbequeme: dass die Seite die Grenzen nennt, an
 * denen andere Apps schweigen — und dass sie an keiner Stelle einen Beleg
 * vortäuscht, wo keiner ist.
 */

async function openScience(page: import('@playwright/test').Page) {
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  await page.getByText('Was belegt ist', { exact: true }).click()
}

test('nennt, worauf die App steht — mit Quelle', async ({ page }) => {
  await openScience(page)

  await expect(page.getByText('Verteiltes Üben schlägt Blockübung')).toBeVisible()
  await expect(page.getByText('Abrufen lernt, Ansehen nicht')).toBeVisible()

  // Die Quellen liegen zugeklappt an der Aussage, zu der sie gehören.
  const spacing = page.locator('.claim', { hasText: 'Verteiltes Üben' })
  await spacing.getByText('Quellen').click()
  await expect(spacing.getByText(/Cepeda/)).toBeVisible()
  await expect(spacing.getByText(/Psychological Bulletin/)).toBeVisible()
})

test('sagt, was Gehirnjogging nicht kann (F4, R-2)', async ({ page }) => {
  await openScience(page)

  const block = page.locator('.standing-unsupported')
  await expect(block.getByText('Nicht belegt')).toBeVisible()
  await expect(block.getByText('Gehirnjogging macht nicht allgemein klüger')).toBeVisible()

  // Der entscheidende Satz: Auf einer unbelegten Annahme steht hier nichts.
  await expect(block.getByText('Darauf ist in der App nichts gebaut.')).toBeVisible()
})

test('gibt zu, was niemand gemessen hat — auch nicht wir', async ({ page }) => {
  await openScience(page)

  const block = page.locator('.standing-unmeasured')
  await expect(block.getByText('Niemand hat es gemessen. Auch wir nicht.')).toBeVisible()
  await expect(block.getByText('Ob ANITEW deinem Alltag hilft')).toBeVisible()

  // Und dort steht kein Beleg, der die Lücke zudeckt.
  await expect(block.getByText('Quellen')).toHaveCount(0)
})

test('trennt „wirkt“ von „wirkt auf alles“', async ({ page }) => {
  await openScience(page)

  const block = page.locator('.standing-narrow')
  await expect(block.getByText('Belegt, aber nur dafür')).toBeVisible()
  await expect(block.getByText(/Merktechniken heben die Leistung/)).toBeVisible()
  await expect(block.getByText(/nicht.*gezeigt/)).toBeVisible()
})

test('hält den ersten Bildschirm davon frei (D-011/G-2)', async ({ page }) => {
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()

  // Zugeklappt: erreichbar, aber nichts, was den Start bedrängt.
  await expect(page.getByText('Gehirnjogging macht nicht allgemein klüger')).toBeHidden()
})

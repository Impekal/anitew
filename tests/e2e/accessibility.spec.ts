import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/**
 * Barrierefreiheit (Backlog O4, O5).
 *
 * Geprüft wird das, was sich mechanisch prüfen lässt und am ehesten
 * unbemerkt kaputtgeht: dass die Tastatur überall hinkommt und dort sichtbar
 * steht, dass Bilder benannt oder ausgeblendet sind, und dass die laufende
 * Uhr für einen Screenreader lesbar ist. Der Rest — Kontrast im Auge, Bewegung
 * im Gefühl — gehört in den Gerätedurchgang (`docs/DEVICES.md`).
 */

test('führt die Tastatur zum Startknopf und zeigt den Fokus', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Vom Seitenanfang aus tabben, bis der Startknopf den Fokus hat — er muss
  // in wenigen Schritten erreichbar sein, nicht hinter dreißig anderen.
  let reached = false
  for (let step = 0; step < 6; step++) {
    await page.keyboard.press('Tab')
    if (await startButton(page).evaluate((el) => el === document.activeElement)) {
      reached = true
      break
    }
  }
  expect(reached, 'der Startknopf war mit der Tastatur nicht früh erreichbar').toBe(true)

  // Und er zeigt einen sichtbaren Ring — kein `outline: none` ohne Ersatz.
  const outlineWidth = await startButton(page).evaluate(
    (el) => getComputedStyle(el).outlineWidth,
  )
  expect(outlineWidth, 'kein sichtbarer Fokusring').not.toBe('0px')
})

test('hält den Fokus im offenen Menü und gibt ihn danach zurück', async ({ page }) => {
  await visit(page)
  const menu = page.locator('.hamburger')
  await expect(menu).toHaveAttribute('aria-haspopup', 'dialog')

  await menu.focus()
  await page.keyboard.press('Enter')

  const dialog = page.locator('.drawer-veil[role="dialog"]')
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute('aria-modal', 'true')
  await expect(page.locator('.drawer-close')).toBeFocused()

  /*
   * Die eigentliche Zusage ist Verhalten: Bei offenem Modal kann Tab den
   * Drawer nicht verlassen. Ein früherer Test verlangte zusätzlich `[inert]`
   * auf dem React-Hintergrund. Das war eine Implementierungsforderung und
   * machte in Chromium die sichtbaren Drawer-Einträge selbst unanklickbar,
   * weil Overlay und Hintergrund im selben #root leben.
   */
  for (let step = 0; step < 16; step++) {
    await page.keyboard.press('Tab')
    expect(
      await page.evaluate(() => document.querySelector('.drawer')?.contains(document.activeElement) === true),
      `Tab ${step + 1} hat den Fokus aus dem Drawer verloren`,
    ).toBe(true)
  }

  // Pointer und Tastatur müssen gleichzeitig funktionieren — genau diese
  // Kombination hat der fragile inert-Ansatz zuvor zerstört.
  const firstItem = page.locator('.drawer-item').first()
  await expect(firstItem).toBeVisible()
  await firstItem.click()
  await expect(page.locator('.page')).toBeVisible()

  // Noch einmal öffnen und Escape als echten Modal-Ausgang prüfen.
  await page.locator('.page-back').click()
  await expect(menu).toBeVisible()
  await menu.focus()
  await page.keyboard.press('Enter')
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(menu).toBeFocused()
})

test('benennt jedes Bild oder blendet es aus', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  /*
   * Ein SVG ohne Namen liest ein Screenreader als „Grafik“ vor — Lärm. Das
   * Netz im Hintergrund ist `aria-hidden`, die Gesichter tragen einen Namen.
   * Geprüft wird die Regel: kein sichtbares SVG ohne das eine oder andere.
   */
  const naked = await page.locator('svg:not([aria-hidden]):not([aria-label])').count()
  expect(naked, 'ein SVG ohne Name und ohne aria-hidden').toBe(0)
})

test('macht die Uhr der Einheit für einen Screenreader lesbar', async ({ page }) => {
  await visit(page)
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  // Der Fortschrittsbalken trägt seine Werte — ein Screenreader kann sagen,
  // wie weit der Block ist, ohne die Farbe zu sehen.
  const bar = page.locator('[role="progressbar"]').first()
  await expect(bar).toBeVisible({ timeout: 30_000 })
  await expect(bar).toHaveAttribute('aria-valuemax', /\d+/)
})

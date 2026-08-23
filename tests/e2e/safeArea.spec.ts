import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

test.use({ viewport: { width: 390, height: 844 } })

test('hält Seitenaktionen unter der iPhone-Safe-Area', async ({ page }) => {
  await visit(page)

  // Chromium has no real iPhone status-bar inset. The production CSS exposes
  // the env() value through this property so the geometry can still be locked
  // down in CI with a representative standalone-iPhone inset.
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--anitew-safe-area-top', '47px')
  })

  await openPage(page, 'Erinnerung')

  const app = page.locator('.app.page')
  await expect(app).toBeVisible()
  await expect(app).toHaveCSS('padding-top', '65px')

  const close = page.locator('.page-back')
  await expect(close).toBeVisible()
  const box = await close.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y).toBeGreaterThanOrEqual(60)

  await close.click()
  await expect(app).toBeHidden()
})

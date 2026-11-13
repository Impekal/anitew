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

  /*
   * Erst nach oben, dann messen — und beides ausdrücklich.
   *
   * `boundingBox()` misst im **Fensterkoordinatensystem**. Die Notch liegt
   * ebenfalls am oberen Fensterrand, die Zusage ergibt also nur bei
   * ungescrolltem Dokument einen Sinn. Genau das war hier aber nie
   * sichergestellt: Beim Zustellen der Startseite scrollt Playwright, um an
   * seine Knöpfe zu kommen, und wie weit, schwankt von Lauf zu Lauf — gemessen
   * 642, 689 und 69 Pixel an drei aufeinanderfolgenden Läufen.
   *
   * Beim Öffnen der Core-Seite springt das Dokument zurück nach oben. Ist der
   * Sprung beim Messen noch nicht durch, fehlen dem Knopf genau die gescrollten
   * Pixel, und aus 65 werden 18. So ist dieser Test auf CI rot geworden
   * (Lauf 1394), während derselbe Baum daneben grün war.
   *
   * Der Schwellwert bleibt 60. Was hinzukommt, ist ein definierter
   * Ausgangszustand: oben anfangen, und vor dem Messen abwarten, dass das
   * Dokument auch oben steht.
   */
  await page.evaluate(() => {
    window.scrollTo(0, 0)
  })

  await openPage(page, 'Erinnerung')

  const app = page.locator('.app.page')
  await expect(app).toBeVisible()
  await expect(app).toHaveCSS('padding-top', '65px')

  await page.waitForFunction(() => (document.scrollingElement?.scrollTop ?? 0) === 0, {
    timeout: 10_000,
  })

  const close = page.locator('.page-back')
  await expect(close).toBeVisible()
  const box = await close.boundingBox()
  expect(box).not.toBeNull()
  const scroll = await page.evaluate(() => Math.round(document.scrollingElement?.scrollTop ?? 0))
  expect(box!.y, `Knopf bei ${box!.y} px, Dokument bei Scrollstand ${scroll}`).toBeGreaterThanOrEqual(60)

  await close.click()
  await expect(app).toBeHidden()
})

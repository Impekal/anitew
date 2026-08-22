import { expect, test, type Page } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

type RitualWindow = Window & { __anitewBuzz?: number | number[] }

async function probeVibration(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      value: (pattern: number | number[]) => {
        ;(window as RitualWindow).__anitewBuzz = pattern
        return true
      },
    })
  })
}

async function waitForRitual(page: Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.anitewRitualReady), {
      timeout: 8_000,
    })
    .toBe('true')
}

async function buzzOf(page: Page): Promise<string> {
  return page.evaluate(() => JSON.stringify((window as RitualWindow).__anitewBuzz ?? null))
}

test('der ANITEW Core antwortet als eigener physischer Moment', async ({ page }) => {
  await probeVibration(page)
  await visit(page)
  await waitForRitual(page)

  await page.locator('.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.anitewCoreOpening))
    .toBe('true')
  await expect.poll(() => buzzOf(page)).toBe(JSON.stringify([6, 22, 10]))
})

test('der Trainingsstart zieht die Welt in den Core und lässt die Session daraus erscheinen', async ({
  page,
}) => {
  await probeVibration(page)
  await visit(page)
  await waitForRitual(page)

  await startButton(page).click()
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.anitewEntering))
    .toBe('true')
  await expect.poll(() => buzzOf(page)).toBe(JSON.stringify([8, 28, 13]))

  await expect(page.locator('.session')).toBeVisible({ timeout: 15_000 })
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.anitewSessionArriving))
    .toBe('true')

  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.anitewEntering), {
      timeout: 3_000,
    })
    .toBeUndefined()
})

test('der Ritual-Pass respektiert Reduced Motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await visit(page)
  await waitForRitual(page)

  await page.locator('.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()
  const animation = await page
    .locator('.hamburger')
    .evaluate((node) => getComputedStyle(node).animationName)
  expect(animation).toBe('none')
})

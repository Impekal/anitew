import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

test('keyboard focus stays unmistakably visible', async ({ page }) => {
  await visit(page)
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus-visible')
  await expect(focused).toHaveCount(1)
  const outline = await focused.evaluate((node) => getComputedStyle(node).outlineStyle)
  expect(outline).not.toBe('none')
})

test('polish never reintroduces horizontal mobile overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})

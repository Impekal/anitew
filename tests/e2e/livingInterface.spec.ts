import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

async function waitForLivingLayer(page: Parameters<typeof test>[0] extends never ? never : any) {
  await expect
    .poll(
      () =>
        page.locator('.hamburger').evaluate((node: Element) => {
          const svg = node.querySelector('svg')
          return svg === null ? 'missing' : getComputedStyle(svg).display
        }),
      { timeout: 8_000 },
    )
    .toBe('none')
}

test('ersetzt das Hamburger-Menü durch den ANITEW Core und entfaltet eine Memory-Map', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page)
  await waitForLivingLayer(page)

  const core = page.locator('.hamburger')
  await expect(core).toBeVisible()
  const coreBox = await core.boundingBox()
  expect(coreBox).not.toBeNull()
  expect(Math.abs((coreBox?.width ?? 0) - (coreBox?.height ?? 0))).toBeLessThanOrEqual(2)

  await core.click()
  const atlas = page.locator('.drawer')
  await expect(atlas).toBeVisible()
  const atlasBox = await atlas.boundingBox()
  expect(atlasBox).not.toBeNull()
  expect(atlasBox?.width ?? 0).toBeGreaterThan(360)
  expect(atlasBox?.height ?? 0).toBeGreaterThan(760)

  const firstNode = page.locator('.drawer-item').first()
  await expect(firstNode).toBeVisible()
  const radius = await firstNode.evaluate((node) => getComputedStyle(node).borderRadius)
  expect(radius).toContain('%')
})

test('macht aus dem Missionsstart ein rundes Core-Portal statt einer Karte', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page)
  await waitForLivingLayer(page)

  const start = startButton(page)
  await expect(start).toBeVisible()
  const box = await start.boundingBox()
  expect(box).not.toBeNull()
  expect(Math.abs((box?.width ?? 0) - (box?.height ?? 0))).toBeLessThan(4)

  const radius = await start.evaluate((node) => getComputedStyle(node).borderRadius)
  expect(radius).toBe('50%')
})

test('Living Memory respektiert Reduced Motion vollständig', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await visit(page)
  await waitForLivingLayer(page)

  const coreAnimation = await page
    .locator('.hamburger')
    .evaluate((node) => getComputedStyle(node, '::before').animationName)
  expect(coreAnimation).toBe('none')

  await page.locator('.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()
  const nodeAnimation = await page
    .locator('.drawer-item')
    .first()
    .evaluate((node) => getComputedStyle(node).animationName)
  expect(nodeAnimation).toBe('none')
})

test('Living Memory erzeugt weiterhin keinen horizontalen iPhone-Overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page)
  await waitForLivingLayer(page)
  await page.locator('.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})

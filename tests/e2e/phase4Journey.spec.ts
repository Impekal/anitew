import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

test('Phase 4 verbindet Today, Settle und Session als eine Reise', async ({ page }) => {
  await visit(page)

  const today = page.locator('.today')
  await expect(today).toBeVisible()
  expect(await today.evaluate((node) => getComputedStyle(node).animationName)).toContain('journey-arrive')

  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()

  const settle = page.locator('.settle')
  await expect(settle).toBeVisible()
  const settlingSession = page.locator('.session')
  expect(await settlingSession.evaluate((node) => getComputedStyle(node).animationName)).toContain('journey-enter')

  await settle.click()
  const phase = page.locator('.session-phase')
  await expect(phase).toBeVisible()
  await expect(phase).toHaveClass(/session-phase-(focus|encode|connect|retrieve|interfere|return)/)

  // Die Atmosphäre wird vom bereits vorhandenen Phasen-Knoten abgeleitet;
  // es gibt keinen zweiten JS-Zustand für die Choreografie.
  const aura = await page.locator('.session').evaluate((node) =>
    getComputedStyle(node, '::before').backgroundImage,
  )
  expect(aura).toContain('radial-gradient')

  await page.locator('.session-abort').click()
  await expect(page.locator('.challenge')).toBeVisible()
})

test('Phase 4 Journey respektiert Reduced Motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await visit(page)

  const today = page.locator('.today')
  await expect(today).toBeVisible()
  expect(await today.evaluate((node) => getComputedStyle(node).animationName)).toBe('none')

  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await expect(page.locator('.settle')).toBeVisible()
  expect(
    await page.locator('.session').evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none')
})

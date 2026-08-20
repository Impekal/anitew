import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

const MEMORY = 'Daniel arbeitet im Museum, kommt aus Madrid und spielt Gitarre.'

test('Phase 4 lässt echte Memory-World-Zustände sprechen, ohne Fake-Knoten', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Mein Gedächtnis')

  await page.locator('.remember-input').fill(MEMORY)
  await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()
  await page.getByRole('button', { name: 'Bestätigen und merken' }).click()

  const world = page.locator('.constellation')
  await expect(world).toBeVisible()
  await expect(world).toHaveAttribute('data-world-state', 'quiet')

  // Die beiden atmosphärischen Orbits sind Ellipsen, keine Erinnerungsknoten:
  // die bestehende Wahrheit „4 Erinnerungen = 4 node circles“ bleibt intakt.
  await expect(world.locator('.constellation-atmosphere ellipse')).toHaveCount(2)
  await expect(world.locator('.constellation-node')).toHaveCount(4)

  // Fokus ist keine neue Datenebene: Er hebt ausschließlich die bereits
  // bestätigten Verbindungen des gewählten echten Knotens hervor.
  await world.locator('.constellation-memory').first().click()
  await expect(world.locator('.constellation-memory-selected')).toHaveCount(1)
  expect(await world.locator('.constellation-edge-selected').count()).toBeGreaterThan(0)
})

test.describe('Phase 4 reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('die Signatur bleibt lesbar, aber die Welt steht still', async ({ page }) => {
    await visit(page)
    await openPage(page, 'Mein Gedächtnis')
    await page.locator('.remember-input').fill(MEMORY)
    await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()
    await page.getByRole('button', { name: 'Bestätigen und merken' }).click()

    const orbit = page.locator('.constellation-orbit').first()
    await expect(orbit).toBeVisible()
    expect(await orbit.evaluate((node) => getComputedStyle(node).animationName)).toBe('none')
  })
})

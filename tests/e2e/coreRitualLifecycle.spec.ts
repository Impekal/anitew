import { expect, test } from '@playwright/test'

import { visit } from './helpers.ts'

test('Core-Ritual bleibt nach einem BFCache-artigen pagehide beobachtungsfähig', async ({ page }) => {
  await visit(page)
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.anitewRitualReady), {
      timeout: 8_000,
    })
    .toBe('true')

  // Ein BFCache-Navigationsschritt feuert pagehide, zerstört das Dokument aber
  // nicht. Der frühere `{ once: true }`-Cleanup trennte hier den
  // MutationObserver dauerhaft; nach der Rückkehr konnte die Session deshalb
  // nicht mehr als Ritual-Ankunft erkannt werden.
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })))

  await page.evaluate(() => {
    document.documentElement.dataset.anitewEntering = 'true'
    const session = document.createElement('section')
    session.className = 'session'
    ;(document.getElementById('root') ?? document.body).append(session)
  })

  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.anitewSessionArriving))
    .toBe('true')
})

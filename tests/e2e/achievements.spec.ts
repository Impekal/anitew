import { expect, test, type Page } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

/**
 * Erreichtes (Backlog K3 · D-019).
 *
 * Geprüft wird die Haltung: **Am Anfang steht gar nichts** (kein „0 von 8
 * freigeschaltet“), und was dasteht, ist eine Tatsache, kein Rang.
 */

/** Legt genug Trainingstage und Termine an, dass Tatsachen wahr werden. */
async function seedReached(page: Page) {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    // Ein Item, das schon zweimal zurückkam → „firstReturn“.
    await new Promise<void>((resolve, reject) => {
      const request = database
        .transaction('itemStates', 'readwrite')
        .objectStore('itemStates')
        .put({ itemId: 'words:de:Anker', moduleId: 'words', language: 'de', createdAt: 1, reviews: 3, lapses: 0, dueDay: '2099-01-01' })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })
  await page.reload()
  await expect(startButton(page)).toBeVisible()
}

test('sagt am Anfang gar nichts (K7)', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  // Kein „Erreicht“-Fach, solange nichts erreicht ist.
  await expect(page.getByText('Erreicht', { exact: true })).toHaveCount(0)
})

test('nennt eine Tatsache, sobald sie zutrifft', async ({ page }) => {
  await seedReached(page)
  await openPage(page, 'Erreicht')
  await expect(page.getByText(/Zum ersten Mal etwas nach Tagen zurückgeholt/)).toBeVisible()
  // Und nur das Erreichte — keine gesperrten, ausgegrauten Zeilen.
  const count = await page.locator('.reached li').count()
  expect(count).toBeGreaterThan(0)
  expect(count).toBeLessThan(8)
})

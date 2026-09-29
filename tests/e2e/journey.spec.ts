import { expect, test } from '@playwright/test'
import { visit, startButton } from './helpers.ts'

test('zeigt nachvollziehbare Level und berechnet den Fortschritt nach Neustart aus gespeicherten Daten', async ({ page }) => {
  await visit(page)
  const journey = page.locator('.training-journey')
  await expect(journey).toContainText('Level 1')
  await expect(journey).toContainText('0 XP')
  const challenge = await page.locator('.challenge').boundingBox()
  const levelCard = await journey.boundingBox()
  expect(levelCard!.y).toBeGreaterThan(challenge!.y + challenge!.height - 1)
  await journey.locator('summary').click()
  await expect(journey.locator('li')).toHaveCount(10)
  await page.evaluate(async () => {
    const request = indexedDB.open('anitew')
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('itemStates', 'readwrite')
      tx.objectStore('itemStates').put({ itemId: 'words:de:Anker', moduleId: 'words', language: 'de', createdAt: 1, reviews: 26, lapses: 0, dueDay: '2099-01-01' })
      tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error)
    })
    db.close()
  })
  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await expect(journey).toContainText('Level 3')
  await expect(journey).toContainText('50 XP')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

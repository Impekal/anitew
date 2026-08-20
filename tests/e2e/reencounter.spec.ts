import { expect, test } from '@playwright/test'

import { visit } from './helpers.ts'

const SEP_ITEM = '\u001e'
const SEP_ID = '\u001d'

test('zeigt eine wirklich fällige persönliche Erinnerung als RETURN statt als generische Zahl', async ({ page }) => {
  await visit(page)

  await page.evaluate(
    ({ sepItem, sepId }) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now()
        const offsetMinutes = -new Date(now).getTimezoneOffset()
        const shifted = new Date(now + offsetMinutes * 60_000 - 4 * 3_600_000)
        const today = shifted.toISOString().slice(0, 10)
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const db = open.result
          const tx = db.transaction(['settings', 'itemStates'], 'readwrite')
          const settings = tx.objectStore('settings')
          const itemStates = tx.objectStore('itemStates')
          const daniel = 'person:daniel'
          const madrid = 'place:madrid'
          const createdAt = now - 10 * 86_400_000
          settings.put({
            key: 'memory.graph',
            value: {
              nodes: [
                { id: daniel, type: 'person', label: 'Daniel', createdAt, strength: 0.2 },
                { id: madrid, type: 'place', label: 'Madrid', createdAt, strength: 0.2 },
              ],
              edges: [
                {
                  id: `${daniel}→${madrid}:association`,
                  from: daniel,
                  to: madrid,
                  relation: 'association',
                  createdAt,
                },
              ],
              removed: {},
            },
          })
          const word = `Daniel${sepItem}Madrid${sepId}${daniel}${sepId}${madrid}`
          itemStates.put({
            itemId: `memory:de:${word}`,
            moduleId: 'memory',
            language: 'de',
            createdAt,
            lastSeenAt: createdAt,
            dueDay: today,
            reviews: 1,
            lapses: 0,
            stability: 2,
            difficulty: 5,
            fsrsState: 2,
            lastDay: today,
          })
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
          tx.onabort = () => reject(tx.error)
        }
      }),
    { sepItem: SEP_ITEM, sepId: SEP_ID },
  )

  await page.reload()
  await expect(page.locator('.memory-reencounter-live')).toBeVisible()
  await expect(page.locator('.memory-reencounter-live .memory-pulse-label')).toHaveText('RETURN')
  await expect(page.locator('.memory-return-name')).toContainText('Madrid')
  await expect(page.locator('.memory-return-status')).toContainText('FSRS')
  await expect(page.locator('.memory-return-context')).toContainText('Daniel')
  await expect(page.locator('.memory-return-glyph')).toBeVisible()
})

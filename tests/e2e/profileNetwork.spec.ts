import { expect, test, type Page } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

async function seedProfile(page: Page) {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('itemStates', 'readwrite')
      const store = transaction.objectStore('itemStates')
      const rows = [
        { module: 'words', reviews: 21, lapses: 2 },
        { module: 'faces', reviews: 21, lapses: 4 },
        { module: 'numbers', reviews: 21, lapses: 6 },
        // Unter der Mindestzahl: darf im Netz nicht als künstliche Null auftauchen.
        { module: 'twins', reviews: 6, lapses: 2 },
      ]
      rows.forEach((row, index) => {
        store.put({
          itemId: `${row.module}:de:netz${index}`,
          moduleId: row.module,
          language: 'de',
          createdAt: 1,
          lastSeenAt: 1,
          reviews: row.reviews,
          lapses: row.lapses,
          stability: 3,
          difficulty: 5,
          fsrsState: 2,
          dueDay: '2099-01-01',
        })
      })
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  })
  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Memory DNA')
}

test('O15 zeigt gemessene Profilachsen als Netz ohne dünne Daten als Null zu erfinden', async ({ page }) => {
  await seedProfile(page)

  const network = page.locator('.profile-network')
  await expect(network).toBeVisible()
  await expect(network.locator('.profile-network-node')).toHaveCount(3)

  // 20 echte Wiedersehen je Achse: 18/20, 16/20, 14/20.
  await expect(network.locator('[data-dimension="words"]')).toHaveAttribute('data-rate', '90')
  await expect(network.locator('[data-dimension="faces"]')).toHaveAttribute('data-rate', '80')
  await expect(network.locator('[data-dimension="numbers"]')).toHaveAttribute('data-rate', '70')

  // Die Zwillings-Achse hat erst fünf Gelegenheiten und bleibt deshalb aus dem Netz.
  await expect(network.locator('[data-dimension="attention"]')).toHaveCount(0)
  await expect(page.locator('.axis', { hasText: 'Ähnliches auseinanderhalten' })).toContainText(
    'Noch zu wenige Gelegenheiten',
  )
})

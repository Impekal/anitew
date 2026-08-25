import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

async function storedMemoryGraph(page: import('@playwright/test').Page) {
  return page.evaluate(async () =>
    new Promise<any>((resolve, reject) => {
      const opening = indexedDB.open('anitew')
      opening.onerror = () => reject(opening.error)
      opening.onsuccess = () => {
        const database = opening.result
        const transaction = database.transaction('settings', 'readonly')
        const request = transaction.objectStore('settings').get('memory.graph')
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result?.value)
      }
    }),
  )
}

test('MEMORY MODE speichert eine Deadline erst mit der bestätigten Erinnerung', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Eigene Inhalte')

  await page.locator('.own-input').fill('Daniel arbeitet im Museum und kommt aus Madrid.')
  await page.locator('.own-memory-mode-open').click()

  const deadline = page.locator('.own-memory-mode .remember-deadline-input')
  await expect(deadline).toBeVisible()
  await deadline.fill('2099-05-12T09:00')

  // Auch mit eingetragenem Termin ist vor der normalen Bestätigung nichts gespeichert.
  await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()
  expect(await storedMemoryGraph(page)).toBeUndefined()

  await page.getByRole('button', { name: 'Bestätigen und merken' }).click()
  await expect(page.locator('.own-memory-mode .remember-saved')).toBeVisible()

  const graph = await storedMemoryGraph(page)
  expect(graph.nodes.length).toBeGreaterThan(1)
  expect(graph.nodes.every((node: any) => node.neededByDay === '2099-05-12')).toBe(true)
  expect(graph.nodes.every((node: any) => typeof node.neededByAt === 'number')).toBe(true)
})

test('„morgen um 9“ wird nur als sichtbarer prüfbarer Terminvorschlag übernommen', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Eigene Inhalte')

  await page
    .locator('.own-input')
    .fill('Daniel arbeitet im Museum. Das Treffen ist morgen um 9 Uhr.')
  await page.locator('.own-memory-mode-open').click()

  const deadline = page.locator('.own-memory-mode .remember-deadline-input')
  await expect(deadline).toHaveValue('')
  await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()

  // Keine stille Datumsinterpretation: Der vorgeschlagene Zeitpunkt steht im
  // editierbaren Feld und wird ausdrücklich als Vorschlag gekennzeichnet.
  await expect(deadline).toHaveValue(/^\d{4}-\d{2}-\d{2}T09:00$/)
  await expect(page.locator('.own-memory-mode .memory-deadline-inferred')).toContainText(
    'Bitte prüfe den Zeitpunkt',
  )
  expect(await storedMemoryGraph(page)).toBeUndefined()
})

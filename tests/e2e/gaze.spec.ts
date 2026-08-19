import { expect, test } from '@playwright/test'

import { answerRecall, collectItems, pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Die Bilder im Browser (Achse „Visuell“).
 *
 * Ein Bild aus vier Dingen in vier Farben, als Ganzes gezeigt; gefragt wird
 * die Einzelheit — und die Frage zeigt dasselbe Bild in Tinte, das gefragte
 * Ding hervorgehoben: Der Anker sagt, *welches* Bild gemeint ist, ohne die
 * Antwort zu tragen.
 */

test('zeigt das Bild in Farbe, fragt es in Tinte — und zählt ehrlich', async ({ page }) => {
  test.setTimeout(300_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()

  let found = false
  for (let attempt = 0; attempt < 50 && !found; attempt++) {
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()

    // Welches Modul die Runde hat, sagt der persistierte Plan — kein
    // Bildschirm-Raten (dieselbe Lehre wie in `startEmergency`).
    if ((await pollFirstModule(page)) === 'gaze') {
      await page.locator('.gaze-encode').waitFor({ timeout: 15_000 })
      found = true
      break
    }
    await page.locator('.session-abort').click()
    await expect(page.locator('.challenge')).toBeVisible()
  }
  expect(found, 'in fünfzig Anläufen kam kein Bild').toBe(true)

  // Vier Dinge, vier Farben — alle verschieden, alle benannt.
  const learned = await collectItems(page, 8)
  expect(learned.items).toHaveLength(4)
  expect(new Set(learned.items).size).toBe(4)

  // Beim Abruf: dasselbe Bild in Tinte, genau ein Ding hervorgehoben —
  // und keine Zeichnung trägt mehr ihre Farbe (`data-color` fehlt).
  await page.locator('.prompted').waitFor({ timeout: 30_000 })
  await expect(page.locator('.gaze-neutral')).toBeVisible()
  await expect(page.locator('.gaze-asked')).toHaveCount(1)
  expect(await page.locator('.gaze-neutral [data-color]').count()).toBe(0)

  // Drei richtig, die letzte offen gelassen — gezählt wird, was stimmt.
  await answerRecall(page, learned, 'allButLast')
  await expect(page.locator('.summary-score strong')).toHaveText('3', { timeout: 30_000 })
  await expect(page.locator('.summary-score span')).toHaveText('/ 4')

  // Und die Einzelheiten bekommen Termine — das Bild kommt nach Tagen wieder.
  const tracked = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const store = open.result.transaction('itemStates').objectStore('itemStates')
        const rows: { moduleId: string }[] = []
        store.openCursor().onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor) {
            rows.push(cursor.value as { moduleId: string })
            cursor.continue()
          } else {
            resolve(rows.filter((row) => row.moduleId === 'gaze').length)
          }
        }
      }
    })
  })
  expect(tracked).toBe(4)
})

import { expect, test, type Page } from '@playwright/test'

import { answerRecall, collectItems, pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Die Bilder im Browser (Achse „Visuell“).
 *
 * Ein Bild aus vier Dingen in vier Farben, als Ganzes gezeigt; gefragt wird
 * die Einzelheit — und die Frage zeigt dasselbe Bild in Tinte, das gefragte
 * Ding hervorgehoben: Der Anker sagt, *welches* Bild gemeint ist, ohne die
 * Antwort zu tragen.
 */

/**
 * Gibt dem realen Profil genug Evidenz, um „Visuell“ als klar schwächste
 * gemessene Achse zu erkennen. Der Planer setzt diesen Schwerpunkt in Runde 1
 * um. Damit prüft der E2E nicht mehr 50 zufällige Seeds in der Hoffnung, dass
 * irgendwann `gaze` fällt — Personalisierung ist hier die deterministische
 * Produkt-API, die der Nutzer ebenfalls bekommt.
 */
async function seedGazeFocus(page: Page) {
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
      ;[
        { module: 'words', reviews: 61, lapses: 3 },
        { module: 'gaze', reviews: 61, lapses: 40 },
      ].forEach((row, index) => {
        store.put({
          itemId: `${row.module}:de:e2e-profile-${index}`,
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
  await expect(page.locator('.focus')).toBeVisible({ timeout: 15_000 })
}

test('zeigt das Bild in Farbe, fragt es in Tinte — und zählt ehrlich', async ({ page }) => {
  test.setTimeout(180_000)

  await seedGazeFocus(page)
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  expect(await pollFirstModule(page), 'der visuelle Schwerpunkt muss die erste Runde führen').toBe(
    'gaze',
  )
  await page.locator('.gaze-encode').waitFor({ timeout: 15_000 })

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
  // Ein Profil-Evidenzsatz wurde absichtlich vorab angelegt; die vier echten
  // Bilddetails müssen zusätzlich als terminierte Erinnerungen existieren.
  expect(tracked).toBe(5)
})
